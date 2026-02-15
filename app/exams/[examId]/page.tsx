'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getExamById } from '@/data/vascular-exams';
import QuizComponent from '@/components/quiz/QuizComponent';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const [exam, setExam] = useState(getExamById(examId));

  useEffect(() => {
    if (!exam) {
      router.push('/exams');
    }
  }, [exam, router]);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Exam not found...</div>
      </div>
    );
  }

  const handleRestart = () => {
    // Refresh the exam (in a real app, you might shuffle questions here)
    setExam(getExamById(examId));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <QuizComponent
        questions={exam.questions}
        title={exam.title}
        onRestart={handleRestart}
      />
    </div>
  );
}
