'use client';

import ExamInterface from '@/components/ExamInterface';
import questionsData from '@/data/vascular-questions.json';

export default function MockExam2Page() {
  return (
    <ExamInterface
      questions={questionsData.exam2}
      title="🎯 Mock Exam 2"
      mode="exam"
    />
  );
}
