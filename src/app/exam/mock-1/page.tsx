'use client';

import { useEffect, useState } from 'react';
import ExamInterface from '@/components/ExamInterface';
import questionsData from '@/data/vascular-questions.json';
import { shuffleQuestions } from '@/lib/shuffle';

export default function MockExam1Page() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    setQuestions(shuffleQuestions(questionsData.exam1));
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ExamInterface
      questions={questions}
      title="Mock Exam 1"
      mode="exam"
      examId="mock-1"
    />
  );
}
