import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useUser } from '@/context/UserContext'

const LogoutButton = () => {
  const { disconnect } = useWallet()
  const { setUser } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    // Disconnect wallet
    await disconnect()
    
    // Clear local storage
    localStorage.removeItem('wallet_address')
    localStorage.removeItem('wallet_user')
    
    // Clear user context
    setUser(null)
    
    // Redirect to login
    router.replace('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors z-50"
    >
      🚀 Disconnect
    </button>
  )
}

export default LogoutButton 