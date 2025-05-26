import { useState } from 'react'
import { useRouter } from 'next/router'

interface User {
  wallet?: string
  username?: string
  [key: string]: any
}

interface Pylon {
  id: string
  name: string
  icon: string
  content: string
  action?: () => void
  disabled?: boolean
  color: string
}

interface PylonGridProps {
  user: User
}

export default function PylonGrid({ user }: PylonGridProps) {
  const router = useRouter()

  const defaultPylons: Pylon[] = [
    {
      id: 'chat',
      name: 'Communication Hub',
      icon: '💬',
      content: 'Access real-time chat channels and connect with the community.',
      action: () => router.push('/chat'),
      color: 'from-blue-900 to-indigo-900 border-blue-600'
    },
    {
      id: 'token',
      name: 'EONIC Analytics',
      icon: '📊',
      content: 'View token metrics, price charts, and market analysis.',
      disabled: true,
      color: 'from-purple-900 to-pink-900 border-purple-600'
    },
    {
      id: 'nft',
      name: 'NFT Gallery',
      icon: '🖼️',
      content: 'Browse and manage your EONIC NFT collection.',
      disabled: true,
      color: 'from-green-900 to-emerald-900 border-green-600'
    },
    {
      id: 'staking',
      name: 'Staking Vault',
      icon: '🔒',
      content: 'Stake your EONIC tokens to earn rewards and governance rights.',
      disabled: true,
      color: 'from-yellow-900 to-orange-900 border-yellow-600'
    },
    {
      id: 'governance',
      name: 'Governance Portal',
      icon: '🗳️',
      content: 'Participate in community voting and proposal creation.',
      disabled: true,
      color: 'from-red-900 to-pink-900 border-red-600'
    },
    {
      id: 'tools',
      name: 'Vault Tools',
      icon: '🛠️',
      content: 'Access Sigil Designer, Vaultskin customizer, and other utilities.',
      disabled: true,
      color: 'from-cyan-900 to-blue-900 border-cyan-600'
    },
    {
      id: 'settings',
      name: 'Vault Settings',
      icon: '⚙️',
      content: 'Customize your dashboard, notifications, and preferences.',
      color: 'from-zinc-900 to-slate-900 border-zinc-600'
    },
    {
      id: 'support',
      name: 'Help & Support',
      icon: '❓',
      content: 'Get help, view documentation, and contact support.',
      color: 'from-gray-900 to-zinc-900 border-gray-600'
    }
  ]

  const [pylons, setPylons] = useState<Pylon[]>(defaultPylons)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const removePylon = (id: string) => {
    setPylons((prev) => prev.filter(p => p.id !== id))
  }

  const addPylon = (pylon: Pylon) => {
    if (!pylons.find(p => p.id === pylon.id)) {
      setPylons((prev) => [...prev, pylon])
    }
    setShowAddMenu(false)
  }

  const availablePylons = defaultPylons.filter(p => !pylons.find(existing => existing.id === p.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Vault Command Center</h2>
          <p className="text-zinc-400">Customize your dashboard with pylons and tools</p>
        </div>
        
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Pylon</span>
        </button>
      </div>

      {/* Add Pylon Menu */}
      {showAddMenu && availablePylons.length > 0 && (
        <div className="bg-zinc-800/50 backdrop-blur-md rounded-xl p-4 border border-zinc-700">
          <h3 className="text-lg font-semibold text-white mb-3">Available Pylons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePylons.map((pylon) => (
              <button
                key={pylon.id}
                onClick={() => addPylon(pylon)}
                className="flex items-center space-x-3 p-3 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-lg transition-colors text-left"
              >
                <span className="text-2xl">{pylon.icon}</span>
                <div>
                  <div className="text-white font-medium">{pylon.name}</div>
                  <div className="text-xs text-zinc-400">Click to add</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pylon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pylons.map((pylon) => (
          <div
            key={pylon.id}
            className={`bg-gradient-to-br ${pylon.color} rounded-xl p-6 border transition-all duration-300 ${
              pylon.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : pylon.action 
                ? 'hover:scale-105 cursor-pointer hover:shadow-lg' 
                : 'hover:scale-105 cursor-pointer'
            }`}
            onClick={pylon.action && !pylon.disabled ? pylon.action : undefined}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{pylon.icon}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removePylon(pylon.id)
                }}
                className="text-zinc-400 hover:text-red-400 transition-colors text-lg"
                title="Remove pylon"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">{pylon.name}</h3>
              <p className="text-sm text-zinc-200 leading-relaxed">{pylon.content}</p>
              
              {/* Action Button */}
              <div className="pt-2">
                {pylon.disabled ? (
                  <div className="bg-zinc-600 text-zinc-300 px-4 py-2 rounded-lg text-sm text-center">
                    Coming Soon
                  </div>
                ) : pylon.action ? (
                  <div className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors">
                    Open Module
                  </div>
                ) : (
                  <div className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors">
                    Configure
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pylons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏗️</div>
          <h3 className="text-xl font-bold text-white mb-2">No Pylons Active</h3>
          <p className="text-zinc-400 mb-4">Add some pylons to customize your dashboard</p>
          <button
            onClick={() => setShowAddMenu(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Add Your First Pylon
          </button>
        </div>
      )}
    </div>
  )
} 