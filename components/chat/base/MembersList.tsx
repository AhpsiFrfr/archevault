import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Volume2, VolumeX, UserPlus, MoreVertical, Crown } from 'lucide-react';
import { User } from '@/lib/chatStore';

interface MembersListProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  currentUserId: string;
  onMemberClick?: (userId: string) => void;
  onInviteMembers?: () => void;
  isAdmin?: boolean;
}

export const MembersList: React.FC<MembersListProps> = ({
  isOpen,
  onClose,
  members,
  currentUserId,
  onMemberClick,
  onInviteMembers,
  isAdmin = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMemberMenu, setShowMemberMenu] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Filter members based on search query
  const filteredMembers = members.filter(member =>
    member.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group members by online status
  const onlineMembers = filteredMembers.filter(member => member.isOnline);
  const offlineMembers = filteredMembers.filter(member => !member.isOnline);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMemberMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut' }}
        className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 text-white flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Members</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800"
            aria-label="Close members list"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-800">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search members"
              className="w-full bg-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Invite Button */}
        {onInviteMembers && (
          <div className="p-3 border-b border-gray-800">
            <button
              onClick={onInviteMembers}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite People</span>
            </button>
          </div>
        )}

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          {/* Online Members */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Online — {onlineMembers.length}
            </h3>
            <div className="space-y-1">
              {onlineMembers.map((member) => (
                <div
                  key={member.id}
                  className="group flex items-center justify-between p-2 rounded-md hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                        {member.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">
                          {member.username}
                        </span>
                        {member.isAdmin && (
                          <Crown className="h-3.5 w-3.5 text-yellow-400 ml-1" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {member.status || 'Online'}
                      </span>
                    </div>
                  </div>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                      aria-label="Member options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {/* Member Menu */}
                    <AnimatePresence>
                      {showMemberMenu === member.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                        >
                          <div className="py-1">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                              <UserPlus className="h-4 w-4 mr-3" />
                              Send Message
                            </button>
                            {isAdmin && member.id !== currentUserId && (
                              <>
                                <div className="border-t border-gray-700 my-1"></div>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                                  <VolumeX className="h-4 w-4 mr-3" />
                                  Mute User
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                                  <X className="h-4 w-4 mr-3" />
                                  Kick User
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Members */}
          {offlineMembers.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Offline — {offlineMembers.length}
              </h3>
              <div className="space-y-1">
                {offlineMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-2 rounded-md hover:bg-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-600 rounded-full border-2 border-gray-900"></span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-400">
                            {member.username}
                          </span>
                          {member.isAdmin && (
                            <Crown className="h-3.5 w-3.5 text-yellow-400 ml-1" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          Last seen {member.lastSeen || 'recently'}
                        </span>
                      </div>
                    </div>
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                        aria-label="Member options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {/* Member Menu */}
                      <AnimatePresence>
                        {showMemberMenu === member.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                          >
                            <div className="py-1">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                                <UserPlus className="h-4 w-4 mr-3" />
                                Send Message
                              </button>
                              {isAdmin && member.id !== currentUserId && (
                                <>
                                  <div className="border-t border-gray-700 my-1"></div>
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                                    <X className="h-4 w-4 mr-3" />
                                    Kick User
                                  </button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
