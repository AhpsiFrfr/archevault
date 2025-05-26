-- Fix RLS policies for existing tables

-- Drop existing policies if they exist
drop policy if exists "Users can insert/select their own messages" on messages;
drop policy if exists "Allow select on public rooms" on rooms;
drop policy if exists "Users can react to messages" on reactions;
drop policy if exists "Allow viewing threads in joined rooms" on threads;
drop policy if exists "Allow managing your voice session" on voice_sessions;

-- Recreate policies
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

-- Add missing policies for rooms
create policy "Users can create rooms" on rooms
  for insert with check (true);

-- Add policy to allow users to see messages in rooms they have access to
create policy "Users can see messages in public rooms" on messages
  for select using (
    exists (
      select 1 from rooms 
      where rooms.id = messages.room_id 
      and rooms.is_private = false
    )
  ); 