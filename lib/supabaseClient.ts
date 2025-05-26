import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Chat API functions
export const chatAPI = {
  // Rooms
  async getRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createRoom(name: string, isPrivate = false) {
    const { data, error } = await supabase
      .from('rooms')
      .insert({ name, is_private: isPrivate })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Messages
  async getMessages(roomId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        reactions(*)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data?.reverse() || []
  },

  async sendMessage(content: string, roomId: string, threadId?: string) {
    // Get wallet user ID from localStorage
    const walletUserData = localStorage.getItem('wallet_user');
    if (!walletUserData) throw new Error('No wallet user found');
    
    const walletUser = JSON.parse(walletUserData);
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content,
        room_id: roomId,
        thread_id: threadId,
        user_id: walletUser.id
      })
      .select(`
        *,
        reactions(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Reactions
  async addReaction(messageId: string, emoji: string) {
    const walletUserData = localStorage.getItem('wallet_user');
    if (!walletUserData) throw new Error('No wallet user found');
    
    const walletUser = JSON.parse(walletUserData);
    const userId = walletUser.id;

    // Check if reaction already exists
    const { data: existing } = await supabase
      .from('reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', emoji)
      .single()

    if (existing) {
      // Remove reaction if it exists
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return null
    } else {
      // Add new reaction
      const { data, error } = await supabase
        .from('reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          emoji
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Real-time subscriptions
  subscribeToRoom(roomId: string, onMessage: (message: any) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch the complete message with reactions
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              reactions(*)
            `)
            .eq('id', payload.new.id)
            .single()
          
          if (data) onMessage(data)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reactions',
          filter: `message_id=in.(${roomId})`
        },
        (payload) => {
          // Handle reaction updates
          console.log('New reaction:', payload)
        }
      )
      .subscribe()
  },

  // Voice sessions
  async startVoiceSession(roomId: string, streamUrl?: string) {
    const walletUserData = localStorage.getItem('wallet_user');
    if (!walletUserData) throw new Error('No wallet user found');
    
    const walletUser = JSON.parse(walletUserData);
    const userId = walletUser.id;

    const { data, error } = await supabase
      .from('voice_sessions')
      .insert({
        user_id: userId,
        room_id: roomId,
        stream_url: streamUrl,
        active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async endVoiceSession(sessionId: string) {
    const { error } = await supabase
      .from('voice_sessions')
      .update({ active: false })
      .eq('id', sessionId)
    
    if (error) throw error
  }
}
