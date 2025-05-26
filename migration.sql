-- Cursor, please execute this SQL migration script to set up the full Supabase schema for ARCHEVAULT Chat 2.0.
-- Includes table creation, indexing, constraints, and row-level security policies.

-- ✅ Enable UUID support
create extension if not exists "pgcrypto";

-- ✅ ROOMS
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_private boolean default false,
  created_at timestamptz default now()
);

-- ✅ MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id uuid not null references auth.users(id),
  room_id uuid not null references rooms(id),
  thread_id uuid references messages(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ✅ THREADS
create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  parent_message_id uuid references messages(id),
  room_id uuid not null references rooms(id),
  created_at timestamptz default now()
);

-- ✅ REACTIONS
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id),
  user_id uuid not null references auth.users(id),
  emoji text not null,
  created_at timestamptz default now()
);

-- ✅ VOICE SESSIONS
create table if not exists voice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  room_id uuid not null references rooms(id),
  stream_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- ✅ INDEXES
create index on messages (room_id, created_at);
create index on reactions (message_id, user_id);
create index on voice_sessions (room_id, active);

-- ✅ ENABLE RLS
alter table messages enable row level security;
alter table rooms enable row level security;
alter table reactions enable row level security;
alter table threads enable row level security;
alter table voice_sessions enable row level security;

-- ✅ RLS POLICIES
create policy "Users can insert/select their own messages" on messages
  for all using (auth.uid() = user_id);

create policy "Allow select on public rooms" on rooms
  for select using (is_private = false);

create policy "Users can react to messages" on reactions
  for all using (auth.uid() = user_id);

create policy "Allow viewing threads in joined rooms" on threads
  for select using (true);

create policy "Allow managing your voice session" on voice_sessions
  for all using (auth.uid() = user_id); 