'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, X, Home, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: string;
  number: number;
  question: string;
  options: Option[];
  category: string;
  correctAnswer: string | null;
  explanation: string | null;
}

interface ExamInterfaceProps {
  questions: Question[];
  title: string;
  mode: 'practice' | 'exam';
  showResults?: boolean;
}

export default function ExamInterface({ questions, title, mode, showResults = true }: ExamInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (letter: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: letter
    }));

    if (mode === 'practice') {
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleSubmit = () => {
    setCompleted(true);
  };

  // Calculate score
  const correctAnswers = Object.entries(answers).filter(([id, answer]) => {
    const q = questions.find(q => q.id === id);
    return q?.correctAnswer === answer;
  }).length;

  const score = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;

  if (completed && showResults) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-white shadow-md border border-gray-200">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 text-gray-800">
                Exam Complete!
              </h1>

              <div className="mb-12">
                <div className="text-7xl font-bold text-emerald-600 mb-4">
                  {score}%
                </div>
                <p className="text-2xl font-semibold text-gray-700">
                  {correctAnswers} / {answeredCount} Correct
                </p>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-emerald-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{correctAnswers}</div>
                  <div className="text-sm font-medium text-gray-600">Correct</div>
                </div>
                <div className="p-6 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">{answeredCount - correctAnswers}</div>
                  <div className="text-sm font-medium text-gray-600">Incorrect</div>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{questions.length}</div>
                  <div className="text-sm font-medium text-gray-600">Total</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="font-semibold text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700">
                    <Home className="mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold text-lg px-8 py-6"
                  onClick={() => {
                    setCurrentIndex(0);
                    setAnswers({});
                    setCompleted(false);
                    setShowAnswer(false);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Home className="mr-2 w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>

          {/* Progress and Score */}
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Progress: {currentIndex + 1}/{questions.length}</span>
            <span className="text-gray-600">Correct: {correctAnswers}/{answeredCount} ({score}%)</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Question Card */}
        <Card className="p-8 bg-white shadow-sm border border-gray-200">
          {/* Question header */}
          <div className="flex justify-between items-start mb-6">
            <span className="text-emerald-600 font-semibold text-lg">
              Question {currentIndex + 1}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options - NO letter badges, checkmark/X on RIGHT */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.letter;
              const isCorrect = currentQuestion.correctAnswer === option.letter;
              const showCorrectness = showAnswer && mode === 'practice';

              return (
                <button
                  key={option.letter}
                  onClick={() => !showAnswer && handleAnswer(option.letter)}
                  disabled={showAnswer && mode === 'practice'}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all relative",
                    !showAnswer && "bg-white border-gray-200 hover:border-emerald-400 hover:bg-gray-50",
                    showCorrectness && isCorrect && "bg-emerald-50 border-emerald-600",
                    showCorrectness && isSelected && !isCorrect && "bg-red-50 border-red-600",
                    showCorrectness && !isCorrect && !isSelected && "bg-gray-50 border-gray-200 opacity-50",
                  )}
                >
                  <div className="flex items-center justify-between pr-2">
                    <span className={cn(
                      "text-base",
                      showCorrectness && isCorrect && "text-gray-900 font-medium",
                      showCorrectness && isSelected && !isCorrect && "text-gray-900 font-medium",
                      showCorrectness && !isCorrect && !isSelected && "text-gray-500",
                    )}>
                      {option.text}
                    </span>
                    {showCorrectness && isCorrect && (
                      <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 ml-3" />
                    )}
                    {showCorrectness && isSelected && !isCorrect && (
                      <X className="w-6 h-6 text-red-600 flex-shrink-0 ml-3" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswer && mode === 'practice' && currentQuestion.explanation && (
            <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="px-6 py-5"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>

          {currentIndex === questions.length - 1 ? (
            mode === 'exam' && answeredCount === questions.length ? (
              <Button
                onClick={handleSubmit}
                className="px-6 py-5 bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={() => setCompleted(true)}
                className="px-6 py-5 bg-emerald-600 hover:bg-emerald-700"
              >
                Finish
              </Button>
            )
          ) : (
            <Button
              onClick={handleNext}
              className="px-6 py-5 bg-emerald-600 hover:bg-emerald-700"
            >
              Next
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
