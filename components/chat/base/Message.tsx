import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Picker, EmojiClickData } from 'emoji-picker-react';
import { Message as MessageType } from '@/lib/chatStore';
import { ReactionList } from '../reactions/ReactionList';

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (messageId: string) => void;
}

export const Message: React.FC<MessageProps> = ({
  message,
  isCurrentUser,
  onReact,
  onReply,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onReact(message.id, emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleReactions = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleAction = (action: 'reply' | 'react' | 'more') => {
    switch (action) {
      case 'reply':
        onReply(message.id);
        break;
      case 'react':
        toggleReactions();
        break;
      default:
        break;
    }
    setShowActions(false);
  };

  return (
    <div 
      className={`group relative flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div 
        className={`relative max-w-[80%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-700 text-gray-100 rounded-bl-none'
        }`}
      >
        {/* Message Header */}
        {!isCurrentUser && (
          <div className="font-semibold text-sm mb-1">
            {message.user?.username || 'Unknown User'}
          </div>
        )}
        
        {/* Message Content */}
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        {/* Message Footer */}
        <div className="flex items-center justify-end mt-1 space-x-2">
          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <ReactionList 
                reactions={message.reactions}
                onReactionClick={(emoji) => onReact(message.id, emoji)}
              />
            </div>
          )}
          
          {/* Timestamp */}
          <span className={`text-xs opacity-60 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        {/* Message Actions */}
        {(showActions || showEmojiPicker) && (
          <div 
            className={`absolute flex space-x-1 p-1 rounded-full bg-gray-800 shadow-lg ${
              isCurrentUser ? '-left-2 -top-3' : '-right-2 -top-3'
            }`}
          >
            <button
              onClick={() => handleAction('reply')}
              className="p-1 rounded-full hover:bg-gray-700"
              title="Reply"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={() => handleAction('react')}
              className="p-1 rounded-full hover:bg-gray-700"
              title="Add Reaction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute -top-40 left-0 z-10">
            <Picker 
              onEmojiClick={handleEmojiClick}
              width={300}
              height={350}
              previewConfig={{
                showPreview: false,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
