import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import bs58 from 'bs58'
import { supabase } from './supabaseClient'
import { Connection, PublicKey } from '@solana/web3.js'

// EONIC token configuration
const EONIC_MINT_ADDRESS = process.env.NEXT_PUBLIC_EONIC_MINT_ADDRESS || 'YOUR_EONIC_MINT_ADDRESS'
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'

interface TokenAccount {
  mint: string
  amount: number
}

export const useWalletAuth = () => {
  const { publicKey, signMessage, connected, connect, disconnect, wallet } = useWallet()
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'authenticated' | 'unauthorized' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [tokenBalance, setTokenBalance] = useState<number>(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false) // Prevent duplicate auth
  const router = useRouter()

  // Check EONIC token balance
  const checkEonicBalance = async (walletAddress: string): Promise<number> => {
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
        return balance
      }

      return 0
    } catch (error) {
      console.error('Error checking EONIC balance:', error)
      return 0
    }
  }

  // Calculate user level and evolution based on token balance and activity
  const calculateUserStats = (balance: number, createdAt: string) => {
    const daysSinceJoined = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const baseXP = Math.floor(balance * 10) + daysSinceJoined
    const level = Math.floor(baseXP / 100) + 1

    let evolution = 'Initiate'
    if (level >= 50) evolution = 'Ascended'
    else if (level >= 25) evolution = 'Evolved'
    else if (level >= 10) evolution = 'Advanced'
    else if (level >= 5) evolution = 'Apprentice'

    return { level, evolution, xp: baseXP }
  }

  // Manual authentication function
  const authenticate = async () => {
    if (!connected || !publicKey || !signMessage || isAuthenticating) {
      return
    }

    setIsAuthenticating(true)
    setAuthStatus('authenticating')
    setError('')

    try {
      const walletAddress = publicKey.toBase58()
      
      // Check if already authenticated for this wallet
      const storedWalletAddress = localStorage.getItem('wallet_address')
      if (storedWalletAddress === walletAddress) {
        setAuthStatus('authenticated')
        setIsAuthenticating(false)
        return
      }
      
      // Check EONIC token balance
      const balance = await checkEonicBalance(walletAddress)
      setTokenBalance(balance)

      // Enhanced message with timestamp and wallet info
      const timestamp = new Date().toISOString()
      const message = `Authenticate to Eonic Vault\nWallet: ${walletAddress}\nTime: ${timestamp}\nNetwork: Solana Devnet`
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)

      const payload = {
        address: walletAddress,
        message,
        signature: bs58.encode(signature),
        walletName: wallet?.adapter?.name || 'Unknown',
        tokenBalance: balance
      }

      // Verify signature with enhanced API
      const response = await fetch('/api/verify-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data?.authorized) {
        // Create or update wallet user with enhanced profile
        const userStats = calculateUserStats(balance, new Date().toISOString())
        
        const { data: walletUser, error: supabaseError } = await supabase
          .from('wallet_users')
          .upsert({ 
            wallet_address: walletAddress,
            username: `Pilot_${walletAddress.slice(0, 8)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
            wallet_name: wallet?.adapter?.name || 'Unknown',
            token_balance: balance,
            xp_level: userStats.level,
            evolution: userStats.evolution,
            last_login: new Date().toISOString(),
            status: 'online'
          }, { 
            onConflict: 'wallet_address',
            ignoreDuplicates: false 
          })
          .select()
          .single()

        if (supabaseError) {
          console.error('Supabase error:', supabaseError)
          setError('Failed to create user record')
          setAuthStatus('error')
          setIsAuthenticating(false)
          return
        }

        // Store enhanced authentication data
        const authData = {
          walletAddress,
          walletName: wallet?.adapter?.name || 'Unknown',
          tokenBalance: balance,
          userStats,
          loginTime: timestamp
        }

        localStorage.setItem('wallet_address', walletAddress)
        localStorage.setItem('wallet_user', JSON.stringify(walletUser))
        localStorage.setItem('auth_data', JSON.stringify(authData))
        
        setUserProfile(walletUser)
        setAuthStatus('authenticated')
        
        // Redirect based on user level
        if (userStats.level >= 10) {
          router.push('/dashboard') // High-level users go to dashboard
        } else {
          router.push('/chat') // New users start with chat
        }
      } else {
        setError(data.error || 'Wallet verification failed')
        setAuthStatus('unauthorized')
      }
    } catch (err: any) {
      console.error('Authentication error:', err)
      setError(err.message || 'Authentication failed')
      setAuthStatus('error')
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Reset auth status when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setAuthStatus('idle')
      setIsAuthenticating(false)
      setError('')
      setTokenBalance(0)
      setUserProfile(null)
    }
  }, [connected])

  const logout = async () => {
    try {
      // Update user status to offline
      const walletAddress = localStorage.getItem('wallet_address')
      if (walletAddress) {
        await supabase
          .from('wallet_users')
          .update({ status: 'offline', last_logout: new Date().toISOString() })
          .eq('wallet_address', walletAddress)
      }

      await disconnect()
      localStorage.removeItem('wallet_address')
      localStorage.removeItem('wallet_user')
      localStorage.removeItem('auth_data')
      
      setAuthStatus('idle')
      setError('')
      setTokenBalance(0)
      setUserProfile(null)
      setIsAuthenticating(false)
      router.push('/login')
    } catch (err: any) {
      console.error('Logout error:', err)
    }
  }

  const refreshProfile = async () => {
    const walletAddress = localStorage.getItem('wallet_address')
    if (walletAddress) {
      const balance = await checkEonicBalance(walletAddress)
      setTokenBalance(balance)
      
      // Update balance in database
      await supabase
        .from('wallet_users')
        .update({ token_balance: balance })
        .eq('wallet_address', walletAddress)
    }
  }

  return { 
    connect, 
    authenticate, // Manual authentication function
    logout,
    refreshProfile,
    authStatus, 
    error,
    tokenBalance,
    userProfile,
    isAuthenticated: authStatus === 'authenticated',
    isLoading: authStatus === 'authenticating' || isAuthenticating,
    walletName: wallet?.adapter?.name || 'Unknown'
  }
} 