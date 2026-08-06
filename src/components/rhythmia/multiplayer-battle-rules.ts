import { getBeatMultiplier, type BeatJudgment } from './tetris/utils';

export type TSpinResult = 'none' | 'mini' | 'full';

export interface BattlePlacementResult {
    combo: number;
    score: number;
    garbage: number;
}

/**
 * Resolve the competitive consequences of locking a piece. Keeping this pure
 * lets human and AI competitors use exactly the same rhythm, scoring, combo,
 * T-spin, and garbage rules.
 */
export function resolveBattlePlacement(
    cleared: number,
    tSpin: TSpinResult,
    timing: BeatJudgment,
    previousCombo: number,
    backToBack = false,
    perfectClear = false,
): BattlePlacementResult {
    const combo = timing === 'miss' ? 0 : previousCombo + 1;

    if (cleared === 0) {
        return { combo, score: 0, garbage: 0 };
    }

    let base = [0, 100, 300, 500, 800][cleared] ?? 0;
    if (tSpin === 'full') {
        base += 400 + 400 * cleared;
    } else if (tSpin === 'mini') {
        base += 100 + 200 * cleared;
    }

    let garbage: number;
    if (tSpin === 'full') {
        garbage = [0, 2, 4, 6][cleared] ?? 0;
    } else if (tSpin === 'mini') {
        garbage = [0, 0, 1][cleared] ?? 0;
    } else {
        garbage = [0, 0, 1, 2, 4][cleared] ?? 0;
    }

    if (backToBack) {
        if (tSpin === 'full' && cleared === 3) {
            garbage += 3;
        } else if ((tSpin === 'full' && cleared === 2) || (tSpin === 'none' && cleared === 4)) {
            garbage += 2;
        } else {
            garbage += 1;
        }
    }

    if (perfectClear) garbage += 10;

    return {
        combo,
        score: base * getBeatMultiplier(timing) * Math.max(1, combo),
        garbage,
    };
}
