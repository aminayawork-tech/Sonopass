'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Star,
  Award,
  Clock,
  Target
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-black">
                <span className="text-gray-900">Sono</span>
                <span style={{ color: '#3abc83' }}>Pass</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button style={{ backgroundColor: '#3abc83' }} className="hover:opacity-90 text-white">
                  Sign Up Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: '#e8f8f2', color: '#3abc83' }}>
              <Zap className="w-4 h-4" />
              Trusted by Sonography Students Nationwide
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6">
              Pass Your Sonography
              <br />
              <span style={{ color: '#3abc83' }}>Registry Exam</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              The complete exam prep platform for RVT, SPI, and ARDMS certification.
              Master your exam with practice questions, study guides, and proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" style={{ backgroundColor: '#3abc83' }} className="hover:opacity-90 text-white text-lg h-14 px-8">
                  Start Studying Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                  Log In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free practice questions
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ backgroundColor: '#3abc83' }}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black mb-2" style={{ color: '#3abc83' }}>1000+</div>
              <div className="text-gray-600 font-medium">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2" style={{ color: '#3abc83' }}>95%</div>
              <div className="text-gray-600 font-medium">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2" style={{ color: '#3abc83' }}>24/7</div>
              <div className="text-gray-600 font-medium">Study Access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2" style={{ color: '#3abc83' }}>4.9★</div>
              <div className="text-gray-600 font-medium">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
              Everything You Need to Pass
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive study materials designed by experienced sonographers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#e8f8f2' }}>
                <Brain className="w-6 h-6" style={{ color: '#3abc83' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Practice Questions</h3>
              <p className="text-gray-600">
                1000+ exam-style questions with detailed explanations. Practice by topic or take full mock exams.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Study Guides</h3>
              <p className="text-gray-600">
                Comprehensive study guides covering all exam topics with clinical pearls and key concepts.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Learning</h3>
              <p className="text-gray-600">
                AI-powered study recommendations based on your performance and weak areas.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your performance, identify weak areas, and monitor improvement over time.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mock Exams</h3>
              <p className="text-gray-600">
                Full-length practice exams that simulate the real registry experience.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Study</h3>
              <p className="text-gray-600">
                Study anytime, anywhere on any device. Perfect for busy schedules.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
              Your Path to Success
            </h2>
            <p className="text-xl text-gray-600">
              Simple, effective, proven
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: '#3abc83' }}>
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Exam</h3>
              <p className="text-gray-600">
                Select RVT, SPI, or other ARDMS certification. Access tailored content for your specific exam.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: '#3abc83' }}>
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Study & Practice</h3>
              <p className="text-gray-600">
                Use study guides, flashcards, and practice questions. Track your progress and focus on weak areas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: '#3abc83' }}>
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pass Your Exam</h3>
              <p className="text-gray-600">
                Walk into your exam confident and prepared. Join thousands who have passed with SonoPass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #3abc83, #2a9d6f)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ready to Pass Your Registry Exam?
          </h2>
          <p className="text-xl mb-8" style={{ color: '#e8f8f2' }}>
            Join thousands of successful sonographers who prepared with SonoPass
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-lg h-14 px-8" style={{ color: '#3abc83' }}>
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="mt-4" style={{ color: '#e8f8f2' }}>
            Free practice questions • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-black mb-4">
                <span className="text-white">Sono</span>
                <span style={{ color: '#3abc83' }}>Pass</span>
              </h3>
              <p className="text-sm">
                The complete exam prep platform for sonography registry exams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/practice" className="hover:text-white">Practice Questions</Link></li>
                <li><Link href="/study-guide" className="hover:text-white">Study Guides</Link></li>
                <li><Link href="/exam/mock-exams" className="hover:text-white">Mock Exams</Link></li>
                <li><Link href="/glossary" className="hover:text-white">Glossary</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <p className="text-sm mb-4">
                Get exam tips and study strategies delivered to your inbox.
              </p>
              <Link href="/support">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SonoPass. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
