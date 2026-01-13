'use client';

import RhythmGame from '../components/RhythmGame';
import Link from 'next/link';

export default function SoloPage() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Back button */}
      <Link 
        href="/"
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          SOLO MODE
        </h1>
      </div>
      
      {/* Game */}
      <RhythmGame />
    </div>
  );
}
