'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StatsPage() {
  // TODO: Load actual stats from localStorage/database
  const stats = {
    totalQuestions: 231,
    answeredQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    studyStreak: 0,
    lastStudied: null,
    categoryProgress: {
      'Cerebrovascular': { answered: 0, correct: 0, total: 53 },
      'Arterial Anatomy': { answered: 0, correct: 0, total: 30 },
      'Arterial Hemodynamics': { answered: 0, correct: 0, total: 28 },
      'Physics & Instrumentation': { answered: 0, correct: 0, total: 18 },
      'Arterial Disease': { answered: 0, correct: 0, total: 16 },
      'General & Other': { answered: 0, correct: 0, total: 62 },
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <header className="p-6 bg-white/80 backdrop-blur-sm border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            📊 Your Stats
          </h1>
          <Link href="/">
            <Button variant="outline" size="lg" className="font-bold border-2">
              <ArrowLeft className="mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-8 bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-12 h-12 text-white" />
              <div className="text-right">
                <div className="text-5xl font-black text-white">{stats.answeredQuestions}</div>
                <div className="text-lg font-bold text-purple-100">Questions Done</div>
              </div>
            </div>
            <Progress value={(stats.answeredQuestions / stats.totalQuestions) * 100} className="h-3 bg-purple-700" />
            <div className="text-sm font-bold text-purple-100 mt-2">
              {stats.answeredQuestions} / {stats.totalQuestions}
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-12 h-12 text-white" />
              <div className="text-right">
                <div className="text-5xl font-black text-white">{stats.accuracy}%</div>
                <div className="text-lg font-bold text-green-100">Accuracy</div>
              </div>
            </div>
            <Progress value={stats.accuracy} className="h-3 bg-green-700" />
            <div className="text-sm font-bold text-green-100 mt-2">
              {stats.correctAnswers} correct answers
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-orange-500 to-yellow-500 border-0 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-12 h-12 text-white" />
              <div className="text-right">
                <div className="text-5xl font-black text-white">{stats.studyStreak}</div>
                <div className="text-lg font-bold text-orange-100">Day Streak</div>
              </div>
            </div>
            <div className="text-sm font-bold text-orange-100 mt-6">
              Keep it up! Study daily to build your streak 🔥
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-pink-500 to-rose-600 border-0 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-12 h-12 text-white" />
              <div className="text-right">
                <div className="text-3xl font-black text-white">Ready!</div>
                <div className="text-lg font-bold text-pink-100">Exam Status</div>
              </div>
            </div>
            <div className="text-sm font-bold text-pink-100 mt-6">
              Start practicing to track your readiness
            </div>
          </Card>
        </div>

        {/* Category Progress */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-4 border-purple-300">
          <h2 className="text-4xl font-black text-gray-800 mb-8">Progress by Category</h2>

          <div className="space-y-6">
            {Object.entries(stats.categoryProgress).map(([category, data]) => {
              const progress = data.total > 0 ? (data.answered / data.total) * 100 : 0;
              const accuracy = data.answered > 0 ? (data.correct / data.answered) * 100 : 0;

              return (
                <div key={category} className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-black text-gray-800">{category}</h3>
                    <div className="text-right">
                      <div className="text-3xl font-black text-purple-600">{data.answered}/{data.total}</div>
                      <div className="text-sm font-bold text-gray-600">
                        {accuracy > 0 ? `${Math.round(accuracy)}% accuracy` : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-4 bg-purple-200" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Study Tips */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-xl text-white">
          <h2 className="text-4xl font-black mb-6">💡 Study Tips</h2>
          <ul className="space-y-3 text-lg font-semibold">
            <li>• Study consistently - aim for at least 10 questions per day</li>
            <li>• Focus on weak areas - review categories with lower accuracy</li>
            <li>• Take mock exams under timed conditions to simulate the real test</li>
            <li>• Review explanations carefully to understand why answers are correct</li>
            <li>• Build your streak - daily practice helps with retention!</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
