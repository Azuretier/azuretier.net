'use client';

import React from 'react';
import styles from '../VanillaGame.module.css';
import { MAX_HEALTH, MAX_MANA } from '../constants';

interface HealthManaHUDProps {
  health: number;
  mana: number;
  combo: number;
}

/**
 * Health and Mana globe-style HUD inspired by Minecraft Dungeons / Path of Exile.
 * Two orbs at the bottom-left and bottom-right of the screen with fill animation.
 */
export function HealthManaHUD({ health, mana, combo }: HealthManaHUDProps) {
  const healthPct = Math.max(0, Math.min(100, (health / MAX_HEALTH) * 100));
  const manaPct = Math.max(0, Math.min(100, (mana / MAX_MANA) * 100));

  const healthColor = healthPct > 50 ? '#e53935' : healthPct > 25 ? '#ff6f00' : '#b71c1c';
  const manaColor = '#1565c0';

  const isFever = combo >= 10;

  return (
    <div className={styles.hudContainer}>
      {/* Health Globe */}
      <div className={styles.hudGlobe}>
        <div className={styles.hudGlobeFrame}>
          <div className={styles.hudGlobeInner}>
            <div
              className={`${styles.hudGlobeFill} ${styles.hudHealthFill}`}
              style={{
                height: `${healthPct}%`,
                background: `linear-gradient(0deg, ${healthColor}, ${healthPct > 50 ? '#ef5350' : '#ff8a65'})`,
              }}
            />
            <div className={styles.hudGlobeShine} />
            {healthPct < 30 && <div className={styles.hudGlobeLowPulse} />}
          </div>
          <div className={styles.hudGlobeOrnament} />
        </div>
        <div className={styles.hudGlobeLabel}>
          <span className={styles.hudGlobeValue}>{Math.ceil(health)}</span>
          <span className={styles.hudGlobeCaption}>HP</span>
        </div>
      </div>

      {/* Center decorative chain */}
      <div className={styles.hudCenterChain}>
        <div className={styles.hudChainLink} />
        <div className={styles.hudChainLink} />
        <div className={styles.hudChainLink} />
        {isFever && <div className={styles.hudFeverGem} />}
      </div>

      {/* Mana Globe */}
      <div className={styles.hudGlobe}>
        <div className={`${styles.hudGlobeFrame} ${styles.hudManaFrame}`}>
          <div className={styles.hudGlobeInner}>
            <div
              className={`${styles.hudGlobeFill} ${styles.hudManaFill}`}
              style={{
                height: `${manaPct}%`,
                background: `linear-gradient(0deg, ${manaColor}, #42a5f5)`,
              }}
            />
            <div className={styles.hudGlobeShine} />
          </div>
          <div className={`${styles.hudGlobeOrnament} ${styles.hudManaOrnament}`} />
        </div>
        <div className={styles.hudGlobeLabel}>
          <span className={styles.hudGlobeValue}>{Math.ceil(mana)}</span>
          <span className={styles.hudGlobeCaption}>MP</span>
        </div>
      </div>
    </div>
  );
}
