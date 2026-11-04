'use client';

import Link from 'next/link';
import { Timer, BookOpen, Flag, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration, registryPace } from '@/lib/examSession';
import GradientIcon from '@/components/GradientIcon';

export function ExamStartScreen({
  title,
  questionCount,
  limitSeconds,
  modality,
  timed,
  onChangeTimed,
  onStart,
}: {
  title: string;
  questionCount: number;
  limitSeconds: number;
  modality?: string;
  timed: boolean;
  onChangeTimed: (timed: boolean) => void;
  onStart: () => void;
}) {
  const pace = registryPace(modality);
  const rules = timed
    ? [
        `You have ${formatDuration(limitSeconds)} for ${questionCount} questions.`,
        'No answers or explanations until you submit.',
        'Flag questions to come back to them from the question grid.',
        'The exam submits automatically when time runs out. Leaving the page does not pause the clock.',
      ]
    : [
        'No time limit. Answers and explanations appear when you submit.',
        'Flag questions to come back to them from the question grid.',
      ];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ backgroundColor: '#F4F5F7' }}>
      <div className="px-5 pt-6">
        <Link href="/exam/mock-exams" className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-white surface active:scale-95 transition-transform" aria-label="Back to exams">
          <ArrowLeft size={18} className="text-ink" />
        </Link>
      </div>

      <div className="flex-1 px-5 pt-6 pb-8 max-w-lg w-full mx-auto">
        <p className="eyebrow" style={{ color: '#2ea873' }}>Mock exam</p>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight mt-1">{title}</h1>
        <p className="text-slate-500 text-[15px] mt-1">{questionCount} questions</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { value: true, label: 'Timed', sub: formatDuration(limitSeconds), icon: Timer, gradient: 'violet' as const },
            { value: false, label: 'Practice', sub: 'No clock', icon: BookOpen, gradient: 'blue' as const },
          ].map((opt) => {
            const active = timed === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => onChangeTimed(opt.value)}
                className={cn(
                  'surface rounded-[22px] p-4 text-left transition-all active:scale-[0.98]',
                  active ? 'ring-2 ring-[#2ea873]' : 'opacity-80',
                )}
              >
                <div className="flex items-start justify-between">
                  <GradientIcon icon={opt.icon} gradient={opt.gradient} size={40} />
                  {active && (
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2ea873' }}>
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="text-[15px] font-bold text-ink mt-4">{opt.label}</p>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">{opt.sub}</p>
              </button>
            );
          })}
        </div>

        {timed && pace && (
          <p className="text-[12.5px] text-slate-500 mt-3 leading-relaxed">
            Paced like the real exam ({pace.label}).
          </p>
        )}

        <div className="surface rounded-[22px] p-5 mt-6">
          <p className="eyebrow mb-3">How it works</p>
          <ul className="space-y-2.5">
            {rules.map((rule) => (
              <li key={rule} className="flex gap-2.5 text-[14px] text-slate-600 leading-relaxed">
                <span className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#2ea873' }} />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-5 pt-3 bg-white border-t border-slate-900/5" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <button
          onClick={onStart}
          className="btn-primary w-full max-w-lg mx-auto block py-4 rounded-2xl text-[16px] font-bold active:scale-[0.98] transition-transform"
        >
          {timed ? 'Start timed exam' : 'Start practice'}
        </button>
      </div>
    </div>
  );
}

function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-[28px] px-5 pt-3 slide-up"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-4" />
        {children}
      </div>
    </div>
  );
}

