import { useState } from 'react';
import EonIDEnhanced from '@/components/eonid/EonIDEnhanced';
import BadgeHoldingsPanel from '@/components/eonid/BadgeHoldingsPanel';

interface ProfileData {
  displayName?: string;
  title?: string;
  vaultskin?: string;
  walletDomain?: string;
  bio?: string;
  avatar?: string | null;
}

export default function EonIDEnhancedDemo() {
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'Bussynfrfr',
    title: 'King of The Rats',
    vaultskin: 'Nebula Blue',
    walletDomain: 'bussynfrfr',
    bio: "I'm just bussyn frfr.",
    avatar: null
  });

  // Badge and Holdings state
  const [activeBadges, setActiveBadges] = useState<string[]>([
    'badge-dayone.png',
    'badge-builder.png',
    'badge-star.png'
  ]);
  const [showFields, setShowFields] = useState<string[]>([
    'total',
    'staked',
    'value'
  ]);

  const mockSaveProfile = async (data: ProfileData): Promise<string | null> => {
    console.log('Saving profile:', data);
    setProfileData(data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return null; // No error
  };

  const handlePylonToggle = (pylonId: string) => {
    console.log('Toggling pylon:', pylonId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Enhanced EON-ID Component */}
      <EonIDEnhanced
        saveProfile={mockSaveProfile}
        profileIsValid={true}
        profileData={profileData}
        onPylonToggle={handlePylonToggle}
      />
      
      {/* Badge Holdings Panel Demo */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Badge & Holdings Configuration</h2>
          <p className="text-gray-400">Configure which badges and holdings information to display in your EON-ID preview</p>
        </div>
        
        <BadgeHoldingsPanel
          activeBadges={activeBadges}
          setActiveBadges={setActiveBadges}
          showFields={showFields}
          setShowFields={setShowFields}
        />
        
        {/* Debug Info */}
        <div className="mt-6 bg-gray-900/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Current Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-purple-400 font-medium mb-2">Active Badges ({activeBadges.length})</h4>
              <ul className="text-gray-300 space-y-1">
                {activeBadges.map(badge => (
                  <li key={badge} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {badge.replace('.png', '').replace('badge-', '')}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-medium mb-2">Holdings Fields ({showFields.length})</h4>
              <ul className="text-gray-300 space-y-1">
                {showFields.map(field => (
                  <li key={field} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 