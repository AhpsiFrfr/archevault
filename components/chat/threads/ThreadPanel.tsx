import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ArrowLeft, MoreVertical, Pin, Trash2, Link as LinkIcon } from 'lucide-react';
import { Message as MessageType, User } from '@/lib/chatStore';
import { Message } from '../base/Message';
import { MessageInput } from '../base/MessageInput';

interface ThreadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  thread: {
    id: string;
    name: string;
    messages: MessageType[];
    parentMessage?: MessageType;
  };
  currentUserId: string;
  onSendReply: (content: string) => void;
  onCloseThread?: (threadId: string) => void;
  onPinThread?: (threadId: string) => void;
  onShareThread?: (threadId: string) => void;
}

export const ThreadPanel: React.FC<ThreadPanelProps> = ({
  isOpen,
  onClose,
  thread,
  currentUserId,
  onSendReply,
  onCloseThread,
  onPinThread,
  onShareThread,
}) => {
  const [reply, setReply] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread.messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendReply = () => {
    if (reply.trim()) {
      onSendReply(reply);
      setReply('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut' }}
        className="absolute right-0 top-0 bottom-0 w-96 bg-gray-900 text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-800"
              aria-label="Close thread"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">Thread</h2>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-800"
              aria-label="Thread options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {/* Thread Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-1 w-56 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                >
                  <div className="py-1">
                    {onPinThread && (
                      <button 
                        onClick={() => {
                          onPinThread(thread.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <Pin className="h-4 w-4 mr-3" />
                        {thread.id.startsWith('pinned-') ? 'Unpin Thread' : 'Pin Thread'}
                      </button>
                    )}
                    {onShareThread && (
                      <button 
                        onClick={() => {
                          onShareThread(thread.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <LinkIcon className="h-4 w-4 mr-3" />
                        Share Thread
                      </button>
                    )}
                    {onCloseThread && (
                      <>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button 
                          onClick={() => {
                            onCloseThread(thread.id);
                            setShowMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Close Thread
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Thread Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Parent Message */}
          {thread.parentMessage && (
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-400 mb-2 flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                <span>Replying to {thread.parentMessage.user?.username || 'a message'}</span>
              </div>
              <div className="pl-4 border-l-2 border-blue-500">
                <Message
                  message={thread.parentMessage}
                  isCurrentUser={thread.parentMessage.userId === currentUserId}
                  onReact={() => {}}
                  onReply={() => {}}
                />
              </div>
            </div>
          )}

          {/* Thread Messages */}
          <div className="space-y-4">
            {thread.messages.length > 0 ? (
              thread.messages.map((message) => (
                <div key={message.id} className="group">
                  <Message
                    message={message}
                    isCurrentUser={message.userId === currentUserId}
                    onReact={() => {}}
                    onReply={() => {}}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No messages in this thread yet.</p>
                <p className="text-sm mt-1">Be the first to reply!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Input */}
        <div className="p-3 border-t border-gray-800">
          <div className="relative">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              placeholder="Reply in thread..."
              className="w-full bg-gray-800 text-white text-sm rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendReply}
              disabled={!reply.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                reply.trim() ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500'
              }`}
              aria-label="Send reply"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
