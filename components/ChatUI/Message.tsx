import React from 'react';
import { motion } from 'framer-motion';
import { Message as MessageType } from '../../lib/chatStore';

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
  onReact: (messageId: string, emoji: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, isCurrentUser, onReact }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isCurrentUser && (
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 mr-3 overflow-hidden">
          <img src={message.user.avatar} alt={message.user.username} className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`max-w-[70%] ${isCurrentUser ? 'bg-indigo-600' : 'bg-gray-700'} rounded-2xl p-3`}>
        {!isCurrentUser && (
          <div className="font-semibold text-sm mb-1">{message.user.username}</div>
        )}
        <div className="text-sm">{message.content}</div>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs opacity-50">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.isPinned && <span className="text-xs">📌</span>}
        </div>
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, i) => (
              <button
                key={i}
                onClick={() => onReact(message.id, reaction.emoji)}
                className="text-xs bg-black/20 px-2 py-0.5 rounded-full hover:bg-black/30 transition-colors"
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
