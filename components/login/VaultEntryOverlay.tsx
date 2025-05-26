import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

interface VaultEntryOverlayProps {
  show: boolean
  authStatus: 'idle' | 'connecting' | 'authenticating' | 'success' | 'failed'
}

export default function VaultEntryOverlay({ show, authStatus }: VaultEntryOverlayProps) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      if (authStatus === 'success') {
        const timeout = setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
        return () => clearTimeout(timeout)
      }
    }
  }, [show, authStatus, router])

  if (!visible) return null

  const getStatusMessage = () => {
    switch (authStatus) {
      case 'connecting':
        return { 
          text: 'CONNECTING WALLET...', 
          color: 'text-yellow-400', 
          animation: 'animate-pulse',
          subtitle: 'Please approve the connection in your wallet'
        }
      case 'authenticating':
        return { 
          text: 'AUTHENTICATING...', 
          color: 'text-orange-400', 
          animation: 'animate-pulse',
          subtitle: 'Please sign the authentication message'
        }
      case 'success':
        return { 
          text: 'ACCESS GRANTED', 
          color: 'text-cyan-400', 
          animation: 'animate-access-glow',
          subtitle: 'Entering the Eonic Vault...'
        }
      case 'failed':
        return { 
          text: 'ACCESS DENIED', 
          color: 'text-red-400', 
          animation: 'animate-pulse',
          subtitle: 'Authentication failed'
        }
      default:
        return { 
          text: 'INITIALIZING...', 
          color: 'text-gray-400', 
          animation: 'animate-pulse',
          subtitle: 'Preparing vault entry'
        }
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative text-center">
        <Image
          src="/images/eonic-ring.png"
          alt="Vault Ring"
          width={280}
          height={280}
          className={`mx-auto ${authStatus === 'success' ? 'animate-zoom-glow' : 'animate-pulse'}`}
          priority
        />
        <p className={`mt-6 text-xl font-bold ${statusMessage.color} ${statusMessage.animation}`}>
          {statusMessage.text}
        </p>
        <p className="mt-2 text-sm text-gray-400 animate-pulse">
          {statusMessage.subtitle}
        </p>
      </div>

      <style jsx>{`
        @keyframes zoom-glow {
          0% { 
            transform: scale(1); 
            filter: brightness(1) drop-shadow(0 0 20px rgba(0,255,255,0.5)); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1.5); 
            filter: brightness(1.8) drop-shadow(0 0 60px rgba(0,255,255,1)); 
            opacity: 1; 
          }
        }
        .animate-zoom-glow {
          animation: zoom-glow 1.4s ease-out forwards;
        }

        @keyframes access-glow {
          0% { 
            opacity: 0; 
            letter-spacing: 0.1em; 
            text-shadow: 0 0 10px rgba(0,255,255,0.5);
          }
          60% { 
            opacity: 1; 
            letter-spacing: 0.2em; 
            text-shadow: 0 0 20px rgba(0,255,255,1);
          }
          100% { 
            opacity: 0; 
            letter-spacing: 0.3em;
            text-shadow: 0 0 30px rgba(0,255,255,0.8);
          }
        }
        .animate-access-glow {
          animation: access-glow 1.2s ease-in-out forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-in;
        }
      `}</style>
    </div>
  )
} 