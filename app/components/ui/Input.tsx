import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-semibold text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-4 py-3 bg-zinc-900/50 border-2 border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors ${className}`}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
