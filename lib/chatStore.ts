import { create } from 'zustand';
import { chatAPI, supabase } from './supabaseClient';

// Types
export type User = {
  id: string;
  username?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
  roles?: string[];
};

export type Message = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  threadId?: string;
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
  isPinned: boolean;
  user: User;
};

export type Room = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isVoice: boolean;
  unreadCount: number;
  lastMessage?: Message;
  users: User[];
};

export type Thread = {
  id: string;
  name: string;
  messageId: string;
  roomId: string;
  messageCount: number;
  lastMessageAt: string;
  isUnread: boolean;
};

export type Reaction = {
  emoji: string;
  count: number;
  userIds: string[];
};

export type TypingUser = {
  userId: string;
  username: string;
  startedAt: string;
};

export interface ChatState {
  currentRoom: Room | null;
  rooms: Room[];
  messages: Message[];
  threads: Thread[];
  users: User[];
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  subscription: any;
  
  // Actions
  loadRooms: () => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  sendMessage: (content: string, threadId?: string) => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  createRoom: (name: string, isPrivate?: boolean) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentRoom: null,
  rooms: [],
  messages: [],
  threads: [],
  users: [],
  isConnected: false,
  loading: false,
  error: null,
  subscription: null,

  loadRooms: async () => {
    try {
      set({ loading: true, error: null });
      const rooms = await chatAPI.getRooms();
      
      // Transform Supabase rooms to our Room type
      const transformedRooms: Room[] = rooms.map(room => ({
        id: room.id,
        name: room.name,
        isPrivate: room.is_private,
        isVoice: false, // TODO: Add voice room support
        unreadCount: 0, // TODO: Calculate unread count
        users: [], // TODO: Load room users
      }));
      
      set({ rooms: transformedRooms, loading: false });
    } catch (error) {
      console.error('Failed to load rooms:', error);
      set({ error: 'Failed to load rooms', loading: false });
    }
  },

  joinRoom: async (roomId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Find the room
      const room = get().rooms.find(r => r.id === roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Leave previous room subscription
      const currentSubscription = get().subscription;
      if (currentSubscription) {
        await supabase.removeChannel(currentSubscription);
      }

      // Load messages for the room
      await get().loadMessages(roomId);
      
      // Subscribe to real-time updates
      const subscription = chatAPI.subscribeToRoom(roomId, (newMessage) => {
        const transformedMessage: Message = {
          id: newMessage.id,
          content: newMessage.content,
          userId: newMessage.user_id,
          roomId: newMessage.room_id,
          threadId: newMessage.thread_id,
          createdAt: newMessage.created_at,
          updatedAt: newMessage.updated_at,
          reactions: newMessage.reactions?.map((r: any) => ({
            emoji: r.emoji,
            count: 1, // TODO: Aggregate reactions properly
            userIds: [r.user_id],
          })) || [],
          isPinned: false, // TODO: Add pinned message support
          user: {
            id: newMessage.user_id,
            username: `Pilot_${newMessage.user_id.slice(0, 8)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMessage.user_id}`,
            status: 'online',
          },
        };
        
        set(state => ({
          messages: [...state.messages, transformedMessage]
        }));
      });

      set({ 
        currentRoom: room, 
        subscription,
        isConnected: true,
        loading: false 
      });
    } catch (error) {
      console.error('Failed to join room:', error);
      set({ error: 'Failed to join room', loading: false });
    }
  },

  leaveRoom: () => {
    const subscription = get().subscription;
    if (subscription) {
      supabase.removeChannel(subscription);
    }
    
    set({ 
      currentRoom: null, 
      messages: [],
      subscription: null,
      isConnected: false 
    });
  },

  loadMessages: async (roomId: string) => {
    try {
      const messages = await chatAPI.getMessages(roomId);
      
      // Transform Supabase messages to our Message type
      const transformedMessages: Message[] = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        userId: msg.user_id,
        roomId: msg.room_id,
        threadId: msg.thread_id,
        createdAt: msg.created_at,
        updatedAt: msg.updated_at,
        reactions: msg.reactions?.map((r: any) => ({
          emoji: r.emoji,
          count: 1, // TODO: Aggregate reactions properly
          userIds: [r.user_id],
        })) || [],
        isPinned: false, // TODO: Add pinned message support
        user: {
          id: msg.user_id,
          username: `Pilot_${msg.user_id.slice(0, 8)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user_id}`,
          status: 'online',
        },
      }));
      
      set({ messages: transformedMessages });
    } catch (error) {
      console.error('Failed to load messages:', error);
      set({ error: 'Failed to load messages' });
    }
  },

  sendMessage: async (content: string, threadId?: string) => {
    const { currentRoom } = get();
    if (!currentRoom) {
      throw new Error('No room selected');
    }

    try {
      await chatAPI.sendMessage(content, currentRoom.id, threadId);
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Failed to send message:', error);
      set({ error: 'Failed to send message' });
      throw error;
    }
  },

  reactToMessage: async (messageId: string, emoji: string) => {
    try {
      await chatAPI.addReaction(messageId, emoji);
      // TODO: Update local state optimistically
    } catch (error) {
      console.error('Failed to add reaction:', error);
      set({ error: 'Failed to add reaction' });
    }
  },

  createRoom: async (name: string, isPrivate = false) => {
    try {
      set({ loading: true, error: null });
      const newRoom = await chatAPI.createRoom(name, isPrivate);
      
      const transformedRoom: Room = {
        id: newRoom.id,
        name: newRoom.name,
        isPrivate: newRoom.is_private,
        isVoice: false,
        unreadCount: 0,
        users: [],
      };
      
      set(state => ({
        rooms: [transformedRoom, ...state.rooms],
        loading: false
      }));
      
      return newRoom;
    } catch (error) {
      console.error('Failed to create room:', error);
      set({ error: 'Failed to create room', loading: false });
      throw error;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
