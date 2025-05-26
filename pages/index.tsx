import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabaseClient'

export default function IndexRedirect() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkUserProfile = async () => {
      // Wait for user context to load
      if (userLoading) return
      
      // If no user, redirect to login
      if (!user) {
        router.push('/login')
        return
      }
      
      try {
        setChecking(true)
        
        // Check if user has an EON-ID profile
        const { data, error } = await supabase
          .from('eon_profiles')
          .select('*')
          .eq('wallet', user.id)
          .single()

        if (data && !error) {
          // Profile exists, redirect to dashboard
          router.push('/dashboard')
        } else {
          // No profile exists, redirect to EON-ID setup
          router.push('/EON-ID')
        }
      } catch (err) {
        console.error('Error checking profile:', err)
        // On error, redirect to EON-ID setup as fallback
        router.push('/EON-ID')
      } finally {
        setChecking(false)
      }
    }

    checkUserProfile()
  }, [user, userLoading, router])

  // Show loading screen while checking
  if (userLoading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Accessing Vault</h2>
          <p className="text-gray-400">Checking your profile...</p>
        </div>
      </div>
    )
  }

  return null
}
