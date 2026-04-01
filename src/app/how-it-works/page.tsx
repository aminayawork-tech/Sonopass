'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Info, BookOpen, Brain, TrendingUp } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">How does this work</h1>
          <p className="text-gray-600">Learn how SonoPass helps you ace your ultrasound registry exam</p>
        </div>

        <Card className="p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Info className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Study Smart</h2>
              <p className="text-gray-600">
                SonoPass uses spaced repetition and adaptive learning to help you master ultrasound concepts efficiently.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Practice Questions</h2>
              <p className="text-gray-600">
                Access thousands of practice questions covering all modalities, with detailed explanations for every answer.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mock Exams</h2>
              <p className="text-gray-600">
                Take full-length practice exams that simulate the real test environment and timing.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h2>
              <p className="text-gray-600">
                Monitor your improvement with detailed analytics, track your weak areas, and see your readiness score.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
