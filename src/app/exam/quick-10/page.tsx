'use client';

import { useEffect, useState } from 'react';
import ExamInterface from '@/components/ExamInterface';
import questionsData from '@/data/vascular-questions.json';
import { shuffleQuestions } from '@/lib/shuffle';

export default function Quick10Page() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const allQuestions = [...questionsData.exam1, ...questionsData.exam2];
    setQuestions(shuffleQuestions(allQuestions).slice(0, 10));
  }, [key]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ExamInterface
      key={key}
      questions={questions}
      title="Quick 10"
      mode="practice"
      examId="quick-10"
      onRestart={() => setKey(k => k + 1)}
    />
  );
}
