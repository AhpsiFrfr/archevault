import { NextApiRequest, NextApiResponse } from 'next'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { PublicKey, Connection } from '@solana/web3.js'

// EONIC token configuration
const EONIC_MINT_ADDRESS = process.env.NEXT_PUBLIC_EONIC_MINT_ADDRESS || 'YOUR_EONIC_MINT_ADDRESS'
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
const MIN_EONIC_BALANCE = 0 // Set to 1 or higher to require EONIC tokens

interface VerificationRequest {
  address: string
  message: string
  signature: string
  walletName?: string
  tokenBalance?: number
}

// Check if wallet holds EONIC tokens
async function checkEonicTokens(walletAddress: string): Promise<{ hasTokens: boolean; balance: number }> {
  try {
    const connection = new Connection(SOLANA_RPC_URL)
    const publicKey = new PublicKey(walletAddress)
    
    // Get token accounts for the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    })

    // Find EONIC token account
    const eonicAccount = tokenAccounts.value.find(account => 
      account.account.data.parsed.info.mint === EONIC_MINT_ADDRESS
    )

    if (eonicAccount) {
      const balance = eonicAccount.account.data.parsed.info.tokenAmount.uiAmount || 0
      return { hasTokens: balance >= MIN_EONIC_BALANCE, balance }
    }

    return { hasTokens: MIN_EONIC_BALANCE === 0, balance: 0 }
  } catch (error) {
    console.error('Error checking EONIC tokens:', error)
    return { hasTokens: MIN_EONIC_BALANCE === 0, balance: 0 }
  }
}

// Validate message format and timestamp
function validateMessage(message: string, address: string): { valid: boolean; error?: string } {
  const lines = message.split('\n')
  
  if (lines.length < 4) {
    return { valid: false, error: 'Invalid message format' }
  }

  // Check if message contains expected components
  if (!message.includes('Authenticate to Eonic Vault')) {
    return { valid: false, error: 'Invalid message header' }
  }

  if (!message.includes(`Wallet: ${address}`)) {
    return { valid: false, error: 'Wallet address mismatch' }
  }

  // Check timestamp (should be within last 5 minutes)
  const timestampLine = lines.find(line => line.startsWith('Time: '))
  if (timestampLine) {
    const timestamp = timestampLine.replace('Time: ', '')
    const messageTime = new Date(timestamp).getTime()
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    if (now - messageTime > fiveMinutes) {
      return { valid: false, error: 'Message timestamp expired' }
    }
  }

  return { valid: true }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', authorized: false })
  }

  const { address, message, signature, walletName, tokenBalance }: VerificationRequest = req.body

  if (!address || !message || !signature) {
    return res.status(400).json({ 
      error: 'Missing required fields: address, message, signature', 
      authorized: false 
    })
  }

  try {
    // Validate wallet address format
    let publicKey: PublicKey
    try {
      publicKey = new PublicKey(address)
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid wallet address format', 
        authorized: false 
      })
    }

    // Validate message format and timestamp
    const messageValidation = validateMessage(message, address)
    if (!messageValidation.valid) {
      return res.status(400).json({ 
        error: messageValidation.error, 
        authorized: false 
      })
    }

    // Verify the cryptographic signature
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = bs58.decode(signature)
    const publicKeyBytes = publicKey.toBytes()

    const isVerified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    )

    if (!isVerified) {
      return res.status(401).json({ 
        error: 'Invalid cryptographic signature', 
        authorized: false 
      })
    }

    // Check EONIC token requirements
    const tokenCheck = await checkEonicTokens(address)
    
    if (!tokenCheck.hasTokens) {
      return res.status(403).json({ 
        error: `Access requires ${MIN_EONIC_BALANCE} EONIC tokens. Current balance: ${tokenCheck.balance}`, 
        authorized: false,
        tokenBalance: tokenCheck.balance,
        requirement: MIN_EONIC_BALANCE
      })
    }

    // Log successful authentication
    console.log(`✅ Wallet authenticated: ${address.slice(0, 8)}...${address.slice(-4)} | Wallet: ${walletName || 'Unknown'} | EONIC: ${tokenCheck.balance}`)

    return res.status(200).json({ 
      authorized: true,
      address: address,
      walletName: walletName || 'Unknown',
      tokenBalance: tokenCheck.balance,
      level: Math.floor(tokenCheck.balance * 10 / 100) + 1,
      message: 'Authentication successful'
    })
  } catch (error) {
    console.error('Wallet verification error:', error)
    return res.status(500).json({ 
      error: 'Internal verification error', 
      authorized: false 
    })
  }
} 