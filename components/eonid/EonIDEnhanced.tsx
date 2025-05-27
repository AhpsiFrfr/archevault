import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TITLES = ['Founder', 'Builder', 'Developer', 'Strategist', 'King of The Rats'];
const VAULTSKINS = {
  'Nebula Blue': {
    gradient: 'from-blue-600 to-cyan-500',
    border: 'border-blue-400',
    shadow: 'shadow-blue-500/30',
    glow: 'shadow-lg shadow-blue-500/40',
    ring: 'focus:ring-blue-500/20'
  },
  'Solar Flare': {
    gradient: 'from-orange-600 to-red-500',
    border: 'border-orange-400',
    shadow: 'shadow-orange-500/30',
    glow: 'shadow-lg shadow-orange-500/40',
    ring: 'focus:ring-orange-500/20'
  },
  'Void Walker': {
    gradient: 'from-gray-600 to-slate-500',
    border: 'border-gray-400',
    shadow: 'shadow-gray-500/30',
    glow: 'shadow-lg shadow-gray-500/40',
    ring: 'focus:ring-gray-500/20'
  },
  'Quantum Violet': {
    gradient: 'from-purple-600 to-violet-500',
    border: 'border-purple-400',
    shadow: 'shadow-purple-500/30',
    glow: 'shadow-lg shadow-purple-500/40',
    ring: 'focus:ring-purple-500/20'
  },
  'Cosmic Storm': {
    gradient: 'from-pink-600 to-purple-500',
    border: 'border-pink-400',
    shadow: 'shadow-pink-500/30',
    glow: 'shadow-lg shadow-pink-500/40',
    ring: 'focus:ring-pink-500/20'
  }
};

const PYLONS = [
  {
    id: 'eonid',
    name: 'EON-ID Profile',
    description: 'Your digital identity and profile information',
    icon: '🆔',
    isCore: true,
    enabled: true
  },
  {
    id: 'phasePulse',
    name: 'Phase Pulse Monitor',
    description: 'Real-time dimensional stability and phase monitoring',
    icon: '⚡',
    isCore: false,
    enabled: true
  },
  {
    id: 'refraGate',
    name: 'RefraGate',
    description: 'Dimensional gateway control and portal management',
    icon: '🌀',
    isCore: false,
    enabled: true
  },
  {
    id: 'aetherFeed',
    name: 'Aether Feed',
    description: 'Real-time cosmic data streams and updates',
    icon: '📡',
    isCore: false,
    enabled: false
  },
  {
    id: 'vaultSkin',
    name: 'Vault Skin',
    description: 'Customizable interface themes and appearance',
    icon: '🎨',
    isCore: false,
    enabled: false
  }
];

interface ProfileData {
  displayName?: string;
  title?: string;
  vaultskin?: string;
  walletDomain?: string;
  bio?: string;
  avatar?: string | null;
}

interface EonIDEnhancedProps {
  saveProfile?: (data: ProfileData) => Promise<string | null>;
  profileIsValid?: boolean;
  profileData?: ProfileData;
  onPylonToggle?: (pylonId: string) => void;
}

