import React from 'react';

export default function ArcheLab() {
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="text-lg text-yellow-200 mb-2">Pylon Modules</div>
      <div className="grid grid-cols-3 gap-4">
        {/* TODO: Replace with dynamic locked/unlocked pylons */}
        <div className="bg-gray-900 border border-yellow-400 rounded-lg p-4 opacity-60">🔒 Locked</div>
        <div className="bg-gray-900 border border-yellow-400 rounded-lg p-4">🔓 Unlocked</div>
        <div className="bg-gray-900 border border-yellow-400 rounded-lg p-4 opacity-60">🔒 Locked</div>
      </div>
    </div>
  );
}
