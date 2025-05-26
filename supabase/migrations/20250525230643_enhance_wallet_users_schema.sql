-- Enhance wallet_users table with additional fields from original Eonic Vault

-- Add new columns to wallet_users table
ALTER TABLE wallet_users 
ADD COLUMN IF NOT EXISTS wallet_name text,
ADD COLUMN IF NOT EXISTS token_balance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp_level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS evolution text DEFAULT 'Initiate',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'offline',
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS last_logout timestamptz,
ADD COLUMN IF NOT EXISTS total_messages integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reactions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add check constraint for status
ALTER TABLE wallet_users 
ADD CONSTRAINT check_status 
CHECK (status IN ('online', 'offline', 'away', 'dnd'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallet_users_status ON wallet_users (status);
CREATE INDEX IF NOT EXISTS idx_wallet_users_level ON wallet_users (xp_level);
CREATE INDEX IF NOT EXISTS idx_wallet_users_evolution ON wallet_users (evolution);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_wallet_users_updated_at ON wallet_users;
CREATE TRIGGER update_wallet_users_updated_at
  BEFORE UPDATE ON wallet_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
