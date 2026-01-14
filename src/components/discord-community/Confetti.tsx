import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  rotation: number
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      'oklch(0.60 0.20 290)',
      'oklch(0.70 0.18 145)',
      'oklch(0.75 0.15 80)',
      'oklch(0.68 0.18 50)',
      'oklch(0.60 0.15 240)',
    ]

    const confettiPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    }))

    setPieces(confettiPieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${piece.left}%`,
            top: -20,
            backgroundColor: piece.color,
            rotate: piece.rotation
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [1, 1, 0],
            rotate: piece.rotation + 720
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}
