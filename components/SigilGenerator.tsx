import React from 'react';

export default function SigilGenerator() {
  return (
    <form className="flex flex-col items-center gap-4 p-6">
      <label className="text-yellow-200">Intent:</label>
      <input type="text" className="rounded px-3 py-2 bg-black border border-yellow-400 text-white" placeholder="Describe your intent..." />
      <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded font-bold">Generate Glyph</button>
      {/* TODO: Render generated glyph */}
    </form>
  );
}
