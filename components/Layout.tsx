import React from 'react';
import { motion } from 'framer-motion';

const glyphs = [
  '✶', '⟁', '⟁', '⟁', '✶', '⟁', '✶'
];

const CosmicBackground = () => (
  <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-950 via-indigo-900 to-black overflow-hidden">
    <motion.div
      className="absolute inset-0 w-full h-full pointer-events-none"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      {glyphs.map((g, i) => (
        <motion.span
          key={i}
          className="absolute text-yellow-300 text-7xl opacity-10 select-none"
          style={{ top: `${10 + i * 12}%`, left: `${8 + i * 13}%` }}
          animate={{ rotate: [0, 360, 0] }}
          transition={{ duration: 30 + i * 2, repeat: Infinity, ease: 'linear' }}
        >
          {g}
        </motion.span>
      ))}
    </motion.div>
  </div>
);

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <CosmicBackground />
      <header className="flex items-center py-5 px-8 bg-transparent z-10 relative">
        <span className="text-yellow-400 text-4xl font-serif font-extrabold mr-4">A</span>
        <span className="text-white text-2xl tracking-widest font-bold">ARCHEVAULT</span>
      </header>
      <main>{children}</main>
      <footer className="text-center text-gray-500 py-6 text-xs opacity-60">© {new Date().getFullYear()} Archevault</footer>
    </div>
  );
};

export default Layout;
