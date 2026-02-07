import { useState, useRef, useEffect, useCallback } from 'react';
import type { Piece, Board, KeyState, TerrainGrid } from '../types';
import { BOARD_WIDTH, DEFAULT_DAS, DEFAULT_ARR, DEFAULT_SDF, ColorTheme, TERRAIN_COLS, TERRAIN_ROWS, WORLDS } from '../constants';
import { createEmptyBoard, shuffleBag, getShape, isValidPosition, createSpawnPiece } from '../utils/boardUtils';

// Seeded random for deterministic terrain generation
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// Generate terrain grid for a given stage
function generateTerrain(stageNumber: number, worldIdx: number): TerrainGrid {
    const rand = seededRandom(stageNumber * 7919 + 42);
    const world = WORLDS[worldIdx];
    const grid: TerrainGrid = [];

    // Fill density increases with stage number (60% base, up to 90%)
    const density = Math.min(0.9, 0.6 + stageNumber * 0.03);

    for (let row = 0; row < TERRAIN_ROWS; row++) {
        const gridRow: (string | null)[] = [];
        for (let col = 0; col < TERRAIN_COLS; col++) {
            if (rand() < density) {
                // Pick a color from the world palette
                const colorIdx = Math.floor(rand() * world.colors.length);
                gridRow.push(world.colors[colorIdx]);
            } else {
                gridRow.push(null);
            }
        }
        grid.push(gridRow);
    }

    return grid;
}

// Count remaining blocks in terrain
function countTerrainBlocks(grid: TerrainGrid): number {
    let count = 0;
    for (const row of grid) {
        for (const cell of row) {
            if (cell !== null) count++;
        }
    }
    return count;
}

/**
 * Custom hook for managing game state with synchronized refs
 */
