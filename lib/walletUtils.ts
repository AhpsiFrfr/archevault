import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'

export async function connectWallet(type: string) {
  try {
    if (type === 'guest') {
      // For guest mode, return mock auth data
      return {
        address: 'guest',
        walletName: 'Guest Mode',
        tokenBalance: 0,
        authorized: true
      }
    }

    // Get wallet adapter context - this needs to be called from a component
    // For now, we'll throw an error to indicate this needs to be handled in the component
    throw new Error('connectWallet must be called from a component with wallet context')
    
  } catch (error) {
    console.error(`Failed to connect ${type} wallet:`, error)
    throw error
  }
}

// Helper function for wallet authentication that can be used in components
export async function authenticateWallet(
  walletType: string,
  publicKey: any,
  signMessage: any
) {
  try {
    if (!publicKey || !signMessage) {
      throw new Error('Wallet not connected or missing signature capability')
    }

    // Create authentication message with timestamp and wallet info
    const timestamp = new Date().toISOString()
    const walletAddress = publicKey.toBase58()
    const message = `Authenticate to Eonic Vault\nWallet: ${walletAddress}\nTime: ${timestamp}\nNetwork: Solana Devnet`
    
    console.log('Requesting signature for message:', message)
    const encodedMessage = new TextEncoder().encode(message)
    const signature = await signMessage(encodedMessage)

    const payload = {
      address: walletAddress,
      message,
      signature: bs58.encode(signature),
      walletName: walletType,
    }

    console.log('Verifying wallet signature...')
    const res = await fetch('/api/verify-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    console.log('Verification result:', result)

    if (!result.authorized) {
      throw new Error(result.error || 'Authentication failed')
    }

    return {
      address: walletAddress,
      walletName: walletType,
      tokenBalance: result.tokenBalance || 0,
      authorized: true,
      level: result.level || 1
    }
  } catch (error) {
    console.error('Authentication error:', error)
    throw error
  }
} 