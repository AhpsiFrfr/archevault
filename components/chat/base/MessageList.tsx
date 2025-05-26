import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './Message';
import type { Message as MessageType } from '@/lib/chatStore';

interface MessageListProps {
  messages: MessageType[];
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (messageId: string) => void;
  onLoadMore?: () => void;
  loading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onReact,
  onReply,
  onLoadMore,
  loading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onLoadMore) return;

    const handleScroll = () => {
      if (container.scrollTop === 0) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onLoadMore]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {/* Loading indicator at the top */}
      {loading && (
        <div ref={loadingRef} className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Messages */}
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <Message
              message={message}
              isCurrentUser={message.userId === currentUserId}
              onReact={onReact}
              onReply={onReply}
            />
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </AnimatePresence>
    </div>
  );
};
