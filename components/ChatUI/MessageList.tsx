import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './Message';
import { Message as MessageType } from '../../lib/chatStore';

interface MessageListProps {
  messages: MessageType[];
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onReact,
  onReply,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence>
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
