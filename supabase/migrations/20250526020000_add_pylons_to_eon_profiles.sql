-- Add pylons column to eon_profiles table
ALTER TABLE eon_profiles 
ADD COLUMN IF NOT EXISTS pylons JSONB DEFAULT '{
  "show_refraGate": true,
  "show_aetherFeed": true,
  "show_vaultSkin": true,
  "show_phasePulse": true,
  "show_sigilSynth": true,
  "show_resonantArchive": true
}'::jsonb;

-- Update existing records to have default pylon values
UPDATE eon_profiles 
SET pylons = '{
  "show_refraGate": true,
  "show_aetherFeed": true,
  "show_vaultSkin": true,
  "show_phasePulse": true,
  "show_sigilSynth": true,
  "show_resonantArchive": true
}'::jsonb
WHERE pylons IS NULL; 