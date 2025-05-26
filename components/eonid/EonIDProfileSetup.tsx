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
  const [domainStatus, setDomainStatus] = useState<'unchecked' | 'checking' | 'available' | 'taken'>('unchecked');

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkDomainAvailability = async () => {
    if (!domain) return;
    setDomainStatus('checking');
    
    try {
      const res = await fetch(`https://naming.bonfida.org/domain/${domain}`);
      const data = await res.json();
      if (!data?.owner) {
        setDomainStatus('available');
      } else {
        setDomainStatus('taken');
      }
    } catch (error) {
      console.error('Domain check failed:', error);
      setDomainStatus('unchecked');
      alert('⚠️ Unable to check domain availability');
    }
  };

  const claimDomain = async () => {
    if (domainStatus !== 'available') return;
    
    try {
      // This would integrate with actual Bonfida claiming process
      alert('🚀 Domain claiming functionality would be implemented here with Bonfida integration');
      // Reset status after claim attempt
      setDomainStatus('unchecked');
    } catch (error) {
      console.error('Domain claim failed:', error);
      alert('❌ Failed to claim domain');
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
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      aria-label="Upload avatar image"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <ArrowUpTrayIcon className="w-4 h-4" />
                      Upload Avatar
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">Max 5MB, JPG/PNG</p>
                  </div>
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
                    onChange={(e) => {
                      setDomain(e.target.value);
                      setDomainStatus('unchecked'); // Reset status when domain changes
                    }} 
                    placeholder="your-domain" 
                    className="flex-1" 
                  />
                  <span className="flex items-center px-3 text-gray-400">.sol</span>
                  {domainStatus === 'unchecked' && (
                    <Button 
                      onClick={checkDomainAvailability} 
                      variant="outline"
                      disabled={!domain.trim()}
                    >
                      🔍 Check Availability
                    </Button>
                  )}
                  {domainStatus === 'checking' && (
                    <Button variant="outline" disabled>
                      ⏳ Checking...
                    </Button>
                  )}
                  {domainStatus === 'available' && (
                    <Button 
                      onClick={claimDomain} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      ✅ Claim Domain
                    </Button>
                  )}
                  {domainStatus === 'taken' && (
                    <Button 
                      onClick={() => setDomainStatus('unchecked')} 
                      variant="outline"
                      className="border-red-500 text-red-400"
                    >
                      ❌ Taken - Try Another
                    </Button>
                  )}
                </div>
                {domainStatus === 'available' && (
                  <p className="text-xs text-green-400 mt-1">✅ Domain is available for claiming!</p>
                )}
                {domainStatus === 'taken' && (
                  <p className="text-xs text-red-400 mt-1">❌ This domain is already taken. Try a different name.</p>
                )}
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
                    { 
                      name: 'Twitter', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'GitHub', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Discord', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'LinkedIn', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Instagram', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'Website', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 7.178l-1.414 1.414c1.262 1.262 2.045 3.003 2.045 4.93 0 1.927-.783 3.668-2.045 4.93l1.414 1.414c1.677-1.677 2.717-3.992 2.717-6.344s-1.04-4.667-2.717-6.344zM12 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm-5.568-8.822C4.755 8.855 3.715 11.17 3.715 13.522s1.04 4.667 2.717 6.344l1.414-1.414c-1.262-1.262-2.045-3.003-2.045-4.93 0-1.927.783-3.668 2.045-4.93L6.432 7.178z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'YouTube', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )
                    },
                    { 
                      name: 'More', 
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                        </svg>
                      )
                    }
                  ].map((social, idx) => (
                    <Button key={idx} variant="outline" className="aspect-square p-2 hover:bg-gray-600">
                      {social.icon}
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