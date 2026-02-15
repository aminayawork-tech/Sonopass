'use client';

import Link from 'next/link';
import { Brain, Zap, BookOpen, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <header className="p-6 bg-white/80 backdrop-blur-sm border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            SonoPass
          </h1>
          <Link href="/stats">
            <Button variant="outline" size="lg" className="font-bold border-2">
              <BarChart3 className="mr-2" />
              My Stats
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black mb-4 text-gray-800">
            Ace Your Vascular
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Registry Exam!
            </span>
          </h2>
          <p className="text-2xl text-gray-600 font-semibold">
            231 Real Practice Questions • Smart Study Tools • Track Your Progress
          </p>
        </div>

        {/* Exam Modes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Quick 10 */}
          <Link href="/exam/quick-10">
            <Card className="p-8 hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-xl group">
              <div className="flex flex-col items-center text-center">
                <Zap className="w-16 h-16 mb-4 text-white group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-2">Quick 10</h3>
                <p className="text-white font-semibold text-lg">
                  Fast practice session
                </p>
              </div>
            </Card>
          </Link>

          {/* Study by Section */}
          <Link href="/exam/study">
            <Card className="p-8 hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-green-400 to-emerald-500 border-0 shadow-xl group">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="w-16 h-16 mb-4 text-white group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-2">Study Mode</h3>
                <p className="text-white font-semibold text-lg">
                  Learn by sections
                </p>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 1 */}
          <Link href="/exam/mock-1">
            <Card className="p-8 hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-xl group">
              <div className="flex flex-col items-center text-center">
                <Brain className="w-16 h-16 mb-4 text-white group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-2">Mock Exam 1</h3>
                <p className="text-white font-semibold text-lg">
                  140 questions
                </p>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 2 */}
          <Link href="/exam/mock-2">
            <Card className="p-8 hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-pink-500 to-rose-600 border-0 shadow-xl group">
              <div className="flex flex-col items-center text-center">
                <Brain className="w-16 h-16 mb-4 text-white group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-2">Mock Exam 2</h3>
                <p className="text-white font-semibold text-lg">
                  91 questions
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Preview */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-4 border-purple-300">
          <h3 className="text-3xl font-black mb-6 text-gray-800">Your Progress</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="text-5xl font-black text-purple-600 mb-2">0</div>
              <div className="text-lg font-bold text-gray-700">Questions Answered</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-5xl font-black text-green-600 mb-2">0%</div>
              <div className="text-lg font-bold text-gray-700">Accuracy</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
              <div className="text-5xl font-black text-orange-600 mb-2">0</div>
              <div className="text-lg font-bold text-gray-700">Study Streak</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
