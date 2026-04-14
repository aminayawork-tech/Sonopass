'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats } from '@/lib/userStats';
import {
  BookOpen, GraduationCap, Library, Users, ChevronRight,
  Zap, Target, Search, TrendingUp, CheckCircle, Heart, Brain,
  Activity, BarChart3, AlertTriangle, Stethoscope, Waves, Sparkles
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

type TabType = 'topics' | 'study-guide' | 'glossary';

export default function StudyModePage() {
  const { currentModality } = useModality();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('topics');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setStats(getStats());
  }, []);

  // Load categories dynamically based on modality
  useEffect(() => {
    const loadCategories = async () => {
      if (!currentModality) return;

      try {
        const response = await fetch(`/study-guides/${currentModality.id}/categories.json`);
        if (response.ok) {
          const data = await response.json();

          // Map categories with icon components and progress data
          const mappedCategories = Array.isArray(data) ? data.map((cat: any, idx: number) => ({
            id: cat.id,
            name: cat.title,
            icon: cat.icon, // We'll handle icon mapping in the render
            progress: 0, // TODO: Calculate actual progress from stats
            completed: 0,
            total: cat.questionCount || 0,
          })) : [];

          setCategories(mappedCategories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback to empty array
        setCategories([]);
      }
    };

    loadCategories();
  }, [currentModality]);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  // Map emoji/icon names to lucide-react icons
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      '🫀': Heart,
      'heart': Heart,
      '📖': BookOpen,
      'book': BookOpen,
      '🧠': Brain,
      'brain': Brain,
      '❤️': Heart,
      '📊': BarChart3,
      'activity': Activity,
      '⚠️': AlertTriangle,
      'alert-triangle': AlertTriangle,
      '⚡': Zap,
      'zap': Zap,
      '🔊': Waves,
      'waves': Waves,
      '🎯': Target,
      'target': Target,
      '🛡️': Stethoscope,
      'shield': Stethoscope,
      'default': BookOpen,
    };
    return iconMap[iconName] || iconMap['default'];
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sono-gray-900">Study Mode</h1>
          <p className="text-sm sm:text-base text-sono-gray-600 mt-1">
            Your unified learning hub — topics, guides, glossary, and study groups
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-1 shadow-sm border border-sono-gray-300 flex gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'topics'
                ? 'bg-sono-green-ultrasound text-white shadow-md'
                : 'text-sono-gray-600 hover:bg-sono-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 inline-block mr-1.5" />
            Topics
          </button>
          <button
            onClick={() => setActiveTab('study-guide')}
            className={`flex-1 min-w-[110px] px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'study-guide'
                ? 'bg-sono-green-ultrasound text-white shadow-md'
                : 'text-sono-gray-600 hover:bg-sono-gray-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 inline-block mr-1.5" />
            Study Guide
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'bg-sono-green-ultrasound text-white shadow-md'
                : 'text-sono-gray-600 hover:bg-sono-gray-100'
            }`}
          >
            <Library className="w-4 h-4 inline-block mr-1.5" />
            Glossary
          </button>
        </div>

        {/* Universal Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sono-gray-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'topics' ? 'topics' : activeTab === 'study-guide' ? 'study materials' : 'terms'}...`}
            className="w-full pl-12 pr-4 py-4 bg-white border border-sono-gray-300 rounded-2xl text-sono-gray-900 placeholder-sono-gray-500 focus:outline-none focus:ring-2 focus:ring-sono-green-ultrasound transition-all shadow-sm"
          />
        </div>

        {/* Content Area */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900">Topic Categories</h2>
              <Link href="/exam/study">
                <Button variant="link" className="text-sono-green-ultrasound text-sm">
                  Start Quiz →
                </Button>
              </Link>
            </div>

            {/* Category List */}
            <div className="space-y-3">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <Link key={category.id} href={`/exam/study?category=${encodeURIComponent(category.name)}`}>
                    <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 shadow-sm hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer rounded-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#39b981]/10 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#39b981]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sono-gray-900 text-base sm:text-lg mb-1">
                              {category.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-sono-gray-600">
                              {category.completed}/{category.total} questions
                            </p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex-1 sm:w-40">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-medium text-sono-gray-600">Progress</span>
                              <span className="text-sm font-bold text-sono-gray-900">{category.progress}%</span>
                            </div>
                            <div className="h-2 bg-sono-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-500 rounded-full"
                                style={{ width: `${category.progress}%`, backgroundColor: '#39b981' }}
                              />
                            </div>
                          </div>

                          {/* CTA */}
                          <Button
                            size="sm"
                            className="flex-shrink-0 text-white hover:opacity-90"
                            style={{ backgroundColor: '#39b981' }}
                          >
                            {category.progress >= 90 ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Review
                              </>
                            ) : category.progress > 0 ? (
                              'Continue →'
                            ) : (
                              'Start →'
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <Link href="/exam/quick-10">
                <Card className="p-5 bg-gradient-to-br from-sono-green-ultrasound to-sono-green-soft text-sono-gray-900 hover:shadow-lg transition-all cursor-pointer rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Quick 10</h3>
                  </div>
                  <p className="text-sm opacity-90">10 random questions for daily practice</p>
                </Card>
              </Link>

              <Link href="/progress">
                <Card className="p-5 bg-gradient-to-br from-sono-blue-soft to-sono-blue-light text-white hover:shadow-lg transition-all cursor-pointer rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6" />
                    <h3 className="font-bold text-lg">View Progress</h3>
                  </div>
                  <p className="text-sm opacity-90">See detailed analytics and weak areas</p>
                </Card>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'study-guide' && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900">Study Guide</h2>
            <Link href="/study-guide">
              <Card className="p-6 bg-white border border-sono-gray-300 shadow-sm hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-4 bg-sono-green-ultrasound/10 rounded-xl">
                      <GraduationCap className="w-8 h-8 text-sono-green-ultrasound" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sono-gray-900 text-lg mb-1">View Full Study Guide</h3>
                      <p className="text-sm text-sono-gray-600">Comprehensive theory, anatomy & protocols</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-sono-gray-400" />
                </div>
              </Card>
            </Link>
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900">Glossary</h2>
            <Link href="/glossary">
              <Card className="p-6 bg-white border border-sono-gray-300 shadow-sm hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-4 bg-sono-blue-soft/10 rounded-xl">
                      <Library className="w-8 h-8 text-sono-blue-soft" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sono-gray-900 text-lg mb-1">View Full Glossary</h3>
                      <p className="text-sm text-sono-gray-600">Essential medical terms & definitions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-sono-gray-400" />
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Performance Insight */}
        {accuracy > 0 && accuracy < 75 && (
          <Card className="p-5 sm:p-6 bg-gradient-to-r from-sono-green-ultrasound/5 to-sono-blue-soft/5 border border-sono-green-ultrasound/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-sono-green-ultrasound/10 rounded-xl flex-shrink-0">
                <Target className="w-6 h-6 text-sono-green-ultrasound" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sono-gray-900 mb-1">Boost Your Registry Readiness</h3>
                <p className="text-sm text-sono-gray-600">
                  Master these topics to improve your accuracy from {accuracy}% to {Math.min(100, accuracy + 15)}%
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
