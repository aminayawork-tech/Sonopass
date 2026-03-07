'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
      <div className="min-h-screen bg-[#F5F7FA] p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-12 bg-white shadow-md border border-gray-200">
            <div className="text-center">
              <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-800">
                Exam Complete!
              </h1>

              <div className="mb-6 sm:mb-8">
                <div className="text-5xl sm:text-7xl font-bold text-emerald-600 mb-2 sm:mb-4">
                  {score}%
                </div>
                <p className="text-lg sm:text-2xl font-semibold text-gray-700">
                  {correctAnswers} / {answeredCount} Correct
                </p>
              </div>

              {modalityStats && (
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                    <span className="text-sm sm:text-lg font-bold text-amber-700">
                      {modalityStats.xp} Total XP &middot; Level {modalityStats.level}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
                <div className="p-3 sm:p-6 bg-emerald-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">{correctAnswers}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">Correct</div>
                </div>
                <div className="p-3 sm:p-6 bg-red-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">{answeredCount - correctAnswers}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">Incorrect</div>
                </div>
                <div className="p-3 sm:p-6 bg-blue-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{questions.length}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">Total</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="w-full sm:w-auto font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-emerald-600 hover:bg-emerald-700">
                    <Home className="mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
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
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── Main exam / practice UI ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — stacks on mobile */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
          {/* Top row: title + home */}
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <h1 className="text-base sm:text-xl font-semibold text-gray-800 truncate mr-2">{title}</h1>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Stats — hidden on very small screens, compact on mobile */}
              {modalityStats && stats && (
                <div className="hidden xs:flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm">
                  <span className="flex items-center gap-0.5 sm:gap-1 font-semibold text-amber-600">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {modalityStats.xp}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={cn(
                          "w-3 h-3 sm:w-4 sm:h-4",
                          i < (stats?.hearts ?? 0) ? "text-red-500 fill-red-500" : "text-gray-300"
                        )}
                      />
                    ))}
                  </span>
                </div>
              )}
              <Link href="/">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm px-2.5 sm:px-4">
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile stats row — visible only on very small screens */}
          {modalityStats && stats && (
            <div className="flex xs:hidden items-center justify-center gap-3 text-xs mb-2">
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <Zap className="w-3.5 h-3.5" /> {modalityStats.xp} XP
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 font-semibold text-orange-500">
                {stats.streak > 0 ? `${stats.streak}d streak` : 'No streak'}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < (stats?.hearts ?? 0) ? "text-red-500 fill-red-500" : "text-gray-300"
                    )}
                  />
                ))}
              </span>
            </div>
          )}

          {/* Progress and Score */}
          <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5 sm:mb-2">
            <span className="text-gray-600">{currentIndex + 1}/{questions.length}</span>
            <span className="text-gray-600">{correctAnswers}/{answeredCount} correct ({score}%)</span>
          </div>
          <Progress value={progress} className="h-1.5 sm:h-2 bg-gray-200" />
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
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Question Card */}
        <Card className="p-4 sm:p-8 bg-white shadow-sm border border-gray-200">
          {/* Question header */}
          <div className="flex justify-between items-start mb-3 sm:mb-6 gap-2">
            <span className="text-emerald-600 font-semibold text-sm sm:text-lg">
              Q{currentIndex + 1}
            </span>
            <span className={cn(
              "px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded shrink-0",
              getCategoryColors(currentQuestion.category).bg,
              getCategoryColors(currentQuestion.category).text
            )}>
              {currentQuestion.category}
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-base sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
            {showHint[currentQuestion.id] && currentQuestion.keywords
              ? highlightKeywords(currentQuestion.question, currentQuestion.keywords)
              : currentQuestion.question}
          </h2>

          {/* Hint Section */}
          {currentQuestion.hint && mode === 'practice' && !showAnswer && (
            <div className="mb-4 sm:mb-6">
              {!showHint[currentQuestion.id] ? (
                <Button
                  onClick={handleUseHint}
                  disabled={!stats || stats.hearts <= 0}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-amber-700 border-amber-400 hover:bg-amber-100 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">Use Hint</span>
                  <span className="flex items-center gap-1 ml-1">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span className="text-xs">-1</span>
                  </span>
                </Button>
              ) : (
                <div className="p-3 sm:p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1 text-sm sm:text-base">Hint</h3>
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{currentQuestion.hint}</p>
                      {currentQuestion.keywords && currentQuestion.keywords.length > 0 && (
                        <p className="text-xs text-amber-700 mt-2 italic">
                          Key terms highlighted in yellow above
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.letter;
              const isCorrect = currentQuestion.correctAnswer === option.letter;
              const showCorrectness = showAnswer && mode === 'practice';

              return (
                <button
                  key={option.letter}
                  onClick={() => {
                    if (showAnswer && mode === 'practice') return;
                    handleAnswer(option.letter);
                  }}
                  style={
                    showCorrectness
                      ? isCorrect
                        ? { backgroundColor: '#d1fae5', borderColor: '#059669', borderWidth: 2 }
                        : isSelected
                        ? { backgroundColor: '#fee2e2', borderColor: '#dc2626', borderWidth: 2 }
                        : { backgroundColor: '#f3f4f6', borderColor: '#d1d5db', borderWidth: 2, opacity: 0.6 }
                      : undefined
                  }
                  className={cn(
                    "w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all relative",
                    !showCorrectness && !isSelected && "bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer",
                    !showCorrectness && isSelected && "bg-emerald-50 border-emerald-400 cursor-pointer",
                    showCorrectness && "cursor-default",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className={cn(
                        "flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2",
                        !showCorrectness && !isSelected && "bg-gray-100 border-gray-300 text-gray-600",
                        !showCorrectness && isSelected && "bg-emerald-600 border-emerald-600 text-white",
                        showCorrectness && isCorrect && "bg-emerald-600 border-emerald-600 text-white",
                        showCorrectness && isSelected && !isCorrect && "bg-red-500 border-red-500 text-white",
                        showCorrectness && !isCorrect && !isSelected && "bg-gray-200 border-gray-300 text-gray-500",
                      )}>
                        {option.letter}
                      </span>
                      <span className={cn(
                        "text-sm sm:text-base",
                        showCorrectness && isCorrect && "text-gray-900 font-semibold",
                        showCorrectness && isSelected && !isCorrect && "text-gray-900 font-medium",
                        showCorrectness && !isCorrect && !isSelected && "text-gray-400",
                      )}>
                        {option.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {showCorrectness && isCorrect && (
                        <>
                          <span className="hidden sm:inline text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">CORRECT</span>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        </>
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <>
                          <span className="hidden sm:inline text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">WRONG</span>
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswer && mode === 'practice' && (
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {answers[currentQuestion.id] !== currentQuestion.correctAnswer && currentQuestion.correctAnswer && (
                <div className="p-3 sm:p-4 bg-emerald-50 border-2 border-emerald-400 rounded-lg flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                    Correct answer: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                    {' — '}
                    {currentQuestion.options.find(o => o.letter === currentQuestion.correctAnswer)?.text}
                  </p>
                </div>
              )}
              {currentQuestion.explanation && (
                <div className="p-3 sm:p-5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Explanation</h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4 sm:mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="sm"
            className="px-3 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5 sm:mr-1" />
            Prev
          </Button>

          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {currentIndex + 1} of {questions.length}
          </span>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={finishExam}
              size="sm"
              className="px-3 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700"
            >
              {mode === 'exam' && answeredCount === questions.length ? 'Submit' : 'Finish'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="sm"
              className="px-3 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-0.5 sm:ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
