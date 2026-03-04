'use client';

import { useEffect, useState } from 'react';
import ExamInterface from '@/components/ExamInterface';
import { shuffleQuestions } from '@/lib/shuffle';
import { useModality } from '@/contexts/ModalityContext';

export default function MockExam2Page() {
  const [questions, setQuestions] = useState<any[]>([]);
  const { currentModality, loadQuestions } = useModality();

  useEffect(() => {
    const loadData = async () => {
      if (!currentModality) return;

      try {
        const questionsData = await loadQuestions();
        setQuestions(shuffleQuestions(questionsData.exam2));
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    loadData();
  }, [currentModality, loadQuestions]);

  if (questions.length === 0 || !currentModality) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ExamInterface
      questions={questions}
      title="Mock Exam 2"
      mode="exam"
      examId="mock-2"
      modality={currentModality.id}
    />
  );
}
