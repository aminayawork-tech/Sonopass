'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';

import {
  Brain, Activity, AlertTriangle, ClipboardList, Zap,
  BookOpen, ChevronRight, Check, ArrowLeft,
  CheckCircle2, ChevronLeft, RotateCw, XCircle, Shuffle,
  Link2, Lock, ClipboardCheck, Sparkles,
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

    return (
      <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
        {/* Header */}
        <header className="shrink-0 px-4 py-3 bg-white border-b border-gray-100" style={{ isolation: 'isolate', WebkitFontSmoothing: 'antialiased' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setViewMode('flashcards');
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 active:bg-gray-100"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900 truncate leading-tight">{selectedCategory.title}</p>
              <p className="text-[11px] text-gray-400">{currentCardIndex + 1} of {topics.length}</p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('list')}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white active:bg-gray-50"
              >
                <BookOpen size={15} className="text-gray-500" />
              </button>
              <button
                onClick={handleShuffle}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white active:bg-gray-50"
              >
                <Shuffle size={15} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#3abc83' }}
            />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 pt-[10vh] pb-8">
          <div className="max-w-lg mx-auto space-y-4">

            {/* Card — swipeable */}
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                transform: `translateX(${swipeDelta}px) rotate(${swipeDelta * 0.025}deg)`,
                transition: swipeDelta === 0 ? 'transform 0.3s ease' : 'none',
                position: 'relative',
                willChange: 'transform',
              }}
            >
              {/* Swipe intent overlay */}
              {swipeIntent === 'know' && (
                <div className="absolute inset-0 rounded-3xl z-10 flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: 'rgba(58,188,131,0.15)', border: '2px solid #3abc83' }}>
                  <span className="text-[20px] font-black" style={{ color: '#3abc83' }}>Got It</span>
                </div>
              )}
              {swipeIntent === 'review' && (
                <div className="absolute inset-0 rounded-3xl z-10 flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '2px solid #ef4444' }}>
                  <span className="text-[20px] font-black text-red-500">Review</span>
                </div>
              )}
              {swipeIntent === 'prev' && (
                <div className="absolute inset-0 rounded-3xl z-10 flex items-center justify-start pl-5 pointer-events-none"
                  style={{ backgroundColor: 'rgba(99,102,241,0.08)', border: '2px solid #6366f1' }}>
                  <ChevronLeft size={28} className="text-indigo-400" />
                </div>
              )}
              {swipeIntent === 'next' && (
                <div className="absolute inset-0 rounded-3xl z-10 flex items-center justify-end pr-5 pointer-events-none"
                  style={{ backgroundColor: 'rgba(99,102,241,0.08)', border: '2px solid #6366f1' }}>
                  <ChevronRight size={28} className="text-indigo-400" />
                </div>
              )}

            {!isFlipped ? (
              /* Front */
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full text-left bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                {currentTopic.pieceNumber && (
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#3abc83' }}>
                    {currentTopic.pieceNumber}
                  </p>
                )}
                <h2 className="text-[22px] font-black text-gray-900 leading-snug mb-4">
                  {currentTopic.title}
                </h2>
                {currentTopic.frontClue && (
                  <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
                    {currentTopic.frontClue}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px flex-1 bg-gray-100" />
                  <p className="text-[12px] font-semibold text-gray-300">Tap to reveal · swipe to navigate</p>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
              </button>
            ) : (
              /* Back */
              <button
                onClick={() => setIsFlipped(false)}
                className="w-full text-left bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-[18px] font-black text-gray-900 leading-snug mb-5">
                  {currentTopic.title}
                </h2>

                <div className="space-y-4">
                  {currentTopic.corePiece && (
                    <div className="rounded-2xl p-4" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={14} style={{ color: '#3abc83' }} />
                        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#3abc83' }}>Core Concept</p>
                      </div>
                      <p className="text-[15px] text-gray-700 leading-relaxed">{currentTopic.corePiece}</p>
                    </div>
                  )}

                  {currentTopic.whyLock && (
                    <div className="rounded-2xl p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={14} className="text-blue-500" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500">Why It Matters</p>
                      </div>
                      <p className="text-[15px] text-gray-700 leading-relaxed">{currentTopic.whyLock}</p>
                    </div>
                  )}

                  {currentTopic.connectionEdges && currentTopic.connectionEdges.length > 0 && (
                    <div className="rounded-2xl p-4 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Link2 size={14} className="text-purple-500" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-purple-500">Connections</p>
                      </div>
                      <ul className="space-y-1.5">
                        {currentTopic.connectionEdges.map((edge: any, i: number) => (
                          <li key={i} className="text-[14px] text-gray-700 flex items-start gap-2">
                            <span className="text-gray-300 mt-0.5 shrink-0">—</span>
                            <span>{typeof edge === 'string' ? edge : `${edge.title}: ${edge.link}`}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentTopic.registryApplication && (
                    <div className="rounded-2xl p-4 bg-amber-50">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardCheck size={14} className="text-amber-500" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-500">Registry Application</p>
                      </div>
                      <p className="text-[15px] text-gray-700 leading-relaxed">{currentTopic.registryApplication}</p>
                    </div>
                  )}

                  {currentTopic.checkpoint && (
                    <div className="rounded-2xl p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-gray-500" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Checkpoint</p>
                      </div>
                      {typeof currentTopic.checkpoint === 'string' ? (
                        <p className="text-[15px] text-gray-700 leading-relaxed">{currentTopic.checkpoint}</p>
                      ) : (
                        <div className="space-y-2">
                          {currentTopic.checkpoint.pearl && (
                            <p className="text-[15px] text-gray-700 leading-relaxed">{currentTopic.checkpoint.pearl}</p>
                          )}
                          {currentTopic.checkpoint.reflection && (
                            <p className="text-[14px] text-gray-500 italic leading-relaxed">{currentTopic.checkpoint.reflection}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTopic.keyTerms && currentTopic.keyTerms.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Key Terms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentTopic.keyTerms.slice(0, 8).map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-[13px] text-gray-600 font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <div className="h-px flex-1 bg-gray-100" />
                  <p className="text-[12px] font-semibold text-gray-300">Tap to flip · swipe to rate</p>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
              </button>
            )}
            </div>{/* end swipeable wrapper */}

            {/* Know / Review buttons — always visible after flip */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
                className="w-11 h-11 flex items-center justify-center rounded-2xl border border-gray-200 bg-white disabled:opacity-30 active:bg-gray-50 shrink-0"
              >
                <ChevronLeft size={18} className="text-gray-500" />
              </button>

              {isFlipped ? (
                <>
                  <button
                    onClick={handleDontKnow}
                    className="flex-1 h-11 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 text-[14px] font-bold active:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                    Review Again
                  </button>
                  <button
                    onClick={handleKnow}
                    className="flex-1 h-11 rounded-2xl text-white text-[14px] font-bold active:opacity-90 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#3abc83' }}
                  >
                    <CheckCircle2 size={16} />
                    Got It
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex-1 h-11 rounded-2xl bg-white border border-gray-200 text-gray-700 text-[14px] font-semibold active:bg-gray-50 transition-all"
                >
                  Reveal Answer
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentCardIndex === topics.length - 1}
                className="w-11 h-11 flex items-center justify-center rounded-2xl border border-gray-200 bg-white disabled:opacity-30 active:bg-gray-50 shrink-0"
              >
                <ChevronRight size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Stats */}
            {(knownTopics.size > 0 || unknownTopics.size > 0) && (
              <div className="flex items-center justify-center gap-4 py-1">
                <span className="text-[13px] font-semibold" style={{ color: '#3abc83' }}>{knownTopics.size} mastered</span>
                <span className="text-gray-200">·</span>
                <span className="text-[13px] font-semibold text-red-400">{unknownTopics.size} to review</span>
              </div>
            )}
          </div>
        </main>
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
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer relative"
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
  return (
    <AppLayout>
      <header className="px-4 sm:px-6 pt-14 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-1">
                Study Guide
              </h1>
              <p className="text-sm text-gray-500">
                Study with Quizlet-style flashcards or browse comprehensive materials
              </p>
            </div>
            <Link href="/practice">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Study Mode
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Progress strip */}
        {completedTopics.size > 0 && (() => {
          const total = content.categories.reduce((acc, cat) => acc + cat.topics.length, 0);
          const pct = Math.round((completedTopics.size / total) * 100);
          return (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Overall Progress</p>
                <p className="text-[11px] font-bold" style={{ color: '#3abc83' }}>{pct}%</p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#3abc83' }} />
              </div>
            </div>
          );
        })()}

        {/* Categories as dashboard-style list */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Study Categories</p>
        <div className="flex flex-col gap-2.5">
          {filteredCategories?.map((category, idx) => {
            const Icon = iconMap[category.icon] || BookOpen;
            const totalTopics = category.topics.length;
            const completedCount = category.topics.filter((t: any) => completedTopics.has(t.id)).length;
            const iconColors = [
              { bg: '#e8f8f2', color: '#3abc83' },
              { bg: '#eff6ff', color: '#3b82f6' },
              { bg: '#faf5ff', color: '#a855f7' },
              { bg: '#fff7ed', color: '#f97316' },
              { bg: '#fef2f2', color: '#ef4444' },
              { bg: '#f0fdf4', color: '#22c55e' },
            ];
            const c = iconColors[idx % iconColors.length];

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.bg }}>
                  <Icon size={17} style={{ color: c.color }} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900">{category.title}</p>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    {completedCount > 0
                      ? `${completedCount}/${totalTopics} topics completed`
                      : `${totalTopics} ${totalTopics === 1 ? 'topic' : 'topics'}`}
                  </p>
                </div>
                {completedCount === totalTopics && totalTopics > 0 && (
                  <CheckCircle2 size={16} style={{ color: '#3abc83' }} className="shrink-0" />
                )}
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </button>
            );
          })}
        </div>
      </main>
    </AppLayout>
  );
}
