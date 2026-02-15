'use client';

import { Question } from '@/lib/types';
import { useState } from 'react';

interface ResultsCardProps {
  questions: Question[];
  selectedAnswers: number[];
  onRestart: () => void;
}

export default function ResultsCard({ questions, selectedAnswers, onRestart }: ResultsCardProps) {
  const [showReview, setShowReview] = useState(false);

  const correctCount = selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const passed = percentage >= 70;

  const getGrade = () => {
    if (percentage >= 90) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 80) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 70) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const grade = getGrade();

  if (showReview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Review Your Answers</h1>
          <button
            onClick={() => setShowReview(false)}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Back to Results
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correctAnswer;
            return (
              <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex-1">
                    {index + 1}. {question.question}
                  </h3>
                  {isCorrect ? (
                    <span className="flex-shrink-0 ml-4 text-green-600 font-semibold">✓ Correct</span>
                  ) : (
                    <span className="flex-shrink-0 ml-4 text-red-600 font-semibold">✗ Incorrect</span>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  {question.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[index] === optIndex;
                    const isCorrectAnswer = optIndex === question.correctAnswer;

                    let className = "p-2 rounded text-sm ";
                    if (isCorrectAnswer) {
                      className += "bg-green-50 border-l-4 border-green-500 font-medium";
                    } else if (isSelected && !isCorrect) {
                      className += "bg-red-50 border-l-4 border-red-500";
                    }

                    if (isCorrectAnswer || isSelected) {
                      return (
                        <div key={optIndex} className={className}>
                          {option}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Explanation:</p>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Score Circle */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${grade.bg} mb-4`}>
            <div className="text-center">
              <div className={`text-5xl font-bold ${grade.color}`}>{percentage}%</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {passed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600">
            You got {correctCount} out of {questions.length} questions correct
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{correctCount}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{questions.length - correctCount}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${grade.color}`}>{grade.letter}</div>
            <div className="text-sm text-gray-600">Grade</div>
          </div>
        </div>

        {/* Performance Message */}
        <div className={`p-4 rounded-lg mb-6 ${
          passed
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-yellow-50 border-2 border-yellow-200'
        }`}>
          <p className={passed ? 'text-green-800' : 'text-yellow-800'}>
            {passed
              ? 'Excellent work! You would pass the registry exam with this score. Keep up the great studying!'
              : 'You need 70% or higher to pass. Review the explanations and try again!'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowReview(true)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Review Answers
          </button>
          <button
            onClick={onRestart}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
