import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmilePlus } from 'lucide-react';
import Picker, { EmojiClickData } from 'emoji-picker-react';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // Array of user IDs who reacted with this emoji
  isOwnReaction?: boolean;
}

interface ReactionListProps {
  reactions: Reaction[];
  onReactionClick: (emoji: string) => void;
  onReactionAdd?: (emoji: string) => void;
  showAddButton?: boolean;
  className?: string;
}

export const ReactionList: React.FC<ReactionListProps> = ({
  reactions,
  onReactionClick,
  onReactionAdd,
  showAddButton = true,
  className = '',
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setShowEmojiPicker(false);
    if (onReactionAdd) {
      onReactionAdd(emojiData.emoji);
    }
  };

  const handleReactionClick = (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onReactionClick(emoji);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Group reactions by emoji and count
  const groupedReactions = reactions.reduce<Reaction[]>((acc, reaction) => {
    const existingReaction = acc.find(r => r.emoji === reaction.emoji);
    if (existingReaction) {
      existingReaction.count += reaction.count;
      existingReaction.users = [...new Set([...existingReaction.users, ...reaction.users])];
    } else {
      acc.push({ ...reaction, users: [...reaction.users] });
    }
    return acc;
  }, []);

  return (
    <div className={`flex flex-wrap gap-1 items-center ${className}`}>
      {groupedReactions.map((reaction) => (
        <motion.button
          key={reaction.emoji}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => handleReactionClick(reaction.emoji, e)}
          className={`flex items-center px-2 py-0.5 rounded-full text-sm ${
            reaction.isOwnReaction
              ? 'bg-blue-500/20 border border-blue-500/30'
              : 'bg-gray-700/50 hover:bg-gray-600/50'
          }`}
          title={`${reaction.users.length} people reacted with ${reaction.emoji}`}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span className="text-xs">{reaction.count > 1 ? reaction.count : ''}</span>
        </motion.button>
      ))}

      {showAddButton && onReactionAdd && (
        <div className="relative" ref={pickerRef}>
          <motion.button
            onClick={toggleEmojiPicker}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
            aria-label="Add reaction"
          >
            <SmilePlus className="h-4 w-4" />
          </motion.button>

          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 z-10 mb-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Picker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={350}
                  previewConfig={{
                    showPreview: false,
                  }}
                  searchDisabled={false}
                  skinTonesShown={false}
                  groupNames={{
                    smileys_people: 'Smileys & People',
                    animals_nature: 'Animals & Nature',
                    food_drink: 'Food & Drink',
                    travel_places: 'Travel & Places',
                    activities: 'Activities',
                    objects: 'Objects',
                    symbols: 'Symbols',
                    flags: 'Flags',
                    recently_used: 'Recently Used',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// Helper component to show reaction tooltip with user names
export const ReactionTooltip: React.FC<{ users: { id: string; username: string }[]; emoji: string }> = ({
  users,
  emoji,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {emoji}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-col">
              {users.map((user) => (
                <span key={user.id} className="py-0.5">
                  {user.username}
                </span>
              ))}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
