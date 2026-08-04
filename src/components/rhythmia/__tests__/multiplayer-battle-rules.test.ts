import { describe, expect, it } from 'vitest';
import { resolveBattlePlacement } from '../multiplayer-battle-rules';

describe('resolveBattlePlacement', () => {
    it('uses beat timing for combo and score', () => {
        expect(resolveBattlePlacement(2, 'none', 'perfect', 2)).toEqual({
            combo: 3,
            score: 1800,
            garbage: 2,
        });
        expect(resolveBattlePlacement(2, 'none', 'miss', 8)).toEqual({
            combo: 0,
            score: 300,
            garbage: 1,
        });
    });

    it('applies the same T-spin and combo garbage bonuses', () => {
        expect(resolveBattlePlacement(2, 'full', 'great', 5)).toEqual({
            combo: 6,
            score: 13500,
            garbage: 7,
        });
    });

    it('updates rhythm combo even when no line is cleared', () => {
        expect(resolveBattlePlacement(0, 'none', 'great', 3)).toEqual({
            combo: 4,
            score: 0,
            garbage: 0,
        });
    });
});
