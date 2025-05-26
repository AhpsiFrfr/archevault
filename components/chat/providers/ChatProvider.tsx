import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useSocket } from '@/lib/socket';
import { useAuth } from '@/lib/auth';
import { Message, Room, User, Thread, ChatState, ChatAction } from '@/lib/chatStore';

interface ChatContextType extends ChatState {
  sendMessage: (content: string, files?: File[]) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  replyToMessage: (messageId: string, content: string) => void;
  startThread: (message: Message) => void;
  pinMessage: (messageId: string) => void;
  selectRoom: (roomId: string) => void;
  createRoom: (name: string, isPrivate?: boolean) => void;
  inviteToRoom: (roomId: string, userIds: string[]) => void;
  loadMoreMessages: () => void;
  setTyping: (isTyping: boolean) => void;
  markAsRead: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Initial state
const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  threads: [],
  users: [],
  isLoading: false,
  hasMore: true,
  error: null,
};

// Reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
      
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
      
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room => 
          room.id === action.payload.id ? { ...room, ...action.payload } : room
        ),
      };
      
    case 'REMOVE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
      };
      
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
      
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, hasMore: action.payload.length > 0 };
      
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [action.payload, ...state.messages],
        // Update last message in rooms
        rooms: state.rooms.map(room => 
          room.id === action.payload.roomId
            ? { ...room, lastMessage: action.payload }
            : room
        ),
      };
      
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload } : msg
        ),
      };
      
    case 'ADD_REACTION':
      return {
        ...state,
        messages: state.messages.map(msg => {
          if (msg.id !== action.payload.messageId) return msg;
          
          const existingReaction = msg.reactions?.find(
            r => r.emoji === action.payload.emoji
          );
          
          if (existingReaction) {
            // Update existing reaction
            return {
              ...msg,
              reactions: msg.reactions?.map(r =>
                r.emoji === action.payload.emoji
                  ? { ...r, count: r.count + 1 }
                  : r
              ),
            };
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                {
                  emoji: action.payload.emoji,
                  count: 1,
                  users: [action.payload.userId],
                },
              ],
            };
          }
        }),
      };
      
    case 'ADD_THREAD':
      return {
        ...state,
        threads: [...state.threads, action.payload],
      };
      
    case 'ADD_THREAD_MESSAGE':
      return {
        ...state,
        threads: state.threads.map(thread =>
          thread.id === action.payload.threadId
            ? {
                ...thread,
                messages: [action.payload.message, ...thread.messages],
              }
            : thread
        ),
      };
      
    case 'SET_USERS':
      return { ...state, users: action.payload };
      
    case 'ADD_USER':
      return {
        ...state,
        users: state.users.some(u => u.id === action.payload.id)
          ? state.users.map(u => (u.id === action.payload.id ? action.payload : u))
          : [...state.users, action.payload],
      };
      
    case 'UPDATE_USER_PRESENCE':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, isOnline: action.payload.isOnline }
            : user
        ),
      };
      
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
      
    default:
      return state;
  }
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  // Socket event handlers
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Room events
    socket.on('room:created', (room: Room) => {
      dispatch({ type: 'ADD_ROOM', payload: room });
    });

    socket.on('room:updated', (room: Room) => {
      dispatch({ type: 'UPDATE_ROOM', payload: room });
    });

    socket.on('room:deleted', (roomId: string) => {
      dispatch({ type: 'REMOVE_ROOM', payload: roomId });
    });

    // Message events
    socket.on('message:new', (message: Message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      
      // If this is a reply, update the parent message
      if (message.parentId) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: message.parentId,
            replyCount: (state.messages.find(m => m.id === message.parentId)?.replyCount || 0) + 1,
          },
        });
      }
    });

    socket.on('message:updated', (message: Message) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    });

    socket.on('message:deleted', (messageId: string) => {
      dispatch({
        type: 'SET_MESSAGES',
        payload: state.messages.filter(m => m.id !== messageId),
      });
    });

    // Reaction events
    socket.on('reaction:added', (data: { messageId: string; emoji: string; userId: string }) => {
      dispatch({ type: 'ADD_REACTION', payload: data });
    });

    // Thread events
    socket.on('thread:created', (thread: Thread) => {
      dispatch({ type: 'ADD_THREAD', payload: thread });
    });

    socket.on('thread:message', (data: { threadId: string; message: Message }) => {
      dispatch({
        type: 'ADD_THREAD_MESSAGE',
        payload: data,
      });
    });

    // User events
    socket.on('user:joined', (user: User) => {
      dispatch({ type: 'ADD_USER', payload: user });
    });

    socket.on('user:updated', (user: User) => {
      dispatch({ type: 'ADD_USER', payload: user });
    });

    socket.on('user:presence', (data: { userId: string; isOnline: boolean }) => {
      dispatch({
        type: 'UPDATE_USER_PRESENCE',
        payload: { userId: data.userId, isOnline: data.isOnline },
      });
    });

    // Initial data
    const fetchInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // In a real app, you would fetch these from your API
        const [rooms, messages, users] = await Promise.all([
          // fetchRooms(),
          // fetchMessages(),
          // fetchUsers(),
          Promise.resolve([]),
          Promise.resolve([]),
          Promise.resolve([]),
        ]);
        
        dispatch({ type: 'SET_ROOMS', payload: rooms });
        dispatch({ type: 'SET_MESSAGES', payload: messages });
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error : new Error('Failed to load chat data'),
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchInitialData();

    return () => {
      // Clean up event listeners
      if (socket) {
        socket.off('room:created');
        socket.off('room:updated');
        socket.off('room:deleted');
        socket.off('message:new');
        socket.off('message:updated');
        socket.off('message:deleted');
        socket.off('reaction:added');
        socket.off('thread:created');
        socket.off('thread:message');
        socket.off('user:joined');
        socket.off('user:updated');
        socket.off('user:presence');
      }
    };
  }, [socket, currentUser]);

  // Action creators
  const sendMessage = useCallback(
    (content: string, files: File[] = []) => {
      if (!state.currentRoom || !currentUser) return;

      const message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'> = {
        content,
        userId: currentUser.id,
        roomId: state.currentRoom.id,
        user: currentUser,
        reactions: [],
        isPinned: false,
      };

      // In a real app, you would upload files first and then send the message with file URLs
      if (files.length > 0) {
        // Handle file uploads
        console.log('Uploading files:', files);
        // const fileUrls = await uploadFiles(files);
        // message.attachments = fileUrls;
      }


      // Emit the message to the server
      socket?.emit('message:send', message);
    },
    [state.currentRoom, currentUser, socket]
  );

  const reactToMessage = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUser) return;
      
      socket?.emit('reaction:add', {
        messageId,
        emoji,
        userId: currentUser.id,
      });
    },
    [currentUser, socket]
  );

  const replyToMessage = useCallback(
    (messageId: string, content: string) => {
      if (!state.currentRoom || !currentUser) return;

      const reply: Omit<Message, 'id' | 'createdAt' | 'updatedAt'> = {
        content,
        userId: currentUser.id,
        roomId: state.currentRoom.id,
        parentId: messageId,
        user: currentUser,
        reactions: [],
        isPinned: false,
      };

      socket?.emit('message:send', reply);
    },
    [state.currentRoom, currentUser, socket]
  );

  const startThread = useCallback(
    (message: Message) => {
      if (!currentUser) return;
      
      const thread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt'> = {
        name: `Thread from ${message.user?.username || 'user'}`,
        messageId: message.id,
        roomId: message.roomId,
        userId: currentUser.id,
        messages: [],
        isPinned: false,
      };
      
      socket?.emit('thread:create', thread);
    },
    [currentUser, socket]
  );

  const pinMessage = useCallback(
    (messageId: string) => {
      // In a real app, you would update this on the server
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: { id: messageId, isPinned: true },
      });
      
      // Emit to server
      socket?.emit('message:pin', messageId);
    },
    [socket]
  );

  const selectRoom = useCallback(
    async (roomId: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // In a real app, you would fetch room data and messages
        // const room = await fetchRoom(roomId);
        // const messages = await fetchRoomMessages(roomId);
        
        // For now, just update the current room
        const room = state.rooms.find(r => r.id === roomId) || null;
        dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
        
        // Mark messages as read
        if (room) {
          markAsRead(room.id);
        }
      } catch (error) {
        console.error(`Failed to select room ${roomId}:`, error);
        dispatch({
          type: 'SET_ERROR',
          payload: new Error(`Failed to load room ${roomId}`),
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.rooms]
  );

  const createRoom = useCallback(
    (name: string, isPrivate: boolean = false) => {
      if (!currentUser) return;
      
      const newRoom: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        isPrivate,
        userIds: [currentUser.id],
        users: [currentUser],
        unreadCount: 0,
        lastMessage: null,
      };
      
      socket?.emit('room:create', newRoom);
    },
    [currentUser, socket]
  );

  const inviteToRoom = useCallback(
    (roomId: string, userIds: string[]) => {
      socket?.emit('room:invite', { roomId, userIds });
    },
    [socket]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!state.currentRoom || !state.hasMore || state.isLoading) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // In a real app, you would fetch older messages
      // const olderMessages = await fetchOlderMessages(state.currentRoom.id, state.messages.length);
      // dispatch({
      //   type: 'SET_MESSAGES',
      //   payload: [...state.messages, ...olderMessages],
      //   hasMore: olderMessages.length > 0,
      // });
      
      // For now, just set hasMore to false
      dispatch({ type: 'SET_HAS_MORE', payload: false });
    } catch (error) {
      console.error('Failed to load more messages:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error : new Error('Failed to load more messages'),
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentRoom, state.messages, state.hasMore, state.isLoading]);

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!state.currentRoom || !currentUser) return;
      
      socket?.emit('user:typing', {
        roomId: state.currentRoom.id,
        userId: currentUser.id,
        isTyping,
      });
    },
    [state.currentRoom, currentUser, socket]
  );

  const markAsRead = useCallback(
    (roomId: string) => {
      // In a real app, you would update this on the server
      dispatch({
        type: 'UPDATE_ROOM',
        payload: { id: roomId, unreadCount: 0 },
      });
      
      // Emit to server
      socket?.emit('room:read', roomId);
    },
    [socket]
  );

  // Context value
  const value = {
    ...state,
    sendMessage,
    reactToMessage,
    replyToMessage,
    startThread,
    pinMessage,
    selectRoom,
    createRoom,
    inviteToRoom,
    loadMoreMessages,
    setTyping,
    markAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
