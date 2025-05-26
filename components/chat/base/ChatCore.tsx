import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/chatStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { ChatSidebar } from './ChatSidebar';
import { ThreadPanel } from '../threads/ThreadPanel';
import { MembersList } from './MembersList';
import type { Message as MessageType, User } from '@/lib/chatStore';

interface ChatCoreProps {
  currentUser: User;
  initialRoomId?: string;
  onRoomChange?: (roomId: string) => void;
  onSendMessage?: (message: Omit<MessageType, 'id' | 'createdAt' | 'updatedAt' | 'reactions' | 'user'>) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  onPinMessage?: (messageId: string) => void;
  loadMoreMessages?: () => void;
}

export const ChatCore: React.FC<ChatCoreProps> = ({
  currentUser,
  initialRoomId,
  onRoomChange,
  onSendMessage,
  onReactToMessage,
  onPinMessage,
  loadMoreMessages,
}) => {
  const [showThread, setShowThread] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    currentRoom,
    messages,
    rooms,
    sendMessage: storeSendMessage,
    reactToMessage: storeReactToMessage,
    pinMessage: storePinMessage,
    loadMoreMessages: storeLoadMore,
    joinRoom,
    leaveRoom,
  } = useChatStore();

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (!currentRoom) return;
    
    const newMessage = {
      content,
      userId: currentUser.id,
      roomId: currentRoom.id,
      threadId: undefined,
      isPinned: false,
      user: currentUser,
    };
    
    if (onSendMessage) {
      onSendMessage(newMessage);
    } else {
      storeSendMessage(newMessage);
    }
  };

  // Handle reacting to a message
  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (onReactToMessage) {
      onReactToMessage(messageId, emoji);
    } else {
      storeReactToMessage(messageId, emoji);
    }
  };

  // Handle pinning a message
  const handlePinMessage = (messageId: string) => {
    if (onPinMessage) {
      onPinMessage(messageId);
    } else {
      storePinMessage(messageId);
    }
  };

  // Handle loading more messages
  const handleLoadMore = () => {
    if (loadMoreMessages) {
      loadMoreMessages();
    } else if (storeLoadMore) {
      storeLoadMore();
    }
  };

  // Handle room changes
  const handleRoomChange = (roomId: string) => {
    if (onRoomChange) {
      onRoomChange(roomId);
    } else if (joinRoom) {
      joinRoom(roomId);
    }
  };

  // Join initial room on mount
  useEffect(() => {
    if (initialRoomId) {
      handleRoomChange(initialRoomId);
    }
    
    return () => {
      if (initialRoomId && leaveRoom) {
        leaveRoom(initialRoomId);
      }
    };
  }, [initialRoomId]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-gray-900">
        <ChatSidebar
          rooms={rooms}
          currentRoomId={currentRoom?.id}
          onSelectRoom={handleRoomChange}
          onCreateRoom={() => console.log('Create new room')}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            <ChatHeader
              room={currentRoom}
              onSearch={setSearchQuery}
              onShowMembers={() => setShowMembers(true)}
              onShowPinned={() => console.log('Show pinned messages')}
            />
            
            <MessageList
              messages={messages.filter(msg => 
                msg.content.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              currentUserId={currentUser.id}
              onReact={handleReactToMessage}
              onReply={(messageId) => {
                // In a real app, you would fetch thread messages here
                setShowThread(true);
              }}
              onLoadMore={handleLoadMore}
            />
            
            <div className="p-4 border-t border-gray-800">
              <MessageInput
                onSend={handleSendMessage}
                onTyping={(isTyping) => {
                  // Handle typing indicator
                  console.log(isTyping ? 'User started typing' : 'User stopped typing');
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <h2 className="text-xl font-semibold mb-2">No room selected</h2>
              <p className="text-gray-400">Select a room from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Thread Panel */}
      <ThreadPanel
        isOpen={showThread}
        onClose={() => setShowThread(false)}
        thread={{
          id: 'thread-1', // In a real app, this would come from the message
          name: 'Thread', // In a real app, this would be the thread title or preview
          messages: messages.slice(0, 3), // Sample messages
        }}
        currentUserId={currentUser.id}
        onSendReply={(content) => {
          console.log('Reply in thread:', content);
          // In a real app, this would send the reply to the thread
        }}
      />

      {/* Members List */}
      <MembersList
        isOpen={showMembers}
        onClose={() => setShowMembers(false)}
        members={currentRoom?.users || []}
        currentUserId={currentUser.id}
        onMemberClick={(userId) => {
          console.log('Clicked on member:', userId);
          // In a real app, this might open a user profile or start a DM
        }}
      />
    </div>
  );
};
