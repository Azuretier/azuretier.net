import { describe, expect, it } from 'vitest';
import { distanceToSegment, selectProjectileTarget } from '../td-projectile-physics';
import type { Enemy } from '../types';

const enemy = (id: number, x: number, alive = true): Enemy => ({
    id, x, y: 0, z: 0, gridX: x, gridZ: 0, speed: 1, health: 10,
    maxHealth: 10, alive, spawnTime: 0, enemyType: 'zombie', armor: 0,
    garbageRows: 0, abilities: [], statusEffects: [], stealthBeatsLeft: 0, isBoss: false,
});

describe('tower projectile physics', () => {
    it('detects an enemy crossed between coarse simulation ticks', () => {
        expect(distanceToSegment({ x: 5, y: 0.2, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 })).toBeCloseTo(0.2);
    });

    it('retargets when the original target dies', () => {
        expect(selectProjectileTarget([enemy(1, 1, false), enemy(2, 4), enemy(3, 8)], 1, { x: 3, y: 0, z: 0 }, [])?.id).toBe(2);
    });

    it('does not select an enemy already hit by a piercing projectile', () => {
        expect(selectProjectileTarget([enemy(1, 1), enemy(2, 2)], 1, { x: 0, y: 0, z: 0 }, [1])?.id).toBe(2);
    });
});
