'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-6 rounded-2xl shadow-md prose max-w-none">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Agreement to Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using SonoPass, you agree to be bound by these Terms of Use and all applicable laws and regulations.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Use License</h3>
          <p className="text-gray-600 mb-4">
            Permission is granted to temporarily access the materials on SonoPass for personal, non-commercial study purposes only.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">User Responsibilities</h3>
          <p className="text-gray-600 mb-4">
            You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Disclaimer</h3>
          <p className="text-gray-600">
            SonoPass is a study tool and does not guarantee exam success. Results may vary based on individual effort and preparation.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
