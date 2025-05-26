import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Hash, Volume2, User, Settings, LogOut } from 'lucide-react';
import { Room, User as UserType } from '@/lib/chatStore';

interface ChatSidebarProps {
  rooms: Room[];
  currentRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  user?: UserType;
  onLogout?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
  onCreateRoom,
  user,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Archevault</h1>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          <h2 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Channels
          </h2>
          <div className="space-y-1">
            {filteredRooms
              .filter(room => room.type === 'channel')
              .map((room) => (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                    room.id === currentRoomId
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Hash className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{room.name}</span>
                  {room.unreadCount > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {room.unreadCount > 9 ? '9+' : room.unreadCount}
                    </span>
                  )}
                </button>
              ))}
          </div>

          <h2 className="px-3 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Direct Messages
          </h2>
          <div className="space-y-1">
            {filteredRooms
              .filter(room => room.type === 'dm')
              .map((room) => {
                const otherUser = room.users?.[0]; // In a DM, there should be one other user
                return (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                      room.id === currentRoomId
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="relative mr-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                        {otherUser?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-gray-900 ${
                          otherUser?.isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      ></span>
                    </div>
                    <span className="truncate">
                      {otherUser?.username || 'Unknown User'}
                    </span>
                    {room.unreadCount > 0 && (
                      <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {room.unreadCount > 9 ? '9+' : room.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-2 border-t border-gray-800 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center w-full p-2 rounded-md hover:bg-gray-800"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white mr-2">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.status || 'Online'}
              </p>
            </div>
          </button>

          {/* User Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                ref={userMenuRef}
                className="absolute bottom-16 left-2 right-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10"
              >
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  {onLogout && (
                    <>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
