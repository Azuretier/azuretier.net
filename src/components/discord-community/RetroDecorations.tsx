import { useEffect, useState } from 'react'
import { Star, Sparkle, Heart, Smiley } from '@phosphor-icons/react'

export function RetroDecorations() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([])

  useEffect(() => {
    const starArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 16 + Math.random() * 16
    }))
    setStars(starArray)
  }, [])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animation: `star-twinkle 2s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          >
            <Star
              weight="fill"
              size={star.size}
              className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]"
            />
          </div>
        ))}
      </div>

      <div className="fixed top-4 left-4 pointer-events-none z-10">
        <div className="flex gap-2 items-center" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <Sparkle weight="fill" size={32} className="text-pink-500 sparkle" />
          <span className="text-2xl font-bold retro-text-shadow">Welcome!</span>
          <Sparkle weight="fill" size={32} className="text-cyan-400 sparkle" />
        </div>
      </div>

      <div className="fixed top-4 right-4 pointer-events-none z-10">
        <div style={{ animation: 'rotate 4s linear infinite' }}>
          <Smiley weight="fill" size={48} className="text-yellow-400 drop-shadow-[0_0_12px_rgba(255,255,0,1)]" />
        </div>
      </div>

      <div className="fixed bottom-4 left-4 pointer-events-none z-10 flex gap-2">
        <Heart weight="fill" size={24} className="text-red-500" style={{ animation: 'float 2s ease-in-out infinite' }} />
        <Heart weight="fill" size={32} className="text-pink-500" style={{ animation: 'float 2.5s ease-in-out infinite' }} />
        <Heart weight="fill" size={20} className="text-red-400" style={{ animation: 'float 3s ease-in-out infinite' }} />
      </div>

      <div className="fixed bottom-4 right-4 pointer-events-none z-10 flex gap-2">
        <Star weight="fill" size={28} className="text-purple-500" style={{ animation: 'rotate 3s linear infinite' }} />
        <Sparkle weight="fill" size={36} className="text-cyan-400" style={{ animation: 'star-twinkle 1.5s ease-in-out infinite' }} />
        <Star weight="fill" size={24} className="text-yellow-400" style={{ animation: 'rotate 4s linear infinite reverse' }} />
      </div>

      <div className="fixed bottom-1/4 left-0 right-0 pointer-events-none z-0 opacity-30">
        <div className="flex gap-8 text-3xl font-bold marquee">
          ⭐ Learn the Rules! ⭐ Earn Points! ⭐ Become a Master! ⭐ Join the Community! ⭐
        </div>
      </div>
    </>
  )
}