export default function EonIDEnhanced({ saveProfile, profileIsValid, profileData, onPylonToggle }: EonIDEnhancedProps) {
  const router = useRouter();
  const [hasSaved, setHasSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(profileData || {
    displayName: 'Bussynfrfr',
    title: 'King of The Rats',
    vaultskin: 'Nebula Blue',
    walletDomain: 'bussynfrfr',
    bio: "I'm just bussyn frfr.",
    avatar: null
  });
  const [pylons, setPylons] = useState(PYLONS);
  const [avatarPreview, setAvatarPreview] = useState(formData.avatar || null);
  const [domainAvailability, setDomainAvailability] = useState<boolean | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentTheme = VAULTSKINS[formData.vaultskin as keyof typeof VAULTSKINS] || VAULTSKINS['Nebula Blue'];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const error = await saveProfile?.(formData);
      if (!error) {
        setHasSaved(true);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnter = () => {
    if (hasSaved && profileIsValid) {
      router.push('/dashboard');
    } else {
      alert('⚠️ Please save your profile before entering the dashboard.');
    }
  };

  const checkDomain = async (domain: string) => {
    setDomainAvailability(null);
    const taken = ['admin', 'vault', 'test', 'archevault'];
    await new Promise(r => setTimeout(r, 500));
    setDomainAvailability(!taken.includes(domain.toLowerCase()));
  };

  const togglePylon = (pylonId: string) => {
    setPylons(prev => prev.map(pylon => 
      pylon.id === pylonId && !pylon.isCore 
        ? { ...pylon, enabled: !pylon.enabled }
        : pylon
    ));
    onPylonToggle?.(pylonId);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setFormData({ ...formData, avatar: result });
    };
    reader.readAsDataURL(file);
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
            Personalize your vault profile and configure your dashboard layout
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column – Redesigned EON-ID Manager */}
          <div className="bg-gradient-to-br from-[#0a0b14] via-[#0c0e1a] to-[#0e1020] border border-neutral-800/60 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-lg">🪪</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                EON-ID Manager
              </h2>
            </div>

            {/* Top Section: Avatar + Live Preview */}
            <div className="flex gap-6 mb-6">
              {/* Avatar Section - Left Side */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative group">
                  <div className={cn(
                    'w-24 h-24 rounded-full border-3 transition-all duration-500 group-hover:scale-105',
                    currentTheme.border,
                    currentTheme.glow
                  )}>
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className={cn(
                        'w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center text-2xl',
                        currentTheme.gradient
                      )}>
                        👤
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </div>
                
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
                  size="sm"
                  className="text-xs px-3 py-1 border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  Upload Avatar
                </Button>
              </div>

              {/* Live Preview - Right Side */}
              <div className="flex-1 bg-gradient-to-br from-[#11131d] to-[#0d0f1c] border border-neutral-700/50 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center space-y-1">
                    <div className={cn(
                      'w-16 h-16 rounded-full border-2 transition-all duration-500',
                      currentTheme.border,
                      currentTheme.glow
                    )}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className={cn('w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center text-lg', currentTheme.gradient)}>
                          👤
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-mono text-violet-300">{formData.walletDomain || 'unclaimed'}.sol</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <h1 className="text-lg font-bold text-white">{formData.displayName || 'Bussynfrfr'}</h1>
                      <h2 className="text-sm text-gray-400">{formData.title || 'King of The Rats'}</h2>
                    </div>
                    
                    {formData.bio && (
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{formData.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges + Holdings Display */}
            <div className="mb-6">
              <div className="bg-[#11131d] border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Badges + Holdings Display</h3>
                  <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    Hide Holdings
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {['badge1.png', 'badge2.png', 'badge3.png'].map((badge) => (
                    <div
                      key={badge}
                      className="border-2 border-emerald-500 bg-emerald-900 p-1 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-emerald-600 rounded"></div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['Total Holdings', 'Staked', 'Locked', 'Portfolio Value'].map((option) => (
                    <div key={option} className="flex items-center justify-between px-2 py-1 rounded bg-neutral-900">
                      <span className="text-xs text-white">{option}</span>
                      <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Fields - Compact */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Display Name</label>
                  <Input
                    placeholder="Bussynfrfr"
                    value={formData.displayName || ''}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="h-8 text-sm bg-neutral-900/50 border-neutral-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Title</label>
                  <Select defaultValue={formData.title || ''} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                    <SelectTrigger className="h-8 text-sm bg-neutral-900/50 border-neutral-700">
                      <SelectValue placeholder="King of The Rats" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLES.map(title => (
                        <SelectItem key={title} value={title}>{title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Vault Theme</label>
                  <Select defaultValue={formData.vaultskin || ''} onValueChange={(value) => setFormData({ ...formData, vaultskin: value })}>
                    <SelectTrigger className="h-8 text-sm bg-neutral-900/50 border-neutral-700">
                      <SelectValue placeholder="Nebula Blue" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(VAULTSKINS).map(theme => (
                        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Wallet Domain</label>
                  <div className="flex items-center gap-1">
                    <Input
                      placeholder="bussynfrfr"
                      value={formData.walletDomain || ''}
                      onChange={(e) => {
                        const domain = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        setFormData({ ...formData, walletDomain: domain });
                        if (domain.length > 2) checkDomain(domain);
                      }}
                      className="h-8 text-sm bg-neutral-900/50 border-neutral-700"
                    />
                    <span className="text-xs text-gray-400">.sol</span>
                    <Button size="sm" className="h-8 px-2 text-xs bg-cyan-600 hover:bg-cyan-700">
                      Claim
                    </Button>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs border-neutral-600">
                  <span className="mr-1">🐦</span> Twitter
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs border-neutral-600">
                  <span className="mr-1">📷</span> Instagram
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs border-neutral-600">
                  <span className="mr-1">🌐</span> Website
                </Button>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Bio</label>
                <Textarea
                  placeholder="I'm just bussyn frfr."
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="h-16 text-sm bg-neutral-900/50 border-neutral-700 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 h-9 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : saveSuccess ? '✓ Saved!' : 'Save / Update Profile'}
              </Button>
              <Button 
                className="flex-1 h-9 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-sm"
                onClick={handleEnter}
                disabled={!saveSuccess}
              >
                Enter Dashboard
              </Button>
            </div>
          </div>

          {/* Right Column – Dashboard Layout Manager */}
          <div className="bg-gradient-to-br from-[#0a0b14] via-[#0c0e1a] to-[#0e1020] border border-neutral-800/60 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <span className="text-lg">🌸</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard Layout Manager
              </h2>
            </div>

            {/* Active Dashboard Preview */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Active Dashboard Preview</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {pylons.slice(0, 3).map((pylon) => (
                  <div 
                    key={pylon.id}
                    className={cn(
                      'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-xl p-3 text-center',
                      pylon.enabled ? 'opacity-100' : 'opacity-50'
                    )}
                  >
                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-500/20 border border-blue-400/50 rounded-lg flex items-center justify-center text-lg">
                      {pylon.icon}
                    </div>
                    <div className="text-xs font-medium text-white mb-1">{pylon.name}</div>
                    {pylon.isCore && (
                      <div className="text-xs bg-yellow-600/80 text-yellow-100 px-2 py-0.5 rounded-full">
                        CORE
                      </div>
                    )}
                    {pylon.enabled && !pylon.isCore && (
                      <div className="text-xs text-green-400 flex items-center justify-center gap-1">
                        <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md">All Pylons</button>
                <button className="px-3 py-1 bg-neutral-700 text-gray-300 text-xs rounded-md hover:bg-neutral-600">Identity</button>
                <button className="px-3 py-1 bg-neutral-700 text-gray-300 text-xs rounded-md hover:bg-neutral-600">Monitoring</button>
                <button className="px-3 py-1 bg-neutral-700 text-gray-300 text-xs rounded-md hover:bg-neutral-600">Social</button>
              </div>
              
              <div className="flex items-center gap-1 ml-auto">
                <button className="p-1 bg-blue-600 text-white rounded text-xs">
                  <span className="block w-4 h-4">⊞</span>
                </button>
                <button className="p-1 bg-neutral-700 text-gray-300 rounded text-xs hover:bg-neutral-600">
                  <span className="block w-4 h-4">☰</span>
                </button>
                <button className="px-2 py-1 bg-neutral-700 text-gray-300 text-xs rounded hover:bg-neutral-600">
                  Reset
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <button className="px-2 py-1 bg-neutral-700 text-gray-300 text-xs rounded hover:bg-neutral-600">Utility</button>
              <button className="px-2 py-1 bg-neutral-700 text-gray-300 text-xs rounded hover:bg-neutral-600">Customization</button>
            </div>

            {/* Pylon List */}
            <div className="space-y-3">
              {pylons.map((pylon) => (
                <div 
                  key={pylon.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border transition-all duration-300',
                    'hover:scale-[1.01] cursor-pointer',
                    pylon.enabled 
                      ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/50' 
                      : 'bg-gradient-to-r from-gray-800/40 to-gray-700/40 border-gray-600/50 hover:border-gray-500'
                  )}
                  onClick={() => !pylon.isCore && togglePylon(pylon.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300',
                      pylon.enabled 
                        ? 'bg-blue-500/20 border border-blue-400/50' 
                        : 'bg-gray-700/50 border border-gray-600/50'
                    )}>
                      {pylon.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {pylon.name}
                        {pylon.isCore && (
                          <span className="text-xs bg-yellow-600/80 text-yellow-100 px-2 py-0.5 rounded-full font-medium">
                            CORE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{pylon.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {pylon.enabled && (
                      <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!pylon.isCore) togglePylon(pylon.id);
                      }}
                      disabled={pylon.isCore}
                      aria-label={`Toggle ${pylon.name} pylon`}
                      className={cn(
                        'w-12 h-6 rounded-full transition-all duration-300',
                        pylon.enabled 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30' 
                          : 'bg-gray-600 hover:bg-gray-500',
                        pylon.isCore ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                      )}
                    >
                      <div className={cn(
                        'w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg',
                        pylon.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 