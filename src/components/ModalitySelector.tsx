'use client';

import { useState } from 'react';
import {
  ChevronDown, Check, Heart, Activity, AudioWaveform, Scan, Baby, HeartPulse, Ribbon, Smile, Bone, type LucideIcon,
} from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import GradientIcon, { type GradientName } from '@/components/GradientIcon';

const ICONS: Record<string, { icon: LucideIcon; gradient: GradientName }> = {
  heart: { icon: Heart, gradient: 'rose' },
  activity: { icon: Activity, gradient: 'blue' },
  scanner: { icon: Scan, gradient: 'violet' },
  baby: { icon: Baby, gradient: 'orange' },
  heartPulse: { icon: HeartPulse, gradient: 'rose' },
  ribbon: { icon: Ribbon, gradient: 'indigo' },
  smile: { icon: Smile, gradient: 'amber' },
  bone: { icon: Bone, gradient: 'cyan' },
};

const MODALITY_STYLE: Record<string, { icon: LucideIcon; gradient: GradientName }> = {
  vascular: { icon: Activity, gradient: 'emerald' },
  spi: { icon: AudioWaveform, gradient: 'blue' },
  'fetal-echo': { icon: Heart, gradient: 'violet' },
};

function styleFor(modality: { id: string; icon: string }) {
  return MODALITY_STYLE[modality.id] ?? ICONS[modality.icon] ?? { icon: Heart, gradient: 'emerald' as GradientName };
}

// Header button showing the current registry; opens a sheet listing all registries
export function ModalitySelectorDropdown() {
  const { currentModality, allModalities, switchModality } = useModality();
  const [isOpen, setIsOpen] = useState(false);
  const enabled = allModalities.filter((m) => m.enabled);

  if (!currentModality || enabled.length <= 1) return null;

  const current = styleFor(currentModality);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="surface inline-flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full active:scale-[0.98] transition-transform"
        aria-haspopup="dialog"
      >
        <GradientIcon icon={current.icon} gradient={current.gradient} size={30} />
        <span className="text-[14px] font-bold text-ink">{currentModality.shortName}</span>
        <ChevronDown size={16} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40" />
          <div
            role="dialog"
            aria-label="Choose your registry exam"
            className="relative w-full max-w-lg bg-white rounded-t-[28px] px-5 pt-3 slide-up"
            style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-4" />
            <p className="eyebrow">Registry exam</p>
            <p className="text-[19px] font-extrabold text-ink tracking-tight mt-1 mb-4">What are you studying for?</p>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto -mx-1 px-1 pb-1">
              {enabled.map((modality) => {
                const s = styleFor(modality);
                const active = modality.id === currentModality.id;
                return (
                  <button
                    key={modality.id}
                    onClick={() => {
                      switchModality(modality.id);
                      setIsOpen(false);
                    }}
                    className={`surface rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform ${active ? 'ring-2 ring-[#2ea873]' : ''}`}
                  >
                    <GradientIcon icon={s.icon} gradient={s.gradient} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14.5px] font-bold text-ink leading-tight">{modality.name}</p>
                      <p className="text-[12px] text-slate-400 font-medium mt-0.5">{modality.questionCount} questions</p>
                    </div>
                    {active && (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#2ea873' }}>
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
