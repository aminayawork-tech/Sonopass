'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, ArrowLeft, ChevronLeft, ChevronRight, RotateCw, CheckCircle, XCircle, Shuffle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModality } from '@/contexts/ModalityContext';
import AppLayout from '@/components/layout/AppLayout';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

// Category color mapping for glossary badges
const getCategoryColors = (category: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    'anatomy': { bg: 'bg-rose-100', text: 'text-rose-700' },
    'doppler': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'pathology': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'technique': { bg: 'bg-blue-100', text: 'text-blue-700' },
  };

  return colorMap[category] || { bg: 'bg-emerald-100', text: 'text-emerald-700' };
};

export default function GlossaryPage() {
  const { currentModality } = useModality();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flashcards' | 'list'>('flashcards');

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownTerms, setKnownTerms] = useState<Set<number>>(new Set());
  const [unknownTerms, setUnknownTerms] = useState<Set<number>>(new Set());

  // Load glossary terms based on current modality
  useEffect(() => {
    const loadGlossaryTerms = async () => {
      setLoading(true);
      try {
        // Determine which glossary to load based on modality
        const glossaryPath = currentModality?.id === 'spi'
          ? '/glossary/spi/terms.json'
          : '/glossary/vascular/terms.json';

        const response = await fetch(glossaryPath);
        const data = await response.json();
        setTerms(data);
      } catch (error) {
        console.error('Failed to load glossary terms:', error);
        setTerms([]);
      } finally {
        setLoading(false);
      }
    };

    loadGlossaryTerms();
  }, [currentModality]);

  // Get unique categories from terms
  const categories = useMemo(() => {
    const cats = new Set(terms.map(t => t.category));
    return ['all', ...Array.from(cats)].sort();
  }, [terms]);

  // Filter and search terms
  const filteredTerms = useMemo(() => {
    let filtered = terms;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t => t.term.toLowerCase().includes(query) ||
             t.definition.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically
    return filtered.sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, selectedCategory, searchQuery]);

  const currentTerm = filteredTerms[currentCardIndex];
  const progress = filteredTerms.length > 0 ? Math.round(((knownTerms.size + unknownTerms.size) / filteredTerms.length) * 100) : 0;

  const handleNext = () => {
    if (currentCardIndex < filteredTerms.length - 1) {
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
    const newKnown = new Set(knownTerms);
    newKnown.add(currentCardIndex);
    setKnownTerms(newKnown);
    unknownTerms.delete(currentCardIndex);
    handleNext();
  };

  const handleDontKnow = () => {
    const newUnknown = new Set(unknownTerms);
    newUnknown.add(currentCardIndex);
    setUnknownTerms(newUnknown);
    knownTerms.delete(currentCardIndex);
    handleNext();
  };

  const handleShuffle = () => {
    setKnownTerms(new Set());
    setUnknownTerms(new Set());
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Flashcard View
  const renderFlashcardView = () => {
    if (filteredTerms.length === 0) {
      return (
        <Card className="p-8 text-center bg-white">
          <div className="text-gray-500">No terms found matching your search.</div>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{knownTerms.size + unknownTerms.size} / {filteredTerms.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 min-h-[400px]">
          <div
            className={`relative w-full h-[400px] cursor-pointer transition-transform duration-500 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front of card */}
            <Card
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl flex items-center justify-center p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${getCategoryColors(currentTerm.category).bg} ${getCategoryColors(currentTerm.category).text}`}>
                  {currentTerm.category}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                  {currentTerm.term}
                </h2>
                <p className="text-blue-100 text-sm">Click to reveal definition</p>
              </div>
            </Card>

            {/* Back of card */}
            <Card
              className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-2xl flex items-center justify-center p-8 backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  {currentTerm.term}
                </h3>
                <p className="text-base sm:text-xl text-white leading-relaxed max-w-2xl">
                  {currentTerm.definition}
                </p>
                <p className="text-green-100 text-sm mt-4">Click to flip back</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-3 flex-1">
            <Button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentCardIndex === filteredTerms.length - 1}
              variant="outline"
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Know / Don't Know Buttons */}
        {isFlipped && (
          <div className="flex gap-4">
            <Button
              onClick={handleDontKnow}
              variant="outline"
              className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Don't Know
            </Button>
            <Button
              onClick={handleKnow}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I Know This
            </Button>
          </div>
        )}

        {/* Card Counter */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Card {currentCardIndex + 1} of {filteredTerms.length}
          </p>
          {knownTerms.size > 0 || unknownTerms.size > 0 ? (
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-emerald-600 font-semibold">{knownTerms.size} known</span>
              {' • '}
              <span className="text-red-600 font-semibold">{unknownTerms.size} to review</span>
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  // List View (original)
  const renderListView = () => {
    if (filteredTerms.length === 0) {
      return (
        <Card className="p-8 text-center bg-white">
          <div className="text-gray-500">No terms found matching your search.</div>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredTerms.map((term, index) => (
          <Card key={index} className="p-4 sm:p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{term.term}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getCategoryColors(term.category).bg} ${getCategoryColors(term.category).text}`}>
                    {term.category}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {term.definition}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link href="/practice" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Study Mode</span>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black">
                <span className="text-gray-800">Sono</span>
                <span className="text-emerald-500">Pass</span>
                <span className="text-gray-600 ml-2">Glossary</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                {currentModality?.name || 'Ultrasound'} Terms & Definitions
              </p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Search and Filter Controls */}
        <Card className="p-4 sm:p-6 bg-white shadow-md border border-gray-200 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search terms or definitions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="pl-10 w-full"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setViewMode('flashcards')}
                  variant={viewMode === 'flashcards' ? 'default' : 'outline'}
                  className={viewMode === 'flashcards' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Flashcards
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  className={viewMode === 'list' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {/* Category Filter and Shuffle */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              {viewMode === 'flashcards' && (
                <Button
                  onClick={handleShuffle}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredTerms.length}</span> of {terms.length} terms
            </div>
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <Card className="p-8 text-center bg-white">
            <div className="text-gray-500">Loading glossary terms...</div>
          </Card>
        ) : viewMode === 'flashcards' ? (
          renderFlashcardView()
        ) : (
          renderListView()
        )}
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
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </AppLayout>
  );
}
