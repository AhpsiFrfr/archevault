import { useRouter } from 'next/router'
import { useUser } from '@/context/UserContext'
import LogoutButton from './LogoutButton'

export default function Sidebar() {
  const router = useRouter()
  const { user } = useUser()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠', current: router.pathname === '/dashboard' },
    { name: 'Chat Hub', href: '/chat', icon: '💬', current: router.pathname === '/chat' },
    { name: 'Token Analytics', href: '#', icon: '📊', current: false, disabled: true },
    { name: 'NFT Gallery', href: '#', icon: '🖼️', current: false, disabled: true },
    { name: 'Staking Vault', href: '#', icon: '🔒', current: false, disabled: true },
    { name: 'Governance', href: '#', icon: '🗳️', current: false, disabled: true },
    { name: 'Settings', href: '#', icon: '⚙️', current: false, disabled: true },
  ]

  return (
    <div className="w-64 bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">E</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ARCHEVAULT</h1>
            <p className="text-xs text-zinc-400">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => !item.disabled && router.push(item.href)}
            disabled={item.disabled}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              item.current
                ? 'bg-cyan-600 text-white'
                : item.disabled
                ? 'text-zinc-500 cursor-not-allowed opacity-50'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
            {item.disabled && (
              <span className="ml-auto text-xs bg-zinc-700 px-2 py-1 rounded">Soon</span>
            )}
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.wallet}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-cyan-400"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || 'Vault Explorer'}
            </p>
            <p className="text-xs text-zinc-400 truncate">
              {user?.wallet ? `${user.wallet.slice(0, 6)}...${user.wallet.slice(-4)}` : 'No wallet'}
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
} 