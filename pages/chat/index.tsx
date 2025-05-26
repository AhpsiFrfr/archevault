import React, { useEffect, useState } from 'react';
import { ChatWindow } from '../../components/ChatUI/ChatWindow';
import { ChatSidebar } from '../../components/ChatUI/ChatSidebar';
import { useChatStore, Room } from '../../lib/chatStore';
import Layout from '../../components/Layout';
import LogoutButton from '../../components/LogoutButton'
import { useUser } from '@/context/UserContext'

const ChatPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    loadRooms,
    joinRoom, 
    currentRoom, 
    rooms: chatRooms,
    loading,
    error
  } = useChatStore();
  const { user, loading: userLoading } = useUser();

  // Load rooms when component mounts and user is available
  useEffect(() => {
    if (user && !userLoading) {
      loadRooms();
    }
  }, [user, userLoading, loadRooms]);

  // Auto-join first room if available and no room is selected
  useEffect(() => {
    if (chatRooms.length > 0 && !currentRoom && !loading) {
      joinRoom(chatRooms[0].id);
    }
  }, [chatRooms, currentRoom, loading, joinRoom]);

  const handleCreateRoom = async () => {
    const roomName = prompt('Enter room name:');
    if (roomName) {
      try {
        const { createRoom } = useChatStore.getState();
        await createRoom(roomName);
      } catch (error) {
        console.error('Failed to create room:', error);
      }
    }
  };

  // Show loading while user is being fetched
  if (userLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-gray-900 text-white">
        {/* Error Display */}
        {error && (
          <div className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-500 text-red-200 p-3 rounded-md">
            {error}
            <button 
              onClick={() => useChatStore.getState().setError(null)}
              className="ml-2 text-red-400 hover:text-red-200"
            >
              ×
            </button>
          </div>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 p-3 rounded-full shadow-lg"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 z-40 w-64 transition-transform duration-300 ease-in-out`}
        >
          <ChatSidebar
            rooms={chatRooms}
            currentRoomId={currentRoom?.id}
            onSelectRoom={joinRoom}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <LogoutButton />
          <ChatWindow currentUser={{...user, status: user?.status || 'online'}} />
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
