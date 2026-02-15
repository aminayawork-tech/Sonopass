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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-white shadow-2xl border-4 border-purple-300">
            <div className="text-center">
              <h1 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                🎉 Exam Complete!
              </h1>

              <div className="mb-12">
                <div className="text-8xl font-black text-purple-600 mb-4">
                  {score}%
                </div>
                <p className="text-3xl font-bold text-gray-700">
                  {correctAnswers} / {answeredCount} Correct
                </p>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-4xl font-black text-green-600 mb-2">{correctAnswers}</div>
                  <div className="text-lg font-bold text-gray-700">Correct</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
                  <div className="text-4xl font-black text-red-600 mb-2">{answeredCount - correctAnswers}</div>
                  <div className="text-lg font-bold text-gray-700">Incorrect</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <div className="text-4xl font-black text-purple-600 mb-2">{questions.length}</div>
                  <div className="text-lg font-bold text-gray-700">Total</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="font-black text-xl px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Home className="mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-black text-xl px-8 py-6 border-4"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <header className="p-6 bg-white/80 backdrop-blur-sm border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {title}
            </h1>
            <Link href="/">
              <Button variant="outline" className="font-bold border-2">
                <Home className="mr-2" />
                Exit
              </Button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-gray-700">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-3 bg-purple-200" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="px-6 py-3 bg-purple-600 text-white font-black text-lg rounded-full shadow-lg">
            📚 {currentQuestion.category}
          </span>
        </div>

        {/* Question Card */}
        <Card className="p-10 mb-8 bg-white shadow-2xl border-4 border-purple-300">
          <h2 className="text-3xl font-black text-gray-800 mb-8 leading-relaxed">
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
                    "w-full p-6 rounded-2xl border-4 text-left transition-all font-bold text-xl",
                    "hover:scale-102 hover:shadow-xl",
                    !showAnswer && !isSelected && "bg-white border-gray-300 hover:border-purple-400",
                    !showAnswer && isSelected && "bg-purple-100 border-purple-600 scale-102 shadow-lg",
                    showCorrectness && isCorrect && "bg-green-100 border-green-600",
                    showCorrectness && isSelected && !isCorrect && "bg-red-100 border-red-600",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl",
                      !showAnswer && !isSelected && "bg-gray-200 text-gray-700",
                      !showAnswer && isSelected && "bg-purple-600 text-white",
                      showCorrectness && isCorrect && "bg-green-600 text-white",
                      showCorrectness && isSelected && !isCorrect && "bg-red-600 text-white",
                    )}>
                      {showCorrectness && isCorrect && <CheckCircle2 />}
                      {showCorrectness && isSelected && !isCorrect && <XCircle />}
                      {(!showCorrectness || (!isCorrect && !isSelected)) && option.letter}
                    </span>
                    <span className="flex-1 pt-2">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (if in practice mode and answer shown) */}
          {showAnswer && mode === 'practice' && currentQuestion.explanation && (
            <div className="mt-8 p-6 bg-blue-50 border-4 border-blue-300 rounded-2xl">
              <h3 className="text-2xl font-black text-blue-900 mb-3">💡 Explanation</h3>
              <p className="text-lg font-semibold text-gray-700">{currentQuestion.explanation}</p>
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
            className="font-black text-xl px-8 py-6 border-4"
          >
            <ArrowLeft className="mr-2" />
            Previous
          </Button>

          <div className="text-center">
            {mode === 'exam' && answeredCount === questions.length && !completed && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="font-black text-xl px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Submit Exam
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            size="lg"
            className="font-black text-xl px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Next
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
