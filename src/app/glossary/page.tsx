'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, ArrowLeft } from 'lucide-react';
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

  return (
    <AppLayout>
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search terms or definitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredTerms.length}</span> of {terms.length} terms
          </div>
        </Card>

        {/* Terms List */}
        {loading ? (
          <Card className="p-8 text-center bg-white">
            <div className="text-gray-500">Loading glossary terms...</div>
          </Card>
        ) : filteredTerms.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <div className="text-gray-500">No terms found matching your search.</div>
          </Card>
        ) : (
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
        )}
      </main>
    </AppLayout>
  );
}
