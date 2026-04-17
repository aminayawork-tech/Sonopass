'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link');
      return;
    }

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
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sono-green-ultrasound/10 to-sono-blue-soft/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-black mb-2">
              <span className="text-gray-900">Sono</span>
              <span className="text-sono-green-ultrasound">Pass</span>
            </h1>
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-800">Invalid or missing reset link</p>
            </div>
            <Link href="/forgot-password" className="mt-6 inline-block">
              <Button className="bg-sono-green-ultrasound hover:bg-sono-green-soft text-white">
                Request New Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sono-green-ultrasound/10 to-sono-blue-soft/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-gray-900">Sono</span>
            <span className="text-sono-green-ultrasound">Pass</span>
          </h1>
          <p className="text-gray-600">Reset your password</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">Password reset successfully!</p>
              <p className="text-xs text-green-700">
                Redirecting to login...
              </p>
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
            <p className="text-sm text-gray-600 mb-6">
              Enter your new password below.
            </p>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
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
                  Confirm New Password
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
                className="w-full bg-sono-green-ultrasound hover:bg-sono-green-soft text-white font-semibold h-12"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
