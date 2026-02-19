'use client';

import { useEffect, useState } from 'react';
import ExamInterface from '@/components/ExamInterface';
import questionsData from '@/data/vascular-questions.json';

export default function Quick10Page() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Combine all questions from both exams
    const allQuestions = [...questionsData.exam1, ...questionsData.exam2];

    // Randomly select 10 questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return <ExamInterface questions={questions} title="Quick 10" mode="practice" examId="quick-10" />;
}
