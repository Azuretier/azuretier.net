import type { Enemy } from './types';

export type Point3 = { x: number; y: number; z: number };

/** Distance from a point to a finite flight segment (not its infinite line). */
export function distanceToSegment(point: Point3, start: Point3, end: Point3): number {
    const abx = end.x - start.x;
    const aby = end.y - start.y;
    const abz = end.z - start.z;
    const lengthSquared = abx * abx + aby * aby + abz * abz;
    if (lengthSquared === 0) {
        return Math.hypot(point.x - start.x, point.y - start.y, point.z - start.z);
    }

    const projection = Math.max(0, Math.min(1,
        ((point.x - start.x) * abx + (point.y - start.y) * aby + (point.z - start.z) * abz) / lengthSquared,
    ));
    return Math.hypot(
        point.x - (start.x + abx * projection),
        point.y - (start.y + aby * projection),
        point.z - (start.z + abz * projection),
    );
}

/** Prefer the original target, then the living enemy closest to the projectile. */
export function selectProjectileTarget(
    enemies: Enemy[],
    targetId: number,
    position: Point3,
    excludedIds: readonly number[],
): Enemy | undefined {
    const canHit = (enemy: Enemy) => enemy.alive && !excludedIds.includes(enemy.id);
    const original = enemies.find(enemy => enemy.id === targetId && canHit(enemy));
    if (original) return original;

    return enemies.filter(canHit).reduce<Enemy | undefined>((best, enemy) => {
        if (!best) return enemy;
        const enemyDistance = Math.hypot(enemy.x - position.x, enemy.y - position.y, enemy.z - position.z);
        const bestDistance = Math.hypot(best.x - position.x, best.y - position.y, best.z - position.z);
        return enemyDistance < bestDistance ? enemy : best;
    }, undefined);
}
