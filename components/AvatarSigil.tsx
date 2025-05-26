import React from 'react';
import { motion } from 'framer-motion';

export default function AvatarSigil() {
  // TODO: Replace with dynamic user PFP + sigil
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="rounded-full bg-gradient-to-br from-yellow-400 via-indigo-600 to-black w-24 h-24 flex items-center justify-center shadow-xl border-4 border-yellow-400 relative"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-4xl text-white font-bold">🜂</span>
        <motion.span
          className="absolute right-2 bottom-2 text-yellow-300 text-2xl animate-pulse"
          animate={{ rotate: [0, 360, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >✶</motion.span>
      </motion.div>
      <span className="mt-2 text-sm text-yellow-200">Your Sigil</span>
    </div>
  );
}
