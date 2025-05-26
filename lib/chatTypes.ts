// User related types
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
  roles?: string[];
  lastSeen?: string;
  isTyping?: boolean;
  customStatus?: string;
}

// Message related types
export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // Array of user IDs who reacted
}

export interface Attachment {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  size: number;
  width?: number;
  height?: number;
  duration?: number; // For audio/video
  thumbnail?: string; // For videos and large images
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  user?: User; // Populated on the client side
  roomId: string;
  parentId?: string; // For replies
  threadId?: string; // For thread messages
  reactions?: Reaction[];
  attachments?: Attachment[];
  isPinned: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Room/Channel related types
export interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isVoice: boolean;
  isGroup: boolean;
  isDirectMessage: boolean;
  userIds: string[]; // Members of the room
  users?: User[]; // Populated on the client side
  ownerId?: string;
  lastMessage?: Message;
  unreadCount: number;
  mentionCount: number;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Thread related types
export interface Thread {
  id: string;
  name: string;
  messageId: string; // The parent message ID
  roomId: string;
  userId: string; // Thread creator
  users: string[]; // Participants in the thread
  messageCount: number;
  isResolved: boolean;
  isPinned: boolean;
  lastMessageAt: string;
  isUnread: boolean;
  createdAt: string;
  updatedAt: string;
}

// Chat state types
export interface ChatState {
  // State
  rooms: Room[];
  currentRoom: Room | null;
  messages: Message[];
  threads: Thread[];
  users: User[];
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;
}

// Action types
export type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: Partial<Room> & { id: string } }
  | { type: 'REMOVE_ROOM'; payload: string }
  | { type: 'SET_CURRENT_ROOM'; payload: Room | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Partial<Message> & { id: string } }
  | {
      type: 'ADD_REACTION';
      payload: { messageId: string; emoji: string; userId: string };
    }
  | { type: 'ADD_THREAD'; payload: Thread }
  | {
      type: 'ADD_THREAD_MESSAGE';
      payload: { threadId: string; message: Message };
    }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | {
      type: 'UPDATE_USER_PRESENCE';
      payload: { userId: string; isOnline: boolean };
    }
  | { type: 'SET_HAS_MORE'; payload: boolean };

// Socket event types
export interface ServerToClientEvents {
  'room:created': (room: Room) => void;
  'room:updated': (room: Room) => void;
  'room:deleted': (roomId: string) => void;
  'message:new': (message: Message) => void;
  'message:updated': (message: Message) => void;
  'message:deleted': (messageId: string) => void;
  'reaction:added': (data: {
    messageId: string;
    emoji: string;
    userId: string;
  }) => void;
  'thread:created': (thread: Thread) => void;
  'thread:message': (data: { threadId: string; message: Message }) => void;
  'user:joined': (user: User) => void;
  'user:updated': (user: User) => void;
  'user:presence': (data: { userId: string; isOnline: boolean }) => void;
  'user:typing': (data: { userId: string; roomId: string; isTyping: boolean }) => void;
}

export interface ClientToServerEvents {
  'room:create': (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>, callback?: (room: Room) => void) => void;
  'room:join': (roomId: string, callback?: (room: Room) => void) => void;
  'room:leave': (roomId: string, callback?: () => void) => void;
  'room:update': (room: Partial<Room> & { id: string }, callback?: (room: Room) => void) => void;
  'room:delete': (roomId: string, callback?: () => void) => void;
  'room:invite': (data: { roomId: string; userIds: string[] }, callback?: (room: Room) => void) => void;
  'room:read': (roomId: string, callback?: () => void) => void;
  'message:send': (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>, callback?: (message: Message) => void) => void;
  'message:edit': (message: { id: string; content: string }, callback?: (message: Message) => void) => void;
  'message:delete': (messageId: string, callback?: () => void) => void;
  'message:pin': (messageId: string, callback?: () => void) => void;
  'reaction:add': (data: { messageId: string; emoji: string; userId: string }, callback?: () => void) => void;
  'thread:create': (thread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt'>, callback?: (thread: Thread) => void) => void;
  'thread:reply': (data: { threadId: string; content: string }, callback?: (message: Message) => void) => void;
  'user:typing': (data: { roomId: string; isTyping: boolean }, callback?: () => void) => void;
}
