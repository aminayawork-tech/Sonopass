'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      setSuccess(true);
      // Don't redirect - show success message instead
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sono-green-ultrasound/10 to-sono-blue-soft/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-gray-900">Sono</span>
            <span className="text-sono-green-ultrasound">Pass</span>
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">Account created successfully!</p>
              <p className="text-xs text-green-700">
                Please check your email to verify your account before logging in.
              </p>
              <Link href="/login" className="text-xs text-green-800 underline mt-2 inline-block">
                Go to login →
              </Link>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {!success && (
          <>
        {/* Benefits */}
        <div className="mb-6 space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-5 h-5 text-sono-green-ultrasound flex-shrink-0 mt-0.5" />
            <span>Track your progress across all study modes</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-5 h-5 text-sono-green-ultrasound flex-shrink-0 mt-0.5" />
            <span>Personalized study recommendations</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-5 h-5 text-sono-green-ultrasound flex-shrink-0 mt-0.5" />
            <span>Access from any device, anytime</span>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sono-green-ultrasound hover:bg-sono-green-soft text-white font-semibold h-12 mt-6"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
          </>
        )}

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-sono-green-ultrasound hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
}
