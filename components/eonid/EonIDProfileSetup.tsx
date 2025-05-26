import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const defaultTitles = [
  'Builder',
  'Founder', 
  'King of the Rats',
  'Oracle',
  'Visionary',
  'Architect',
  'Pioneer',
  'Sage'
];

const vaultThemes = [
  'Cosmic Dark',
  'Neon Cyber',
  'Ethereal Blue',
  'Mystic Purple',
  'Solar Gold'
];

interface PylonConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'core' | 'identity' | 'monitoring' | 'social' | 'utility' | 'customization';
  enabled: boolean;
}

const defaultPylons: PylonConfig[] = [
  { id: 'eonid', name: 'EON-ID Profile', description: 'Your digital identity and profile information', icon: '🆔', category: 'core', enabled: true },
  { id: 'phasePulse', name: 'Phase Pulse Monitor', description: 'Real-time dimensional stability and phase monitoring', icon: '⚡', category: 'monitoring', enabled: true },
  { id: 'refraGate', name: 'RefraGate', description: 'Dimensional gateway control and portal management', icon: '🌀', category: 'core', enabled: true },
  { id: 'aetherFeed', name: 'Aether Feed', description: 'Real-time cosmic data streams and updates', icon: '📡', category: 'monitoring', enabled: false },
  { id: 'vaultSkin', name: 'Vault Skin', description: 'Customizable interface themes and appearance', icon: '🎨', category: 'customization', enabled: false },
  { id: 'sigilSynth', name: 'Sigil Synth', description: 'Mystical symbol generation and management', icon: '🔮', category: 'utility', enabled: false },
  { id: 'resonantArchive', name: 'Resonant Archive', description: 'Knowledge repository access and storage', icon: '📚', category: 'utility', enabled: false },
  { id: 'socialLinks', name: 'Social Links', description: 'Connected social media and external profiles', icon: '🔗', category: 'social', enabled: false }
];

