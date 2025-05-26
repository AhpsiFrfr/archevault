import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/context/UserContext'
import EonIDProfileSetup from '@/components/eonid/EonIDProfileSetup'

export default function EonID() {
  const { user } = useUser()
  const router = useRouter()
  
  // Check for authentication state from multiple sources
  const [authChecking, setAuthChecking] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthState = async () => {
      // Check if user is authenticated via UserContext
      if (user) {
        setWalletAddress(user.wallet || user.id)
        setAuthChecking(false)
        return
      }
      
      // Check localStorage for recent authentication
      const storedWalletAddress = localStorage.getItem('wallet_address')
      const authTimestamp = localStorage.getItem('auth_timestamp')
      
      if (storedWalletAddress && authTimestamp) {
        // Check if authentication is recent (within last 10 minutes)
        const authTime = new Date(authTimestamp)
        const now = new Date()
        const timeDiff = now.getTime() - authTime.getTime()
        const tenMinutes = 10 * 60 * 1000
        
        if (timeDiff < tenMinutes) {
          setWalletAddress(storedWalletAddress)
          setAuthChecking(false)
      return
    }
      }

      // No valid authentication found
      setAuthChecking(false)
    }

    checkAuthState()
  }, [user])
      
  if (authChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user && !walletAddress) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please connect your wallet to customize your EON-ID</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded font-bold transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return <EonIDProfileSetup />
} 