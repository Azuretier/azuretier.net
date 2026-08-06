import { describe, expect, it } from 'vitest';
import { resolveBattlePlacement } from '../multiplayer-battle-rules';

describe('resolveBattlePlacement', () => {
    it('uses beat timing for combo and score', () => {
        expect(resolveBattlePlacement(2, 'none', 'perfect', 2)).toEqual({
            combo: 3,
            score: 1800,
            garbage: 1,
        });
        expect(resolveBattlePlacement(2, 'none', 'miss', 8)).toEqual({
            combo: 0,
            score: 300,
            garbage: 1,
        });
    });

    it('does not add a garbage bonus for rhythm combos', () => {
        expect(resolveBattlePlacement(2, 'full', 'great', 5)).toEqual({
            combo: 6,
            score: 13500,
            garbage: 4,
        });
    });

    it.each([
        [1, 'none', 0], [2, 'none', 1], [3, 'none', 2], [4, 'none', 4],
        [1, 'mini', 0], [2, 'mini', 1],
        [1, 'full', 2], [2, 'full', 4], [3, 'full', 6],
    ] as const)('sends guideline garbage for %i cleared with %s T-spin', (cleared, tSpin, garbage) => {
        expect(resolveBattlePlacement(cleared, tSpin, 'good', 0).garbage).toBe(garbage);
    });

    it('adds the guideline back-to-back bonus for each difficult clear', () => {
        expect(resolveBattlePlacement(1, 'mini', 'good', 0, true).garbage).toBe(1);
        expect(resolveBattlePlacement(1, 'full', 'good', 0, true).garbage).toBe(3);
        expect(resolveBattlePlacement(2, 'full', 'good', 0, true).garbage).toBe(6);
        expect(resolveBattlePlacement(3, 'full', 'good', 0, true).garbage).toBe(9);
        expect(resolveBattlePlacement(4, 'none', 'good', 0, true).garbage).toBe(6);
    });

    it('adds ten garbage rows for a perfect clear', () => {
        expect(resolveBattlePlacement(1, 'none', 'good', 0, false, true).garbage).toBe(10);
        expect(resolveBattlePlacement(4, 'none', 'good', 0, false, true).garbage).toBe(14);
    });

    it('updates rhythm combo even when no line is cleared', () => {
        expect(resolveBattlePlacement(0, 'none', 'great', 3)).toEqual({
            combo: 4,
            score: 0,
            garbage: 0,
        });
    });
});
