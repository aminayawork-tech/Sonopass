'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';
import ProgressBar from './ProgressBar';

interface QuizComponentProps {
  questions: Question[];
  title: string;
  onRestart: () => void;
}

export default function QuizComponent({ questions, title, onRestart }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(selectedAnswers[currentQuestionIndex - 1] !== -1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowExplanation(false);
    setIsComplete(false);
    onRestart();
  };

  if (isComplete) {
    return (
      <ResultsCard
        questions={questions}
        selectedAnswers={selectedAnswers}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <a
            href="/"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </a>
        </div>
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
          correct={selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length}
        />
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={currentAnswer}
        showExplanation={showExplanation}
        onAnswer={handleAnswer}
      />

      {/* Navigation */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>

        {showExplanation && (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        )}

        {!showExplanation && (
          <button
            disabled
            className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
          >
            Select an answer
          </button>
        )}
      </div>
    </div>
  );
}
