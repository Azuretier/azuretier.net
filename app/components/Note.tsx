'use client';

import { NoteType } from './RhythmGame';

interface NoteProps {
  note: NoteType;
}

const LANE_WIDTH = 100;
const LANE_COLORS = [
  'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600',
  'from-purple-500 to-purple-600',
  'from-yellow-500 to-yellow-600',
];

export default function Note({ note }: NoteProps) {
  const x = 50 + note.lane * 110;
  
  return (
    <div
      className={`absolute rounded-lg transition-all duration-100 shadow-2xl`}
      style={{
        left: `${x}px`,
        top: `${note.y}px`,
        width: `${LANE_WIDTH}px`,
        height: '20px',
        transform: 'translateY(-10px)',
      }}
    >
      {/* Outer glow */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${LANE_COLORS[note.lane]} opacity-50 blur-sm`}></div>
      
      {/* Main note body */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${LANE_COLORS[note.lane]} border-2 border-white/30`}>
        {/* Inner shine effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/40 to-transparent"></div>
      </div>
      
      {/* Sparkle effect */}
      <div className="absolute inset-0 rounded-lg animate-pulse">
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${LANE_COLORS[note.lane]} opacity-30`}></div>
      </div>
    </div>
  );
}
