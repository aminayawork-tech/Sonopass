'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModality } from '@/contexts/ModalityContext';
import { BookOpen, Library, GraduationCap, Video, FileText, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function LearnPage() {
  const { currentModality } = useModality();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
          <p className="text-gray-600 mt-1">
            Study materials, guides, and reference content for {currentModality?.shortName || 'your exam'}
          </p>
        </div>

        {/* Main Learning Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Guide */}
          <Link href="/study-guide">
            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white cursor-pointer transition-all hover:shadow-lg h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentModality?.shortName || 'RVT'} Study Guide</h2>
              <p className="text-emerald-50 mb-4">
                Comprehensive study material covering theory, anatomy, protocols, and key concepts for the exam
              </p>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>Organized by topic</span>
              </div>
            </Card>
          </Link>

          {/* Vascular Glossary */}
          <Link href="/glossary">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white cursor-pointer transition-all hover:shadow-lg h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Library className="w-8 h-8" />
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Vascular Glossary</h2>
              <p className="text-blue-50 mb-4">
                Essential medical terms and definitions - search, filter, and master the terminology you need
              </p>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Searchable & filterable</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Coming Soon Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Video Lessons */}
            <Card className="p-5 bg-white border-2 border-dashed border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700">Video Lessons</h3>
              </div>
              <p className="text-sm text-gray-600">
                Step-by-step video tutorials covering key exam topics
              </p>
            </Card>

            {/* Flashcards */}
            <Card className="p-5 bg-white border-2 border-dashed border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700">Flashcards</h3>
              </div>
              <p className="text-sm text-gray-600">
                Digital flashcards for quick review and memorization
              </p>
            </Card>

            {/* Cheat Sheets */}
            <Card className="p-5 bg-white border-2 border-dashed border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700">Cheat Sheets</h3>
              </div>
              <p className="text-sm text-gray-600">
                Quick reference guides for exam day preparation
              </p>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <h3 className="font-bold text-gray-900 mb-2">💡 Study Tip</h3>
          <p className="text-gray-700">
            Start with the Study Guide to understand core concepts, then use the Glossary to
            reinforce terminology. Once you're comfortable, move to the Practice section to
            test your knowledge!
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
