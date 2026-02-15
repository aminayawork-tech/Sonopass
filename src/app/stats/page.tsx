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
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="p-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            <span className="text-gray-800">Sono</span>
            <span className="text-emerald-600">Pass</span>
            <span className="text-gray-600 text-2xl ml-3">Stats</span>
          </h1>
          <Link href="/">
            <Button variant="outline" size="lg" className="font-semibold">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Questions Done</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.answeredQuestions}</div>
            <Progress value={(stats.answeredQuestions / stats.totalQuestions) * 100} className="h-2 bg-gray-100" />
            <div className="text-xs text-gray-500 mt-2">
              {stats.answeredQuestions} / {stats.totalQuestions}
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Accuracy</div>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.accuracy}%</div>
            <Progress value={stats.accuracy} className="h-2 bg-emerald-100" />
            <div className="text-xs text-gray-500 mt-2">
              {stats.correctAnswers} correct answers
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Day Streak</div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.studyStreak}</div>
            <div className="text-xs text-gray-500 mt-6">
              Study daily to build your streak
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Exam Status</div>
            </div>
            <div className="text-2xl font-bold text-indigo-600 mb-2">Ready!</div>
            <div className="text-xs text-gray-500 mt-6">
              Start practicing to track your readiness
            </div>
          </Card>
        </div>

        {/* Category Progress */}
        <Card className="p-8 bg-white shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress by Category</h2>

          <div className="space-y-4">
            {Object.entries(stats.categoryProgress).map(([category, data]) => {
              const progress = data.total > 0 ? (data.answered / data.total) * 100 : 0;
              const accuracy = data.answered > 0 ? (data.correct / data.answered) * 100 : 0;

              return (
                <div key={category} className="p-5 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">{data.answered}/{data.total}</div>
                      <div className="text-xs text-gray-600">
                        {accuracy > 0 ? `${Math.round(accuracy)}% accuracy` : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-200" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Study Tips */}
        <Card className="mt-12 p-8 bg-white shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Study Tips</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Study consistently - aim for at least 10 questions per day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Focus on weak areas - review categories with lower accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Take mock exams under timed conditions to simulate the real test</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Review explanations carefully to understand why answers are correct</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Build your streak - daily practice helps with retention</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
