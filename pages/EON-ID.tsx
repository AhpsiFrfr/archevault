import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabaseClient'

export default function EonID() {
  const { user } = useUser()
  const router = useRouter()
  const [form, setForm] = useState({
    avatar_url: '',
    username: '',
    title: '',
    bio: '',
    xp: 0,
    domain: '',
    show_badges: true,
    show_achievements: true,
    show_nfts: true,
    show_holdings: true,
    show_staked: true,
    pylons: {
      show_refraGate: true,
      show_aetherFeed: true,
      show_vaultSkin: true,
      show_phasePulse: true,
      show_sigilSynth: true,
      show_resonantArchive: true
    }
  })
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Check for authentication state from multiple sources
  const [authChecking, setAuthChecking] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const currentWalletAddress = user?.wallet || user?.id || walletAddress
    if (!currentWalletAddress) return
    
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('eon_profiles')
        .select('*')
        .eq('wallet', currentWalletAddress)
        .single()
      
      if (data && !error) {
        setForm({ ...form, ...data })
      }
    }
    
    loadProfile()
  }, [user, walletAddress])



  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    
    if (name.startsWith('pylons.')) {
      const key = name.split('.')[1]
      setForm({ 
        ...form, 
        pylons: { 
          ...form.pylons, 
          [key]: checked 
        } 
      })
    } else {
      const newValue = type === 'checkbox' ? checked : value
      setForm({
        ...form,
        [name]: newValue
      })
    }

    // Domain availability check
    if (name === 'domain') {
      const domain = value.replace(/\s+/g, '').toLowerCase()
      if (!domain.endsWith('.sol')) {
        setDomainAvailable(null)
        return
      }
      
      try {
        setLoading(true)
        const res = await fetch(`https://sns-api.bonfida.com/domain/${domain}`)
        const data = await res.json()
        setDomainAvailable(data?.owner === null)
      } catch (err) {
        console.error('Domain check failed:', err)
        setDomainAvailable(null)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = async () => {
    const currentWalletAddress = user?.wallet || user?.id || walletAddress
    
    if (!currentWalletAddress) {
      alert('Please connect your wallet first.')
      return
    }

    if (form.domain.endsWith('.sol') && domainAvailable === false) {
      alert('The selected domain is already taken. Please choose a different one.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase
        .from('eon_profiles')
        .upsert({ 
          ...form, 
          wallet: currentWalletAddress,
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Save error:', error)
        alert('Failed to save profile. Please try again.')
        return
      }
      
      router.push('/dashboard')
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            Customize Your EON-ID
          </h1>
          <p className="text-gray-400">
            Personalize your vault profile and control what others can see
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* LEFT: EON-ID Profile Setup */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 space-y-6">
              <h2 className="text-2xl font-semibold text-blue-300 border-b border-gray-600 pb-3">
                EON-ID Profile Setup
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input 
                      name="username" 
                      value={form.username} 
                      onChange={handleChange} 
                      placeholder="Enter your username" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title / Role
                    </label>
                    <input 
                      name="title" 
                      value={form.title} 
                      onChange={handleChange} 
                      placeholder="e.g. DeFi Trader, NFT Collector" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleChange} 
                    placeholder="Tell others about yourself..." 
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Avatar Image URL
                    </label>
                    <input 
                      name="avatar_url" 
                      value={form.avatar_url} 
                      onChange={handleChange} 
                      placeholder="https://example.com/avatar.jpg" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      XP Level
                    </label>
                    <input 
                      name="xp" 
                      type="number" 
                      value={form.xp} 
                      onChange={handleChange} 
                      placeholder="0" 
                      min="0"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Domain Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bonfida Domain (Optional)
                  </label>
                  <div className="relative">
                    <input 
                      name="domain" 
                      value={form.domain} 
                      onChange={handleChange} 
                      placeholder="myname.sol" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {loading && form.domain.endsWith('.sol') && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {form.domain.endsWith('.sol') && domainAvailable !== null && !loading && (
                    <p className={`mt-2 text-sm flex items-center ${domainAvailable ? 'text-green-400' : 'text-red-400'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${domainAvailable ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      {domainAvailable ? 'Domain is available!' : 'Domain is already taken.'}
                    </p>
                  )}
                </div>

                {/* EON-ID Display Settings */}
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                  <h3 className="text-lg font-semibold text-blue-300">EON-ID Display Settings</h3>
                  <p className="text-sm text-gray-400">Control which sections appear on your profile</p>
                  
                  <div className="space-y-2">
                    {[
                      { key: 'show_badges', label: 'Show Badges', desc: 'Achievement badges' },
                      { key: 'show_achievements', label: 'Show Achievements', desc: 'Milestone achievements' },
                      { key: 'show_nfts', label: 'Show NFTs', desc: 'NFT collection' },
                      { key: 'show_holdings', label: 'Show Holdings', desc: 'Token balances' },
                      { key: 'show_staked', label: 'Show Staked EONIC', desc: 'Staking overview' }
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded hover:bg-gray-800 transition-colors cursor-pointer">
                        <input 
                          type="checkbox" 
                          name={key} 
                          checked={form[key as keyof typeof form] as boolean} 
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-sm">{label}</span>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Pylon/Widget Visibility Toggles */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 space-y-6">
              <h2 className="text-2xl font-semibold text-cyan-300 border-b border-gray-600 pb-3">
                Pylon Customization
              </h2>
              <p className="text-sm text-gray-400">
                Configure which pylons and widgets appear on your dashboard
              </p>
              
              <div className="space-y-4">
                {Object.entries(form.pylons).map(([key, value]) => {
                  const pylonNames: { [key: string]: { name: string; desc: string; icon: string } } = {
                    show_refraGate: { 
                      name: 'Refra Gate', 
                      desc: 'Portal access and dimensional navigation',
                      icon: '🌀'
                    },
                    show_aetherFeed: { 
                      name: 'Aether Feed', 
                      desc: 'Real-time cosmic data streams',
                      icon: '📡'
                    },
                    show_vaultSkin: { 
                      name: 'Vault Skin', 
                      desc: 'Customizable interface themes',
                      icon: '🎨'
                    },
                    show_phasePulse: { 
                      name: 'Phase Pulse', 
                      desc: 'Temporal synchronization matrix',
                      icon: '⚡'
                    },
                    show_sigilSynth: { 
                      name: 'Sigil Synth', 
                      desc: 'Mystical symbol generation',
                      icon: '🔮'
                    },
                    show_resonantArchive: { 
                      name: 'Resonant Archive', 
                      desc: 'Knowledge repository access',
                      icon: '📚'
                    }
                  }
                  
                  const pylon = pylonNames[key]
                  
                  return (
                    <label key={key} className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer border border-gray-700 hover:border-cyan-500">
                      <input 
                        type="checkbox" 
                        name={`pylons.${key}`} 
                        checked={value} 
                        onChange={handleChange}
                        className="w-5 h-5 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                      <div className="text-3xl">{pylon.icon}</div>
                      <div className="flex-1">
                        <span className="font-semibold text-cyan-300">{pylon.name}</span>
                        <p className="text-sm text-gray-400">{pylon.desc}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${value ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                    </label>
                  )
                })}
              </div>

              {/* Preview Section */}
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-300 mb-3">Active Pylons Preview</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(form.pylons)
                    .filter(([_, enabled]) => enabled)
                    .map(([key, _]) => {
                      const pylonNames: { [key: string]: string } = {
                        show_refraGate: 'Refra Gate',
                        show_aetherFeed: 'Aether Feed',
                        show_vaultSkin: 'Vault Skin',
                        show_phasePulse: 'Phase Pulse',
                        show_sigilSynth: 'Sigil Synth',
                        show_resonantArchive: 'Resonant Archive'
                      }
                      
                      return (
                        <div key={key} className="bg-cyan-900/30 p-2 rounded text-center">
                          <span className="text-xs text-cyan-300">{pylonNames[key]}</span>
                        </div>
                      )
                    })}
                </div>
                {Object.values(form.pylons).every(v => !v) && (
                  <p className="text-gray-500 text-center text-sm">No pylons selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-md mx-auto">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              'Save and Enter Vault'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 