export function QuestionGridSheet({
  questionIds,
  answers,
  flagged,
  currentIndex,
  correctById,
  onJump,
  onSubmit,
  onClose,
}: {
  questionIds: string[];
  answers: Record<string, string>;
  flagged: Set<string>;
  currentIndex: number;
  // Set after submitting: colors cells correct / incorrect instead of answered
  correctById?: Record<string, boolean>;
  onJump: (index: number) => void;
  onSubmit?: () => void;
  onClose: () => void;
}) {
  const answered = questionIds.filter((id) => answers[id]).length;
  const reviewing = !!correctById;
  const correct = reviewing ? questionIds.filter((id) => correctById[id]).length : 0;
  const unanswered = questionIds.length - answered;
  const firstUnanswered = questionIds.findIndex((id) => !answers[id]);

  const cellColor = (id: string) => {
    if (!answers[id]) return 'bg-slate-100 text-slate-600 border border-slate-200';
    if (!reviewing) return 'bg-[#2ea873] text-white';
    return correctById[id] ? 'bg-[#2ea873] text-white' : 'bg-red-500 text-white';
  };

  return (
    <Sheet onClose={onClose}>
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="eyebrow">Questions</p>
          <p className="text-[17px] font-extrabold text-ink mt-1">
            {reviewing ? `${correct} of ${questionIds.length} correct` : `${answered} of ${questionIds.length} answered`}
          </p>
        </div>
        {flagged.size > 0 && (
          <p className="text-[12px] font-semibold text-amber-600 flex items-center gap-1">
            <Flag size={12} className="fill-amber-500 text-amber-500" /> {flagged.size} flagged
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mb-3 flex-wrap">
        {reviewing ? (
          <>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#2ea873]" /> Correct</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Incorrect</span>
          </>
        ) : (
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#2ea873]" /> Answered</span>
        )}
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" /> Not answered</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-amber-400" /> Flagged</span>
      </div>
      <div className="grid grid-cols-6 gap-2 max-h-[45vh] overflow-y-auto p-1">
        {questionIds.map((id, i) => (
          <button
            key={id}
            onClick={() => onJump(i)}
            className={cn(
              'h-10 rounded-xl text-[13px] font-bold transition-transform active:scale-95',
              cellColor(id),
              flagged.has(id) && 'ring-2 ring-amber-400 ring-offset-1',
              i === currentIndex && 'outline outline-2 outline-[#0E1726] outline-offset-2',
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-4">
        {!reviewing && unanswered > 0 && firstUnanswered >= 0 && (
          <button
            onClick={() => onJump(firstUnanswered)}
            className="btn-secondary flex-1 h-12 rounded-2xl text-[14px] font-bold active:scale-[0.98] transition-transform"
          >
            First unanswered
          </button>
        )}
        {onSubmit && (
          <button
            onClick={onSubmit}
            className="btn-primary flex-1 h-12 rounded-2xl text-[15px] font-bold active:scale-[0.98] transition-transform"
          >
            {reviewing ? 'Back to results' : 'Submit exam'}
          </button>
        )}
      </div>
    </Sheet>
  );
}

export function SubmitSheet({
  unanswered,
  flagged,
  onReview,
  onSubmit,
  onClose,
}: {
  unanswered: number;
  flagged: number;
  onReview: () => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const allDone = unanswered === 0 && flagged === 0;
  return (
    <Sheet onClose={onClose}>
      <p className="text-[20px] font-extrabold text-ink tracking-tight">Submit exam?</p>
      <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed">
        {allDone
          ? 'You have answered every question. You will not be able to change answers after submitting.'
          : [
              unanswered > 0 && `${unanswered} unanswered question${unanswered === 1 ? '' : 's'} will be marked wrong`,
              flagged > 0 && `${flagged} question${flagged === 1 ? ' is' : 's are'} flagged for review`,
            ].filter(Boolean).join(', and ') + '.'}
      </p>
      <div className="flex gap-3 mt-5">
        {!allDone && (
          <button onClick={onReview} className="btn-secondary flex-1 h-12 rounded-2xl text-[15px] font-bold active:scale-[0.98] transition-transform">
            Review
          </button>
        )}
        <button onClick={onSubmit} className="btn-primary flex-1 h-12 rounded-2xl text-[15px] font-bold active:scale-[0.98] transition-transform">
          Submit
        </button>
      </div>
    </Sheet>
  );
}
