import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSidebar } from './ChatSidebar';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ThreadPanel } from '../threads/ThreadPanel';
import { MembersList } from './MembersList';
import { FileUpload } from '../files/FileUpload';
import { Room, Message as MessageType, User } from '@/lib/chatStore';

interface ChatLayoutProps {
  currentUser: User;
  rooms: Room[];
  currentRoom?: Room;
  messages: MessageType[];
  onSelectRoom: (roomId: string) => void;
  onSendMessage: (content: string, files?: File[]) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage: (messageId: string, content: string) => void;
  onPinMessage: (messageId: string) => void;
  onLoadMoreMessages: () => void;
  onCreateRoom: () => void;
  onInviteMembers: () => void;
  loading?: boolean;
  className?: string;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  currentUser,
  rooms,
  currentRoom,
  messages,
  onSelectRoom,
  onSendMessage,
  onReactToMessage,
  onReplyToMessage,
  onPinMessage,
  onLoadMoreMessages,
  onCreateRoom,
  onInviteMembers,
  loading = false,
  className = '',
}) => {
  const [showThread, setShowThread] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<MessageType | null>(null);
  const [selectedThread, setSelectedThread] = useState<{
    id: string;
    name: string;
    messages: MessageType[];
    parentMessage?: MessageType;
  } | null>(null);

  // Handle sending a new message
  const handleSendMessage = (content: string, files: File[] = []) => {
    if (!currentRoom) return;
    
    if (replyToMessage) {
      // If replying to a message, send it as a thread reply
      onReplyToMessage(replyToMessage.id, content);
      setReplyToMessage(null);
    } else {
      // Otherwise, send as a regular message
      onSendMessage(content, files);
    }
  };

  // Handle reply to a message
  const handleReplyToMessage = (message: MessageType) => {
    setReplyToMessage(message);
  };

  // Handle starting a thread from a message
  const handleStartThread = (message: MessageType) => {
    setSelectedThread({
      id: `thread-${Date.now()}`,
      name: `Thread from ${message.user?.username || 'user'}`,
      messages: [],
      parentMessage: message,
    });
    setShowThread(true);
  };

  // Handle sending a reply in a thread
  const handleSendThreadReply = (content: string) => {
    if (!selectedThread?.parentMessage) return;
    
    onReplyToMessage(selectedThread.parentMessage.id, content);
    
    // In a real app, this would update the thread messages
    setSelectedThread(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-${Date.now()}`,
            content,
            userId: currentUser.id,
            user: currentUser,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            reactions: [],
          },
        ],
      };
    });
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${className}`}>
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <ChatSidebar
          rooms={rooms}
          currentRoomId={currentRoom?.id}
          onSelectRoom={onSelectRoom}
          onCreateRoom={onCreateRoom}
          user={currentUser}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              room={currentRoom}
              onSearch={setSearchQuery}
              onShowMembers={() => setShowMembers(true)}
              onShowPinned={() => console.log('Show pinned messages')}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList
                messages={filteredMessages}
                currentUserId={currentUser.id}
                onReact={onReactToMessage}
                onReply={handleReplyToMessage}
                onStartThread={handleStartThread}
                onLoadMore={onLoadMoreMessages}
                loading={loading}
              />
            </div>

            {/* Reply Preview */}
            {replyToMessage && (
              <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 px-2">
                  <div className="flex items-center">
                    <span className="font-medium">Replying to {replyToMessage.user?.username || 'user'}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-500 truncate max-w-xs">
                      {replyToMessage.content.length > 50
                        ? `${replyToMessage.content.substring(0, 50)}...`
                        : replyToMessage.content}
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <MessageInput
                onSend={handleSendMessage}
                onTyping={(isTyping) => {
                  // Handle typing indicator
                  console.log(isTyping ? 'User started typing' : 'User stopped typing');
                }}
                onAttachFile={() => setShowFileUpload(!showFileUpload)}
                disabled={!currentRoom}
              />
              
              {/* File Upload */}
              <AnimatePresence>
                {showFileUpload && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2">
                      <FileUpload
                        multiple={true}
                        onFilesSelected={(files) => {
                          // Handle file uploads
                          console.log('Files selected:', files);
                          setShowFileUpload(false);
                        }}
                        maxSizeMB={50}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No conversation selected
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a conversation or start a new one to begin messaging.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onCreateRoom}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Conversation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thread Panel */}
      {showThread && selectedThread && (
        <ThreadPanel
          isOpen={showThread}
          onClose={() => setShowThread(false)}
          thread={selectedThread}
          currentUserId={currentUser.id}
          onSendReply={handleSendThreadReply}
          onCloseThread={(threadId) => {
            console.log('Close thread:', threadId);
            setShowThread(false);
          }}
          onPinThread={(threadId) => {
            console.log('Pin thread:', threadId);
          }}
          onShareThread={(threadId) => {
            console.log('Share thread:', threadId);
          }}
        />
      )}

      {/* Members List */}
      {showMembers && currentRoom && (
        <MembersList
          isOpen={showMembers}
          onClose={() => setShowMembers(false)}
          members={currentRoom.users || []}
          currentUserId={currentUser.id}
          onMemberClick={(userId) => {
            console.log('Clicked on member:', userId);
            // In a real app, this might open a user profile or start a DM
          }}
          onInviteMembers={onInviteMembers}
        />
      )}
    </div>
  );
};

export default ChatLayout;
