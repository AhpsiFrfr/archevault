import React, { useState } from 'react';
import { Room } from '../../lib/chatStore';

interface ChatSidebarProps {
  rooms: Room[];
  currentRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
  onCreateRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room =>
    room && room.name && room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
      {/* Search */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Find or start a conversation"
            className="w-full bg-gray-700 text-sm text-white rounded px-3 py-2 pl-8 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-2">
          <button
            onClick={onCreateRoom}
            className="w-full flex items-center px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md group"
          >
            <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </span>
            New Room
          </button>
        </div>

        <div className="px-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Channels
          </h3>
          <nav className="space-y-1">
            {filteredRooms.map((room) => room && (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`w-full flex items-center px-2 py-2 text-sm rounded-md group ${
                  room.id === currentRoomId
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    room.isPrivate ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                />
                <span className="truncate">
                  {room.isPrivate ? '🔒 ' : '#'} {room.name || 'Unnamed Room'}
                </span>
                {room.unreadCount && room.unreadCount > 0 && (
                  <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-2 border-t border-gray-700">
        <div className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2 overflow-hidden">
            <div className="text-sm font-medium text-white truncate">
              Username
            </div>
            <div className="text-xs text-gray-400 truncate">
              Online
            </div>
          </div>
          <button className="ml-auto text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
