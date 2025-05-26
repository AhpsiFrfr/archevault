import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import bs58 from 'bs58'
import { Tooltip } from '@/components/ui/Tooltip'
import VaultEntryOverlay from '@/components/login/VaultEntryOverlay'
import { supabase } from '@/lib/supabaseClient'

const ships = [
  { name: 'Phantom', icon: '/wallets/phantom-ship.png', type: 'phantom' },
  { name: 'Solflare', icon: '/wallets/solflare-ship.png', type: 'solflare' },
  { name: 'MetaMask', icon: '/wallets/metamask-ship.png', type: 'metamask' },
  { name: 'Coinbase', icon: '/wallets/coinbase-ship.png', type: 'coinbase' },
  { name: 'Backpack', icon: '/wallets/backpack-ship.png', type: 'backpack' },
  { name: 'xNFT', icon: '/wallets/xnft-ship.png', type: 'xnft' },
  { name: 'Guest Mode', icon: '/wallets/guest-ship.png', type: 'guest' }
]

export default function Login() {
  const { publicKey, connect, disconnect, signMessage, connected, select, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const router = useRouter()
  const [hoveredShip, setHoveredShip] = useState<number | null>(null)
  const [showVaultEntry, setShowVaultEntry] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<'idle' | 'connecting' | 'authenticating' | 'success' | 'failed'>('idle')

  // Debug hover state
  useEffect(() => {
    console.log('Hovered ship changed to:', hoveredShip)
  }, [hoveredShip])

  const handleShipClick = async (shipType: string, shipIndex: number) => {
    console.log('🚀 Ship clicked:', shipType)
    
    try {
      if (shipType === 'guest') {
        console.log('👤 Guest mode selected')
        setAuthStatus('success')
        setShowVaultEntry(true)
        
        // Store guest session data
        localStorage.setItem('wallet_address', 'guest')
        localStorage.setItem('wallet_type', 'guest')
        localStorage.setItem('auth_timestamp', new Date().toISOString())
        localStorage.setItem('token_balance', '0')
        
        // Guest users always go to EON-ID setup first
        setTimeout(() => {
          console.log('👤 Guest user - redirecting to EON-ID setup...')
          router.push('/EON-ID')
        }, 2000)
        return
      }

      if (shipType === 'vault') {
        console.log('🏛️ Vault clicked - redirecting to chat')
        router.push('/chat')
        return
      }

      // Set connecting state and show overlay immediately
      console.log('🔗 Setting connecting state for:', shipType)
      setConnectingWallet(shipType)
      setAuthStatus('connecting')
      setShowVaultEntry(true)

      // Step 1: Connect to the wallet
      console.log(`🔌 Connecting to ${shipType} wallet...`)
      console.log('📱 Opening wallet selection modal...')
      
      // If no wallet is connected, show the wallet modal
      if (!wallet) {
        console.log('🔗 No wallet selected, opening wallet modal...')
        setVisible(true)
        
        // Wait for user to select a wallet
        let attempts = 0
        while (!wallet && attempts < 30) { // Wait up to 30 seconds
          await new Promise(resolve => setTimeout(resolve, 1000))
          attempts++
        }
        
        if (!wallet) {
          throw new Error('No wallet selected. Please select a wallet to continue.')
        }
        
        setVisible(false)
      }
      
      console.log('📱 Requesting wallet connection - please approve in your wallet')
      await connect()
      
      // Wait for connection to fully establish
      console.log('⏳ Waiting for wallet connection to establish...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Verify connection was successful
      if (!connected || !publicKey || !signMessage) {
        console.error('❌ Wallet connection failed - missing required functions')
        throw new Error('Wallet connection failed. Please ensure your wallet is unlocked and try again.')
      }

      console.log('✅ Wallet connected successfully!')
      console.log('📝 Wallet address:', publicKey.toBase58())

      // Step 2: Request signature for authentication
      const timestamp = new Date().toISOString()
      const walletAddress = publicKey.toBase58()
      const message = `🔐 Authenticate to Eonic Vault

Wallet: ${walletAddress}
Time: ${timestamp}
Network: Solana Devnet

By signing this message, you confirm your identity and authorize access to the Eonic Vault.`
      
      console.log('✍️ Requesting signature for authentication message...')
      console.log('📋 Message to sign:', message)
      setAuthStatus('authenticating')
      
      const encodedMessage = new TextEncoder().encode(message)
      console.log('🔏 Please approve the signature request in your wallet...')
      const signature = await signMessage(encodedMessage)
      
      console.log('✅ Message signed successfully!')

      // Step 3: Verify signature with backend
      const payload = {
        address: walletAddress,
        message,
        signature: bs58.encode(signature),
        walletName: shipType,
      }

      console.log('🔍 Verifying signature with backend...')
      const res = await fetch('/api/verify-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('📊 Verification result:', result)

      if (result.authorized) {
        console.log('🎉 Wallet authenticated successfully!')
        console.log('🏆 Access granted to Eonic Vault!')
        console.log('💰 EONIC Token Balance:', result.tokenBalance)
        setAuthStatus('success')
        
        // Store authentication data
        localStorage.setItem('wallet_address', walletAddress)
        localStorage.setItem('wallet_type', shipType)
        localStorage.setItem('auth_timestamp', timestamp)
        localStorage.setItem('token_balance', result.tokenBalance?.toString() || '0')
        
        // Check if user has existing profile in Supabase
        console.log('🔍 Checking user profile status...')
        
        try {
          // Check if user exists in wallet_users table
          const { data: existingUser, error: userError } = await supabase
            .from('wallet_users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single()
          
          if (userError && userError.code !== 'PGRST116') {
            console.error('Error checking user profile:', userError)
            throw userError
          }
          
          // Check if user has EON-ID profile
          const { data: eonProfile, error: profileError } = await supabase
            .from('eon_profiles')
            .select('*')
            .eq('wallet', walletAddress)
            .single()
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error checking EON profile:', profileError)
          }
          
          const hasEonProfile = !!eonProfile && !profileError
          const isNewUser = !existingUser || !hasEonProfile
          
          console.log('👤 User Status:', {
            hasWalletUser: !!existingUser,
            hasEonProfile,
            isNewUser
          })
          
          // Create or update wallet user record
          if (!existingUser) {
            console.log('📝 Creating new wallet user record...')
            const { error: createError } = await supabase
              .from('wallet_users')
              .insert({
                wallet_address: walletAddress,
                username: `Pilot_${walletAddress.slice(0, 8)}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
                wallet_name: shipType,
                token_balance: result.tokenBalance || 0,
                xp_level: Math.floor((result.tokenBalance || 0) * 10 / 100) + 1,
                evolution: 'Initiate',
                last_login: new Date().toISOString(),
                status: 'online'
              })
            
            if (createError) {
              console.error('Error creating user:', createError)
            } else {
              console.log('✅ New wallet user created successfully')
            }
          } else {
            console.log('🔄 Updating existing wallet user...')
            const { error: updateError } = await supabase
              .from('wallet_users')
              .update({
                token_balance: result.tokenBalance || 0,
                last_login: new Date().toISOString(),
                status: 'online'
              })
              .eq('wallet_address', walletAddress)
            
            if (updateError) {
              console.error('Error updating user:', updateError)
            } else {
              console.log('✅ Wallet user updated successfully')
            }
          }
          
          // Redirect based on user status
          setTimeout(() => {
            if (isNewUser) {
              console.log('🆕 New user detected - redirecting to EON-ID setup...')
              router.push('/EON-ID')
            } else {
              console.log('👋 Existing user detected - redirecting to dashboard...')
              router.push('/dashboard')
            }
          }, 2500)
          
        } catch (dbError) {
          console.error('💥 Database error during user check:', dbError)
          // Fallback to dashboard on database error
          setTimeout(() => {
            console.log('⚠️ Database error - defaulting to dashboard...')
            router.push('/dashboard')
          }, 2500)
        }
      } else {
        console.error('❌ Authentication failed:', result.error)
        setAuthStatus('failed')
        // Hide overlay after showing error
        setTimeout(() => {
          setShowVaultEntry(false)
          alert(`🚫 Authentication Failed\n\n${result.error || 'Invalid signature or insufficient tokens.'}\n\nPlease ensure you have the required EONIC tokens and try again.`)
        }, 1500)
        await disconnect()
      }
    } catch (err: any) {
      console.error('💥 Login error:', err)
      setAuthStatus('failed')
      
      // Handle different types of errors
      let errorMessage = 'Unknown error occurred'
      
      if (err.message?.includes('User rejected') || err.message?.includes('rejected')) {
        errorMessage = 'Signature request was rejected. Please approve the signature to authenticate.'
        console.log('👎 User rejected the signature request')
      } else if (err.message?.includes('Wallet connection failed')) {
        errorMessage = 'Failed to connect to wallet. Please ensure your wallet is unlocked and try again.'
        console.log('🔌 Wallet connection failed')
      } else if (err.message?.includes('Server error')) {
        errorMessage = 'Server error occurred. Please try again later.'
        console.log('🖥️ Server error')
      } else {
        errorMessage = err.message || 'Authentication failed'
        console.log('❓ Other error:', err.message)
      }
      
      // Hide overlay and show error after a moment
      setTimeout(() => {
        setShowVaultEntry(false)
        alert(`🚫 Login Failed\n\n${errorMessage}`)
      }, 1500)
      
      // Disconnect wallet on error
      try {
        await disconnect()
      } catch (disconnectErr) {
        console.error('Error disconnecting wallet:', disconnectErr)
      }
    } finally {
      // Clear connecting state
      console.log('🧹 Clearing connecting state')
      setConnectingWallet(null)
      setTimeout(() => {
        if (authStatus !== 'success') {
          setAuthStatus('idle')
        }
      }, 3000)
    }
  }

  const getShipTooltipText = (ship: typeof ships[0], index: number) => {
    if (connectingWallet === ship.type) {
      switch (authStatus) {
        case 'connecting': return 'Connecting...'
        case 'authenticating': return 'Authenticating...'
        case 'success': return 'Success!'
        case 'failed': return 'Failed'
        default: return ship.name
      }
    }
    return ship.name
  }

  return (
    <>
      <VaultEntryOverlay show={showVaultEntry} authStatus={authStatus} />
      
      {/* Debug info */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs">
        <div>Hovered: {hoveredShip !== null ? ships[hoveredShip]?.name : 'none'}</div>
        <div>Connecting: {connectingWallet || 'none'}</div>
        <div>Auth Status: {authStatus}</div>
        <div>Connected: {connected ? 'Yes' : 'No'}</div>
      </div>

      <div className="relative w-full h-screen bg-black overflow-hidden text-white">
        {/* Enhanced Galactic Background */}
        <div className="absolute inset-0 z-0">
          {/* Milky Way galaxy background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-black opacity-80" />
          
          {/* Static starfield to prevent hydration mismatch */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '10%', left: '15%', animationDelay: '0s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '20%', left: '80%', animationDelay: '1s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '30%', left: '25%', animationDelay: '2s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '40%', left: '70%', animationDelay: '3s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '50%', left: '45%', animationDelay: '4s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '60%', left: '90%', animationDelay: '5s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '70%', left: '35%', animationDelay: '6s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '80%', left: '60%', animationDelay: '7s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '15%', left: '55%', animationDelay: '8s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '85%', left: '20%', animationDelay: '9s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '25%', left: '75%', animationDelay: '1.5s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '35%', left: '10%', animationDelay: '2.5s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '45%', left: '85%', animationDelay: '3.5s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '55%', left: '30%', animationDelay: '4.5s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '65%', left: '65%', animationDelay: '5.5s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '75%', left: '40%', animationDelay: '6.5s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '5%', left: '50%', animationDelay: '7.5s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '95%', left: '15%', animationDelay: '8.5s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '12%', left: '95%', animationDelay: '9.5s' }} />
            <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle" style={{ top: '88%', left: '5%', animationDelay: '0.5s' }} />
          </div>
          
          {/* Static shooting stars */}
          <div className="absolute inset-0">
            <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ top: '40%', left: '30%', animationDelay: '3s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ top: '60%', left: '50%', animationDelay: '6s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ top: '30%', left: '70%', animationDelay: '9s' }} />
            <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ top: '80%', left: '20%', animationDelay: '12s' }} />
          </div>
          
          {/* Static comets */}
          <div className="absolute inset-0">
            <div className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-comet" style={{ top: '25%', left: '0%', animationDelay: '0s' }} />
            <div className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-comet" style={{ top: '60%', left: '0%', animationDelay: '8s' }} />
            <div className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-comet" style={{ top: '40%', left: '0%', animationDelay: '16s' }} />
          </div>
        </div>

        {/* Orbit Field */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div className="relative w-[1600px] h-[1600px]">
            {/* Ships with enhanced hovering animations - ORBITAL LAYOUT */}
            {ships.map((ship, i) => {
              const angle = (i / ships.length) * 2 * Math.PI;
              const radius = 380;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              return (
                <div
                  key={ship.type}
                  className={`absolute flex flex-col items-center text-center group ${
                    connectingWallet ? 'cursor-wait' : 'cursor-pointer'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px - 80px)`,
                    top: `calc(50% + ${y}px - 80px)`
                  }}
                  onClick={() => !connectingWallet && handleShipClick(ship.type, i)}
                  onMouseEnter={() => {
                    if (!connectingWallet) {
                      setHoveredShip(i)
                    }
                  }}
                  onMouseLeave={() => {
                    if (!connectingWallet) {
                      setHoveredShip(null)
                    }
                  }}
                >
                  <Tooltip text={getShipTooltipText(ship, i)}>
                    <div className="relative">
                      <Image
                        src={ship.icon}
                        alt={ship.name}
                        width={160}
                        height={160}
                        className={`transition-all duration-300 ease-in-out animate-float drop-shadow-[0_0_40px_rgba(0,255,255,0.8)] ${
                          connectingWallet === ship.type
                            ? 'scale-125 animate-pulse drop-shadow-[0_0_80px_rgba(255,165,0,1)] brightness-110'
                            : hoveredShip === i 
                            ? 'scale-150 drop-shadow-[0_0_120px_rgba(0,255,255,1)] brightness-125' 
                            : 'scale-100'
                        }`}
                        style={{
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              )
            })}

            {/* Centered EONIC Vault - PERFECTLY SIZED */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => handleShipClick('vault', -1)}
            >
              <div className="relative w-[540px] h-[540px]">
                {/* Static vault structure with text glow effect */}
                <Image
                  src="/images/eonic-ring.png?v=3"
                  alt="EONIC"
                  width={540}
                  height={540}
                  priority
                  className="absolute inset-0 w-full h-full z-10 eonic-text-glow cursor-pointer"
                />
                
                {/* Animated Egyptian blue orbit line */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-300 animate-orbit-ring opacity-80" 
                       style={{ 
                         maskImage: 'radial-gradient(ellipse, white 60%, transparent 100%)',
                         WebkitMaskImage: 'radial-gradient(ellipse, white 60%, transparent 100%)'
                       }} />
                </div>
                
                {/* Electrical zaps around the ring - LARGER */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div className="absolute w-4 h-4 bg-cyan-400 rounded-full animate-zap-1" 
                       style={{ top: '8%', left: '50%', transform: 'translateX(-50%)' }} />
                  <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-zap-2" 
                       style={{ top: '50%', right: '8%', transform: 'translateY(-50%)' }} />
                  <div className="absolute w-4 h-4 bg-cyan-300 rounded-full animate-zap-3" 
                       style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)' }} />
                  <div className="absolute w-3 h-3 bg-blue-300 rounded-full animate-zap-4" 
                       style={{ top: '50%', left: '8%', transform: 'translateY(-50%)' }} />
                  <div className="absolute w-2 h-2 bg-cyan-500 rounded-full animate-zap-5" 
                       style={{ top: '22%', right: '22%' }} />
                  <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-zap-6" 
                       style={{ bottom: '22%', left: '22%' }} />
                  <div className="absolute w-3 h-3 bg-cyan-200 rounded-full animate-zap-1" 
                       style={{ top: '30%', right: '12%', animationDelay: '0.8s' }} />
                  <div className="absolute w-2 h-2 bg-blue-200 rounded-full animate-zap-3" 
                       style={{ bottom: '30%', right: '12%', animationDelay: '1.2s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}