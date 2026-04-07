'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Video, Trophy, Calendar, Plus, UserPlus, MessageSquare, Target } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function StudyTogetherPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Together</h1>
          <p className="text-gray-600 mt-1">
            Collaborate with peers, join study rooms, and learn together
          </p>
        </div>

        {/* Hero Section */}
        <Card className="p-8 bg-gradient-to-r from-sono-green-ultrasound to-sono-green-soft text-white rounded-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">Learn Better Together</h2>
              <p className="text-white/90 text-lg mb-6">
                Join study rooms, compete on leaderboards, and share quizzes with friends.
                Collaborative learning helps you stay motivated and achieve better results!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-sono-green-ultrasound hover:bg-gray-50 font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Study Room
                </Button>
                <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
              </div>
            </div>
            <div className="p-6 bg-white/20 rounded-2xl">
              <Users className="w-24 h-24" />
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Study Together Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Live Study Rooms */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Study Rooms</h3>
              <p className="text-gray-600 text-sm mb-4">
                Join or create live study sessions with voice chat, screen sharing, and synchronized practice questions
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>

            {/* Leaderboards */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="p-3 bg-amber-100 rounded-xl w-fit mb-4">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Leaderboards</h3>
              <p className="text-gray-600 text-sm mb-4">
                Compete with friends and peers on weekly and all-time leaderboards. Track your ranking and progress
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>

            {/* Scheduled Sessions */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Scheduled Sessions</h3>
              <p className="text-gray-600 text-sm mb-4">
                Plan study sessions in advance and get reminders. Build a consistent study routine with your group
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>

            {/* Group Chat */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="p-3 bg-emerald-100 rounded-xl w-fit mb-4">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Group Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Ask questions, share resources, and discuss tricky topics with your study group
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>

            {/* Shared Quizzes */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="p-3 bg-pink-100 rounded-xl w-fit mb-4">
                <Target className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Shared Quizzes</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create and share custom quiz sets with your study buddies. Challenge each other!
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>

            {/* Friend System */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="p-3 bg-indigo-100 rounded-xl w-fit mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Friend System</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect with other learners, track each other&apos;s progress, and motivate one another
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>
          </div>
        </div>

        {/* Current Study Buddy Link */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Try Study Buddy (Current)</h3>
              <p className="text-gray-700">
                While we build these features, you can use our current Study Buddy feature for basic collaboration
              </p>
            </div>
            <Link href="/study-buddy">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Open Study Buddy
              </Button>
            </Link>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Why Study Together?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                <strong>Stay Motivated:</strong> Learning with others keeps you accountable and engaged
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                <strong>Learn Faster:</strong> Discussing concepts with peers deepens understanding
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                <strong>Build Connections:</strong> Meet other aspiring sonographers and build your professional network
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                <strong>Gamify Learning:</strong> Compete on leaderboards and make studying fun
              </p>
            </li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
