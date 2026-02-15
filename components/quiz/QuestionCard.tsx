'use client';

import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number;
  showExplanation: boolean;
  onAnswer: (answerIndex: number) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  showExplanation,
  onAnswer,
}: QuestionCardProps) {
  const getOptionClassName = (index: number) => {
    const baseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all";

    if (!showExplanation) {
      return `${baseClasses} ${
        selectedAnswer === index
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-primary-300 bg-white'
      }`;
    }

    if (index === question.correctAnswer) {
      return `${baseClasses} border-green-500 bg-green-50`;
    }

    if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return `${baseClasses} border-red-500 bg-red-50`;
    }

    return `${baseClasses} border-gray-200 bg-gray-50 opacity-60`;
  };

  const getOptionIcon = (index: number) => {
    if (!showExplanation) return null;

    if (index === question.correctAnswer) {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-primary-600">
            Question {questionNumber}
          </span>
          {question.category && (
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {question.category}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showExplanation && onAnswer(index)}
            disabled={showExplanation}
            className={getOptionClassName(index)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option}</span>
              {getOptionIcon(index)}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`p-4 rounded-lg ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-blue-50 border-2 border-blue-200'
        }`}>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Explanation</h3>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
