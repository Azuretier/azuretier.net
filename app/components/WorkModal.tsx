'use client';

import { useEffect } from 'react';

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  workUrl: string;
  title: string;
}

export default function WorkModal({ isOpen, onClose, workUrl, title }: WorkModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-[95%] h-[95%] max-w-[95vw] max-h-[95vh] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
          aria-label="Close modal"
        >
          ×
        </button>
        <iframe
          src={workUrl}
          title={title}
          className="h-full w-full rounded-lg border-2 border-white/10 bg-white shadow-2xl"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
