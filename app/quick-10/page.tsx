'use client';

import { useState, useEffect } from 'react';
import { getQuick10Questions } from '@/data/vascular-exams';
import QuizComponent from '@/components/quiz/QuizComponent';
import { Question } from '@/lib/types';

export default function Quick10Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setQuestions(getQuick10Questions());
    setIsLoading(false);
  }, []);

  const handleRestart = () => {
    setQuestions(getQuick10Questions());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <QuizComponent
        questions={questions}
        title="Quick 10 Practice"
        onRestart={handleRestart}
      />
    </div>
  );
}
