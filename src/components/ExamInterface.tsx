'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Home, Info, Heart, Zap, Trophy, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getStats, recordAnswer, recordExamComplete, getBadgeInfo, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import { highlightKeywords } from '@/lib/highlightKeywords';

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
  };

  return colorMap[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function ExamInterface({ questions, title, mode, examId, modality, showResults = true, onRestart }: ExamInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [xpFlash, setXpFlash] = useState<{ amount: number; correct: boolean } | null>(null);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setStats(getStats());
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

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
      const result = recordAnswer(isCorrect, currentQuestion.category, modality);
      setStats(result.stats);
      showXpFlash(result.xpGained, isCorrect);
      if (result.newBadges.length > 0) {
        showBadgeNotification(result.newBadges[0]);
      }
    }
  };

  const handleUseHint = () => {
    if (!stats || stats.hearts <= 0) return;

    // Deduct a heart
    const currentStats = getStats();
    if (currentStats.hearts > 0) {
      currentStats.hearts -= 1;
      localStorage.setItem('userStats', JSON.stringify(currentStats));
      setStats(currentStats);

      // Show hint for current question
      setShowHint(prev => ({
        ...prev,
        [currentQuestion.id]: true
      }));
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

  const finishExam = () => {
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
      const result = recordExamComplete(examId, correctAnswers, answeredCount, modality);
      setStats(result.stats);
      if (result.newBadges.length > 0) {
        showBadgeNotification(result.newBadges[0]);
      }
    }
    setCompleted(true);
  };

  const badgeInfo = newBadge ? getBadgeInfo(newBadge) : null;

  // ── Results screen ──
  if (completed && showResults) {
    return (
      <div className="min-h-screen px-5 py-10" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Results</p>
          <div className="text-6xl font-black mb-1" style={{ color: score >= 70 ? '#3abc83' : '#ef4444' }}>
            {score}%
          </div>
          <p className="text-[15px] font-bold text-gray-700 mb-6">
            {correctAnswers} / {answeredCount} Correct
          </p>

          {modalityStats && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 mb-6">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[13px] font-bold text-amber-700">{modalityStats.xp} XP · Level {modalityStats.level}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-[#e8f8f2] rounded-2xl p-4">
              <div className="text-2xl font-black" style={{ color: '#3abc83' }}>{correctAnswers}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Correct</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="text-2xl font-black text-red-500">{answeredCount - correctAnswers}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Incorrect</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-2xl font-black text-blue-500">{questions.length}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Total</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (onRestart) {
                  onRestart();
                } else {
                  setCurrentIndex(0);
                  setAnswers({});
                  setCompleted(false);
                  setShowAnswer(false);
                }
              }}
              className="h-12 rounded-2xl font-black text-[14px] text-white active:opacity-80 shadow-sm"
              style={{ backgroundColor: '#3abc83' }}
            >
              Try Again
            </button>
            <Link href="/">
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
          {/* Top row: title + home */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-[16px] font-black text-gray-900 truncate mr-2">{title}</h1>
            <div className="flex items-center gap-3 flex-shrink-0">
              {stats && (
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="flex items-center gap-0.5 font-bold text-amber-500">
                    <Zap className="w-3.5 h-3.5" /> {modalityStats?.xp ?? 0} XP
                  </span>
                  <span className="text-gray-200">|</span>
                  <span className="flex items-center gap-0.5 font-bold text-orange-500">
                    {(stats.streak ?? 0)}d streak
                  </span>
                  <span className="text-gray-200">|</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart key={i} className={cn("w-3 h-3", i < (stats?.hearts ?? 0) ? "text-red-500 fill-red-500" : "text-gray-200")} />
                    ))}
                  </span>
                </div>
              )}
              <Link href="/">
                <button className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 bg-white active:bg-gray-50">
                  <Home className="w-4 h-4 text-gray-600" />
                </button>
              </Link>
            </div>
          </div>

          {/* Progress and Score */}
          <div className="flex justify-between items-center text-[11px] text-gray-400 mb-1.5">
            <span>{currentIndex + 1}/{questions.length}</span>
            <span>{correctAnswers}/{answeredCount} correct ({score}%)</span>
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
      <main className="px-4 py-4 pb-10">
        {/* Question Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          {/* Question header */}
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-[13px] font-black" style={{ color: '#3abc83' }}>
              Q{currentIndex + 1}
            </span>
            <span className={cn(
              "px-2.5 py-0.5 text-[11px] font-bold rounded-full shrink-0",
              getCategoryColors(currentQuestion.category).bg,
              getCategoryColors(currentQuestion.category).text
            )}>
              {currentQuestion.category}
            </span>
          </div>

          {/* Question text */}
          <p className="text-[15px] font-bold text-gray-900 mb-4 leading-relaxed">
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
                  disabled={!stats || stats.hearts <= 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 text-[12px] font-bold disabled:opacity-40"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Use Hint
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span className="text-[11px]">-1</span>
                  </span>
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
              const showCorrectness = showAnswer && mode === 'practice';

              let bg = 'bg-white';
              let border = 'border-gray-200';
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
                    if (showAnswer && mode === 'practice') return;
                    handleAnswer(option.letter);
                  }}
                  className={cn(
                    "w-full px-3.5 py-3 rounded-2xl border-2 text-left transition-all",
                    bg, border,
                    showCorrectness ? 'cursor-default' : 'active:scale-[0.98]',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black border-2",
                        letterBg,
                      )}>
                        {option.letter}
                      </span>
                      <span className={cn("text-[14px] font-medium", textColor)}>
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
          {showAnswer && mode === 'practice' && (
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
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-1.5 bg-white border border-gray-200 shadow-sm disabled:opacity-30 active:bg-gray-50"
          >
            <ChevronLeft size={18} className="text-gray-600" />
            <span className="text-[14px] font-bold text-gray-700">Prev</span>
          </button>

          <span className="text-[12px] text-gray-400 font-medium shrink-0">
            {currentIndex + 1} of {questions.length}
          </span>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={finishExam}
              className="flex-1 h-12 rounded-2xl flex items-center justify-center shadow-sm active:opacity-80"
              style={{ backgroundColor: '#3abc83' }}
            >
              <span className="text-[14px] font-black text-white">
                {mode === 'exam' && answeredCount === questions.length ? 'Submit' : 'Finish'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm active:opacity-80"
              style={{ backgroundColor: '#3abc83' }}
            >
              <span className="text-[14px] font-black text-white">Next</span>
              <ChevronRight size={18} className="text-white" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
