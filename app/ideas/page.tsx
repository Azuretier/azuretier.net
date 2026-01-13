'use client';

import Link from 'next/link';
import { useState } from 'react';

interface GameMode {
  id: string;
  title: string;
  emoji: string;
  description: string;
  features: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  color: string;
}

const GAME_MODES: GameMode[] = [
  {
    id: 'speed-run',
    title: 'Speed Run Mode',
    emoji: '⚡',
    description: 'Notes accelerate as you progress. Can you keep up with the increasing tempo?',
    features: [
      'Notes gradually speed up every 8 beats',
      'BPM increases from 100 to 200+',
      'Perfect hits slightly slow down acceleration',
      'Miss penalties increase speed dramatically',
    ],
    difficulty: 'Hard',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'survival',
    title: 'Survival Mode',
    emoji: '❤️',
    description: 'Health constantly drains. Only perfect hits restore your vitality!',
    features: [
      'Health drains at 2% per second',
      'Perfect hits: +5% health',
      'Great hits: +2% health',
      'Good hits: +0% health',
      'Miss: -10% health',
    ],
    difficulty: 'Extreme',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'accuracy',
    title: 'Accuracy Challenge',
    emoji: '🎯',
    description: 'Perfection is mandatory. Anything less than perfect breaks your combo!',
    features: [
      'Combo only increases on Perfect hits',
      'Great/Good counts as combo breaker',
      'Miss: Lose 20% of current score',
      'Unlock bonus multipliers at 50, 100, 200 combo',
      '10x score multiplier active',
    ],
    difficulty: 'Extreme',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'mirror',
    title: 'Mirror Mode',
    emoji: '🪞',
    description: 'Lanes are reversed! Train your brain to adapt to the mirrored layout.',
    features: [
      'Lane order reversed: K-J-F-D instead of D-F-J-K',
      'Same patterns, different muscle memory',
      'Perfect for ambidextrous training',
      'Can be combined with other modes',
    ],
    difficulty: 'Medium',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'random',
    title: 'Random Mode',
    emoji: '🎲',
    description: 'Notes spawn in random lanes! Pure sight-reading challenge.',
    features: [
      'Original patterns randomized per attempt',
      'Maintains rhythm timing',
      'Focuses on reaction time over memory',
      'Different experience every playthrough',
    ],
    difficulty: 'Hard',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'blindfold',
    title: 'Blindfold Mode',
    emoji: '🙈',
    description: 'Notes become invisible halfway down. Trust your rhythm!',
    features: [
      'Notes fade out at 50% of screen',
      'Rely on rhythm and audio cues',
      'Perfect hits reveal next note briefly',
      'Ultimate timing challenge',
    ],
    difficulty: 'Extreme',
    color: 'from-gray-500 to-zinc-500',
  },
  {
    id: 'combo-rush',
    title: 'Combo Rush',
    emoji: '🔥',
    description: 'Score multiplier increases exponentially with combo. Don\'t break it!',
    features: [
      'Multiplier = (Combo / 10) + 1',
      'At 100 combo: 11x multiplier',
      'At 200 combo: 21x multiplier',
      'Combo break resets multiplier to 1x',
    ],
    difficulty: 'Hard',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'zen',
    title: 'Zen Mode',
    emoji: '🧘',
    description: 'No scoring, no health, no pressure. Pure rhythm meditation.',
    features: [
      'No score tracking',
      'No health system',
      'No game over',
      'Focus on flow and enjoyment',
      'Perfect for practice and relaxation',
    ],
    difficulty: 'Easy',
    color: 'from-teal-500 to-cyan-500',
  },
];

export default function GameIdeasPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(78,205,196,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(78,205,196,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [perspective:500px] [transform:rotateX(60deg)] animate-pulse opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Creative Game Ideas
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xl text-zinc-400">
            Explore innovative game modes that push the boundaries of rhythm gaming.
            Each mode offers unique challenges and gameplay mechanics!
          </p>
        </div>

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${
                mode.color
              }/10 border-2 ${
                selectedMode?.id === mode.id
                  ? `border-${mode.color}/80`
                  : `border-${mode.color}/20`
              } p-6 transition-all hover:border-${
                mode.color
              }/50 hover:shadow-2xl hover:shadow-${
                mode.color
              }/20 hover:-translate-y-1 text-left`}
            >
              <div className="relative z-10">
                <div className="text-5xl mb-3">{mode.emoji}</div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {mode.title}
                </h2>
                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                  {mode.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      mode.difficulty === 'Easy'
                        ? 'bg-green-500/20 text-green-400'
                        : mode.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : mode.difficulty === 'Hard'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {mode.difficulty}
                  </span>
                  <span className="text-xs text-zinc-500">Click for details</span>
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${mode.color}/0 to-${mode.color}/10 opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </button>
          ))}
        </div>

        {/* Selected Mode Details */}
        {selectedMode && (
          <div className="max-w-4xl mx-auto">
            <div
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${selectedMode.color}/10 border-2 border-${selectedMode.color}/30 p-8`}
            >
              <button
                onClick={() => setSelectedMode(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="flex items-start gap-6 mb-6">
                <div className="text-7xl">{selectedMode.emoji}</div>
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">
                    {selectedMode.title}
                  </h2>
                  <p className="text-xl text-zinc-300">
                    {selectedMode.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>✨</span> Key Features
                </h3>
                <ul className="space-y-3">
                  {selectedMode.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <span className="text-cyan-400 mt-1">▹</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex gap-4">
                <div
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${selectedMode.color} text-white font-semibold`}
                >
                  Difficulty: {selectedMode.difficulty}
                </div>
                <div className="px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 font-semibold">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Implementation Status
          </h3>
          <p className="text-zinc-400 mb-4">
            These creative game modes are concept designs showing the potential for
            RHYTHMIA NEXUS. They demonstrate various ways to enhance the rhythm
            gaming experience with unique mechanics and challenges.
          </p>
          <p className="text-zinc-400">
            <strong className="text-white">Want to see these implemented?</strong>{' '}
            Vote for your favorites or suggest new ideas on our GitHub repository!
          </p>
        </div>
      </div>
    </div>
  );
}
