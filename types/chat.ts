export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
  roles?: string[];
}

export interface Message {
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
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isVoice: boolean;
  unreadCount: number;
  lastMessage?: Message;
  users: User[];
}

export interface Thread {
  id: string;
  name: string;
  messageId: string;
  roomId: string;
  messageCount: number;
  lastMessageAt: string;
  isUnread: boolean;
}

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface TypingUser {
  userId: string;
  username: string;
  startedAt: string;
}
