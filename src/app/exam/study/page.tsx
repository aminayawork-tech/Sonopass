'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import questionsData from '@/data/vascular-questions.json';
import ExamInterface from '@/components/ExamInterface';

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all unique categories and count questions
  const allQuestions = [...questionsData.exam1, ...questionsData.exam2];
  const categoryMap = new Map<string, any[]>();

  allQuestions.forEach(q => {
    if (!categoryMap.has(q.category)) {
      categoryMap.set(q.category, []);
    }
    categoryMap.get(q.category)!.push(q);
  });

  const categories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1].length - a[1].length);

  // Category colors
  const categoryColors = [
    'from-purple-400 to-purple-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-orange-500',
    'from-pink-400 to-rose-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-cyan-600',
    'from-red-400 to-red-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-orange-600',
    'from-violet-400 to-violet-600',
  ];

  // If category is selected, show exam interface
  if (selectedCategory) {
    const questions = categoryMap.get(selectedCategory) || [];
    return (
      <ExamInterface
        questions={questions}
        title={`📚 ${selectedCategory}`}
        mode="practice"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <header className="p-6 bg-white/80 backdrop-blur-sm border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            📚 Study by Section
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
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-800 mb-4">
            Choose Your Topic
          </h2>
          <p className="text-2xl font-semibold text-gray-600">
            Master one section at a time
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(([category, questions], index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="group"
            >
              <Card className={`p-8 hover:scale-105 transition-all bg-gradient-to-br ${categoryColors[index % categoryColors.length]} border-0 shadow-xl h-full`}>
                <div className="flex flex-col items-center text-center text-white">
                  <BookOpen className="w-16 h-16 mb-4 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-2xl font-black mb-3">{category}</h3>
                  <div className="text-5xl font-black mb-2">{questions.length}</div>
                  <p className="text-lg font-semibold">Questions</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
