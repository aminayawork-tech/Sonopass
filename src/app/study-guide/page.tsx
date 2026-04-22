'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import {
  Brain, Activity, AlertTriangle, ClipboardList, Zap,
  Search, BookOpen, ChevronRight, Check, ArrowLeft,
  Lightbulb, Star, ListChecks, Info, CheckCircle2,
  ChevronLeft, RotateCw, XCircle, Shuffle
} from 'lucide-react';

interface Image {
  filename: string;
  caption: string;
}

interface Section {
  title: string;
  content: string;
}

interface Topic {
  id: string;
  title: string;
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

  const [puzzleContent, setPuzzleContent] = useState<any>(null);

  useEffect(() => {
    fetch('/study-guide-content.json')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load study guide:', err));

    fetch('/puzzle-study-guide.json')
      .then(res => res.json())
      .then(data => setPuzzleContent(data))
      .catch(err => console.error('Failed to load puzzle guide:', err));

    // Load completed topics from localStorage
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

  const currentPuzzlePiece = useMemo(() => {
    if (!puzzleContent || !selectedCategory) return null;
    const topics = selectedCategory.topics;
    const currentTopic = topics[currentCardIndex];
    if (!currentTopic) return null;
    const cat = puzzleContent.categories.find((c: any) => c.id === selectedCategory.id);
    if (!cat) return null;
    return cat.puzzlePieces?.find((p: any) => p.id === currentTopic.id) ?? null;
  }, [puzzleContent, selectedCategory, currentCardIndex]);

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
    const progress = topics.length > 0 ? Math.round(((knownTopics.size + unknownTopics.size) / topics.length) * 100) : 0;

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

    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <header className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      setSelectedCategory(null);
                      setViewMode('flashcards');
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Categories</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCategory.title}</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Flashcard mode</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode('list')}
                    variant="outline"
                    size="sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">List View</span>
                  </Button>
                  <Button
                    onClick={handleShuffle}
                    variant="outline"
                    size="sm"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{knownTopics.size + unknownTopics.size} / {topics.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Flashcard */}
              <div className="perspective-1000 min-h-[400px] sm:min-h-[450px]">
                <div
                  className={`relative w-full h-[70vh] sm:h-[450px] max-h-[600px] cursor-pointer transition-transform duration-500 preserve-3d`}
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front of card - Topic Title & Summary */}
                  <Card
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl flex items-center justify-center p-6 sm:p-8 backface-hidden overflow-y-auto"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-center">
                      <div className="mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3 sm:mb-4">
                          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
                        {currentTopic.title}
                      </h2>
                      {currentTopic.quickSummary && (
                        <p className="text-base sm:text-lg text-blue-100 mb-3 sm:mb-4 max-w-2xl mx-auto px-4">
                          {currentTopic.quickSummary}
                        </p>
                      )}
                      <p className="text-blue-100 text-xs sm:text-sm">Tap to reveal details</p>
                    </div>
                  </Card>

                  {/* Back of card - Puzzle Format */}
                  <Card
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-2xl p-4 sm:p-6 lg:p-8 backface-hidden overflow-y-auto"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="text-white h-full flex flex-col max-w-3xl">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 flex-shrink-0">
                        {currentPuzzlePiece?.title}
                      </h3>

                      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 text-xs sm:text-sm">
                        {/* Core Piece */}
                        {currentPuzzlePiece?.corePiece && (
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span>🧩</span> Core Piece
                            </h4>
                            <p className="leading-relaxed">{currentPuzzlePiece.corePiece}</p>
                          </div>
                        )}

                        {/* Why Lock */}
                        {currentPuzzlePiece?.whyLock && (
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span>🔐</span> The Why Lock
                            </h4>
                            <p className="leading-relaxed">{currentPuzzlePiece.whyLock}</p>
                          </div>
                        )}

                        {/* Connection Edges */}
                        {currentPuzzlePiece?.connectionEdges && currentPuzzlePiece.connectionEdges.length > 0 && (
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span>🔗</span> Connection Edges
                            </h4>
                            <ul className="space-y-1.5">
                              {currentPuzzlePiece.connectionEdges.map((edge: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-0.5 flex-shrink-0">→</span>
                                  <span className="flex-1">{edge}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Registry Application */}
                        {currentPuzzlePiece?.registryApplication && (
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span>📋</span> Registry Application
                            </h4>
                            <p className="leading-relaxed italic">{currentPuzzlePiece.registryApplication}</p>
                          </div>
                        )}

                        {/* Puzzle Checkpoint */}
                        {currentPuzzlePiece?.puzzleCheckpoint && (
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span>✨</span> Puzzle Complete Checkpoint
                            </h4>
                            <p className="leading-relaxed">{currentPuzzlePiece.puzzleCheckpoint}</p>
                          </div>
                        )}
                      </div>

                      <p className="text-green-100 text-xs sm:text-sm mt-3 sm:mt-4 flex-shrink-0 text-center">Tap to flip back</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex gap-2 sm:gap-3 flex-1">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentCardIndex === 0}
                    variant="outline"
                    className="flex-1 h-11 sm:h-10 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentCardIndex === topics.length - 1}
                    variant="outline"
                    className="flex-1 h-11 sm:h-10 text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 sm:ml-2" />
                  </Button>
                </div>
              </div>

              {/* Know / Don't Know Buttons */}
              {isFlipped && (
                <div className="flex gap-2 sm:gap-4">
                  <Button
                    onClick={handleDontKnow}
                    variant="outline"
                    className="flex-1 h-12 sm:h-11 border-2 border-red-500 text-red-600 hover:bg-red-50 text-sm sm:text-base"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">Need to Review</span>
                    <span className="xs:hidden">Review</span>
                  </Button>
                  <Button
                    onClick={handleKnow}
                    className="flex-1 h-12 sm:h-11 bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">I Know This</span>
                    <span className="xs:hidden">Know</span>
                  </Button>
                </div>
              )}

              {/* Card Counter */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Card {currentCardIndex + 1} of {topics.length}
                </p>
                {knownTopics.size > 0 || unknownTopics.size > 0 ? (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-emerald-600 font-semibold">{knownTopics.size} mastered</span>
                    {' • '}
                    <span className="text-red-600 font-semibold">{unknownTopics.size} to review</span>
                  </p>
                ) : null}
              </div>
            </div>
          </main>

          <style jsx global>{`
            .perspective-1000 {
              perspective: 1000px;
            }
            .preserve-3d {
              transform-style: preserve-3d;
            }
            .backface-hidden {
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
          `}</style>
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
          <header className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-100 sticky top-0 z-10">
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
      <header className="px-4 sm:px-6 py-6 sm:py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
                RVT Study Guide
              </h1>
              <p className="text-base text-gray-500">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
              <p className="text-sm text-gray-500">
                {completedTopics.size} of {content.categories.reduce((acc, cat) => acc + cat.topics.length, 0)} topics completed
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-emerald-500 rounded-full h-2 transition-all duration-500"
              style={{
                width: `${(completedTopics.size / content.categories.reduce((acc, cat) => acc + cat.topics.length, 0)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Study Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories?.map((category) => {
              const Icon = iconMap[category.icon] || BookOpen;
              const totalTopics = category.topics.length;
              const completedCount = category.topics.filter(t => completedTopics.has(t.id)).length;

              return (
                <div
                  key={category.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {totalTopics} {totalTopics === 1 ? 'topic' : 'topics'}
                      </p>
                      {completedCount > 0 && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {completedCount} completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
