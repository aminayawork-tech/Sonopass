'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardSlide {
  front: React.ReactNode;
  back: React.ReactNode;
}

interface Props {
  cards: FlashcardSlide[];
  initialIndex?: number;
  onClose: () => void;
  accentColor?: string;
}

const SWIPE_THRESHOLD = 50;
const TAP_MOVE_LIMIT = 10;

export default function FullscreenFlashcard({ cards, initialIndex = 0, onClose, accentColor = '#3abc83' }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [flipped, setFlipped] = useState(false);
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchMovedX = useRef(0);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const goTo = (next: number, dir: 'left' | 'right') => {
    if (next < 0 || next >= cards.length) return;
    setAnimDir(dir);
    setFlipped(false);
    setTimeout(() => {
      setIndex(next);
      setAnimDir(null);
    }, 180);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMovedX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchMovedX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchMovedX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) < TAP_MOVE_LIMIT && Math.abs(dy) < TAP_MOVE_LIMIT) {
      // Tap — flip
      setFlipped(f => !f);
    } else if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx < 0) goTo(index + 1, 'left');
      else goTo(index - 1, 'right');
    }
  };

  const card = cards[index];
  const slideClass = animDir === 'left'
    ? 'translate-x-[-8%] opacity-0'
    : animDir === 'right'
    ? 'translate-x-[8%] opacity-0'
    : 'translate-x-0 opacity-100';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-safe-top pt-4 pb-3 shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20"
        >
          <X size={18} className="text-white" />
        </button>

        <span className="text-white/60 text-[13px] font-medium tabular-nums">
          {index + 1} / {cards.length}
        </span>

        <button
          onClick={() => setFlipped(f => !f)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20"
        >
          <RotateCcw size={16} className="text-white" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 mx-5 rounded-full bg-white/10 shrink-0 mb-4">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / cards.length) * 100}%`, backgroundColor: accentColor }}
        />
      </div>

      {/* Hint */}
      <p className="text-center text-white/30 text-[12px] mb-3 shrink-0">
        {flipped ? 'Tap to flip back · swipe to navigate' : 'Tap to flip · swipe to navigate'}
      </p>

      {/* Card area */}
      <div
        className="flex-1 mx-4 mb-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => setFlipped(f => !f)}
        style={{ cursor: 'pointer' }}
      >
        <div
          className={`w-full h-full transition-all duration-200 ${slideClass}`}
          style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
        >
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-3xl flex items-center justify-center p-6 overflow-y-auto"
              style={{
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(145deg, #1e2a3a, #0f1923)',
                border: `1px solid ${accentColor}30`,
              }}
            >
              {card?.front}
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl flex items-start p-6 overflow-y-auto"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: `linear-gradient(145deg, ${accentColor}18, ${accentColor}08)`,
                border: `1px solid ${accentColor}50`,
              }}
            >
              {card?.back}
            </div>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between px-5 pb-safe-bottom pb-8 shrink-0 gap-4">
        <button
          onClick={() => goTo(index - 1, 'right')}
          disabled={index === 0}
          className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 bg-white/8 border border-white/10 disabled:opacity-30 active:bg-white/15 transition-colors"
        >
          <ChevronLeft size={18} className="text-white" />
          <span className="text-white text-[14px] font-medium">Previous</span>
        </button>

        <button
          onClick={() => goTo(index + 1, 'left')}
          disabled={index === cards.length - 1}
          className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-30"
          style={{ backgroundColor: accentColor }}
        >
          <span className="text-white text-[14px] font-bold">Next</span>
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
