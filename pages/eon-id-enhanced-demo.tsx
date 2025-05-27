import { useState } from 'react';
import EonIDEnhanced from '@/components/eonid/EonIDEnhanced';

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
    <EonIDEnhanced
      saveProfile={mockSaveProfile}
      profileIsValid={true}
      profileData={profileData}
      onPylonToggle={handlePylonToggle}
    />
  );
} 