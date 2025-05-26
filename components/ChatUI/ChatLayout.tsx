import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChatLayoutProps {
  sidebar: ReactNode;
  mainContent: ReactNode;
  threadPanel?: ReactNode;
  isThreadOpen?: boolean;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  sidebar,
  mainContent,
  threadPanel,
  isThreadOpen = false,
}) => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900 flex-shrink-0">
        {sidebar}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {mainContent}
      </main>

      {/* Thread Panel */}
      {threadPanel && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isThreadOpen ? '24rem' : 0,
            opacity: isThreadOpen ? 1 : 0,
          }}
          className="h-full bg-gray-850 border-l border-gray-800 overflow-hidden flex-shrink-0"
        >
          <div className="w-96">{threadPanel}</div>
        </motion.aside>
      )}
    </div>
  );
};
