'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Note from './Note';
import ScoreDisplay from './ScoreDisplay';

// Game configuration
const CONFIG = {
  BPM: 128,
  NOTE_SPEED: 4, // pixels per frame
  SPAWN_Y: -100,
  HIT_ZONE_Y: 600,
  JUDGE_PERFECT: 30,
  JUDGE_GREAT: 60,
  JUDGE_GOOD: 100,
  LANES: [0, 1, 2, 3],
  KEYS: ['d', 'f', 'j', 'k'] as const,
  LANE_WIDTH: 100,
};

// Game state interface
interface GameState {
  score: number;
  combo: number;
  maxCombo: number;
  health: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isCleared: boolean;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  missCount: number;
}

// Note interface
export interface NoteType {
  id: number;
  lane: number;
  time: number;
  y: number;
  hit: boolean;
  missed: boolean;
}

// Particle effect interface
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function RhythmGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    health: 100,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isCleared: false,
    perfectCount: 0,
    greatCount: 0,
    goodCount: 0,
    missCount: 0,
  });

  const [notes, setNotes] = useState<NoteType[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [judgmentText, setJudgmentText] = useState<string>('');
  const [judgmentColor, setJudgmentColor] = useState<string>('');
  
  const gameLoopRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noteIdRef = useRef<number>(0);
  const particleIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Generate beat pattern
  const generateNotePattern = useCallback(() => {
    const pattern: NoteType[] = [];
    const beatInterval = (60 / CONFIG.BPM) * 1000; // ms per beat
    const totalBeats = 64; // 64 beats for the song
    
    // Generate interesting patterns
    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * beatInterval;
      
      // Different patterns based on beat position
      if (beat % 8 === 0) {
        // Strong beat - all lanes
        CONFIG.LANES.forEach(lane => {
          pattern.push({
            id: noteIdRef.current++,
            lane,
            time,
            y: CONFIG.SPAWN_Y,
            hit: false,
            missed: false,
          });
        });
      } else if (beat % 4 === 0) {
        // Medium beat - alternating lanes
        pattern.push({
          id: noteIdRef.current++,
          lane: 0,
          time,
          y: CONFIG.SPAWN_Y,
          hit: false,
          missed: false,
        });
        pattern.push({
          id: noteIdRef.current++,
          lane: 3,
          time,
          y: CONFIG.SPAWN_Y,
          hit: false,
          missed: false,
        });
      } else if (beat % 2 === 0) {
        // Light beat - middle lanes
        const lane = Math.random() > 0.5 ? 1 : 2;
        pattern.push({
          id: noteIdRef.current++,
          lane,
          time,
          y: CONFIG.SPAWN_Y,
          hit: false,
          missed: false,
        });
      } else {
        // Syncopation - random lane
        if (Math.random() > 0.5) {
          pattern.push({
            id: noteIdRef.current++,
            lane: Math.floor(Math.random() * 4),
            time,
            y: CONFIG.SPAWN_Y,
            hit: false,
            missed: false,
          });
        }
      }
    }
    
    return pattern;
  }, []);

  // Initialize game
  const startGame = useCallback(() => {
    noteIdRef.current = 0;
    particleIdRef.current = 0;
    const pattern = generateNotePattern();
    
    setNotes(pattern);
    setGameState({
      score: 0,
      combo: 0,
      maxCombo: 0,
      health: 100,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      isCleared: false,
      perfectCount: 0,
      greatCount: 0,
      goodCount: 0,
      missCount: 0,
    });
    startTimeRef.current = Date.now();
    
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    // Play background music (simple beat)
    playBackgroundMusic();
  }, [generateNotePattern]);

  // Play background music using Web Audio API
  const playBackgroundMusic = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const beatInterval = (60 / CONFIG.BPM);
    const totalBeats = 64;
    
    for (let i = 0; i < totalBeats; i++) {
      const time = ctx.currentTime + i * beatInterval;
      
      // Kick drum (low frequency)
      if (i % 4 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.start(time);
        osc.stop(time + 0.1);
      }
      
      // Hi-hat (high frequency)
      if (i % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(8000, time);
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        
        osc.start(time);
        osc.stop(time + 0.05);
      }
    }
  }, []);

  // Play hit sound
  const playHitSound = useCallback((judgment: string) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const frequencies = {
      'PERFECT': 880,
      'GREAT': 660,
      'GOOD': 440,
      'MISS': 220,
    };
    
    osc.frequency.setValueAtTime(frequencies[judgment as keyof typeof frequencies] || 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  // Create particles
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Judge hit timing
  const judgeHit = useCallback((note: NoteType): string | null => {
    const distance = Math.abs(note.y - CONFIG.HIT_ZONE_Y);
    
    if (distance <= CONFIG.JUDGE_PERFECT) return 'PERFECT';
    if (distance <= CONFIG.JUDGE_GREAT) return 'GREAT';
    if (distance <= CONFIG.JUDGE_GOOD) return 'GOOD';
    return null;
  }, []);

  // Handle key press
  const handleKeyPress = useCallback((lane: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
    
    // Find the closest note in this lane
    const laneNotes = notes.filter(n => n.lane === lane && !n.hit && !n.missed);
    if (laneNotes.length === 0) return;
    
    // Sort by distance to hit zone
    laneNotes.sort((a, b) => Math.abs(a.y - CONFIG.HIT_ZONE_Y) - Math.abs(b.y - CONFIG.HIT_ZONE_Y));
    const closestNote = laneNotes[0];
    
    const judgment = judgeHit(closestNote);
    
    if (judgment) {
      // Mark note as hit
      setNotes(prev => prev.map(n => 
        n.id === closestNote.id ? { ...n, hit: true } : n
      ));
      
      // Update game state
      setGameState(prev => {
        const points = judgment === 'PERFECT' ? 100 : judgment === 'GREAT' ? 75 : 50;
        const newCombo = prev.combo + 1;
        const bonusMultiplier = 1 + Math.floor(newCombo / 10) * 0.1;
        const finalScore = prev.score + Math.floor(points * bonusMultiplier);
        
        return {
          ...prev,
          score: finalScore,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          perfectCount: judgment === 'PERFECT' ? prev.perfectCount + 1 : prev.perfectCount,
          greatCount: judgment === 'GREAT' ? prev.greatCount + 1 : prev.greatCount,
          goodCount: judgment === 'GOOD' ? prev.goodCount + 1 : prev.goodCount,
        };
      });
      
      // Show judgment
      setJudgmentText(judgment);
      setJudgmentColor(
        judgment === 'PERFECT' ? 'text-pink-400' :
        judgment === 'GREAT' ? 'text-cyan-400' :
        'text-purple-400'
      );
      setTimeout(() => setJudgmentText(''), 300);
      
      // Play sound and create particles
      playHitSound(judgment);
      const x = 200 + lane * (CONFIG.LANE_WIDTH + 10);
      const color = judgment === 'PERFECT' ? '#ec4899' : judgment === 'GREAT' ? '#06b6d4' : '#a855f7';
      createParticles(x, CONFIG.HIT_ZONE_Y, color);
    }
  }, [gameState, notes, judgeHit, playHitSound, createParticles]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
    
    const loop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Update notes position
      setNotes(prev => {
        const updated = prev.map(note => {
          if (note.hit || note.missed) return note;
          
          // Calculate expected Y position based on time
          const timeUntilHit = note.time - elapsed;
          const distanceFromHitZone = (timeUntilHit / 1000) * CONFIG.NOTE_SPEED * 60;
          const newY = CONFIG.HIT_ZONE_Y - distanceFromHitZone;
          
          // Check if note passed the hit zone (miss)
          if (newY > CONFIG.HIT_ZONE_Y + 100 && !note.missed) {
            setGameState(state => ({
              ...state,
              combo: 0,
              health: Math.max(0, state.health - 10),
              missCount: state.missCount + 1,
            }));
            
            playHitSound('MISS');
            return { ...note, missed: true };
          }
          
          return { ...note, y: newY };
        });
        
        // Remove old notes
        return updated.filter(n => n.y < CONFIG.HIT_ZONE_Y + 200);
      });
      
      // Update particles
      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // gravity
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0);
      });
      
      // Check game over
      setGameState(state => {
        if (state.health <= 0) {
          return { ...state, isGameOver: true, isPlaying: false };
        }
        
        // Check if all notes are done
        const allNotesDone = notes.every(n => n.hit || n.missed || n.y > CONFIG.HIT_ZONE_Y + 200);
        if (allNotesDone && elapsed > 32000) { // ~32 seconds for 64 beats
          return { ...state, isCleared: true, isPlaying: false };
        }
        
        return state;
      });
      
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    
    gameLoopRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, notes, playHitSound]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const laneIndex = CONFIG.KEYS.indexOf(key as typeof CONFIG.KEYS[number]);
      
      if (laneIndex !== -1) {
        handleKeyPress(laneIndex);
      }
      
      if (key === 'escape') {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      }
      
      if (key === ' ' && (gameState.isGameOver || gameState.isCleared)) {
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, gameState.isGameOver, gameState.isCleared, startGame]);

  // Touch controls for mobile
  const handleLaneClick = useCallback((lane: number) => {
    handleKeyPress(lane);
  }, [handleKeyPress]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
      
      {/* Score Display */}
      <ScoreDisplay gameState={gameState} />
      
      {/* Game Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: '450px', height: '700px' }}>
          {/* Lanes */}
          {CONFIG.LANES.map((lane) => (
            <div
              key={lane}
              className="absolute top-0 bottom-0 border-l border-r border-zinc-700/50 cursor-pointer transition-all hover:bg-white/5"
              style={{
                left: `${50 + lane * 110}px`,
                width: `${CONFIG.LANE_WIDTH}px`,
              }}
              onClick={() => handleLaneClick(lane)}
            >
              {/* Lane key indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-zinc-600">
                {CONFIG.KEYS[lane].toUpperCase()}
              </div>
            </div>
          ))}
          
          {/* Hit zone */}
          <div 
            className="absolute left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50"
            style={{ top: `${CONFIG.HIT_ZONE_Y}px` }}
          ></div>
          
          {/* Notes */}
          {notes.map((note) => (
            !note.hit && !note.missed && note.y > -50 && note.y < CONFIG.HIT_ZONE_Y + 100 && (
              <Note key={note.id} note={note} />
            )
          ))}
          
          {/* Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                backgroundColor: particle.color,
                opacity: particle.life,
                boxShadow: `0 0 ${particle.life * 10}px ${particle.color}`,
              }}
            ></div>
          ))}
          
          {/* Judgment text */}
          {judgmentText && (
            <div className={`absolute left-1/2 -translate-x-1/2 text-4xl font-black ${judgmentColor} animate-bounce`}
                 style={{ top: `${CONFIG.HIT_ZONE_Y - 100}px` }}>
              {judgmentText}
            </div>
          )}
        </div>
      </div>
      
      {/* Start screen */}
      {!gameState.isPlaying && !gameState.isGameOver && !gameState.isCleared && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              RHYTHMIA
            </h1>
            <p className="text-xl text-zinc-400">Press the keys when notes hit the line!</p>
            <div className="flex gap-4 justify-center text-lg text-zinc-300">
              {CONFIG.KEYS.map(key => (
                <div key={key} className="px-6 py-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  {key.toUpperCase()}
                </div>
              ))}
            </div>
            <button
              onClick={startGame}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full text-white font-bold text-xl hover:scale-105 transition-transform"
            >
              Start Game
            </button>
            <p className="text-sm text-zinc-500">ESC to pause • SPACE to restart</p>
          </div>
        </div>
      )}
      
      {/* Pause screen */}
      {gameState.isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-black text-white">PAUSED</h2>
            <p className="text-xl text-zinc-400">Press ESC to continue</p>
          </div>
        </div>
      )}
      
      {/* Game Over screen */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-black text-red-500">GAME OVER</h2>
            <div className="space-y-2 text-xl text-zinc-300">
              <p>Final Score: {gameState.score}</p>
              <p>Max Combo: {gameState.maxCombo}</p>
            </div>
            <button
              onClick={startGame}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full text-white font-bold text-xl hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Clear screen */}
      {gameState.isCleared && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              STAGE CLEAR!
            </h2>
            <div className="space-y-2 text-xl text-zinc-300">
              <p>Final Score: {gameState.score}</p>
              <p>Max Combo: {gameState.maxCombo}</p>
              <p className="text-pink-400">Perfect: {gameState.perfectCount}</p>
              <p className="text-cyan-400">Great: {gameState.greatCount}</p>
              <p className="text-purple-400">Good: {gameState.goodCount}</p>
              <p className="text-zinc-500">Miss: {gameState.missCount}</p>
            </div>
            <button
              onClick={startGame}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full text-white font-bold text-xl hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
