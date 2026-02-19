'use client';

import ExamInterface from '@/components/ExamInterface';
import questionsData from '@/data/vascular-questions.json';

export default function MockExam1Page() {
  return (
    <ExamInterface
      questions={questionsData.exam1}
      title="Mock Exam 1"
      mode="exam"
      examId="mock-1"
    />
  );
}
