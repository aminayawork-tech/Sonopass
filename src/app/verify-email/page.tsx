'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
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
          <p className="text-gray-600">Email Verification</p>
        </div>

        {/* Status Display */}
        <div className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-sono-green-ultrasound animate-spin" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">
                  Redirecting to login...
                </p>
              </div>
              <Link href="/login">
                <Button className="bg-sono-green-ultrasound hover:bg-sono-green-soft text-white">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-4">{message}</p>
              </div>
              <div className="flex gap-3">
                <Link href="/login">
                  <Button variant="outline">
                    Back to Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-sono-green-ultrasound hover:bg-sono-green-soft text-white">
                    Sign Up Again
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
