import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../lib/chatStore';
import { ChatSidebar } from './ChatSidebar';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import MessageInput from './MessageInput';
import { ThreadPanel } from './ThreadPanel';
import type { User } from '../../lib/chatStore';

interface ChatWindowProps {
  currentUser: User;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser }) => {
  const [showThread, setShowThread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  // Get data from the chat store
  const {
    currentRoom,
    messages = [],
    rooms = [],
    sendMessage,
    reactToMessage,
    joinRoom,
  } = useChatStore();

  const handleReactToMessage = useCallback((messageId: string, emoji: string) => {
    reactToMessage(messageId, emoji);
  }, [reactToMessage]);

  const handleReplyToMessage = useCallback((messageId: string) => {
    setShowThread(true);
  }, []);

  const handleCreateRoom = () => {
    const roomName = prompt('Enter room name:');
    if (roomName) {
      // Handle room creation
      console.log('Create room:', roomName);
    }
  };

  if (!currentRoom) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No room selected</h3>
          <p className="text-sm">Select a room from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-gray-900 flex-shrink-0">
        <ChatSidebar
          rooms={rooms}
          currentRoomId={currentRoom?.id}
          onSelectRoom={joinRoom}
          onCreateRoom={handleCreateRoom}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          room={currentRoom}
          onSearch={setSearchQuery}
          onShowMembers={() => setShowMembers(true)}
          onShowPinned={() => console.log('Show pinned messages')}
        />
        
        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={messages}
            currentUserId={currentUser.id}
            onReact={handleReactToMessage}
            onReply={handleReplyToMessage}
          />
        </div>
        
        <MessageInput />
      </div>

      {/* Thread Panel */}
      <AnimatePresence>
        {showThread && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-96 border-l border-gray-800 bg-gray-850"
          >
            <ThreadPanel
              isOpen={showThread}
              onClose={() => setShowThread(false)}
              thread={{
                id: 'thread-1',
                name: 'Thread',
                messages: [],
              }}
              currentUserId={currentUser.id}
              onSendReply={(content: string) => console.log('Reply in thread:', content)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;
