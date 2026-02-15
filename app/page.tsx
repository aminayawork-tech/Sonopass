'use client';

import Link from 'next/link';
import { vascularExams } from '@/data/vascular-exams';

export default function Home() {
  const totalQuestions = vascularExams.reduce((sum, exam) => sum + exam.questions.length, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Sono<span className="text-primary-600">Pass</span>
          </h1>
          <p className="text-xl text-gray-600">
            Ace Your Vascular Sonography Registry Exam
          </p>
          <div className="mt-4 inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold">
            {totalQuestions} Questions Available
          </div>
        </div>

        {/* Study Modes */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Quick 10 Mode */}
          <Link href="/quick-10">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-500">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick 10</h2>
              <p className="text-gray-600">
                Practice with 10 random questions. Perfect for quick study sessions.
              </p>
              <div className="mt-4 text-primary-600 font-semibold flex items-center">
                Start Practice
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Full Exam Mode */}
          <Link href="/exams">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Full Exams</h2>
              <p className="text-gray-600">
                Take complete practice exams to simulate the real test experience.
              </p>
              <div className="mt-4 text-blue-600 font-semibold flex items-center">
                View Exams
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Available Exams */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Exams</h2>
          <div className="space-y-4">
            {vascularExams.map((exam) => (
              <div key={exam.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                <p className="text-sm text-gray-600">{exam.description}</p>
                <p className="text-sm text-primary-600 mt-1">{exam.questions.length} questions</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note about adding questions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Add Your PDF Exams</h3>
          <p className="text-blue-800 text-sm">
            This app comes with sample questions. To add your 3 PDF exams, share them and I&apos;ll help you convert them to the app format!
          </p>
        </div>
      </div>
    </div>
  );
}
