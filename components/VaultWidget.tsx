import React from 'react';

export default function VaultWidget() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-900 via-blue-950 to-black border border-yellow-400 p-4 min-w-[140px] min-h-[100px] flex flex-col items-center justify-center text-yellow-100 shadow-lg">
      <span className="text-2xl mb-2">🔹</span>
      <span className="text-xs opacity-80">Pylon Slot</span>
    </div>
  );
}
