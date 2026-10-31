'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import GradientIcon, { gradientCss, type GradientName } from '@/components/GradientIcon';
import {
  Brain, Activity, AlertTriangle, ClipboardList, Zap,
  BookOpen, ChevronRight, Check, ArrowLeft,
  CheckCircle2, ChevronLeft, RotateCw, Shuffle,
  HeartPulse, GitBranch, Waves, Droplets, ScanLine, AudioWaveform, ListChecks,
  type LucideIcon,
} from 'lucide-react';

interface Image {
  filename: string;
  caption: string;
}

interface Section {
  title: string;
  content: string;
}

interface ConnectionEdge {
  piece: string;
  title: string;
  link: string;
}

interface Checkpoint {
  pearl: string;
  reflection: string;
}

interface Topic {
  id: string;
  title: string;
  pieceNumber?: string;
  frontClue?: string;
  corePiece?: string;
  whyLock?: string;
  connectionEdges?: ConnectionEdge[];
  registryApplication?: string;
  puzzleAssembly?: string;
  checkpoint?: Checkpoint;
  content?: string;
  quickSummary?: string;
  clinicalPearls?: string[];
  sections?: Section[];
  keyTakeaways?: string[];
  keyTerms: string[];
  images: Image[];
}

interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
  topics: Topic[];
}

interface StudyGuideContent {
  categories: Category[];
}

const CATEGORY_STYLE: Record<string, { icon: LucideIcon; gradient: GradientName }> = {
  'cerebrovascular': { icon: Brain, gradient: 'violet' },
  'arterial-hemodynamics': { icon: HeartPulse, gradient: 'rose' },
  'arterial-anatomy': { icon: GitBranch, gradient: 'orange' },
  'arterial-disease': { icon: AlertTriangle, gradient: 'amber' },
  'venous-hemodynamics': { icon: Waves, gradient: 'blue' },
  'venous-anatomy': { icon: Droplets, gradient: 'cyan' },
  'venous-testing': { icon: ScanLine, gradient: 'indigo' },
  'venous-disease': { icon: AlertTriangle, gradient: 'blue' },
  'arterial-testing': { icon: ScanLine, gradient: 'rose' },
  'physics-instrumentation': { icon: AudioWaveform, gradient: 'emerald' },
  'quick-reference': { icon: ListChecks, gradient: 'indigo' },
};

const iconMap: Record<string, any> = {
  'brain': Brain,
  'activity': Activity,
  'alert-triangle': AlertTriangle,
  'clipboard-list': ClipboardList,
  'zap': Zap,
  'book-open': BookOpen,
};

const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
  'blue': { bg: 'bg-blue-50/50', text: 'text-blue-600', accent: 'bg-blue-500' },
  'red': { bg: 'bg-red-50/50', text: 'text-red-600', accent: 'bg-red-500' },
  'orange': { bg: 'bg-orange-50/50', text: 'text-orange-600', accent: 'bg-orange-500' },
  'green': { bg: 'bg-green-50/50', text: 'text-green-600', accent: 'bg-green-500' },
  'purple': { bg: 'bg-purple-50/50', text: 'text-purple-600', accent: 'bg-purple-500' },
};

function CardSection({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="py-4 border-t border-slate-100 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <p className="eyebrow" style={{ color: accent }}>{label}</p>
      </div>
      {children}
    </section>
  );
}

