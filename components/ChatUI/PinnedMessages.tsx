import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../types/chat';
import { Message as MessageComponent } from './Message';

interface PinnedMessagesProps {
  messages: Message[];
  onUnpin?: (messageId: string) => void;
}

export const PinnedMessages: React.FC<PinnedMessagesProps> = ({ messages, onUnpin }) => {
  if (messages.length === 0) return null;

  return (
    <div className="bg-zinc-800/50 border-l-4 border-amber-500">
      <div className="p-3 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-xs font-medium text-amber-400">PINNED MESSAGES</span>
          <span className="text-xs text-zinc-400">• {messages.length}</span>
        </div>
        <button className="text-zinc-400 hover:text-white text-xs">
          View all
        </button>
      </div>
      <div className="divide-y divide-zinc-700">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 hover:bg-zinc-800/50 transition-colors"
          >
            <MessageComponent message={message} showActions={false} />
            <div className="mt-2 flex justify-end">
              <button 
                onClick={() => onUnpin?.(message.id)}
                className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Unpin</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
