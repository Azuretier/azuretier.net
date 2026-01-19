import React, { useState, useEffect, useCallback, useRef } from 'react';

// Tetromino definitions with all 4 rotation states (0, R, 2, L)
// Using SRS (Super Rotation System) - the standard Tetris rotation system
const TETROMINOES: Record<string, number[][][]> = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // 0
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]], // R
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]], // 2
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]], // L
  ],
  O: [
    [[1,1], [1,1]], // 0
    [[1,1], [1,1]], // R
    [[1,1], [1,1]], // 2
    [[1,1], [1,1]], // L
  ],
  T: [
    [[0,1,0], [1,1,1], [0,0,0]], // 0
    [[0,1,0], [0,1,1], [0,1,0]], // R
    [[0,0,0], [1,1,1], [0,1,0]], // 2
    [[0,1,0], [1,1,0], [0,1,0]], // L
  ],
  S: [
    [[0,1,1], [1,1,0], [0,0,0]], // 0
    [[0,1,0], [0,1,1], [0,0,1]], // R
    [[0,0,0], [0,1,1], [1,1,0]], // 2
    [[1,0,0], [1,1,0], [0,1,0]], // L
  ],
  Z: [
    [[1,1,0], [0,1,1], [0,0,0]], // 0
    [[0,0,1], [0,1,1], [0,1,0]], // R
    [[0,0,0], [1,1,0], [0,1,1]], // 2
    [[0,1,0], [1,1,0], [1,0,0]], // L
  ],
  J: [
    [[1,0,0], [1,1,1], [0,0,0]], // 0
    [[0,1,1], [0,1,0], [0,1,0]], // R
    [[0,0,0], [1,1,1], [0,0,1]], // 2
    [[0,1,0], [0,1,0], [1,1,0]], // L
  ],
  L: [
    [[0,0,1], [1,1,1], [0,0,0]], // 0
    [[0,1,0], [0,1,0], [0,1,1]], // R
    [[0,0,0], [1,1,1], [1,0,0]], // 2
    [[1,1,0], [0,1,0], [0,1,0]], // L
  ],
};

// SRS Wall Kick Data
// Format: [dx, dy] offsets to try when rotation fails
// Tests are tried in order until one succeeds
const WALL_KICKS_JLSTZ: Record<string, [number, number][]> = {
  '0->R': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  'R->2': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '2->L': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
  'L->0': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  'R->0': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '2->R': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  'L->2': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '0->L': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
};

const WALL_KICKS_I: Record<string, [number, number][]> = {
  '0->R': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  'R->2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
  '2->L': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  'L->0': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  'R->0': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  '2->R': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  'L->2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  '0->L': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
};

const COLORS: Record<string, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 28;

type Piece = {
  type: string;
  rotation: number;
  x: number;
  y: number;
};

const rotationNames = ['0', 'R', '2', 'L'];

const createEmptyBoard = () => 
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

const getRandomPiece = (): string => {
  const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return pieces[Math.floor(Math.random() * pieces.length)];
};

