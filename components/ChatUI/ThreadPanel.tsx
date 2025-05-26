import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Message } from './Message';
import { Message as MessageType } from '../../lib/chatStore';

interface ThreadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  thread: {
    id: string;
    name: string;
    messages: MessageType[];
  } | null;
  currentUserId: string;
  onSendReply: (content: string) => void;
}

export const ThreadPanel: React.FC<ThreadPanelProps> = ({
  isOpen,
  onClose,
  thread,
  currentUserId,
  onSendReply,
}) => {
  if (!thread) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-850 border-l border-gray-800 shadow-xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="h-14 border-b border-gray-800 px-4 flex items-center justify-between">
            <h3 className="font-medium">Thread: {thread.name}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              aria-label="Close thread"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {thread.messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isCurrentUser={message.userId === currentUserId}
                onReact={() => {}}
              />
            ))}
          </div>

          {/* Reply Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Reply in thread..."
                className="w-full bg-gray-800 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    onSendReply(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400"
                aria-label="Send reply"
                onClick={(e) => {
                  const input = e.currentTarget
                    .previousElementSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    onSendReply(input.value);
                    input.value = '';
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