export function useGameState() {
    // Core game state
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
    const [nextPiece, setNextPiece] = useState<string>('');
    const [holdPiece, setHoldPiece] = useState<string | null>(null);
    const [canHold, setCanHold] = useState(true);
    const [pieceBag, setPieceBag] = useState<string[]>(shuffleBag());
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Rhythm game state
    const [worldIdx, setWorldIdx] = useState(0);
    const [stageNumber, setStageNumber] = useState(1);
    const [terrainGrid, setTerrainGrid] = useState<TerrainGrid>(() => generateTerrain(1, 0));
    const [terrainTotal, setTerrainTotal] = useState(() => countTerrainBlocks(generateTerrain(1, 0)));
    const [terrainRemaining, setTerrainRemaining] = useState(() => countTerrainBlocks(generateTerrain(1, 0)));
    const [beatPhase, setBeatPhase] = useState(0);
    const [judgmentText, setJudgmentText] = useState('');
    const [judgmentColor, setJudgmentColor] = useState('');
    const [showJudgmentAnim, setShowJudgmentAnim] = useState(false);
    const [boardBeat, setBoardBeat] = useState(false);
    const [boardShake, setBoardShake] = useState(false);
    const [scorePop, setScorePop] = useState(false);

    // DAS/ARR/SDF settings (adjustable)
    const [das, setDas] = useState(DEFAULT_DAS);
    const [arr, setArr] = useState(DEFAULT_ARR);
    const [sdf, setSdf] = useState(DEFAULT_SDF);

    // Color theme
    const [colorTheme, setColorTheme] = useState<ColorTheme>('stage');

    // Refs for accessing current values in callbacks (avoids stale closures)
    const gameLoopRef = useRef<number | null>(null);
    const beatTimerRef = useRef<number | null>(null);
    const lastBeatRef = useRef(Date.now());
    const lastGravityRef = useRef<number>(0);

    // State refs for use in game loop
    const boardRef = useRef<Board>(createEmptyBoard());
    const currentPieceRef = useRef<Piece | null>(null);
    const nextPieceRef = useRef(nextPiece);
    const pieceBagRef = useRef<string[]>(pieceBag);
    const holdPieceRef = useRef<string | null>(holdPiece);
    const canHoldRef = useRef(canHold);
    const scoreRef = useRef(0);
    const comboRef = useRef(combo);
    const linesRef = useRef(lines);
    const dasRef = useRef(das);
    const arrRef = useRef(arr);
    const sdfRef = useRef(sdf);
    const levelRef = useRef(level);
    const gameOverRef = useRef(gameOver);
    const isPausedRef = useRef(isPaused);
    const worldIdxRef = useRef(worldIdx);
    const stageNumberRef = useRef(stageNumber);
    const terrainGridRef = useRef<TerrainGrid>(terrainGrid);
    const beatPhaseRef = useRef(beatPhase);

    // Key states for DAS/ARR
    const keyStatesRef = useRef<Record<string, KeyState>>({
        left: { pressed: false, dasCharged: false, lastMoveTime: 0, pressTime: 0 },
        right: { pressed: false, dasCharged: false, lastMoveTime: 0, pressTime: 0 },
        down: { pressed: false, dasCharged: false, lastMoveTime: 0, pressTime: 0 },
    });

    // Keep refs in sync with state
    useEffect(() => { boardRef.current = board; }, [board]);
    useEffect(() => { currentPieceRef.current = currentPiece; }, [currentPiece]);
    useEffect(() => { nextPieceRef.current = nextPiece; }, [nextPiece]);
    useEffect(() => { pieceBagRef.current = pieceBag; }, [pieceBag]);
    useEffect(() => { holdPieceRef.current = holdPiece; }, [holdPiece]);
    useEffect(() => { canHoldRef.current = canHold; }, [canHold]);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { comboRef.current = combo; }, [combo]);
    useEffect(() => { linesRef.current = lines; }, [lines]);
    useEffect(() => { dasRef.current = das; }, [das]);
    useEffect(() => { arrRef.current = arr; }, [arr]);
    useEffect(() => { sdfRef.current = sdf; }, [sdf]);
    useEffect(() => { levelRef.current = level; }, [level]);
    useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
    useEffect(() => { worldIdxRef.current = worldIdx; }, [worldIdx]);
    useEffect(() => { stageNumberRef.current = stageNumber; }, [stageNumber]);
    useEffect(() => { terrainGridRef.current = terrainGrid; }, [terrainGrid]);
    useEffect(() => { beatPhaseRef.current = beatPhase; }, [beatPhase]);

    // Get next piece from seven-bag system
    const getNextFromBag = useCallback((): string => {
        let bag = [...pieceBagRef.current];
        if (bag.length === 0) {
            bag = shuffleBag();
        }
        const piece = bag.shift()!;
        setPieceBag(bag);
        return piece;
    }, []);

    // Spawn a new piece
    const spawnPiece = useCallback((): Piece | null => {
        const type = nextPieceRef.current;
        const newPiece = createSpawnPiece(type);

        setNextPiece(getNextFromBag());
        setCanHold(true);

        if (!isValidPosition(newPiece, boardRef.current)) {
            setGameOver(true);
            setIsPlaying(false);
            return null;
        }

        return newPiece;
    }, [getNextFromBag]);

    // Show judgment text with animation
    const showJudgment = useCallback((text: string, color: string) => {
        setJudgmentText(text);
        setJudgmentColor(color);
        setShowJudgmentAnim(false);
        requestAnimationFrame(() => {
            setShowJudgmentAnim(true);
        });
    }, []);

    // Update score with pop animation
    const updateScore = useCallback((newScore: number) => {
        setScore(newScore);
        setScorePop(true);
        setTimeout(() => setScorePop(false), 100);
    }, []);

    // Trigger board shake effect
    const triggerBoardShake = useCallback(() => {
        setBoardShake(true);
        setTimeout(() => setBoardShake(false), 200);
    }, []);

    // Reset key states
    const resetKeyStates = useCallback(() => {
        keyStatesRef.current = {
            left: { pressed: false, dasCharged: false, lastMoveTime: 0, pressTime: 0 },
            right: { pressed: false, dasCharged: false, lastMoveTime: 0, pressTime: 0 },
            down: { pressed: false, dasCharged: false, lastMoveTime: 0, pressTime: 0 },
        };
    }, []);

    // Destroy random blocks in terrain, returns new grid and remaining count
    const destroyTerrain = useCallback((count: number): { grid: TerrainGrid; remaining: number } => {
        const grid = terrainGridRef.current.map(row => [...row]);
        const filled: [number, number][] = [];
        for (let r = 0; r < TERRAIN_ROWS; r++) {
            for (let c = 0; c < TERRAIN_COLS; c++) {
                if (grid[r][c] !== null) filled.push([r, c]);
            }
        }

        // Shuffle and destroy up to count blocks
        for (let i = filled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filled[i], filled[j]] = [filled[j], filled[i]];
        }

        const toDestroy = Math.min(count, filled.length);
        for (let i = 0; i < toDestroy; i++) {
            const [r, c] = filled[i];
            grid[r][c] = null;
        }

        const remaining = filled.length - toDestroy;
        return { grid, remaining };
    }, []);

    // Start a new terrain stage
    const startNewStage = useCallback((newStageNumber: number, newWorldIdx: number) => {
        const newTerrain = generateTerrain(newStageNumber, newWorldIdx);
        const total = countTerrainBlocks(newTerrain);
        setTerrainGrid(newTerrain);
        terrainGridRef.current = newTerrain;
        setTerrainTotal(total);
        setTerrainRemaining(total);
        setStageNumber(newStageNumber);
        stageNumberRef.current = newStageNumber;
    }, []);

    // Initialize/reset game
    const initGame = useCallback(() => {
        setBoard(createEmptyBoard());
        boardRef.current = createEmptyBoard();
        setScore(0);
        setCombo(0);
        setLines(0);
        setLevel(1);
        setWorldIdx(0);

        // Initialize terrain for stage 1
        const initialTerrain = generateTerrain(1, 0);
        const total = countTerrainBlocks(initialTerrain);
        setTerrainGrid(initialTerrain);
        terrainGridRef.current = initialTerrain;
        setTerrainTotal(total);
        setTerrainRemaining(total);
        setStageNumber(1);
        stageNumberRef.current = 1;

        setGameOver(false);
        setIsPaused(false);
        setIsPlaying(true);
        setHoldPiece(null);
        setCanHold(true);

        resetKeyStates();

        // Initialize seven-bag system
        const bag = shuffleBag();
        const type = bag[0];
        const next = bag[1];
        setPieceBag(bag.slice(2));

        setNextPiece(next);
        nextPieceRef.current = next;

        const shape = getShape(type, 0);
        const initialPiece: Piece = {
            type,
            rotation: 0,
            x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
            y: type === 'I' ? -2 : -1,
        };

        setCurrentPiece(initialPiece);
        currentPieceRef.current = initialPiece;
        lastGravityRef.current = performance.now();
    }, [resetKeyStates]);

    return {
        // State
        board,
        currentPiece,
        nextPiece,
        holdPiece,
        canHold,
        pieceBag,
        score,
        combo,
        lines,
        level,
        gameOver,
        isPaused,
        isPlaying,
        worldIdx,
        stageNumber,
        terrainGrid,
        terrainTotal,
        terrainRemaining,
        beatPhase,
        judgmentText,
        judgmentColor,
        showJudgmentAnim,
        boardBeat,
        boardShake,
        scorePop,
        das,
        arr,
        sdf,
        colorTheme,

        // Setters
        setBoard,
        setCurrentPiece,
        setNextPiece,
        setHoldPiece,
        setCanHold,
        setPieceBag,
        setScore,
        setCombo,
        setLines,
        setLevel,
        setGameOver,
        setIsPaused,
        setIsPlaying,
        setWorldIdx,
        setStageNumber,
        setTerrainGrid,
        setTerrainTotal,
        setTerrainRemaining,
        setBeatPhase,
        setBoardBeat,
        setDas,
        setArr,
        setSdf,
        setColorTheme,

        // Refs
        boardRef,
        currentPieceRef,
        nextPieceRef,
        pieceBagRef,
        holdPieceRef,
        canHoldRef,
        scoreRef,
        comboRef,
        linesRef,
        dasRef,
        arrRef,
        sdfRef,
        levelRef,
        gameOverRef,
        isPausedRef,
        worldIdxRef,
        stageNumberRef,
        terrainGridRef,
        beatPhaseRef,
        keyStatesRef,
        gameLoopRef,
        beatTimerRef,
        lastBeatRef,
        lastGravityRef,

        // Actions
        spawnPiece,
        showJudgment,
        updateScore,
        triggerBoardShake,
        resetKeyStates,
        initGame,
        destroyTerrain,
        startNewStage,
    };
}
