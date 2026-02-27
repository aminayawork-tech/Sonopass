'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Brain, Activity, AlertTriangle, ClipboardList, Zap,
  Search, BookOpen, ChevronRight, Check, ArrowLeft
} from 'lucide-react';

interface Image {
  filename: string;
  caption: string;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  keyTerms: string[];
  images: Image[];
}

interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
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

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  'blue': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'red': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  'orange': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'green': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  'purple': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
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
        topic.content.toLowerCase().includes(query) ||
        topic.keyTerms.some(term => term.toLowerCase().includes(query))
      )
    );
  });

  if (!content) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
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
      <div className="min-h-screen bg-[#F5F7FA]">
        <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">{selectedCategory.title}</div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{selectedTopic.title}</h1>
              </div>
              <Button
                variant={completedTopics.has(selectedTopic.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTopicComplete(selectedTopic.id)}
                className="flex items-center gap-1"
              >
                {completedTopics.has(selectedTopic.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Completed
                  </>
                ) : (
                  <>Mark Complete</>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Card className="p-6 sm:p-8 bg-white shadow-md mb-6">
            {/* Content */}
            <div className="prose prose-sm sm:prose max-w-none mb-6">
              {selectedTopic.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Images */}
            {selectedTopic.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Visual References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTopic.images.map((image, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <div className="aspect-video flex items-center justify-center p-4 bg-white">
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
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.keyTerms.map((term, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            {prevTopic ? (
              <Button
                variant="outline"
                onClick={() => setSelectedTopic(prevTopic)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {prevTopic.title}
              </Button>
            ) : (
              <div />
            )}
            {nextTopic && (
              <Button
                onClick={() => setSelectedTopic(nextTopic)}
                className="flex items-center gap-2 ml-auto"
              >
                {nextTopic.title}
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
    const colors = colorMap[selectedCategory.color] || colorMap['blue'];
    const totalTopics = selectedCategory.topics.length;
    const completedCount = selectedCategory.topics.filter(t => completedTopics.has(t.id)).length;
    const progress = (completedCount / totalTopics) * 100;

    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="mb-3 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedCategory.title}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {completedCount} of {totalTopics} topics completed ({Math.round(progress)}%)
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategory.topics.map((topic) => {
              const isCompleted = completedTopics.has(topic.id);
              return (
                <Card
                  key={topic.id}
                  className="p-6 hover:shadow-md transition-all cursor-pointer bg-white border border-gray-200 relative"
                  onClick={() => setSelectedTopic(topic)}
                >
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {topic.content.split('\n\n')[0]}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{topic.keyTerms.length} key terms</span>
                    {topic.images.length > 0 && (
                      <span>{topic.images.length} {topic.images.length === 1 ? 'image' : 'images'}</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-emerald-600 font-medium text-sm">
                    Read more
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
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
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                <span className="text-gray-800">RVT Study Guide</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Comprehensive study materials for your vascular registry exam
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
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
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Progress Overview */}
        <Card className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md mb-8">
          <h2 className="text-xl font-bold mb-2">Your Progress</h2>
          <p className="text-emerald-50 mb-4">
            {completedTopics.size} of {content.categories.reduce((acc, cat) => acc + cat.topics.length, 0)} topics completed
          </p>
          <div className="w-full bg-emerald-400/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{
                width: `${(completedTopics.size / content.categories.reduce((acc, cat) => acc + cat.topics.length, 0)) * 100}%`
              }}
            />
          </div>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories?.map((category) => {
            const Icon = iconMap[category.icon] || BookOpen;
            const colors = colorMap[category.color] || colorMap['blue'];
            const totalTopics = category.topics.length;
            const completedCount = category.topics.filter(t => completedTopics.has(t.id)).length;

            return (
              <Card
                key={category.id}
                className={`p-6 hover:shadow-lg transition-all cursor-pointer bg-white border-2 ${colors.border}`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {totalTopics} {totalTopics === 1 ? 'topic' : 'topics'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {completedCount}/{totalTopics} complete
                  </span>
                  <ChevronRight className={`w-5 h-5 ${colors.text}`} />
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
