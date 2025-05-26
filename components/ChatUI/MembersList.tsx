import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../lib/chatStore';

interface MembersListProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  currentUserId: string;
  onMemberClick?: (userId: string) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  isOpen,
  onClose,
  members,
  currentUserId,
  onMemberClick,
}) => {
  const onlineMembers = members.filter((member) => member.status === 'online');
  const offlineMembers = members.filter((member) => member.status !== 'online');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 w-64 bg-gray-850 border-l border-gray-800 shadow-xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="h-14 border-b border-gray-800 px-4 flex items-center justify-between">
            <h3 className="font-medium">Members</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              aria-label="Close members list"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search members"
                className="w-full bg-gray-800 text-sm text-white rounded px-3 py-2 pl-8 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-2.5 top-3"
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

          {/* Online Members */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Online — {onlineMembers.length}
              </h4>
              <div className="space-y-1">
                {onlineMembers.map((member) => (
                  <button
                    key={member.id}
                    className={`w-full flex items-center px-2 py-1.5 rounded text-sm ${
                      member.id === currentUserId
                        ? 'bg-indigo-900/50 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => onMemberClick?.(member.id)}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 overflow-hidden">
                        <img
                          src={member.avatar}
                          alt={member.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
                    </div>
                    <span className="ml-2 truncate">
                      {member.username}
                      {member.id === currentUserId && ' (You)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Offline Members */}
            {offlineMembers.length > 0 && (
              <div className="px-3 py-2 border-t border-gray-800">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Offline — {offlineMembers.length}
                </h4>
                <div className="space-y-1">
                  {offlineMembers.map((member) => (
                    <button
                      key={member.id}
                      className={`w-full flex items-center px-2 py-1.5 rounded text-sm ${
                        member.id === currentUserId
                          ? 'bg-indigo-900/50 text-white'
                          : 'text-gray-500 hover:bg-gray-700'
                      }`}
                      onClick={() => onMemberClick?.(member.id)}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                          <img
                            src={member.avatar}
                            alt={member.username}
                            className="w-full h-full object-cover opacity-70"
                          />
                        </div>
                      </div>
                      <span className="ml-2 truncate">
                        {member.username}
                        {member.id === currentUserId && ' (You)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
