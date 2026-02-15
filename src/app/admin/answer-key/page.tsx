'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: string;
  number: number;
  question: string;
  options: Option[];
  correctAnswer: string | null;
  explanation: string | null;
}

interface ParsedData {
  exam1: Question[];
  exam2: Question[];
}

export default function AnswerKeyAdmin() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [currentExam, setCurrentExam] = useState<'exam1' | 'exam2'>('exam1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load parsed questions
    fetch('/parsed_questions.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentQuestion) return;

      // Arrow keys for navigation
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }

      // A, B, C, D keys for selecting answers
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        const option = currentQuestion.options.find(opt => opt.letter === key);
        if (option) {
          handleAnswerSelect(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, currentIndex, currentExam]);

  if (!data) {
    return <div className="p-8">Loading questions...</div>;
  }

  const questions = data[currentExam];
  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentExam === 'exam1') {
      setCurrentExam('exam2');
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentExam === 'exam2') {
      setCurrentExam('exam1');
      setCurrentIndex(data.exam1.length - 1);
    }
  };

  const handleExport = () => {
    // Update questions with answers
    const updatedData = {
      exam1: data.exam1.map(q => ({
        ...q,
        correctAnswer: answers[q.id] || null
      })),
      exam2: data.exam2.map(q => ({
        ...q,
        correctAnswer: answers[q.id] || null
      }))
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(updatedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_with_answers.json';
    a.click();
  };

  const progress = Object.keys(answers).length;
  const total = data.exam1.length + data.exam2.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Answer Key Admin</h1>
          <p className="text-gray-600">
            Mark the correct answers for each question
          </p>
          <div className="mt-4 flex gap-4">
            <div className="text-sm">
              Progress: <span className="font-bold">{progress}/{total}</span>
            </div>
            <div className="text-sm">
              Exam: <span className="font-bold">{currentExam === 'exam1' ? 'Practice Exam 1' : 'Practice Exam 2'}</span>
            </div>
            <div className="text-sm">
              Question: <span className="font-bold">{currentIndex + 1}/{questions.length}</span>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestion.number}
            </div>
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          <RadioGroup
            value={answers[currentQuestion.id]}
            onValueChange={handleAnswerSelect}
          >
            {currentQuestion.options.map((option) => (
              <div key={option.letter} className="flex items-start space-x-3 mb-3">
                <RadioGroupItem value={option.letter} id={option.letter} />
                <Label htmlFor={option.letter} className="cursor-pointer flex-1">
                  <span className="font-semibold">{option.letter}.</span> {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentExam === 'exam1' && currentIndex === 0}>
            Previous
          </Button>

          <Button onClick={handleExport} variant="outline">
            Export Answers ({progress}/{total})
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentExam === 'exam2' && currentIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Use keyboard: ← Previous | → Next | A/B/C/D to select answer
        </div>
      </div>
    </div>
  );
}
