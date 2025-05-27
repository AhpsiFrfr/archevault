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
          {/* Left Column – Enhanced EON-ID Manager */}
          <div className="bg-gradient-to-br from-[#0a0b14] via-[#0c0e1a] to-[#0e1020] border border-neutral-800/60 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">🪪</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                EON-ID Manager
              </h2>
            </div>

            <div className="space-y-8">
              {/* Enhanced Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className={cn(
                    'w-32 h-32 rounded-full border-4 transition-all duration-500 group-hover:scale-105',
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
                        'w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center text-4xl',
                        currentTheme.gradient
                      )}>
                        👤
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Change</span>
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
                  className={cn(
                    'px-6 py-2 transition-all duration-300 hover:shadow-lg',
                    `border-${currentTheme.border.split('-')[1]}-500/50`,
                    `text-${currentTheme.border.split('-')[1]}-300`,
                    `hover:bg-${currentTheme.border.split('-')[1]}-500/10`,
                    currentTheme.shadow
                  )}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  Upload Avatar
                </Button>
                <p className="text-xs text-gray-400">Max 5MB • JPG, PNG, GIF</p>
              </div>

              {/* Enhanced Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Display Name</label>
                  <Input
                    placeholder="Enter your display name"
                    value={formData.displayName || ''}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className={cn(
                      'bg-neutral-900/50 border-neutral-700 transition-all duration-300 hover:border-neutral-600',
                      'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Title</label>
                                   <Select defaultValue={formData.title || ''} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                   <SelectTrigger className="bg-neutral-900/50 border-neutral-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 hover:border-neutral-600">
                     <SelectValue placeholder="Select your title" />
                   </SelectTrigger>
                   <SelectContent>
                     {TITLES.map(title => (
                       <SelectItem key={title} value={title}>{title}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Vault Theme</label>
                                   <Select defaultValue={formData.vaultskin || ''} onValueChange={(value) => setFormData({ ...formData, vaultskin: value })}>
                   <SelectTrigger className="bg-neutral-900/50 border-neutral-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 hover:border-neutral-600">
                     <SelectValue placeholder="Choose your theme" />
                   </SelectTrigger>
                   <SelectContent>
                     {Object.keys(VAULTSKINS).map(theme => (
                       <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Wallet Domain</label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="your-domain"
                      value={formData.walletDomain || ''}
                      onChange={(e) => {
                        const domain = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        setFormData({ ...formData, walletDomain: domain });
                        if (domain.length > 2) checkDomain(domain);
                      }}
                      className="bg-neutral-900/50 border-neutral-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 hover:border-neutral-600"
                    />
                    <span className="text-sm text-gray-400 font-mono">.sol</span>
                    {domainAvailability === true && <span className="text-green-400 text-sm">✓</span>}
                    {domainAvailability === false && <span className="text-red-400 text-sm">✗</span>}
                  </div>
                  {domainAvailability === true && (
                    <p className="text-green-400 text-xs flex items-center gap-1 animate-fade-in">
                      <span>✓</span> Domain is available for claiming!
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Bio</label>
                  <Textarea
                    placeholder="Tell the vault community about yourself..."
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-neutral-900/50 border-neutral-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 hover:border-neutral-600 min-h-[100px] resize-none"
                  />
                </div>
              </div>

              {/* Enhanced Live Preview */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Live Preview
                  </h3>
                </div>
                
                <div className="rounded-xl border border-neutral-700/50 bg-gradient-to-br from-[#0b0c1a] to-[#0d0f1c] text-white p-6 shadow-xl">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className={cn(
                        'w-20 h-20 rounded-full border-3 transition-all duration-500',
                        currentTheme.border,
                        currentTheme.glow
                      )}>
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <div className={cn('w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center text-2xl', currentTheme.gradient)}>
                            👤
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-mono text-violet-300">{formData.walletDomain || 'unclaimed'}.sol</p>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h1 className="text-2xl font-bold">{formData.displayName || 'Your Display Name'}</h1>
                        <h2 className="text-lg text-gray-400">{formData.title || 'Builder'}</h2>
                      </div>
                      
                      {formData.bio && (
                        <p className="text-sm text-gray-300 leading-relaxed">{formData.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className={cn(
                    'flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300',
                    'hover:shadow-xl hover:shadow-violet-500/25 hover:scale-[1.02]',
                    isSaving && 'animate-pulse'
                  )}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving Profile...
                    </div>
                  ) : saveSuccess ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Profile Saved!
                    </div>
                  ) : (
                    'Save / Update Profile'
                  )}
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.02]"
                  onClick={handleEnter}
                  disabled={!saveSuccess}
                >
                  Enter Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column – Enhanced Pylon Configuration */}
          <div className="bg-gradient-to-br from-[#0a0b14] via-[#0c0e1a] to-[#0e1020] border border-neutral-800/60 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">⚙️</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pylon Configuration
              </h2>
            </div>

            <div className="space-y-6">
              {pylons.map((pylon) => (
                <div 
                  key={pylon.id}
                  className={cn(
                    'flex items-center justify-between p-6 rounded-xl border transition-all duration-300',
                    'hover:scale-[1.02] cursor-pointer',
                    pylon.enabled 
                      ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                      : 'bg-gradient-to-r from-gray-800/40 to-gray-700/40 border-gray-600/50 hover:border-gray-500'
                  )}
                  onClick={() => !pylon.isCore && togglePylon(pylon.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-300',
                      pylon.enabled 
                        ? 'bg-blue-500/20 border border-blue-400/50' 
                        : 'bg-gray-700/50 border border-gray-600/50'
                    )}>
                      {pylon.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg flex items-center gap-3">
                        {pylon.name}
                        {pylon.isCore && (
                          <span className="text-xs bg-yellow-600/80 text-yellow-100 px-3 py-1 rounded-full font-medium">
                            CORE
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{pylon.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {pylon.enabled && (
                      <span className="text-sm text-green-400 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
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
                         'w-14 h-8 rounded-full transition-all duration-300',
                         pylon.enabled 
                           ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30' 
                           : 'bg-gray-600 hover:bg-gray-500',
                         pylon.isCore ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                       )}
                     >
                      <div className={cn(
                        'w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-lg',
                        pylon.enabled ? 'translate-x-7' : 'translate-x-1'
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