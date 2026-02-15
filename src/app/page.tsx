'use client';

import Link from 'next/link';
import { Brain, Zap, BookOpen, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="p-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            <span className="text-gray-800">Sono</span>
            <span className="text-emerald-600">Pass</span>
          </h1>
          <Link href="/stats">
            <Button variant="outline" size="lg" className="font-semibold">
              <BarChart3 className="mr-2 w-5 h-5" />
              My Stats
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-3 text-gray-800">
            Master Your Vascular Registry Exam
          </h2>
          <p className="text-xl text-gray-600">
            231 Practice Questions • Smart Study Tools • Track Your Progress
          </p>
        </div>

        {/* Exam Modes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Quick 10 */}
          <Link href="/exam/quick-10">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-white border border-gray-200 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick 10</h3>
                <p className="text-gray-600 mb-4">
                  Fast practice session
                </p>
                <span className="text-emerald-600 font-semibold text-sm">Start Practice →</span>
              </div>
            </Card>
          </Link>

          {/* Study by Section */}
          <Link href="/exam/study">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-white border border-gray-200 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Study Mode</h3>
                <p className="text-gray-600 mb-4">
                  Learn by sections
                </p>
                <span className="text-blue-600 font-semibold text-sm">Start Learning →</span>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 1 */}
          <Link href="/exam/mock-1">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-white border border-gray-200 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mock Exam 1</h3>
                <p className="text-gray-600 mb-4">
                  140 questions
                </p>
                <span className="text-indigo-600 font-semibold text-sm">Take Exam →</span>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 2 */}
          <Link href="/exam/mock-2">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-white border border-gray-200 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mock Exam 2</h3>
                <p className="text-gray-600 mb-4">
                  91 questions
                </p>
                <span className="text-purple-600 font-semibold text-sm">Take Exam →</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Preview */}
        <Card className="p-8 bg-white shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Progress</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-gray-800 mb-2">0</div>
              <div className="text-sm font-medium text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center p-6 bg-emerald-50 rounded-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">0%</div>
              <div className="text-sm font-medium text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm font-medium text-gray-600">Study Streak</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
