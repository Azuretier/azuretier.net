'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnimeCharacter.module.css';

interface AnimeCharacterProps {
  size?: number;
  className?: string;
}

export default function AnimeCharacter({ size = 420, className }: AnimeCharacterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [expression, setExpression] = useState<'idle' | 'happy'>('idle');

  const handleClick = () => {
    setExpression('happy');
    setTimeout(() => setExpression('idle'), 2000);
  };

  return (
    <motion.div
      className={`${styles.characterWrapper} ${className || ''}`}
      style={{ width: size, height: size * 1.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Ambient glow behind character */}
      <div className={styles.ambientGlow} />

      {/* Floating sparkle particles */}
      <div className={styles.sparkles}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={styles.sparkle}
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main character SVG */}
      <motion.div
        className={styles.characterContainer}
        animate={{
          y: isHovered ? -8 : [0, -6, 0],
        }}
        transition={
          isHovered
            ? { duration: 0.3 }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg
          viewBox="0 0 400 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.characterSvg}
        >
          <defs>
            {/* Hair gradient - azure blue theme */}
            <linearGradient id="hairGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60B8FF" />
              <stop offset="40%" stopColor="#007FFF" />
              <stop offset="100%" stopColor="#3A3ADB" />
            </linearGradient>
            <linearGradient id="hairHighlight" x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#B0DFFF" />
              <stop offset="100%" stopColor="#60B8FF" stopOpacity="0" />
            </linearGradient>

            {/* Eye gradient */}
            <radialGradient id="eyeGradient" cx="0.5" cy="0.4" r="0.5">
              <stop offset="0%" stopColor="#00CFFF" />
              <stop offset="50%" stopColor="#007FFF" />
              <stop offset="100%" stopColor="#1A1A6E" />
            </radialGradient>
            <radialGradient id="eyeShine" cx="0.35" cy="0.3" r="0.25">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            {/* Outfit gradients */}
            <linearGradient id="outfitGradient" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#1A1A2E" />
              <stop offset="50%" stopColor="#16213E" />
              <stop offset="100%" stopColor="#0F3460" />
            </linearGradient>
            <linearGradient id="outfitAccent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#007FFF" />
              <stop offset="100%" stopColor="#00CFFF" />
            </linearGradient>
            <linearGradient id="skirtGradient" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#16213E" />
              <stop offset="100%" stopColor="#0A1628" />
            </linearGradient>

            {/* Skin gradient */}
            <linearGradient id="skinGradient" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#FFE8D6" />
              <stop offset="100%" stopColor="#FFDBC4" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* === HAIR - Back layer (long flowing hair) === */}
          <g className={styles.hairBack}>
            {/* Main back hair mass */}
            <path
              d="M120 120 C100 140, 80 200, 85 280 C88 340, 95 400, 80 460 C78 475, 82 490, 95 495 C110 500, 120 480, 125 440 C130 400, 128 340, 130 280 L130 200 Z"
              fill="url(#hairGradient)"
              opacity="0.85"
            />
            <path
              d="M280 120 C300 140, 320 200, 315 280 C312 340, 305 400, 320 460 C322 475, 318 490, 305 495 C290 500, 280 480, 275 440 C270 400, 272 340, 270 280 L270 200 Z"
              fill="url(#hairGradient)"
              opacity="0.85"
            />
            {/* Middle back hair */}
            <path
              d="M145 170 C140 220, 135 300, 140 380 C142 420, 138 460, 145 480 C150 490, 158 485, 155 460 C152 430, 155 360, 155 300 L150 200 Z"
              fill="url(#hairGradient)"
              opacity="0.7"
            />
            <path
              d="M255 170 C260 220, 265 300, 260 380 C258 420, 262 460, 255 480 C250 490, 242 485, 245 460 C248 430, 245 360, 245 300 L250 200 Z"
              fill="url(#hairGradient)"
              opacity="0.7"
            />
          </g>

          {/* === BODY === */}
          <g>
            {/* Neck */}
            <path
              d="M185 195 L185 220 C185 228, 215 228, 215 220 L215 195"
              fill="url(#skinGradient)"
            />

            {/* Shoulders and torso */}
            <path
              d="M145 230 C155 220, 175 218, 185 220 L215 220 C225 218, 245 220, 255 230 L265 250 C268 260, 265 275, 260 290 L258 340 C256 360, 245 375, 235 380 L165 380 C155 375, 144 360, 142 340 L140 290 C135 275, 132 260, 135 250 Z"
              fill="url(#outfitGradient)"
              stroke="rgba(0,127,255,0.3)"
              strokeWidth="0.5"
            />

            {/* Outfit collar / neckline detail */}
            <path
              d="M170 225 L200 248 L230 225"
              fill="none"
              stroke="url(#outfitAccent)"
              strokeWidth="1.5"
              opacity="0.8"
            />
            {/* Collar V detail */}
            <path
              d="M180 222 L200 240 L220 222"
              fill="rgba(0,127,255,0.1)"
              stroke="url(#outfitAccent)"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Outfit chest accent lines */}
            <path
              d="M165 260 C175 255, 190 252, 200 252 C210 252, 225 255, 235 260"
              fill="none"
              stroke="url(#outfitAccent)"
              strokeWidth="0.8"
              opacity="0.5"
            />

            {/* Center gem/brooch */}
            <circle cx="200" cy="242" r="4" fill="url(#outfitAccent)" filter="url(#glow)" />
            <circle cx="200" cy="242" r="2" fill="#FFFFFF" opacity="0.8" />

            {/* Belt / waist detail */}
            <path
              d="M152 335 L248 335"
              stroke="url(#outfitAccent)"
              strokeWidth="2"
              opacity="0.6"
            />
            <rect x="192" y="330" width="16" height="10" rx="2" fill="url(#outfitAccent)" opacity="0.7" />
            <rect x="196" y="333" width="8" height="4" rx="1" fill="#FFFFFF" opacity="0.5" />

            {/* Side accent stripes */}
            <path
              d="M148 260 L142 335"
              stroke="url(#outfitAccent)"
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M252 260 L258 335"
              stroke="url(#outfitAccent)"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>

          {/* === SKIRT === */}
          <g>
            <path
              d="M148 338 C145 360, 125 420, 115 460 C112 472, 118 478, 128 475 L155 468 C160 466, 165 460, 168 450 L180 400 L200 465 L220 400 L232 450 C235 460, 240 466, 245 468 L272 475 C282 478, 288 472, 285 460 C275 420, 255 360, 252 338 Z"
              fill="url(#skirtGradient)"
              stroke="rgba(0,127,255,0.2)"
              strokeWidth="0.5"
            />
            {/* Skirt pleat lines */}
            <path d="M170 345 L155 468" stroke="rgba(0,127,255,0.15)" strokeWidth="0.8" />
            <path d="M200 345 L200 465" stroke="rgba(0,127,255,0.15)" strokeWidth="0.8" />
            <path d="M230 345 L245 468" stroke="rgba(0,127,255,0.15)" strokeWidth="0.8" />

            {/* Skirt edge glow */}
            <path
              d="M115 460 C125 465, 160 470, 200 465 C240 470, 275 465, 285 460"
              fill="none"
              stroke="url(#outfitAccent)"
              strokeWidth="1"
              opacity="0.3"
            />
          </g>

          {/* === ARMS === */}
          <g>
            {/* Left arm */}
            <path
              d="M140 245 C128 255, 118 280, 115 300 C112 320, 115 345, 120 360 C122 366, 128 368, 130 362 L135 340 C138 320, 140 300, 142 280 Z"
              fill="url(#outfitGradient)"
              stroke="rgba(0,127,255,0.2)"
              strokeWidth="0.5"
            />
            {/* Left hand */}
            <path
              d="M120 358 C116 365, 114 372, 118 376 C122 380, 128 378, 132 372 C134 368, 132 364, 130 362"
              fill="url(#skinGradient)"
            />
            {/* Left arm accent */}
            <path
              d="M132 270 L126 340"
              stroke="url(#outfitAccent)"
              strokeWidth="0.8"
              opacity="0.4"
            />

            {/* Right arm */}
            <path
              d="M260 245 C272 255, 282 280, 285 300 C288 320, 285 345, 280 360 C278 366, 272 368, 270 362 L265 340 C262 320, 260 300, 258 280 Z"
              fill="url(#outfitGradient)"
              stroke="rgba(0,127,255,0.2)"
              strokeWidth="0.5"
            />
            {/* Right hand */}
            <path
              d="M280 358 C284 365, 286 372, 282 376 C278 380, 272 378, 268 372 C266 368, 268 364, 270 362"
              fill="url(#skinGradient)"
            />
            {/* Right arm accent */}
            <path
              d="M268 270 L274 340"
              stroke="url(#outfitAccent)"
              strokeWidth="0.8"
              opacity="0.4"
            />
          </g>

          {/* === LEGS === */}
          <g>
            {/* Left leg */}
            <path
              d="M168 450 C165 465, 162 485, 165 500 C166 508, 172 510, 175 505 L178 490 C180 478, 178 462, 175 450"
              fill="#0A1628"
              stroke="rgba(0,127,255,0.15)"
              strokeWidth="0.5"
            />
            {/* Right leg */}
            <path
              d="M232 450 C235 465, 238 485, 235 500 C234 508, 228 510, 225 505 L222 490 C220 478, 222 462, 225 450"
              fill="#0A1628"
              stroke="rgba(0,127,255,0.15)"
              strokeWidth="0.5"
            />
          </g>

          {/* === HEAD === */}
          <g>
            {/* Face shape */}
            <path
              d="M160 130 C160 100, 170 75, 200 70 C230 75, 240 100, 240 130 L240 175 C240 200, 225 210, 200 212 C175 210, 160 200, 160 175 Z"
              fill="url(#skinGradient)"
            />

            {/* Blush */}
            <AnimatePresence>
              {expression === 'happy' && (
                <>
                  <motion.ellipse
                    cx="170" cy="172" rx="12" ry="6"
                    fill="#FF8A8A"
                    opacity={0}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.ellipse
                    cx="230" cy="172" rx="12" ry="6"
                    fill="#FF8A8A"
                    opacity={0}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* === EYES === */}
            <g>
              {/* Left eye */}
              <g>
                {/* Eye white */}
                <ellipse cx="178" cy="155" rx="16" ry="18" fill="#FFFFFF" />
                {/* Iris */}
                <ellipse cx="178" cy="157" rx="11" ry="13" fill="url(#eyeGradient)">
                  {expression === 'happy' && (
                    <animate attributeName="ry" values="13;8;13" dur="0.3s" fill="freeze" />
                  )}
                </ellipse>
                {/* Pupil */}
                <ellipse cx="178" cy="158" rx="5" ry="6" fill="#0A0A2E" />
                {/* Eye shine - large */}
                <ellipse cx="173" cy="151" rx="4" ry="5" fill="#FFFFFF" opacity="0.9" />
                {/* Eye shine - small */}
                <ellipse cx="183" cy="161" rx="2" ry="2.5" fill="#FFFFFF" opacity="0.6" />
                {/* Upper eyelid line */}
                <path
                  d="M162 145 C166 138, 178 134, 194 145"
                  fill="none"
                  stroke="#2A2A4E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Eyelashes */}
                <path
                  d="M162 145 C159 140, 158 136, 160 132"
                  fill="none"
                  stroke="#2A2A4E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M194 145 C197 140, 198 136, 196 132"
                  fill="none"
                  stroke="#2A2A4E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Right eye */}
              <g>
                {/* Eye white */}
                <ellipse cx="222" cy="155" rx="16" ry="18" fill="#FFFFFF" />
                {/* Iris */}
                <ellipse cx="222" cy="157" rx="11" ry="13" fill="url(#eyeGradient)">
                  {expression === 'happy' && (
                    <animate attributeName="ry" values="13;8;13" dur="0.3s" fill="freeze" />
                  )}
                </ellipse>
                {/* Pupil */}
                <ellipse cx="222" cy="158" rx="5" ry="6" fill="#0A0A2E" />
                {/* Eye shine - large */}
                <ellipse cx="217" cy="151" rx="4" ry="5" fill="#FFFFFF" opacity="0.9" />
                {/* Eye shine - small */}
                <ellipse cx="227" cy="161" rx="2" ry="2.5" fill="#FFFFFF" opacity="0.6" />
                {/* Upper eyelid line */}
                <path
                  d="M206 145 C210 138, 222 134, 238 145"
                  fill="none"
                  stroke="#2A2A4E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Eyelashes */}
                <path
                  d="M206 145 C203 140, 202 136, 204 132"
                  fill="none"
                  stroke="#2A2A4E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M238 145 C241 140, 242 136, 240 132"
                  fill="none"
                  stroke="#2A2A4E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Nose (subtle) */}
            <path
              d="M198 172 L200 178 L202 175"
              fill="none"
              stroke="#E8C4B0"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Mouth */}
            {expression === 'idle' ? (
              <path
                d="M192 188 C196 192, 204 192, 208 188"
                fill="none"
                stroke="#D4928A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M190 186 C195 194, 205 194, 210 186"
                fill="#F0A0A0"
                stroke="#D4928A"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              />
            )}

            {/* Eyebrows */}
            <path
              d="M164 134 C170 129, 182 128, 190 132"
              fill="none"
              stroke="#4A7FBF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M210 132 C218 128, 230 129, 236 134"
              fill="none"
              stroke="#4A7FBF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>

          {/* === HAIR - Front layer === */}
          <g className={styles.hairFront}>
            {/* Main bangs - center */}
            <path
              d="M155 72 C160 50, 180 35, 200 32 C220 35, 240 50, 245 72 L248 100 C248 108, 240 120, 230 128 L225 140 C222 146, 218 145, 220 138 L224 120 C226 110, 228 100, 225 85 L200 80 L175 85 C172 100, 174 110, 176 120 L180 138 C182 145, 178 146, 175 140 L170 128 C160 120, 152 108, 152 100 Z"
              fill="url(#hairGradient)"
            />

            {/* Left side bangs */}
            <path
              d="M155 72 C148 65, 138 70, 132 85 C126 100, 120 120, 118 140 C116 155, 120 160, 126 155 C130 150, 135 135, 140 118 C145 100, 150 85, 155 80 Z"
              fill="url(#hairGradient)"
            />

            {/* Right side bangs */}
            <path
              d="M245 72 C252 65, 262 70, 268 85 C274 100, 280 120, 282 140 C284 155, 280 160, 274 155 C270 150, 265 135, 260 118 C255 100, 250 85, 245 80 Z"
              fill="url(#hairGradient)"
            />

            {/* Hair part highlight (center) */}
            <path
              d="M190 38 C195 36, 205 36, 210 38 L208 60 C205 65, 195 65, 192 60 Z"
              fill="url(#hairHighlight)"
              opacity="0.5"
            />

            {/* Strand highlights */}
            <path
              d="M165 75 C168 85, 170 100, 172 115"
              fill="none"
              stroke="url(#hairHighlight)"
              strokeWidth="2"
              opacity="0.4"
            />
            <path
              d="M235 75 C232 85, 230 100, 228 115"
              fill="none"
              stroke="url(#hairHighlight)"
              strokeWidth="2"
              opacity="0.4"
            />

            {/* Small ahoge (antenna hair) */}
            <path
              d="M200 32 C198 20, 205 8, 215 5 C220 4, 218 10, 212 16 C208 20, 203 28, 200 32"
              fill="url(#hairGradient)"
              className={styles.ahoge}
            />
          </g>

          {/* === HAIR ACCESSORIES === */}
          <g>
            {/* Left hair clip */}
            <g transform="translate(135, 100) rotate(-15)">
              <rect x="-3" y="-8" width="6" height="16" rx="2" fill="url(#outfitAccent)" filter="url(#glow)" />
              <rect x="-1.5" y="-6" width="3" height="12" rx="1" fill="#FFFFFF" opacity="0.4" />
            </g>

            {/* Right hair clip */}
            <g transform="translate(265, 100) rotate(15)">
              <rect x="-3" y="-8" width="6" height="16" rx="2" fill="url(#outfitAccent)" filter="url(#glow)" />
              <rect x="-1.5" y="-6" width="3" height="12" rx="1" fill="#FFFFFF" opacity="0.4" />
            </g>
          </g>

          {/* === DECORATIVE ELEMENTS === */}
          <g className={styles.decorations} filter="url(#glow)">
            {/* Floating star near right */}
            <path
              d="M310 120 L313 128 L322 128 L315 133 L318 142 L310 137 L302 142 L305 133 L298 128 L307 128 Z"
              fill="url(#outfitAccent)"
              opacity="0.6"
              className={styles.floatStar1}
            />
            {/* Small diamond left */}
            <path
              d="M85 180 L90 188 L85 196 L80 188 Z"
              fill="url(#outfitAccent)"
              opacity="0.4"
              className={styles.floatStar2}
            />
            {/* Tiny star */}
            <circle cx="330" cy="200" r="2" fill="#00CFFF" opacity="0.5" className={styles.floatStar3} />
            <circle cx="70" cy="140" r="1.5" fill="#60B8FF" opacity="0.4" className={styles.floatStar2} />
          </g>
        </svg>
      </motion.div>

      {/* Hover effect text */}
      <AnimatePresence>
        {expression === 'happy' && (
          <motion.div
            className={styles.speechBubble}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.speechText}>
              {String.fromCodePoint(0x2727)} ようこそ！ {String.fromCodePoint(0x2727)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
