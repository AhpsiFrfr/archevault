-- Create eon_profiles table for EON-ID customization
CREATE TABLE IF NOT EXISTS eon_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet TEXT NOT NULL UNIQUE,
  username TEXT,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  domain TEXT,
  
  -- Widget visibility toggles
  show_badges BOOLEAN DEFAULT true,
  show_achievements BOOLEAN DEFAULT true,
  show_nfts BOOLEAN DEFAULT true,
  show_holdings BOOLEAN DEFAULT true,
  show_staked BOOLEAN DEFAULT true,
  
  -- Pylon preferences
  pylons JSONB DEFAULT '{
    "show_refraGate": true,
    "show_aetherFeed": true,
    "show_vaultSkin": true,
    "show_phasePulse": true,
    "show_sigilSynth": true,
    "show_resonantArchive": true
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_eon_profiles_wallet ON eon_profiles(wallet);
CREATE INDEX IF NOT EXISTS idx_eon_profiles_username ON eon_profiles(username);
CREATE INDEX IF NOT EXISTS idx_eon_profiles_domain ON eon_profiles(domain);

-- Enable Row Level Security
ALTER TABLE eon_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON eon_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON eon_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON eon_profiles
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own profile" ON eon_profiles
  FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_eon_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_eon_profiles_updated_at
  BEFORE UPDATE ON eon_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_eon_profiles_updated_at();
