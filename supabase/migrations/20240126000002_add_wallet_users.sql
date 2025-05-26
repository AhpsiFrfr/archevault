-- Enhanced wallet_users table for comprehensive user profiles

create table if not exists wallet_users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  username text,
  avatar text,
  wallet_name text, -- e.g., 'Phantom', 'Solflare'
  token_balance numeric default 0,
  xp_level integer default 1,
  evolution text default 'Initiate',
  status text default 'offline' check (status in ('online', 'offline', 'away', 'dnd')),
  last_login timestamptz,
  last_logout timestamptz,
  total_messages integer default 0,
  total_reactions integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on wallet_users
alter table wallet_users enable row level security;

-- Create policy for wallet users to manage their own records
create policy "Users can manage their own wallet record" on wallet_users
  for all using (wallet_address = current_setting('app.current_wallet', true));

-- Create policy to allow reading wallet users for chat functionality
create policy "Allow reading wallet users" on wallet_users
  for select using (true);

-- Add indexes for performance
create index if not exists idx_wallet_users_address on wallet_users (wallet_address);
create index if not exists idx_wallet_users_status on wallet_users (status);
create index if not exists idx_wallet_users_level on wallet_users (xp_level);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_wallet_users_updated_at
  before update on wallet_users
  for each row
  execute function update_updated_at_column(); 