import React from 'react';
import { motion } from 'framer-motion';
import { Room } from '../../lib/chatStore';

interface ChatHeaderProps {
  room: Room | null;
  onSearch: (query: string) => void;
  onShowMembers: () => void;
  onShowPinned: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  room,
  onSearch,
  onShowMembers,
  onShowPinned,
}) => {
  if (!room) return null;

  return (
    <div className="h-14 border-b border-gray-700 flex items-center justify-between px-4 bg-gray-800">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-white">
          {room.isPrivate ? '🔒 ' : '#'} {room.name}
        </h2>
        {room.topic && (
          <p className="text-sm text-gray-400 ml-3 truncate max-w-xs">
            {room.topic}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onSearch('')}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <button
          onClick={onShowPinned}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700"
          aria-label="Pinned messages"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>

        <button
          onClick={onShowMembers}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700"
          aria-label="Show members"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="sr-only">Show Members</span>
        </button>
      </div>
    </div>
  );
};
