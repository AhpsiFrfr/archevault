import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Pin, Users, Phone, Video, Info, X } from 'lucide-react';
import { Room } from '@/lib/chatStore';

interface ChatHeaderProps {
  room: Room;
  onSearch: (query: string) => void;
  onShowMembers: () => void;
  onShowPinned: () => void;
  onShowCall?: (type: 'audio' | 'video') => void;
  onShowRoomInfo?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  room,
  onSearch,
  onShowMembers,
  onShowPinned,
  onShowCall,
  onShowRoomInfo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Clear search when closing
      setSearchQuery('');
      onSearch('');
    }
  };

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

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Room info
  const memberCount = room.users?.length || 0;
  const onlineCount = room.users?.filter(user => user.isOnline).length || 0;

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      {/* Room Info */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {room.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
        </div>
        <div>
          <h2 className="font-semibold text-white">{room.name}</h2>
          <p className="text-xs text-gray-400">
            {onlineCount} online • {memberCount} members
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Search Toggle */}
        <button
          onClick={toggleSearch}
          className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Search messages"
        >
          {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>

        {/* Call Buttons */}
        {onShowCall && (
          <>
            <button
              onClick={() => onShowCall('audio')}
              className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Voice call"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              onClick={() => onShowCall('video')}
              className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Video call"
            >
              <Video className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Pinned Messages */}
        <button
          onClick={onShowPinned}
          className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Pinned messages"
        >
          <Pin className="h-5 w-5" />
        </button>

        {/* Members */}
        <button
          onClick={onShowMembers}
          className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="View members"
        >
          <Users className="h-5 w-5" />
        </button>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-10 overflow-hidden"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      onShowRoomInfo?.();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <Info className="h-4 w-4 mr-3" />
                    Room Info
                  </button>
                  <button
                    onClick={() => {
                      onShowPinned();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <Pin className="h-4 w-4 mr-3" />
                    Pinned Messages
                  </button>
                  <button
                    onClick={() => {
                      onShowMembers();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Members
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                    Leave Room
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 top-16 bg-gray-800 p-2 shadow-md z-10"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search messages..."
                className="w-full bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
