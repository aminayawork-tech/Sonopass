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
  const lastTouchTime = useRef(0);

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
    lastTouchTime.current = Date.now();
    const dx = touchMovedX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) < TAP_MOVE_LIMIT && Math.abs(dy) < TAP_MOVE_LIMIT) {
      setFlipped(f => !f);
    } else if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(index + 1, 'left');
      else goTo(index - 1, 'right');
    }
  };

  const handleCardClick = () => {
    // Ignore the ghost click the browser fires ~300ms after a touch event
    if (Date.now() - lastTouchTime.current < 600) return;
    setFlipped(f => !f);
  };

  const card = cards[index];
  const slideClass = animDir === 'left'
    ? 'translate-x-[-8%] opacity-0'
    : animDir === 'right'
    ? 'translate-x-[8%] opacity-0'
    : 'translate-x-0 opacity-100';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 active:bg-gray-50"
        >
          <X size={18} className="text-gray-600" />
        </button>

        <span className="text-gray-400 text-[13px] font-medium tabular-nums">
          {index + 1} / {cards.length}
        </span>

        <button
          onClick={() => setFlipped(f => !f)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 active:bg-gray-50"
        >
          <RotateCcw size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 mx-5 rounded-full bg-gray-200 shrink-0 mb-4">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / cards.length) * 100}%`, backgroundColor: accentColor }}
        />
      </div>

      {/* Hint */}
      <p className="text-center text-gray-400 text-[12px] mb-3 shrink-0">
        {flipped ? 'Tap to flip back · swipe to navigate' : 'Tap to flip · swipe to navigate'}
      </p>

      {/* Card area */}
      <div
        className="flex-1 mx-4 mb-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleCardClick}
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
              className="absolute inset-0 rounded-3xl flex items-center justify-center p-6 overflow-y-auto bg-white shadow-sm border border-gray-100"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {card?.front}
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl flex items-start p-6 overflow-y-auto shadow-sm"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: '#fff',
                borderTop: `4px solid ${accentColor}`,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {card?.back}
            </div>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between px-5 pb-8 shrink-0 gap-4">
        <button
          onClick={() => goTo(index - 1, 'right')}
          disabled={index === 0}
          className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 bg-white border border-gray-200 shadow-sm disabled:opacity-30 active:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-600" />
          <span className="text-gray-700 text-[14px] font-medium">Previous</span>
        </button>

        <button
          onClick={() => goTo(index + 1, 'left')}
          disabled={index === cards.length - 1}
          className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 shadow-sm active:opacity-80 transition-opacity disabled:opacity-30"
          style={{ backgroundColor: accentColor }}
        >
          <span className="text-white text-[14px] font-bold">Next</span>
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
