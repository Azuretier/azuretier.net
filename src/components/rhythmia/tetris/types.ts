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

// Terrain cell: color string when block is present, null when destroyed
export type TerrainCell = string | null;
export type TerrainGrid = TerrainCell[][];

export type RhythmState = {
    worldIdx: number;
    terrainGrid: TerrainGrid;
    terrainTotal: number;
    terrainRemaining: number;
    stageNumber: number;
    beatPhase: number;
    judgmentText: string;
    judgmentColor: string;
    showJudgmentAnim: boolean;
    boardBeat: boolean;
    boardShake: boolean;
    scorePop: boolean;
};
