import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabaseClient'

interface EonProfile {
  id: string
  wallet: string
  username: string
  title: string
  bio: string
  avatar_url: string
  xp: number
  domain: string
  show_badges: boolean
  show_achievements: boolean
  show_nfts: boolean
  show_holdings: boolean
  show_staked: boolean
  pylons?: {
    show_refraGate: boolean
    show_aetherFeed: boolean
    show_vaultSkin: boolean
    show_phasePulse: boolean
    show_sigilSynth: boolean
    show_resonantArchive: boolean
  }
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<EonProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (userLoading) return
      
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const { data, error } = await supabase
          .from('eon_profiles')
          .select('*')
          .eq('wallet', user.id)
          .single()

        if (data && !error) {
          setProfile(data)
        } else {
          // No profile found, redirect to EON-ID setup
          router.push('/EON-ID')
        }
      } catch (err) {
        console.error('Error loading profile:', err)
        router.push('/EON-ID')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, userLoading, router])

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Loading Vault</h2>
          <p className="text-gray-400">Preparing your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">Unable to load your vault profile</p>
          <button 
            onClick={() => router.push('/EON-ID')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {profile.avatar_url && (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Welcome, {profile.username || 'Vault User'}
                </h1>
                {profile.title && (
                  <p className="text-lg text-gray-300">{profile.title}</p>
                )}
                {profile.domain && (
                  <p className="text-sm text-blue-400">{profile.domain}</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => router.push('/EON-ID')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => router.push('/chat')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Enter Chat
              </button>
            </div>
          </div>

          {profile.bio && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-blue-400">{profile.xp}</div>
            <div className="text-sm text-gray-400">XP Level</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-green-400">Active</div>
            <div className="text-sm text-gray-400">Status</div>
          </div>
                     <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 text-center">
             <div className="text-2xl font-bold text-purple-400">
               {user?.wallet?.slice(0, 6)}...
             </div>
             <div className="text-sm text-gray-400">Wallet</div>
           </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {new Date(profile.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-400">Joined</div>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.show_badges && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-300">Badges</h3>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  🏆
                </div>
              </div>
              <p className="text-gray-400 mb-4">Achievement badges earned</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-2xl">🥇</div>
                  <div className="text-xs text-gray-400">First Login</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-2xl">💎</div>
                  <div className="text-xs text-gray-400">Diamond Hands</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-2xl">🚀</div>
                  <div className="text-xs text-gray-400">Early Adopter</div>
                </div>
              </div>
            </div>
          )}

          {profile.show_achievements && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-green-300">Achievements</h3>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  ⭐
                </div>
              </div>
              <p className="text-gray-400 mb-4">Milestone achievements unlocked</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Setup</span>
                  <span className="text-green-400">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Transaction</span>
                  <span className="text-green-400">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Community Member</span>
                  <span className="text-gray-500">○</span>
                </div>
              </div>
            </div>
          )}

          {profile.show_nfts && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-purple-300">NFT Gallery</h3>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  🖼️
                </div>
              </div>
              <p className="text-gray-400 mb-4">Your NFT collection</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-white font-bold">#001</span>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-white font-bold">#042</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-400">2 NFTs owned</span>
              </div>
            </div>
          )}

          {profile.show_holdings && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-yellow-300">Token Holdings</h3>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  💰
                </div>
              </div>
              <p className="text-gray-400 mb-4">Your token balances</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                    <span>SOL</span>
                  </div>
                  <span className="font-mono">2.45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <span>EONIC</span>
                  </div>
                  <span className="font-mono">1,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    <span>USDC</span>
                  </div>
                  <span className="font-mono">89.32</span>
                </div>
              </div>
            </div>
          )}

          {profile.show_staked && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cyan-300">Staked EONIC</h3>
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                  🔒
                </div>
              </div>
              <p className="text-gray-400 mb-4">Your staking overview</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Staked Amount</span>
                  <span className="font-mono text-cyan-400">500 EONIC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Rewards Earned</span>
                  <span className="font-mono text-green-400">+12.5 EONIC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">APY</span>
                  <span className="font-mono text-yellow-400">8.5%</span>
                </div>
                <button className="w-full mt-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors">
                  Manage Staking
                </button>
              </div>
            </div>
          )}

          {/* Always show Chat Hub */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-300">Chat Hub</h3>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                💬
              </div>
            </div>
            <p className="text-gray-400 mb-4">Connect with the community</p>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">🟢 General Chat - 42 online</div>
              <div className="text-sm text-gray-300">🟡 Trading - 18 online</div>
              <div className="text-sm text-gray-300">🔵 Tech Talk - 7 online</div>
            </div>
            <button 
              onClick={() => router.push('/chat')}
              className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Enter Chat
            </button>
          </div>
        </div>

        {/* Pylon Widgets Section */}
        {profile.pylons && Object.values(profile.pylons).some(Boolean) && (
          <>
            <div className="col-span-full mt-8 mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                Active Pylons
              </h2>
              <p className="text-gray-400">Cosmic interfaces and dimensional tools</p>
            </div>

            {/* Pylon Grid */}
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.pylons?.show_refraGate && (
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-purple-300">Refra Gate</h3>
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        🌀
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">Portal access and dimensional navigation</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Portal Status</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Dimensions</span>
                        <span className="text-purple-400">7 Available</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Energy Level</span>
                        <span className="text-cyan-400">92%</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                      Access Portal
                    </button>
                  </div>
                )}

                {profile.pylons?.show_aetherFeed && (
                  <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-cyan-300">Aether Feed</h3>
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                        📡
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">Real-time cosmic data streams</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Signal Strength</span>
                        <span className="text-green-400">Strong</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Data Rate</span>
                        <span className="text-cyan-400">1.2 TB/s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Channels</span>
                        <span className="text-blue-400">42 Active</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors">
                      View Feed
                    </button>
                  </div>
                )}

                {profile.pylons?.show_vaultSkin && (
                  <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30 hover:border-emerald-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-emerald-300">Vault Skin</h3>
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        🎨
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">Customizable interface themes</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Current Theme</span>
                        <span className="text-emerald-400">Cosmic Dark</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Skins Owned</span>
                        <span className="text-green-400">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Customization</span>
                        <span className="text-yellow-400">Advanced</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                      Customize
                    </button>
                  </div>
                )}

                {profile.pylons?.show_phasePulse && (
                  <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-yellow-300">Phase Pulse</h3>
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        ⚡
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">Temporal synchronization matrix</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Sync Status</span>
                        <span className="text-green-400">Synchronized</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Phase Drift</span>
                        <span className="text-yellow-400">0.003%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Pulse Rate</span>
                        <span className="text-orange-400">144 Hz</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors">
                      Monitor Pulse
                    </button>
                  </div>
                )}

                {profile.pylons?.show_sigilSynth && (
                  <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-sm rounded-xl p-6 border border-violet-500/30 hover:border-violet-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-violet-300">Sigil Synth</h3>
                      <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                        🔮
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">Mystical symbol generation</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Sigils Created</span>
                        <span className="text-violet-400">847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Power Level</span>
                        <span className="text-purple-400">Mystic</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Synthesis Rate</span>
                        <span className="text-indigo-400">3.2/min</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-medium transition-colors">
                      Create Sigil
                    </button>
                  </div>
                )}

                {profile.pylons?.show_resonantArchive && (
                  <div className="bg-gradient-to-br from-teal-900/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-500/30 hover:border-teal-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-teal-300">Resonant Archive</h3>
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                        📚
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">Knowledge repository access</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Records Accessed</span>
                        <span className="text-teal-400">2,847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Archive Size</span>
                        <span className="text-blue-400">∞ Petabytes</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Search Speed</span>
                        <span className="text-cyan-400">Quantum</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg font-medium transition-colors">
                      Browse Archive
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
