'use client';

import { useEffect, useState } from 'react';
import ExamInterface from '@/components/ExamInterface';
import { shuffleQuestions } from '@/lib/shuffle';
import { useModality } from '@/contexts/ModalityContext';
import TabNavigation from '@/components/TabNavigation';

export default function Quick10Page() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [key, setKey] = useState(0);
  const { currentModality, loadQuestions } = useModality();

  useEffect(() => {
    const loadData = async () => {
      if (!currentModality) return;

      try {
        const questionsData = await loadQuestions();
        const allQuestions = [...questionsData.exam1, ...questionsData.exam2];
        setQuestions(shuffleQuestions(allQuestions).slice(0, 10));
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    loadData();
  }, [key, currentModality, loadQuestions]);

  if (questions.length === 0 || !currentModality) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <TabNavigation />
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <TabNavigation />
      <ExamInterface
        key={key}
        questions={questions}
        title="Quick 10"
        mode="practice"
        examId="quick-10"
        modality={currentModality.id}
        onRestart={() => setKey(k => k + 1)}
      />
    </>
  );
}
