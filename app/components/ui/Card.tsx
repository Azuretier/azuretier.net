import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'cyan' | 'pink' | 'purple' | 'gold';
}

export function Card({ children, className = '', gradient }: CardProps) {
  const gradientClasses = {
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50',
    pink: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 hover:border-pink-500/50',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/50',
    gold: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/50',
  };

  const baseClasses = 'rounded-2xl bg-gradient-to-br border-2 p-6 transition-all backdrop-blur-sm';
  const gradientClass = gradient ? gradientClasses[gradient] : 'from-zinc-800/50 to-zinc-900/50 border-zinc-700/50';

  return (
    <div className={`${baseClasses} ${gradientClass} ${className}`}>
      {children}
    </div>
  );
}
