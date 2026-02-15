'use client';

import Link from 'next/link';
import { vascularExams } from '@/data/vascular-exams';

export default function ExamsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Full Practice Exams</h1>
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
          <p className="text-gray-600">
            Take complete practice exams to prepare for your vascular sonography registry.
          </p>
        </div>

        {/* Exam Cards */}
        <div className="space-y-6">
          {vascularExams.map((exam, index) => (
            <div key={exam.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
                      <p className="text-sm text-gray-600">{exam.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {exam.questions.length} questions
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ~{Math.ceil(exam.questions.length * 1.5)} mins
                    </div>
                  </div>

                  {/* Question categories preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Array.from(new Set(exam.questions.map(q => q.category).filter(Boolean))).map((category) => (
                      <span
                        key={category}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/exams/${exam.id}`}
                  className="ml-4 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
                >
                  Start Exam
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Exam Tips
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Take your time to read each question carefully</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Review explanations to reinforce your learning</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Aim for 70% or higher to simulate passing the registry</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Retake exams to improve your score and understanding</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
