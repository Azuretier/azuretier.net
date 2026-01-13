import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-pink-500/50 hover:-translate-y-0.5',
    secondary: 'bg-zinc-800 border-2 border-zinc-700 text-white hover:bg-zinc-700 hover:border-zinc-600',
    ghost: 'bg-transparent border-2 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