export default function Tetris() {
  const [board, setBoard] = useState<(string | null)[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<string>(getRandomPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const getShape = useCallback((type: string, rotation: number) => {
    return TETROMINOES[type][rotation];
  }, []);

  const isValidPosition = useCallback((piece: Piece, boardState: (string | null)[][]) => {
    const shape = getShape(piece.type, piece.rotation);
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          if (newY >= 0 && boardState[newY][newX] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }, [getShape]);

  const getWallKicks = useCallback((type: string, fromRotation: number, toRotation: number) => {
    const from = rotationNames[fromRotation];
    const to = rotationNames[toRotation];
    const key = `${from}->${to}`;
    
    if (type === 'I') {
      return WALL_KICKS_I[key] || [[0, 0]];
    } else if (type === 'O') {
      return [[0, 0]]; // O piece doesn't need wall kicks
    } else {
      return WALL_KICKS_JLSTZ[key] || [[0, 0]];
    }
  }, []);

  const tryRotation = useCallback((piece: Piece, direction: 1 | -1, boardState: (string | null)[][]) => {
    const fromRotation = piece.rotation;
    const toRotation = (piece.rotation + direction + 4) % 4;
    const kicks = getWallKicks(piece.type, fromRotation, toRotation);

    for (const [dx, dy] of kicks) {
      const testPiece: Piece = {
        ...piece,
        rotation: toRotation,
        x: piece.x + dx,
        y: piece.y - dy, // SRS uses inverted Y for kicks
      };
      if (isValidPosition(testPiece, boardState)) {
        return testPiece;
      }
    }
    return null; // Rotation failed
  }, [getWallKicks, isValidPosition]);

  const spawnPiece = useCallback(() => {
    const type = nextPiece;
    const shape = getShape(type, 0);
    const newPiece: Piece = {
      type,
      rotation: 0,
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: type === 'I' ? -1 : 0,
    };
    
    setNextPiece(getRandomPiece());
    
    if (!isValidPosition(newPiece, board)) {
      setGameOver(true);
      setIsPlaying(false);
      return null;
    }
    
    return newPiece;
  }, [nextPiece, getShape, isValidPosition, board]);

  const lockPiece = useCallback((piece: Piece, boardState: (string | null)[][]) => {
    const newBoard = boardState.map(row => [...row]);
    const shape = getShape(piece.type, piece.rotation);
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      }
    }
    return newBoard;
  }, [getShape]);

  const clearLines = useCallback((boardState: (string | null)[][]) => {
    const newBoard = boardState.filter(row => row.some(cell => cell === null));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newBoard, clearedLines };
  }, []);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return false;
    
    const newPiece: Piece = {
      ...currentPiece,
      x: currentPiece.x + dx,
      y: currentPiece.y + dy,
    };
    
    if (isValidPosition(newPiece, board)) {
      setCurrentPiece(newPiece);
      return true;
    }
    return false;
  }, [currentPiece, board, isValidPosition, gameOver, isPaused]);

  const rotatePiece = useCallback((direction: 1 | -1) => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotatedPiece = tryRotation(currentPiece, direction, board);
    if (rotatedPiece) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, board, tryRotation, gameOver, isPaused]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    let newPiece = { ...currentPiece };
    let dropDistance = 0;
    
    while (isValidPosition({ ...newPiece, y: newPiece.y + 1 }, board)) {
      newPiece.y++;
      dropDistance++;
    }
    
    const newBoard = lockPiece(newPiece, board);
    const { newBoard: clearedBoard, clearedLines } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    setScore(prev => prev + dropDistance * 2 + clearedLines * 100 * level);
    setLines(prev => {
      const newLines = prev + clearedLines;
      setLevel(Math.floor(newLines / 10) + 1);
      return newLines;
    });
    
    const spawned = spawnPiece();
    setCurrentPiece(spawned);
  }, [currentPiece, board, isValidPosition, lockPiece, clearLines, spawnPiece, level, gameOver, isPaused]);

  const tick = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newPiece: Piece = {
      ...currentPiece,
      y: currentPiece.y + 1,
    };
    
    if (isValidPosition(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      // Lock the piece
      const newBoard = lockPiece(currentPiece, board);
      const { newBoard: clearedBoard, clearedLines } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setScore(prev => prev + clearedLines * 100 * level);
      setLines(prev => {
        const newLines = prev + clearedLines;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });
      
      const spawned = spawnPiece();
      setCurrentPiece(spawned);
    }
  }, [currentPiece, board, isValidPosition, lockPiece, clearLines, spawnPiece, level, gameOver, isPaused]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setNextPiece(getRandomPiece());
    
    const type = getRandomPiece();
    const shape = getShape(type, 0);
    setCurrentPiece({
      type,
      rotation: 0,
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: type === 'I' ? -1 : 0,
    });
  }, [getShape]);

  useEffect(() => {
    if (isPlaying && !gameOver && !isPaused) {
      const speed = Math.max(100, 1000 - (level - 1) * 100);
      gameLoopRef.current = setInterval(tick, speed);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [isPlaying, gameOver, isPaused, level, tick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1);
          setScore(prev => prev + 1);
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          e.preventDefault();
          rotatePiece(1); // Clockwise
          break;
        case 'z':
        case 'Z':
        case 'Control':
          e.preventDefault();
          rotatePiece(-1); // Counter-clockwise
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, hardDrop, isPlaying]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      const shape = getShape(currentPiece.type, currentPiece.rotation);
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
      
      // Add ghost piece
      let ghostY = currentPiece.y;
      while (isValidPosition({ ...currentPiece, y: ghostY + 1 }, board)) {
        ghostY++;
      }
      if (ghostY !== currentPiece.y) {
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
              const boardY = ghostY + y;
              const boardX = currentPiece.x + x;
              if (boardY >= 0 && boardY < BOARD_HEIGHT && displayBoard[boardY][boardX] === null) {
                displayBoard[boardY][boardX] = `ghost-${currentPiece.type}`;
              }
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  const renderNextPiece = () => {
    const shape = getShape(nextPiece, 0);
    const size = nextPiece === 'I' ? 4 : nextPiece === 'O' ? 2 : 3;
    
    return (
      <div className="flex flex-col items-center">
        {shape.slice(0, size === 4 ? 4 : 2).map((row, y) => (
          <div key={y} className="flex">
            {row.slice(0, size).map((cell, x) => (
              <div
                key={x}
                className="border border-gray-700"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: cell ? COLORS[nextPiece] : '#1a1a2e',
                  boxShadow: cell ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="flex gap-6">
        {/* Main Game Board */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-4 tracking-wider">TETRIS</h1>
          <div 
            className="relative border-4 border-purple-500 rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: '#0f0f1a',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          >
            {displayBoard.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  const isGhost = typeof cell === 'string' && cell.startsWith('ghost-');
                  const pieceType = isGhost ? cell.replace('ghost-', '') : cell;
                  
                  return (
                    <div
                      key={x}
                      className="border border-gray-800"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: cell 
                          ? isGhost 
                            ? 'transparent'
                            : COLORS[pieceType as string]
                          : 'transparent',
                        border: isGhost 
                          ? `2px dashed ${COLORS[pieceType as string]}40`
                          : '1px solid #2d2d4a',
                        boxShadow: cell && !isGhost
                          ? 'inset 3px 3px 6px rgba(255,255,255,0.3), inset -3px -3px 6px rgba(0,0,0,0.4)'
                          : 'none',
                        opacity: isGhost ? 0.4 : 1,
                      }}
                    />
                  );
                })}
              </div>
            ))}
            
            {/* Overlay for Game Over / Paused */}
            {(gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-4">
                    {gameOver ? 'GAME OVER' : 'PAUSED'}
                  </p>
                  {gameOver && (
                    <button
                      onClick={startGame}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Play Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex flex-col gap-4 text-white">
          {/* Next Piece */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-purple-500">
            <h3 className="text-sm font-semibold mb-2 text-purple-300">NEXT</h3>
            <div className="flex justify-center items-center h-20">
              {renderNextPiece()}
            </div>
          </div>

          {/* Score */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-purple-500">
            <h3 className="text-sm font-semibold text-purple-300">SCORE</h3>
            <p className="text-2xl font-bold">{score.toLocaleString()}</p>
          </div>

          {/* Lines */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-purple-500">
            <h3 className="text-sm font-semibold text-purple-300">LINES</h3>
            <p className="text-2xl font-bold">{lines}</p>
          </div>

          {/* Level */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-purple-500">
            <h3 className="text-sm font-semibold text-purple-300">LEVEL</h3>
            <p className="text-2xl font-bold">{level}</p>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-purple-500">
            <h3 className="text-sm font-semibold mb-2 text-purple-300">CONTROLS</h3>
            <div className="text-xs space-y-1 text-gray-300">
              <p>← → Move</p>
              <p>↓ Soft Drop</p>
              <p>↑/X Rotate CW</p>
              <p>Z/Ctrl Rotate CCW</p>
              <p>Space Hard Drop</p>
              <p>P/Esc Pause</p>
            </div>
          </div>

          {/* Start Button */}
          {!isPlaying && !gameOver && (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              START GAME
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
