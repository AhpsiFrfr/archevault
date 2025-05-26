-- Add additional fields to eon_profiles table for enhanced profile customization
ALTER TABLE eon_profiles 
ADD COLUMN IF NOT EXISTS theme TEXT,
ADD COLUMN IF NOT EXISTS selected_badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;

-- Create indexes for the new JSONB fields
CREATE INDEX IF NOT EXISTS idx_eon_profiles_selected_badges ON eon_profiles USING GIN (selected_badges);
CREATE INDEX IF NOT EXISTS idx_eon_profiles_social_links ON eon_profiles USING GIN (social_links);

-- Update existing records to have default values for new fields
UPDATE eon_profiles 
SET 
  theme = COALESCE(theme, ''),
  selected_badges = COALESCE(selected_badges, '[]'::jsonb),
  social_links = COALESCE(social_links, '[]'::jsonb)
WHERE theme IS NULL OR selected_badges IS NULL OR social_links IS NULL; 