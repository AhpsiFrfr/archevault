import { useWalletAuth } from '@/lib/useWalletAuth'

interface User {
  wallet?: string
  username?: string
  avatar?: string
  [key: string]: any
}

interface EonIDProps {
  user: User
}

export default function EonID({ user }: EonIDProps) {
  const { tokenBalance, userProfile } = useWalletAuth()

  const getEvolutionStage = (xpLevel: number) => {
    if (xpLevel >= 5) return 'Ascended'
    if (xpLevel >= 4) return 'Evolved'
    if (xpLevel >= 3) return 'Advanced'
    if (xpLevel >= 2) return 'Apprentice'
    return 'Initiate'
  }

  const getEvolutionColor = (stage: string) => {
    switch (stage) {
      case 'Ascended': return 'text-purple-400'
      case 'Evolved': return 'text-blue-400'
      case 'Advanced': return 'text-green-400'
      case 'Apprentice': return 'text-yellow-400'
      default: return 'text-zinc-400'
    }
  }

  const evolutionStage = getEvolutionStage(userProfile?.xp_level || 1)

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left: Avatar & Identity */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.wallet}`}
            alt="EON-ID Avatar"
            className="w-20 h-20 rounded-full border-3 border-cyan-400 shadow-lg shadow-cyan-400/30"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-zinc-900 flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-cyan-300 mb-1">
            {user?.username || 'Unnamed Explorer'}
          </h2>
          <p className={`text-lg font-semibold ${getEvolutionColor(evolutionStage)}`}>
            {evolutionStage} • Level {userProfile?.xp_level || 1}
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            EON-ID: {user?.wallet ? `${user.wallet.slice(0, 8)}...${user.wallet.slice(-6)}` : 'Not Connected'}
          </p>
        </div>
      </div>

      {/* Right: Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-lg font-bold text-cyan-400">{tokenBalance || 0}</div>
          <div className="text-xs text-zinc-400">EONIC</div>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-lg font-bold text-yellow-400">{userProfile?.xp_level || 1}</div>
          <div className="text-xs text-zinc-400">Level</div>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl mb-1">💬</div>
          <div className="text-lg font-bold text-blue-400">{userProfile?.total_messages || 0}</div>
          <div className="text-xs text-zinc-400">Messages</div>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-lg font-bold text-green-400">{userProfile?.total_reactions || 0}</div>
          <div className="text-xs text-zinc-400">Reactions</div>
        </div>
      </div>
    </div>
  )
} 