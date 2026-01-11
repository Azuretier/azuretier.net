'use client';

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

interface ScoreDisplayProps {
  gameState: GameState;
}

export default function ScoreDisplay({ gameState }: ScoreDisplayProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Score */}
        <div className="space-y-1">
          <div className="text-sm text-zinc-500 font-semibold">SCORE</div>
          <div className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            {gameState.score.toLocaleString()}
          </div>
        </div>
        
        {/* Combo */}
        <div className="space-y-1 text-center">
          <div className="text-sm text-zinc-500 font-semibold">COMBO</div>
          <div 
            className={`text-5xl font-black transition-all duration-200 ${
              gameState.combo > 50 ? 'text-pink-400 scale-110' :
              gameState.combo > 30 ? 'text-cyan-400 scale-105' :
              gameState.combo > 10 ? 'text-purple-400' :
              'text-white'
            }`}
            style={{
              textShadow: gameState.combo > 10 ? `0 0 ${gameState.combo / 2}px currentColor` : 'none',
            }}
          >
            {gameState.combo}
          </div>
          <div className="text-xs text-zinc-600">MAX: {gameState.maxCombo}</div>
        </div>
        
        {/* Health */}
        <div className="space-y-1">
          <div className="text-sm text-zinc-500 font-semibold">HEALTH</div>
          <div className="w-48 h-6 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div 
              className={`h-full transition-all duration-300 ${
                gameState.health > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                gameState.health > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${gameState.health}%` }}
            >
              {/* Shine effect */}
              <div className="h-full bg-gradient-to-b from-white/30 to-transparent"></div>
            </div>
          </div>
          <div className="text-right text-xs text-zinc-600">{Math.round(gameState.health)}%</div>
        </div>
      </div>
      
      {/* Judgment counts (only show during gameplay) */}
      {gameState.isPlaying && (
        <div className="max-w-4xl mx-auto mt-4 flex gap-4 justify-center text-sm">
          <div className="px-3 py-1 bg-pink-500/20 rounded-full border border-pink-500/50">
            <span className="text-pink-400 font-bold">P:</span> {gameState.perfectCount}
          </div>
          <div className="px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/50">
            <span className="text-cyan-400 font-bold">G:</span> {gameState.greatCount}
          </div>
          <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/50">
            <span className="text-purple-400 font-bold">G:</span> {gameState.goodCount}
          </div>
          <div className="px-3 py-1 bg-zinc-700/50 rounded-full border border-zinc-600">
            <span className="text-zinc-400 font-bold">M:</span> {gameState.missCount}
          </div>
        </div>
      )}
    </div>
  );
}
