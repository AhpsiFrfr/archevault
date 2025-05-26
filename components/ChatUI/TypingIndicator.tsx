import React from 'react';
import { motion } from 'framer-motion';
import { TypingUser } from '../../types/chat';

interface TypingIndicatorProps {
  users: TypingUser[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (users.length === 0) return null;

  const usernames = users.map(user => user.username);
  let text = '';
  
  if (usernames.length === 1) {
    text = `${usernames[0]} is typing`;
  } else if (usernames.length === 2) {
    text = `${usernames[0]} and ${usernames[1]} are typing`;
  } else {
    text = `${usernames[0]}, ${usernames[1]}, and ${usernames.length - 2} others are typing`;
  }

  return (
    <div className="flex items-center text-xs text-zinc-400 px-2">
      <div className="flex space-x-1 mr-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
            animate={{
              y: ['0%', '-50%', '0%'],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <span>{text}...</span>
    </div>
  );
};
