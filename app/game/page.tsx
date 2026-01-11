'use client';

import RhythmGame from '../components/RhythmGame';
import Link from 'next/link';

export default function GamePage() {
  return (
    <div className="relative w-full h-screen">
      {/* Back button */}
      <Link 
        href="/"
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
      >
        ← Back to Home
      </Link>
      
      {/* Game */}
      <RhythmGame />
    </div>
  );
}
