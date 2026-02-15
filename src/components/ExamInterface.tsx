'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Home } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="p-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {title}
            </h1>
            <Link href="/">
              <Button variant="outline" className="font-semibold">
                <Home className="mr-2 w-5 h-5" />
                Exit
              </Button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-600">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg border border-gray-200">
            {currentQuestion.category}
          </span>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 bg-white shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
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
                    "w-full p-5 rounded-lg border-2 text-left transition-all font-semibold text-lg relative",
                    !showAnswer && "hover:shadow-lg",
                    !showAnswer && !isSelected && "bg-white border-gray-200 hover:border-emerald-400",
                    !showAnswer && isSelected && "bg-emerald-50 border-emerald-500 shadow-md",
                    // After answer is shown:
                    showCorrectness && isCorrect && "bg-emerald-100 border-emerald-600 border-4 shadow-xl ring-4 ring-emerald-200",
                    showCorrectness && isSelected && !isCorrect && "bg-red-100 border-red-600 border-4 shadow-xl ring-4 ring-red-200",
                    showCorrectness && !isCorrect && !isSelected && "opacity-50 border-gray-300",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span className={cn(
                      "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-base",
                      !showAnswer && !isSelected && "bg-gray-100 text-gray-600",
                      !showAnswer && isSelected && "bg-emerald-600 text-white",
                      showCorrectness && isCorrect && "bg-emerald-600 text-white",
                      showCorrectness && isSelected && !isCorrect && "bg-red-600 text-white",
                      showCorrectness && !isCorrect && !isSelected && "bg-gray-200 text-gray-500",
                    )}>
                      {showCorrectness && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                      {showCorrectness && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                      {(!showCorrectness || (!isCorrect && !isSelected)) && option.letter}
                    </span>
                    <div className="flex-1">
                      <span className="pt-1.5 block">{option.text}</span>
                      {showCorrectness && isCorrect && (
                        <span className="text-emerald-700 text-sm font-bold mt-2 block">✓ Correct Answer</span>
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <span className="text-red-700 text-sm font-bold mt-2 block">✗ Your Answer</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (if in practice mode and answer shown) */}
          {showAnswer && mode === 'practice' && currentQuestion.explanation && (
            <div className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-600 rounded-xl shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-900">Explanation</h3>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-gray-900 font-medium">{currentQuestion.explanation}</p>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            size="lg"
            variant="outline"
            className="font-semibold text-base px-6 py-6"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Previous
          </Button>

          <div className="text-center">
            {mode === 'exam' && answeredCount === questions.length && !completed && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="font-semibold text-base px-8 py-6 bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Exam
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            size="lg"
            className="font-semibold text-base px-6 py-6 bg-emerald-600 hover:bg-emerald-700"
          >
            Next
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
