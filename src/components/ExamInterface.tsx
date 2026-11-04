'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, X, Home, Info, Heart, Zap, Trophy, ChevronLeft, ChevronRight, Lightbulb, Flag, LayoutGrid, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getStats, recordAnswer, recordExamComplete, getBadgeInfo, getCurrentModalityStats, spendHintHeart, STREAK_HEART_EVERY, type UserStats } from '@/lib/userStats';
import HeartsSheet from '@/components/HeartsSheet';
import { highlightKeywords } from '@/lib/highlightKeywords';
import { timeLimitSeconds, formatClock, formatDuration, loadExamSession, saveExamSession, clearExamSession } from '@/lib/examSession';
import { ExamStartScreen, QuestionGridSheet, SubmitSheet } from '@/components/ExamTools';

interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: string;
  number: number;
  question: string;
  options: Option[];
  category: string;
  correctAnswer: string | null;
  explanation: string | null;
  imageUrl?: string;
  imageCaption?: string;
  hint?: string;
  keywords?: string[];
}

interface ExamInterfaceProps {
  questions: Question[];
  title: string;
  mode: 'practice' | 'exam';
  examId?: string;
  modality?: string;
  showResults?: boolean;
  onRestart?: () => void;
}

// Category color mapping for distinguishable badges
const getCategoryColors = (category: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    'Arterial Anatomy': { bg: 'bg-rose-100', text: 'text-rose-700' },
    'Arterial Disease': { bg: 'bg-red-100', text: 'text-red-700' },
    'Arterial Hemodynamics': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'Arterial Testing': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Cerebrovascular': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'General & Other': { bg: 'bg-slate-100', text: 'text-slate-700' },
    'Physics & Instrumentation': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    'Venous Anatomy': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    'Venous Disease': { bg: 'bg-teal-100', text: 'text-teal-700' },
    'Venous Hemodynamics': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'Venous Testing': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'Ultrasound Physics': { bg: 'bg-sky-100', text: 'text-sky-700' },
    'Transducers': { bg: 'bg-violet-100', text: 'text-violet-700' },
    'Image Optimization': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    'Artifacts': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Doppler': { bg: 'bg-rose-100', text: 'text-rose-700' },
    'Bioeffects': { bg: 'bg-orange-100', text: 'text-orange-700' },
  };

  return colorMap[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function ExamInterface({ questions: initialQuestions, title, mode, examId, modality, showResults = true, onRestart }: ExamInterfaceProps) {
  const isExam = mode === 'exam';
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [xpFlash, setXpFlash] = useState<{ amount: number; correct: boolean } | null>(null);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [heartsOpen, setHeartsOpen] = useState(false);
  const [heartToast, setHeartToast] = useState(false);

  // Exam-mode state: timer, flags, review
  const limitSeconds = timeLimitSeconds(initialQuestions.length, modality);
  const [phase, setPhase] = useState<'setup' | 'running'>(isExam ? 'setup' : 'running');
  const [timed, setTimed] = useState(true);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [gridOpen, setGridOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [timeToast, setTimeToast] = useState<string | null>(null);
  const [examResult, setExamResult] = useState<{ timeUsed: number; timedOut: boolean } | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const warned = useRef<Set<number>>(new Set());
  const [furthestIndex, setFurthestIndex] = useState(0);

  useEffect(() => {
    setStats(getStats());
  }, []);

  // Resume an exam in progress (survives refreshes; the clock keeps running)
  useEffect(() => {
    if (!isExam) return;
    const saved = loadExamSession(modality, examId);
    if (!saved) return;
    const byId = new Map(initialQuestions.map((q) => [q.id, q]));
    if (saved.order.length !== initialQuestions.length || !saved.order.every((id) => byId.has(id))) {
      clearExamSession(modality, examId);
      return;
    }
    const ordered = saved.order.map((id) => byId.get(id)!);
    setQuestions(ordered);
    setAnswers(saved.answers);
    setFlagged(new Set(saved.flagged));
    setTimed(saved.timed);
    setStartedAt(saved.startedAt);
    setEndsAt(saved.endsAt);
    setCurrentIndex(Math.min(saved.currentIndex, ordered.length - 1));
    setFurthestIndex(Math.min(saved.furthestIndex ?? saved.currentIndex, ordered.length - 1));
    setNow(Date.now());
    setPhase('running');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const examLive = isExam && phase === 'running' && !completed;

  useEffect(() => {
    if (!examLive) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [examLive]);

  useEffect(() => {
    if (!examLive || startedAt === null) return;
    saveExamSession(
      { order: questions.map((q) => q.id), answers, flagged: Array.from(flagged), timed, startedAt, endsAt, currentIndex, furthestIndex },
      modality,
      examId,
    );
  }, [examLive, questions, answers, flagged, timed, startedAt, endsAt, currentIndex, furthestIndex, modality, examId]);

  useEffect(() => {
    if (examLive) setFurthestIndex((f) => Math.max(f, currentIndex));
  }, [examLive, currentIndex]);

  const remaining = endsAt !== null ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : null;
  const elapsed = startedAt !== null ? Math.max(0, Math.round((now - startedAt) / 1000)) : 0;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const correctById: Record<string, boolean> = Object.fromEntries(
    questions.map((q) => [q.id, !!answers[q.id] && answers[q.id] === q.correctAnswer]),
  );
  const flaggedIndexes = questions.map((q, i) => (flagged.has(q.id) ? i : -1)).filter((i) => i >= 0);
  const wrongIndexes = questions.map((q, i) => (correctById[q.id] ? -1 : i)).filter((i) => i >= 0);
  const cycleFrom = (indexes: number[]) => {
    const others = indexes.filter((i) => i !== currentIndex);
    if (others.length === 0) return null;
    return others.find((i) => i > currentIndex) ?? others[0];
  };
  const nextTarget = reviewing ? cycleFrom(wrongIndexes) : cycleFrom(flaggedIndexes);
  const canReturn = isExam && !reviewing && currentIndex < furthestIndex;

  const correctAnswers = Object.entries(answers).filter(([id, answer]) => {
    const q = questions.find(q => q.id === id);
    return q?.correctAnswer === answer;
  }).length;

  const score = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;
  const modalityStats = stats ? getCurrentModalityStats(stats) : null;

  const showXpFlash = useCallback((amount: number, correct: boolean) => {
    setXpFlash({ amount, correct });
    setTimeout(() => setXpFlash(null), 1200);
  }, []);

  const showBadgeNotification = useCallback((badgeId: string) => {
    setNewBadge(badgeId);
    setTimeout(() => setNewBadge(null), 3000);
  }, []);

  const handleAnswer = (letter: string) => {
    if (showAnswer && mode === 'practice') return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: letter
    }));

    if (mode === 'practice') {
      setShowAnswer(true);
      const isCorrect = currentQuestion.correctAnswer === letter;
      const heartsBefore = stats?.hearts ?? 0;
      const result = recordAnswer(isCorrect, currentQuestion.category, modality);
      setStats(result.stats);
      if (isCorrect || heartsBefore > 0) showXpFlash(result.xpGained, isCorrect);
      if (heartsBefore > 0 && result.stats.hearts === 0) {
        setTimeout(() => setHeartsOpen(true), 1200);
      }
      if (result.heartEarned) {
        setHeartToast(true);
        setTimeout(() => setHeartToast(false), 2200);
      }
      if (result.newBadges.length > 0) {
        showBadgeNotification(result.newBadges[0]);
      }
    }
  };

  const handleUseHint = () => {
    const updated = spendHintHeart();
    if (!updated) {
      setStats(getStats());
      setHeartsOpen(true);
      return;
    }
    setStats(updated);
    setShowHint(prev => ({ ...prev, [currentQuestion.id]: true }));
    if (updated.hearts === 0) {
      setTimeout(() => setHeartsOpen(true), 1500);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      finishExam();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const finishExam = (timedOut = false) => {
    if (mode === 'exam') {
      let latestStats = getStats();
      for (const [id, answer] of Object.entries(answers)) {
        const q = questions.find(q => q.id === id);
        if (q) {
          const isCorrect = q.correctAnswer === answer;
          const result = recordAnswer(isCorrect, q.category, modality);
          latestStats = result.stats;
        }
      }
      setStats(latestStats);
    }
    if (examId) {
      const result = recordExamComplete(examId, correctAnswers, isExam ? questions.length : answeredCount, modality);
      setStats(result.stats);
      if (result.newBadges.length > 0) {
        showBadgeNotification(result.newBadges[0]);
      }
    }
    if (isExam) {
      const used = startedAt !== null ? (Date.now() - startedAt) / 1000 : 0;
      setExamResult({ timeUsed: timedOut ? limitSeconds : timed ? Math.min(used, limitSeconds) : used, timedOut });
      clearExamSession(modality, examId);
      setGridOpen(false);
      setSubmitOpen(false);
    }
    setCompleted(true);
  };

  // Time warnings and auto-submit
  useEffect(() => {
    if (!examLive || !timed || remaining === null) return;
    if (remaining <= 0) {
      finishExam(true);
      return;
    }
    for (const mark of [600, 60]) {
      if (remaining <= mark && limitSeconds > mark && !warned.current.has(mark)) {
        warned.current.add(mark);
        setTimeToast(mark === 600 ? '10 minutes left' : '1 minute left');
        setTimeout(() => setTimeToast(null), 3500);
      }
    }
    // finishExam is recreated every render; re-run only when the clock moves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examLive, timed, remaining]);

  const startExam = () => {
    const t = Date.now();
    warned.current = new Set();
    setStartedAt(t);
    setEndsAt(timed ? t + limitSeconds * 1000 : null);
    setNow(t);
    setPhase('running');
  };

  const toggleFlag = (id: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const restartExam = () => {
    clearExamSession(modality, examId);
    setQuestions(initialQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setFurthestIndex(0);
    setShowAnswer(false);
    setReviewing(false);
    setExamResult(null);
    setStartedAt(null);
    setEndsAt(null);
    setCompleted(false);
    setPhase(isExam ? 'setup' : 'running');
  };

  const badgeInfo = newBadge ? getBadgeInfo(newBadge) : null;

  if (isExam && phase === 'setup') {
    return (
      <ExamStartScreen
        title={title}
        questionCount={questions.length}
        limitSeconds={limitSeconds}
        modality={modality}
        timed={timed}
        onChangeTimed={setTimed}
        onStart={startExam}
      />
    );
  }

  const resultScore = isExam
    ? Math.round((correctAnswers / Math.max(1, questions.length)) * 100)
    : score;
  const unansweredCount = questions.length - answeredCount;

  // ── Results screen ──
  if (completed && showResults && !reviewing) {
    return (
      <div className="min-h-screen px-5 py-10" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="bg-white rounded-3xl p-7 surface text-center">
          <p className="eyebrow mb-3">Results</p>
          {examResult?.timedOut && (
            <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[12px] font-bold mb-3">
              <Clock className="w-3.5 h-3.5" /> Time ran out
            </p>
          )}
          <div className="text-6xl font-extrabold mb-1" style={{ color: resultScore >= 70 ? '#3abc83' : '#ef4444' }}>
            {resultScore}%
          </div>
          <p className="text-[15px] font-bold text-gray-700 mb-6">
            {correctAnswers} / {isExam ? questions.length : answeredCount} Correct
          </p>

          {isExam && examResult && (
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Time used</p>
                <p className="text-[18px] font-extrabold text-ink mt-1">{formatClock(examResult.timeUsed)}</p>
                {timed && <p className="text-[11px] text-slate-400 mt-0.5">of {formatDuration(limitSeconds)}</p>}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Per question</p>
                <p className="text-[18px] font-extrabold text-ink mt-1">
                  {answeredCount > 0 ? `${Math.round(examResult.timeUsed / answeredCount)} s` : '—'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">average</p>
              </div>
            </div>
          )}

          {modalityStats && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 mb-6">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[13px] font-bold text-amber-700">{modalityStats.xp} XP · Level {modalityStats.level}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-[#e8f8f2] rounded-2xl p-4">
              <div className="text-2xl font-extrabold" style={{ color: '#3abc83' }}>{correctAnswers}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Correct</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="text-2xl font-extrabold text-red-500">{answeredCount - correctAnswers}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Incorrect</div>
            </div>
            {isExam ? (
              <div className="bg-slate-100 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-slate-500">{unansweredCount}</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">Unanswered</div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-blue-500">{questions.length}</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">Total</div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {isExam && (
              <button
                onClick={() => { setReviewing(true); setCurrentIndex(0); }}
                className="btn-secondary h-12 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                Review answers
              </button>
            )}
            <button
              onClick={() => {
                if (onRestart) {
                  onRestart();
                } else {
                  restartExam();
                }
              }}
              className="btn-primary h-12 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform"
            >
              Try Again
            </button>
            <Link href="/dashboard">
              <button className="w-full h-12 rounded-2xl font-bold text-[14px] text-gray-700 bg-white border border-gray-200 shadow-sm active:bg-gray-50 flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main exam / practice UI ──
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 pt-3 pb-2">
          {/* Top row: stats + home */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {isExam ? (
              <div className="flex items-center gap-2 min-w-0">
                {reviewing ? (
                  <span className="text-[15px] font-extrabold text-ink">Reviewing answers</span>
                ) : timed && remaining !== null ? (
                  <span
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[14px] font-extrabold tabular-nums transition-colors',
                      remaining <= 60 ? 'bg-red-50 text-red-600' : remaining <= 600 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-ink',
                    )}
                    aria-label="Time remaining"
                  >
                    <Clock className="w-4 h-4" /> {formatClock(remaining)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[13px] font-bold text-slate-500 tabular-nums">
                    <Clock className="w-4 h-4" /> Practice · {formatClock(elapsed)}
                  </span>
                )}
              </div>
            ) : (
            <div className="flex items-center gap-2 min-w-0">
              {stats && (
                <>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-[12px] font-extrabold text-amber-600 shrink-0">
                    <Zap className="w-3 h-3" />{modalityStats?.xp ?? 0} XP
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 text-[12px] font-extrabold text-orange-500 shrink-0">
                    {stats.streak ?? 0}d streak
                  </span>
                  <button
                    onClick={() => setHeartsOpen(true)}
                    aria-label="Hearts"
                    className="flex items-center gap-0.5 shrink-0 py-1 active:scale-95 transition-transform"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart key={i} className={cn("w-3.5 h-3.5", i < (stats?.hearts ?? 0) ? "text-red-500 fill-red-500" : "text-gray-200 fill-gray-200")} />
                    ))}
                  </button>
                </>
              )}
            </div>
            )}
            {isExam && (
              <button
                onClick={() => setGridOpen(true)}
                aria-label="Question grid"
                className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center surface bg-white active:bg-gray-50 shrink-0"
              >
                <LayoutGrid className="w-4 h-4 text-gray-600" />
              </button>
            )}
            {isExam && reviewing && (
              <button
                onClick={() => setReviewing(false)}
                className="ml-auto h-9 px-3 rounded-xl surface bg-white text-[13px] font-bold text-ink active:bg-gray-50 shrink-0"
              >
                Results
              </button>
            )}
            <Link href="/dashboard">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center surface bg-white active:bg-gray-50 shrink-0">
                <Home className="w-4 h-4 text-gray-600" />
              </button>
            </Link>
          </div>

          {/* Progress and Score */}
          <div className="flex justify-between items-center text-[11px] text-gray-400 mb-1.5">
            <span className="font-medium">{currentIndex + 1} / {questions.length}</span>
            {isExam ? (
              <span>{answeredCount} answered{flagged.size > 0 ? ` · ${flagged.size} flagged` : ''}</span>
            ) : (
              <span>{correctAnswers}/{answeredCount} correct ({score}%)</span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: '#3abc83' }} />
          </div>
        </div>
      </header>

      {/* XP Flash notification */}
      {xpFlash && (
        <div className={cn(
          "fixed top-16 sm:top-20 right-3 sm:right-6 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg font-bold text-sm sm:text-lg animate-bounce",
          xpFlash.correct
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        )}>
          {xpFlash.correct ? `+${xpFlash.amount} XP` : '-1 Heart'}
        </div>
      )}

      {heartToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-white surface flex items-center gap-2 slide-down">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span className="text-[13px] font-bold text-ink">+1 heart · {STREAK_HEART_EVERY} in a row</span>
        </div>
      )}

      {heartsOpen && stats && (
        <HeartsSheet stats={stats} onClose={() => setHeartsOpen(false)} onStatsChange={setStats} />
      )}

      {timeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-amber-500 text-white shadow-lg flex items-center gap-2 slide-down">
          <Clock className="w-4 h-4" />
          <span className="text-[13px] font-bold">{timeToast}</span>
        </div>
      )}

      {gridOpen && (
        <QuestionGridSheet
          questionIds={questions.map((q) => q.id)}
          answers={answers}
          flagged={flagged}
          currentIndex={currentIndex}
          correctById={reviewing ? correctById : undefined}
          onJump={(i) => { setCurrentIndex(i); setGridOpen(false); }}
          onSubmit={() => { setGridOpen(false); if (reviewing) setReviewing(false); else setSubmitOpen(true); }}
          onClose={() => setGridOpen(false)}
        />
      )}

      {submitOpen && (
        <SubmitSheet
          unanswered={unansweredCount}
          flagged={flagged.size}
          onReview={() => { setSubmitOpen(false); setGridOpen(true); }}
          onSubmit={() => finishExam(false)}
          onClose={() => setSubmitOpen(false)}
        />
      )}

      {/* Badge notification */}
      {badgeInfo && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-6 py-3 sm:py-4 bg-amber-100 border-2 border-amber-400 rounded-xl shadow-xl animate-bounce">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">{badgeInfo.icon}</span>
            <div>
              <div className="font-bold text-amber-800 text-sm sm:text-base">Badge Earned!</div>
              <div className="text-xs sm:text-sm text-amber-700">{badgeInfo.name}</div>
            </div>
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 pt-8">
        {/* Shortcuts so long exams never need dozens of Next taps */}
        {isExam && (canReturn || nextTarget !== null) && (
          <div className="flex gap-2 mb-3 -mt-4 flex-wrap">
            {canReturn && (
              <button
                onClick={() => setCurrentIndex(furthestIndex)}
                className="btn-secondary flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full text-[12.5px] font-semibold active:scale-[0.98] transition-transform"
              >
                <ChevronLeft size={14} className="rotate-180" /> Back to Q{furthestIndex + 1}
              </button>
            )}
            {nextTarget !== null && (
              <button
                onClick={() => setCurrentIndex(nextTarget)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold active:scale-[0.98] transition-transform',
                  reviewing ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700',
                )}
              >
                {reviewing ? <X size={14} /> : <Flag size={13} className="fill-amber-500 text-amber-500" />}
                {reviewing ? `Next incorrect (${wrongIndexes.length})` : `Next flagged (${flaggedIndexes.length})`}
              </button>
            )}
          </div>
        )}

        {/* Question Card */}
        <div className="surface rounded-[24px] p-5 mb-4">
          {/* Question header */}
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="eyebrow" style={{ color: '#2ea873' }}>
              Q{currentIndex + 1}
            </span>
            {isExam && !reviewing ? (
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold shrink-0 transition-colors',
                  flagged.has(currentQuestion.id) ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                <Flag className={cn('w-3.5 h-3.5', flagged.has(currentQuestion.id) && 'fill-amber-500 text-amber-500')} />
                {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
              </button>
            ) : (
            <span className={cn(
              "px-2.5 py-0.5 text-[11px] font-bold rounded-full shrink-0",
              getCategoryColors(currentQuestion.category).bg,
              getCategoryColors(currentQuestion.category).text
            )}>
              {currentQuestion.category}
            </span>
            )}
          </div>

          {/* Question text */}
          <p className="text-[17px] font-bold text-ink mb-5 leading-[1.45] tracking-[-0.01em]">
            {showHint[currentQuestion.id] && currentQuestion.keywords
              ? highlightKeywords(currentQuestion.question, currentQuestion.keywords)
              : currentQuestion.question}
          </p>

          {/* Question image */}
          {currentQuestion.imageUrl && (
            <div className="mb-5">
              <img
                src={currentQuestion.imageUrl}
                alt={currentQuestion.imageCaption || 'Ultrasound image'}
                className="w-full rounded-2xl border border-gray-100 object-contain max-h-72 bg-black"
              />
              {currentQuestion.imageCaption && (
                <p className="text-[11px] text-gray-400 mt-1.5 text-center italic leading-snug px-1">
                  {currentQuestion.imageCaption}
                </p>
              )}
            </div>
          )}

          {/* Hint Section */}
          {currentQuestion.hint && mode === 'practice' && !showAnswer && (
            <div className="mb-4">
              {!showHint[currentQuestion.id] ? (
                <button
                  onClick={handleUseHint}
                  className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold disabled:opacity-40"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  {stats && stats.hearts > 0 ? 'Use hint' : 'Out of hearts · get more'}
                  {stats && stats.hearts > 0 && (
                    <span className="flex items-center gap-0.5 ml-0.5">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-[11px]">-1</span>
                    </span>
                  )}
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-bold text-amber-800 mb-0.5">Hint</p>
                      <p className="text-[12px] text-gray-700 leading-relaxed">{currentQuestion.hint}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="flex flex-col gap-2.5 mb-4">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.letter;
              const isCorrect = currentQuestion.correctAnswer === option.letter;
              const showCorrectness = (showAnswer && mode === 'practice') || reviewing;

              let bg = 'bg-white';
              let border = 'border-slate-200';
              let letterBg = 'bg-gray-100 border-gray-300 text-gray-600';
              let textColor = 'text-gray-900';

              if (!showCorrectness && isSelected) {
                bg = 'bg-[#e8f8f2]';
                border = 'border-[#3abc83]';
                letterBg = 'bg-[#3abc83] border-[#3abc83] text-white';
              } else if (showCorrectness) {
                if (isCorrect) {
                  bg = 'bg-[#e8f8f2]';
                  border = 'border-[#3abc83]';
                  letterBg = 'bg-[#3abc83] border-[#3abc83] text-white';
                } else if (isSelected) {
                  bg = 'bg-red-50';
                  border = 'border-red-400';
                  letterBg = 'bg-red-500 border-red-500 text-white';
                  textColor = 'text-gray-500';
                } else {
                  bg = 'bg-gray-50';
                  border = 'border-gray-100';
                  textColor = 'text-gray-400';
                  letterBg = 'bg-gray-200 border-gray-200 text-gray-400';
                }
              }

              return (
                <button
                  key={option.letter}
                  onClick={() => {
                    if ((showAnswer && mode === 'practice') || reviewing) return;
                    handleAnswer(option.letter);
                  }}
                  className={cn(
                    "w-full px-3.5 py-3.5 rounded-2xl border-[1.5px] text-left transition-all",
                    bg, border,
                    showCorrectness ? 'cursor-default' : 'active:scale-[0.98]',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold border-2",
                        letterBg,
                      )}>
                        {option.letter}
                      </span>
                      <span className={cn("text-[15px] font-medium leading-snug", textColor)}>
                        {option.text}
                      </span>
                    </div>
                    <div className="shrink-0">
                      {showCorrectness && isCorrect && <Check className="w-4 h-4 text-[#3abc83]" />}
                      {showCorrectness && isSelected && !isCorrect && <X className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {((showAnswer && mode === 'practice') || reviewing) && (
            <div className="mt-2 flex flex-col gap-2">
              {answers[currentQuestion.id] !== currentQuestion.correctAnswer && currentQuestion.correctAnswer && (
                <div className="p-3 bg-[#e8f8f2] border border-[#3abc83]/30 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#3abc83] shrink-0 mt-0.5" />
                  <p className="text-[12px] font-bold text-gray-800">
                    Correct: <span style={{ color: '#3abc83' }}>{currentQuestion.correctAnswer}</span>
                    {' — '}
                    {currentQuestion.options.find(o => o.letter === currentQuestion.correctAnswer)?.text}
                  </p>
                </div>
              )}
              {currentQuestion.explanation && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-blue-800 mb-0.5 uppercase tracking-wide">Explanation</p>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div
          className="sticky bottom-0 z-10 -mx-4 px-4 pt-3 flex items-center justify-between gap-3 border-t border-slate-900/5"
          style={{ backgroundColor: '#F4F5F7', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn-secondary flex-1 h-12 rounded-2xl flex items-center justify-center gap-1.5 disabled:opacity-35 active:scale-[0.98] transition-transform"
          >
            <ChevronLeft size={18} className="text-gray-600" />
            <span className="text-[14px] font-bold text-gray-700">Prev</span>
          </button>

          {isExam ? (
            <button
              onClick={() => setGridOpen(true)}
              aria-label="Open question grid"
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[12px] text-gray-500 font-semibold shrink-0 active:bg-slate-200 transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {currentIndex + 1} of {questions.length}
            </button>
          ) : (
            <span className="text-[12px] text-gray-400 font-medium shrink-0">
              {currentIndex + 1} of {questions.length}
            </span>
          )}

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => {
                if (reviewing) setReviewing(false);
                else if (isExam) setSubmitOpen(true);
                else finishExam();
              }}
              className="btn-primary flex-1 h-12 rounded-2xl flex items-center justify-center active:scale-[0.98] transition-transform"
            >
              <span className="text-[14px] font-extrabold text-white">
                {reviewing ? 'Back to results' : isExam ? 'Review & submit' : 'Finish'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary flex-1 h-12 rounded-2xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <span className="text-[14px] font-extrabold text-white">Next</span>
              <ChevronRight size={18} className="text-white" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
