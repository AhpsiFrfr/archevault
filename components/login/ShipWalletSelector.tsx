import { useState } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from '@/components/ui/Tooltip'

const ships = [
  { name: 'Phantom', icon: '/wallets/phantom.png', type: 'phantom' },
  { name: 'Solflare', icon: '/wallets/solflare.png', type: 'solflare' },
  { name: 'MetaMask', icon: '/wallets/metamask.png', type: 'metamask' },
  { name: 'Backpack', icon: '/wallets/backpack.png', type: 'backpack' },
  { name: 'xNFT', icon: '/wallets/xnft.png', type: 'xnft' },
  { name: 'Coinbase', icon: '/wallets/coinbase.png', type: 'coinbase' },
  { name: 'Guest Mode', icon: '/wallets/guest.png', type: 'guest' }
]

export default function ShipWalletSelector() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const [authenticating, setAuthenticating] = useState<string | null>(null)
  const [launched, setLaunched] = useState(false)

  const connectWallet = async (type: string) => {
    try {
      if (type === 'guest') {
        router.push('/dashboard')
        return
      }

      // For now, just redirect to dashboard
      // In a real implementation, this would handle actual wallet connection
      console.log(`Connecting to ${type} wallet...`)
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/dashboard')
    } catch (error) {
      console.error(`Failed to connect ${type} wallet:`, error)
      throw error
    }
  }

  const handleClick = async (type: string) => {
    if (authenticating) return
    setAuthenticating(type)
    setLaunched(true)
    try {
      await connectWallet(type)
    } catch (e) {
      console.error(`Failed to connect wallet: ${type}`, e)
    } finally {
      setAuthenticating(null)
    }
  }

  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.8] transition-transform duration-500">
        <img
          src="/wallets/eonic-ring.png"
          alt="Eonic Vault Ring"
          className="animate-float shadow-xl hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 max-w-[640px]">
          {ships.map((ship) => (
            <div
              key={ship.name}
              className={`relative flex items-center justify-center transition-all duration-700 ${
                launched && authenticating !== ship.type ? 'translate-y-[-400px] opacity-0' : ''
              }`}
              onMouseEnter={() => setHovered(ship.type)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(ship.type)}
            >
              <Tooltip text={ship.name}>
                <div className="relative">
                  <img
                    src={ship.icon}
                    alt={ship.name}
                    className={`w-16 h-16 cursor-pointer transition-transform duration-300 transform ${
                      hovered === ship.type || authenticating === ship.type
                        ? 'scale-150 animate-pulse'
                        : 'hover:scale-125 active:scale-150'
                    }`}
                  />

                  {/* Ignition effect */}
                  {launched && authenticating !== ship.type && (
                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 animate-ping opacity-80" />
                  )}

                  {/* Smoke trail */}
                  {launched && authenticating !== ship.type && (
                    <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-[2px] h-[40px] bg-gradient-to-b from-gray-400/60 to-transparent animate-fade-smoke" />
                  )}
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-smoke {
          0% { opacity: 0.6; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        .animate-fade-smoke {
          animation: fade-smoke 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
} 