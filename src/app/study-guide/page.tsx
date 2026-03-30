'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TabNavigation from '@/components/TabNavigation';
import {
  Brain, Activity, AlertTriangle, ClipboardList, Zap,
  Search, BookOpen, ChevronRight, Check, ArrowLeft,
  Lightbulb, Star, ListChecks, Info, CheckCircle2
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
  content?: string; // Legacy support
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
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/study-guide-content.json')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load study guide:', err));

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

  if (!content) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20 flex items-center justify-center">
        <p className="text-gray-600">Loading study guide...</p>
      </div>
    );
  }

  // Topic Detail View
  if (selectedTopic && selectedCategory) {
    const currentIndex = selectedCategory.topics.findIndex(t => t.id === selectedTopic.id);
    const prevTopic = currentIndex > 0 ? selectedCategory.topics[currentIndex - 1] : null;
    const nextTopic = currentIndex < selectedCategory.topics.length - 1 ? selectedCategory.topics[currentIndex + 1] : null;

    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20">
        <header className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">{selectedCategory.title}</div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedTopic.title}</h1>
              </div>
              <Button
                variant={completedTopics.has(selectedTopic.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTopicComplete(selectedTopic.id)}
                className={`flex items-center gap-2 ${
                  completedTopics.has(selectedTopic.id)
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {completedTopics.has(selectedTopic.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Completed</span>
                  </>
                ) : (
                  <><span className="hidden sm:inline">Mark Complete</span><span className="sm:hidden">Complete</span></>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
            {/* Quick Summary */}
            {selectedTopic.quickSummary && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-900 font-medium">{selectedTopic.quickSummary}</p>
              </div>
            )}

            {/* Clinical Pearls */}
            {selectedTopic.clinicalPearls && selectedTopic.clinicalPearls.length > 0 && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Clinical Pearls & Exam Tips</h4>
                    <ul className="space-y-2">
                      {selectedTopic.clinicalPearls.map((pearl, i) => (
                        <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>{pearl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Sections or Content */}
            {selectedTopic.sections && selectedTopic.sections.length > 0 ? (
              <div className="space-y-4 mb-6">
                {selectedTopic.sections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h4>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedTopic.content ? (
              <div className="prose prose-sm sm:prose max-w-none mb-6">
                {selectedTopic.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-700 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {/* Key Takeaways */}
            {selectedTopic.keyTakeaways && selectedTopic.keyTakeaways.length > 0 && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-900 mb-2">Key Takeaways</h4>
                    <ul className="space-y-2">
                      {selectedTopic.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">✓</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            {selectedTopic.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Visual References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTopic.images.map((image, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="aspect-video flex items-center justify-center p-4 bg-gray-50">
                        <img
                          src={`/images/study-guide/${image.filename}`}
                          alt={image.caption}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="text-center">
                                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                  <p class="text-xs text-gray-500">Image: ${image.filename}</p>
                                  <p class="text-xs text-gray-400 mt-1">Add image to public/images/study-guide/</p>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                      <div className="px-4 py-2 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Terms */}
            {selectedTopic.keyTerms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.keyTerms.map((term, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            {prevTopic ? (
              <Button
                variant="outline"
                onClick={() => setSelectedTopic(prevTopic)}
                className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="max-w-[150px] sm:max-w-none truncate">{prevTopic.title}</span>
              </Button>
            ) : (
              <div />
            )}
            {nextTopic && (
              <Button
                onClick={() => setSelectedTopic(nextTopic)}
                className="flex items-center gap-2 ml-auto bg-blue-600 hover:bg-blue-700"
              >
                <span className="max-w-[150px] sm:max-w-none truncate">{nextTopic.title}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Category Detail View
  if (selectedCategory) {
    const Icon = iconMap[selectedCategory.icon] || BookOpen;
    const totalTopics = selectedCategory.topics.length;
    const completedCount = selectedCategory.topics.filter(t => completedTopics.has(t.id)).length;
    const progress = (completedCount / totalTopics) * 100;

    return (
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedCategory.title}</h1>
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
                  onClick={() => setSelectedTopic(topic)}
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
                      {topic.quickSummary || (topic.content ? topic.content.split('\n\n')[0] : 'Click to learn more')}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {topic.keyTerms.length > 0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                          {topic.keyTerms.length} key terms
                        </span>
                      )}
                      {topic.images.length > 0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                          {topic.images.length} {topic.images.length === 1 ? 'image' : 'images'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                      Learn more
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // Categories Overview
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <TabNavigation />
      <header className="px-4 sm:px-6 py-6 sm:py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
                RVT Study Guide
              </h1>
              <p className="text-base text-gray-500">
                Comprehensive study materials for your vascular registry exam
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search topics, terms, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Progress Overview - Minimal Design */}
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

        {/* Categories Grid - Clean Homepage Style */}
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
    </div>
  );
}
