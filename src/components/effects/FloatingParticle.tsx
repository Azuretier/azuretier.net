'use client';

import React, { useEffect, useRef } from 'react';
import styles from './FloatingParticle.module.css';

export interface FloatingParticleProps {
  x: number;
  y: number;
  color: string;
  size?: number;
  count?: number;
  duration?: number;
  spread?: number;
  onComplete?: () => void;
}

export const FloatingParticle: React.FC<FloatingParticleProps> = ({
  x,
  y,
  color,
  size = 8,
  count = 8,
  duration = 500,
  spread = 60,
  onComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = styles.particle;
      
      const particleSize = size + Math.random() * 5;
      const angle = (Math.PI * 2 / count) * i;
      const distance = spread + Math.random() * (spread / 2);
      
      particle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background: ${color};
        box-shadow: 0 0 10px ${color};
        transition: all ${duration}ms ease-out;
      `;
      
      document.body.appendChild(particle);
      particles.push(particle);
      
      requestAnimationFrame(() => {
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
        particle.style.opacity = '0';
      });
    }

    const timer = setTimeout(() => {
      particles.forEach(p => p.remove());
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer);
      particles.forEach(p => p.remove());
    };
  }, [x, y, color, size, count, duration, spread, onComplete]);

  return <div ref={containerRef} />;
};

export const spawnFloatingParticles = (
  x: number,
  y: number,
  color: string,
  options?: Partial<Omit<FloatingParticleProps, 'x' | 'y' | 'color'>>
) => {
  const {
    count = 8,
    size = 8,
    duration = 500,
    spread = 60
  } = options || {};

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      pointer-events: none;
      border-radius: 50%;
      z-index: 9999;
      left: ${x}px;
      top: ${y}px;
      width: ${size + Math.random() * 5}px;
      height: ${size + Math.random() * 5}px;
      background: ${color};
      box-shadow: 0 0 10px ${color};
      transition: all ${duration}ms ease-out;
    `;
    
    const angle = (Math.PI * 2 / count) * i;
    const distance = spread + Math.random() * (spread / 2);
    
    document.body.appendChild(particle);
    
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
      particle.style.opacity = '0';
    });
    
    setTimeout(() => particle.remove(), duration);
  }
};

export default FloatingParticle;
