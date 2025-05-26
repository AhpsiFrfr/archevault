import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './chatTypes';

// Create a custom type for our socket that includes our event types
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// This will hold our socket instance
let socket: AppSocket | null = null;

// Get the WebSocket URL from environment variables
const getSocketUrl = (): string => {
  // In development, we might want to connect to a different URL than in production
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  }
  return process.env.NEXT_PUBLIC_WS_URL || window.location.origin;
};

// Initialize the socket connection
export const initSocket = (userId: string): AppSocket => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = getSocketUrl();
  
  socket = io(socketUrl, {
    path: '/socket.io',
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    auth: {
      token: userId, // Or your auth token
      userId,
    },
  });

  // Connection established
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  // Connection error
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  // Disconnected
  socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server:', reason);
  });

  // Reconnection attempt
  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`Reconnection attempt ${attemptNumber}`);
  });

  // Reconnected
  socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
  });

  // Reconnection failed
  socket.on('reconnect_failed', () => {
    console.error('Failed to reconnect to WebSocket server');
  });

  return socket;
};

// Get the current socket instance
export const getSocket = (): AppSocket | null => {
  return socket;
};

// Disconnect the socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// A hook to use the socket in React components
export const useSocket = (): { socket: AppSocket | null } => {
  // In a real app, you might want to use a context provider for the socket
  // For now, we'll just return the socket instance
  return { socket };
};

// Utility function to emit an event and handle the response
export const emitWithAck = async <T,>(
  event: keyof ClientToServerEvents,
  ...args: any[]
): Promise<T> => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }

  return new Promise((resolve, reject) => {
    // @ts-ignore - TypeScript doesn't like the dynamic event name
    socket.emit(event, ...args, (response: any) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
};

// Utility function to join a room
export const joinRoom = async (roomId: string): Promise<void> => {
  try {
    await emitWithAck('room:join', roomId);
    console.log(`Joined room ${roomId}`);
  } catch (error) {
    console.error(`Failed to join room ${roomId}:`, error);
    throw error;
  }
};

// Utility function to leave a room
export const leaveRoom = async (roomId: string): Promise<void> => {
  try {
    await emitWithAck('room:leave', roomId);
    console.log(`Left room ${roomId}`);
  } catch (error) {
    console.error(`Failed to leave room ${roomId}:`, error);
    throw error;
  }
};

// Utility function to send a message
export const sendMessage = async (
  roomId: string,
  content: string,
  parentId?: string
): Promise<void> => {
  try {
    await emitWithAck('message:send', {
      content,
      roomId,
      parentId,
    });
    console.log('Message sent');
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Utility function to add a reaction to a message
export const addReaction = async (
  messageId: string,
  emoji: string,
  userId: string
): Promise<void> => {
  try {
    await emitWithAck('reaction:add', { messageId, emoji, userId });
    console.log('Reaction added');
  } catch (error) {
    console.error('Failed to add reaction:', error);
    throw error;
  }
};

// Utility function to update typing status
export const updateTypingStatus = async (
  roomId: string,
  isTyping: boolean
): Promise<void> => {
  try {
    await emitWithAck('user:typing', { roomId, isTyping });
  } catch (error) {
    console.error('Failed to update typing status:', error);
    throw error;
  }
};