export default function EonIDProfileSetup() {
  const [username, setUsername] = useState('Bussynfrfr');
  const [title, setTitle] = useState('King of The Rats');
  const [bio, setBio] = useState("I'm just bussyn frfr.");
  const [xpLevel, setXPLevel] = useState(0);
  const [avatar, setAvatar] = useState('');
  const [domain, setDomain] = useState('bussynfrfr');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [pylons, setPylons] = useState<PylonConfig[]>(defaultPylons);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  const checkDomainAvailability = async () => {
    if (!domain) return;
    try {
      const res = await fetch(`https://naming.bonfida.org/domain/${domain}`);
      const data = await res.json();
      if (!data?.owner) {
        alert('✅ Domain is available!');
      } else {
        alert('❌ Domain already taken.');
      }
    } catch (error) {
      console.error('Domain check failed:', error);
      alert('⚠️ Unable to check domain availability');
    }
  };

  const togglePylon = (pylonId: string) => {
    setPylons(prev => prev.map(pylon => 
      pylon.id === pylonId ? { ...pylon, enabled: !pylon.enabled } : pylon
    ));
  };

  const resetPylons = () => {
    setPylons(defaultPylons);
  };

  const activePylons = pylons.filter(p => p.enabled);
  const pylonsByCategory = pylons.reduce((acc, pylon) => {
    if (!acc[pylon.category]) acc[pylon.category] = [];
    acc[pylon.category].push(pylon);
    return acc;
  }, {} as Record<string, PylonConfig[]>);

  const categoryLabels = {
    core: 'All Pylons',
    identity: 'Identity', 
    monitoring: 'Monitoring',
    social: 'Social',
    utility: 'Utility',
    customization: 'Customization'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            Customize Your EON-ID
          </h1>
          <p className="text-gray-400">
            Personalize your vault profile and control what others can see
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side – Profile Setup */}
          <div className="space-y-6">
            {/* EON-ID Profile Manager */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">👤</span>
                <h2 className="text-2xl font-bold text-blue-300">EON-ID Profile Manager</h2>
              </div>

              {/* Profile Avatar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Profile Avatar</label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-2 ring-blue-500">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>👤</AvatarFallback>
                  </Avatar>
                                     <Button variant="outline" className="flex items-center gap-2">
                     <ArrowUpTrayIcon className="w-4 h-4" />
                     Upload Avatar
                   </Button>
                </div>
              </div>

              {/* Display Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name *</label>
                <Input 
                  placeholder="Enter your display name" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                />
              </div>

              {/* Title and Theme */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title Selector</label>
                  <Select onValueChange={setTitle} defaultValue={title}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultTitles.map((t, idx) => (
                        <SelectItem key={idx} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vaultskin Theme</label>
                  <Select onValueChange={setSelectedTheme} defaultValue={selectedTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaultThemes.map((theme, idx) => (
                        <SelectItem key={idx} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Claim Domain */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Claim Your Wallet Domain</label>
                <div className="flex gap-2">
                  <Input 
                    value={domain} 
                    onChange={e => setDomain(e.target.value)} 
                    placeholder="your-domain" 
                    className="flex-1" 
                  />
                  <span className="flex items-center px-3 text-gray-400">.sol</span>
                  <Button onClick={checkDomainAvailability} variant="outline">
                    🔍 Claim Domain
                  </Button>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <Textarea 
                  placeholder="Tell us about yourself..." 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  rows={3}
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Social Links</label>
                <p className="text-xs text-gray-400 mb-3">Click logos to add social links</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Twitter', icon: '🐦' },
                    { name: 'GitHub', icon: '🐙' },
                    { name: 'Discord', icon: '💬' },
                    { name: 'LinkedIn', icon: '💼' },
                    { name: 'Instagram', icon: '📷' },
                    { name: 'Website', icon: '🌐' },
                    { name: 'YouTube', icon: '📺' },
                    { name: 'More', icon: '➕' }
                  ].map((social, idx) => (
                    <Button key={idx} variant="outline" className="aspect-square p-2">
                      <span className="text-lg">{social.icon}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side – Preview + Pylon Manager */}
          <div className="space-y-6">
            {/* Dashboard Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👤</span>
                <h2 className="text-2xl font-bold text-blue-300">Dashboard Preview</h2>
              </div>
              
              <div className="rounded-xl bg-gradient-to-br from-[#2b2b45] to-[#1a1a2e] p-6 border border-violet-500/30">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-2 ring-violet-500">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{username || 'Your Display Name'}</h3>
                    <p className="text-sm text-violet-300">
                      @{username.toLowerCase() || 'username'} • {title || 'Builder'}
                    </p>
                    <p className="text-xs text-gray-400">{domain || 'unclaimed'}.sol</p>
                    
                    {/* XP Progress */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-300 mb-1">XP Progress</p>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                          className="h-2 bg-violet-500 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(xpLevel * 10, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-gray-400">
                        {xpLevel} / 1000 XP ({Math.min(xpLevel * 0.1, 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  This is how your EON-ID will appear on your dashboard
                </p>
              </div>
            </div>

            {/* Dashboard Layout Manager */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-2xl font-bold text-purple-300">Dashboard Layout Manager</h2>
              </div>

              {/* Pylon Manager Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Pylon Manager</h3>
                  <p className="text-sm text-gray-400">{activePylons.length} of {pylons.length} pylons active</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeView === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView('grid')}
                  >
                    ⊞
                  </Button>
                  <Button
                    variant={activeView === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView('list')}
                  >
                    ☰
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetPylons}>
                    🔄 Reset
                  </Button>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(categoryLabels).map(([category, label]) => (
                  <Button key={category} variant="outline" size="sm">
                    {label}
                  </Button>
                ))}
              </div>

              {/* Active Pylons Preview */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {activePylons.slice(0, 6).map((pylon) => (
                  <div key={pylon.id} className="bg-blue-900/30 p-3 rounded-lg text-center">
                    <div className="text-lg mb-1">{pylon.icon}</div>
                    <div className="text-xs text-blue-300">{pylon.name}</div>
                    {pylon.id === 'eonid' && (
                      <div className="text-xs text-yellow-400 mt-1">CORE</div>
                    )}
                    {pylon.enabled && pylon.id !== 'eonid' && (
                      <div className="text-xs text-green-400 mt-1">Active</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pylon List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pylons.map((pylon) => (
                  <div 
                    key={pylon.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      pylon.enabled 
                        ? 'bg-blue-900/30 border-blue-500/50' 
                        : 'bg-gray-700/30 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{pylon.icon}</span>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {pylon.name}
                          {pylon.id === 'eonid' && (
                            <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded">
                              CORE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{pylon.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pylon.enabled && (
                        <span className="text-xs text-green-400">● Active</span>
                      )}
                                             <button
                         onClick={() => togglePylon(pylon.id)}
                         disabled={pylon.id === 'eonid'}
                         aria-label={`Toggle ${pylon.name} pylon`}
                         className={`w-10 h-6 rounded-full transition-colors ${
                           pylon.enabled 
                             ? 'bg-blue-500' 
                             : 'bg-gray-600'
                         } ${pylon.id === 'eonid' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                       >
                         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                           pylon.enabled ? 'translate-x-5' : 'translate-x-1'
                         }`} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-md mx-auto">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            Save and Enter Vault
          </Button>
        </div>
      </div>
    </div>
  );
} 