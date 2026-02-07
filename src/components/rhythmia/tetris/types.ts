// ===== Game Types =====

export type Piece = {
    type: string;
    rotation: number;
    x: number;
    y: number;
};

export type KeyState = {
    pressed: boolean;
    dasCharged: boolean;
    lastMoveTime: number;
    pressTime: number;
};

export type BoardCell = string | null;
export type Board = BoardCell[][];

export type GameState = {
    board: Board;
    currentPiece: Piece | null;
    nextPiece: string;
    holdPiece: string | null;
    canHold: boolean;
    pieceBag: string[];
    score: number;
    combo: number;
    lines: number;
    level: number;
    gameOver: boolean;
    isPaused: boolean;
    isPlaying: boolean;
};

export type RhythmState = {
    worldIdx: number;
    terrainSeed: number;
    terrainDestroyedCount: number;
    terrainTotal: number;
    stageNumber: number;
    beatPhase: number;
    judgmentText: string;
    judgmentColor: string;
    showJudgmentAnim: boolean;
    boardBeat: boolean;
    boardShake: boolean;
    scorePop: boolean;
};

// ===== VFX Event Types =====

export type VFXEvent =
    | { type: 'beat'; bpm: number; intensity: number }
    | { type: 'lineClear'; rows: number[]; count: number; onBeat: boolean; combo: number }
    | { type: 'rotation'; pieceType: string; boardX: number; boardY: number; fromRotation: number; toRotation: number }
    | { type: 'hardDrop'; pieceType: string; boardX: number; boardY: number; dropDistance: number }
    | { type: 'comboChange'; combo: number; onBeat: boolean }
    | { type: 'feverStart'; combo: number }
    | { type: 'feverEnd' };

export type VFXEmitter = (event: VFXEvent) => void;