export default function StudyGuidePage() {
  const [content, setContent] = useState<StudyGuideContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'flashcards' | 'list'>('flashcards');

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownTopics, setKnownTopics] = useState<Set<number>>(new Set());
  const [unknownTopics, setUnknownTopics] = useState<Set<number>>(new Set());

  // Swipe gesture state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [swipeDelta, setSwipeDelta] = useState(0);

  useEffect(() => {
    fetch('/study-guide-puzzle.json')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load study guide:', err));

    const saved = localStorage.getItem('completedTopics');
    if (saved) {
      setCompletedTopics(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleTopicComplete = (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);
    localStorage.setItem('completedTopics', JSON.stringify(Array.from(newCompleted)));
  };

  const filteredCategories = content?.categories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.title.toLowerCase().includes(query) ||
      category.topics.some(topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.content?.toLowerCase().includes(query) ||
        topic.quickSummary?.toLowerCase().includes(query) ||
        topic.keyTerms.some(term => term.toLowerCase().includes(query))
      )
    );
  });

  if (!content) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading study guide...</p>
        </div>
      </AppLayout>
    );
  }

  // Flashcard View for Category Topics
  if (selectedCategory && viewMode === 'flashcards') {
    const topics = selectedCategory.topics;
    const currentTopic = topics[currentCardIndex];
    const reviewed = knownTopics.size + unknownTopics.size;
    const progress = topics.length > 0 ? Math.round((reviewed / topics.length) * 100) : 0;

    const handleNext = () => {
      if (currentCardIndex < topics.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      }
    };

    const handlePrevious = () => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
        setIsFlipped(false);
      }
    };

    const handleKnow = () => {
      const newKnown = new Set(knownTopics);
      newKnown.add(currentCardIndex);
      setKnownTopics(newKnown);
      unknownTopics.delete(currentCardIndex);
      toggleTopicComplete(currentTopic.id);
      handleNext();
    };

    const handleDontKnow = () => {
      const newUnknown = new Set(unknownTopics);
      newUnknown.add(currentCardIndex);
      setUnknownTopics(newUnknown);
      knownTopics.delete(currentCardIndex);
      handleNext();
    };

    const handleShuffle = () => {
      setKnownTopics(new Set());
      setUnknownTopics(new Set());
      setCurrentCardIndex(0);
      setIsFlipped(false);
    };

    const SWIPE_THRESHOLD = 60;

    const onTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: React.TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      // Only track horizontal swipes; let vertical scroll pass through
      if (Math.abs(dx) < Math.abs(dy)) return;
      e.preventDefault();
      setSwipeDelta(Math.max(-140, Math.min(140, dx)));
    };

    const onTouchEnd = () => {
      if (swipeDelta > SWIPE_THRESHOLD) {
        // Swipe right
        if (isFlipped) { handleKnow(); }
        else { handlePrevious(); }
      } else if (swipeDelta < -SWIPE_THRESHOLD) {
        // Swipe left
        if (isFlipped) { handleDontKnow(); }
        else { handleNext(); }
      }
      setSwipeDelta(0);
    };

    const swipeIntent = swipeDelta > SWIPE_THRESHOLD
      ? (isFlipped ? 'know' : 'prev')
      : swipeDelta < -SWIPE_THRESHOLD
        ? (isFlipped ? 'review' : 'next')
        : null;

    const exitFlashcards = () => {
      setSelectedCategory(null);
      setViewMode('flashcards');
      setCurrentCardIndex(0);
      setIsFlipped(false);
    };

    return (
      <div className="h-[100dvh] overflow-hidden flex flex-col" style={{ backgroundColor: '#F4F5F7' }}>
        {/* Header */}
        <header className="shrink-0 bg-white border-b border-slate-900/5 px-4 pt-3 pb-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button
              onClick={exitFlashcards}
              aria-label="Back"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={17} className="text-ink" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-ink truncate leading-tight tracking-[-0.01em]">{selectedCategory.title}</p>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                Card {currentCardIndex + 1} of {topics.length}
                {knownTopics.size > 0 && <span style={{ color: '#2ea873' }}> · {knownTopics.size} mastered</span>}
              </p>
            </div>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <BookOpen size={16} className="text-ink" />
            </button>
            <button
              onClick={handleShuffle}
              aria-label="Restart deck"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <Shuffle size={16} className="text-ink" />
            </button>
          </div>

          {/* Segmented progress */}
          <div className="max-w-lg mx-auto flex gap-1 mt-3">
            {topics.map((_, i) => {
              const color = knownTopics.has(i)
                ? '#3abc83'
                : unknownTopics.has(i)
                  ? '#F5A524'
                  : i === currentCardIndex
                    ? '#0E1726'
                    : '#E4E7EC';
              return <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ backgroundColor: color }} />;
            })}
          </div>
        </header>

        {/* Card area */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <div className="min-h-full flex flex-col justify-center px-4 py-6">
            <div className="w-full max-w-lg mx-auto">
              <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                  transform: `translateX(${swipeDelta}px) rotate(${swipeDelta * 0.025}deg)`,
                  transition: swipeDelta === 0 ? 'transform 0.3s cubic-bezier(.2,.8,.2,1)' : 'none',
                  position: 'relative',
                  willChange: 'transform',
                }}
              >
                {swipeIntent && (
                  <div
                    className="absolute inset-0 rounded-[28px] z-10 flex items-start justify-center pt-6 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 2px ${swipeIntent === 'know' ? '#3abc83' : swipeIntent === 'review' ? '#F5A524' : '#0E1726'}`,
                      backgroundColor: swipeIntent === 'know' ? 'rgba(58,188,131,0.06)' : swipeIntent === 'review' ? 'rgba(245,165,36,0.06)' : 'rgba(14,23,38,0.03)',
                    }}
                  >
                    <span
                      className="px-3.5 py-1.5 rounded-full text-[13px] font-bold text-white"
                      style={{ backgroundColor: swipeIntent === 'know' ? '#2ea873' : swipeIntent === 'review' ? '#E08E0B' : '#0E1726' }}
                    >
                      {swipeIntent === 'know' ? 'Got it' : swipeIntent === 'review' ? 'Again' : swipeIntent === 'next' ? 'Next card' : 'Previous card'}
                    </span>
                  </div>
                )}

                {!isFlipped ? (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="surface w-full text-left rounded-[28px] px-6 pt-7 pb-6"
                  >
                    {currentTopic.pieceNumber && (
                      <p className="eyebrow mb-4" style={{ color: '#2ea873' }}>{currentTopic.pieceNumber}</p>
                    )}
                    <h2 className="text-[27px] font-extrabold text-ink leading-[1.15] tracking-[-0.025em]">
                      {currentTopic.title}
                    </h2>
                    {currentTopic.frontClue && (
                      <p className="text-[16px] text-slate-500 leading-relaxed mt-4">{currentTopic.frontClue}</p>
                    )}
                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-slate-400">Tap card to reveal</span>
                      <RotateCw size={14} className="text-slate-300" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="surface w-full text-left rounded-[28px] px-6 pt-6 pb-5"
                  >
                    <h2 className="text-[20px] font-extrabold text-ink leading-snug tracking-[-0.02em] mb-5">
                      {currentTopic.title}
                    </h2>

                    <div>
                      {currentTopic.corePiece && (
                        <CardSection label="Core concept" accent="#2ea873">
                          <p className="text-[15.5px] text-slate-700 leading-[1.65]">{currentTopic.corePiece}</p>
                        </CardSection>
                      )}
                      {currentTopic.whyLock && (
                        <CardSection label="Why it matters" accent="#3B6FE0">
                          <p className="text-[15.5px] text-slate-700 leading-[1.65]">{currentTopic.whyLock}</p>
                        </CardSection>
                      )}
                      {currentTopic.connectionEdges && currentTopic.connectionEdges.length > 0 && (
                        <CardSection label="Connections" accent="#7C5CE0">
                          <ul className="space-y-2">
                            {currentTopic.connectionEdges.map((edge: any, i: number) => (
                              <li key={i} className="text-[15px] text-slate-700 leading-relaxed flex gap-2.5">
                                <span className="mt-[9px] w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                <span>{typeof edge === 'string' ? edge : `${edge.title}: ${edge.link}`}</span>
                              </li>
                            ))}
                          </ul>
                        </CardSection>
                      )}
                      {currentTopic.registryApplication && (
                        <CardSection label="On the registry" accent="#D98A0B">
                          <p className="text-[15.5px] text-slate-700 leading-[1.65]">{currentTopic.registryApplication}</p>
                        </CardSection>
                      )}
                      {currentTopic.checkpoint && (
                        <CardSection label="Checkpoint" accent="#0E1726">
                          {typeof currentTopic.checkpoint === 'string' ? (
                            <p className="text-[15.5px] text-slate-700 leading-[1.65]">{currentTopic.checkpoint}</p>
                          ) : (
                            <>
                              {currentTopic.checkpoint.pearl && (
                                <p className="text-[15.5px] text-slate-700 leading-[1.65]">{currentTopic.checkpoint.pearl}</p>
                              )}
                              {currentTopic.checkpoint.reflection && (
                                <p className="mt-3 pl-3 border-l-2 border-slate-200 text-[14.5px] text-slate-500 italic leading-relaxed">
                                  {currentTopic.checkpoint.reflection}
                                </p>
                              )}
                            </>
                          )}
                        </CardSection>
                      )}
                      {currentTopic.keyTerms && currentTopic.keyTerms.length > 0 && (
                        <CardSection label="Key terms" accent="#8A94A6">
                          <div className="flex flex-wrap gap-1.5">
                            {currentTopic.keyTerms.slice(0, 8).map((t: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-full text-[13px] text-slate-600 font-semibold">{t}</span>
                            ))}
                          </div>
                        </CardSection>
                      )}
                    </div>
                  </button>
                )}
              </div>

              <p className="text-center text-[12px] text-slate-400 font-medium mt-4">
                {isFlipped ? 'Swipe right if you got it, left to see it again' : 'Swipe to move between cards'}
              </p>
            </div>
          </div>
        </main>

        {/* Action bar */}
        <footer
          className="shrink-0 bg-white border-t border-slate-900/5 px-4 pt-3"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-lg mx-auto flex items-center gap-2.5">
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              aria-label="Previous card"
              className="btn-secondary shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl disabled:opacity-35 active:scale-95 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>

            {isFlipped ? (
              <>
                <button
                  onClick={handleDontKnow}
                  className="btn-secondary flex-1 h-12 rounded-2xl text-[15px] font-bold whitespace-nowrap active:scale-[0.98] transition-transform"
                  style={{ color: '#C2410C' }}
                >
                  Again
                </button>
                <button
                  onClick={handleKnow}
                  className="btn-primary flex-1 h-12 rounded-2xl text-[15px] font-bold whitespace-nowrap active:scale-[0.98] transition-transform"
                >
                  Got it
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="flex-1 h-12 rounded-2xl text-[15px] font-bold text-white whitespace-nowrap active:scale-[0.98] transition-transform"
                style={{ backgroundColor: '#0E1726', boxShadow: '0 6px 16px -6px rgba(14,23,38,0.5)' }}
              >
                Show answer
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={currentCardIndex === topics.length - 1}
              aria-label="Next card"
              className="btn-secondary shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl disabled:opacity-35 active:scale-95 transition-transform"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Category Detail View (List mode)
  if (selectedCategory) {
    const Icon = iconMap[selectedCategory.icon] || BookOpen;
    const totalTopics = selectedCategory.topics.length;
    const completedCount = selectedCategory.topics.filter(t => completedTopics.has(t.id)).length;
    const progress = (completedCount / totalTopics) * 100;

    return (
      <AppLayout>
        <div className="min-h-screen bg-[#F5F7FA] pb-20">
          <header className="px-4 sm:px-6 pt-10 pb-4 sm:pb-6 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </Button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedCategory.title}</h1>
                    <Button
                      onClick={() => setViewMode('flashcards')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Study with Flashcards</span>
                      <span className="sm:hidden">Flashcards</span>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {completedCount} of {totalTopics} topics completed
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.topics.map((topic) => {
                const isCompleted = completedTopics.has(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="group bg-white rounded-2xl surface p-6 hover:shadow-md transition-all cursor-pointer relative"
                    onClick={() => toggleTopicComplete(topic.id)}
                  >
                    {isCompleted && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="pr-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {topic.quickSummary || (topic.content ? topic.content.split('\n\n')[0] : 'Click to mark as complete')}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        {topic.keyTerms.length > 0 && (
                          <span className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                            {topic.keyTerms.length} key terms
                          </span>
                        )}
                        {topic.clinicalPearls && topic.clinicalPearls.length > 0 && (
                          <span className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                            {topic.clinicalPearls.length} clinical pearls
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }

  // Categories Overview
  const totalTopicCount = content.categories.reduce((acc, cat) => acc + cat.topics.length, 0);
  const masteredCount = content.categories.reduce(
    (acc, cat) => acc + cat.topics.filter((t) => completedTopics.has(t.id)).length,
    0,
  );
  const overallPct = totalTopicCount > 0 ? Math.round((masteredCount / totalTopicCount) * 100) : 0;
  const ringCircumference = 2 * Math.PI * 26;

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
        <header className="px-5 pt-14 pb-5">
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Study Guide</h1>
          <p className="text-slate-500 text-[15px] mt-1">Flashcards for every registry topic</p>
        </header>

        <main className="px-5 pb-24">
          {/* Deck summary */}
          <div className="surface rounded-[24px] p-5 mb-7 flex items-center gap-5">
            <div className="relative w-[64px] h-[64px] shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#EEF0F3" strokeWidth="7" />
                <circle
                  cx="32" cy="32" r="26" fill="none" stroke="url(#guideRing)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - overallPct / 100)}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <defs>
                  <linearGradient id="guideRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[14px] font-extrabold text-ink">{overallPct}%</span>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-bold text-ink leading-tight">
                {masteredCount} of {totalTopicCount} topics mastered
              </p>
              <p className="text-[13px] text-slate-500 mt-1 leading-snug">
                {masteredCount === 0 ? 'Pick a chapter below to start your first deck.' : 'Keep going — one chapter at a time.'}
              </p>
            </div>
          </div>

          <p className="eyebrow mb-3">Chapters</p>
          <div className="flex flex-col gap-3">
            {filteredCategories?.map((category, idx) => {
              const style = CATEGORY_STYLE[category.id] ?? { icon: iconMap[category.icon] || BookOpen, gradient: 'blue' as GradientName };
              const totalTopics = category.topics.length;
              const completedCount = category.topics.filter((t) => completedTopics.has(t.id)).length;
              const pct = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;
              const done = completedCount === totalTopics && totalTopics > 0;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="surface rounded-[22px] p-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <GradientIcon icon={style.icon} gradient={style.gradient} size={46} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                        Chapter {String(idx + 1).padStart(2, '0')}
                      </p>
                      <p className="text-[15px] font-bold text-ink leading-tight mt-0.5">{category.title}</p>
                    </div>
                    {done
                      ? <CheckCircle2 size={18} style={{ color: '#2ea873' }} className="shrink-0" />
                      : <ChevronRight size={18} className="text-slate-300 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mt-3.5">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: gradientCss(style.gradient) }}
                      />
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-400 shrink-0">
                      {completedCount}/{totalTopics} {totalTopics === 1 ? 'topic' : 'topics'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

