'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-6 space-y-6">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight mb-1">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-6 rounded-2xl shadow-md prose max-w-none">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Your Privacy Matters</h2>
          <p className="text-gray-600 mb-4">
            At SonoPass, we take your privacy seriously. This policy outlines how we collect, use, and protect your information.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Information We Collect</h3>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us, such as your study progress, quiz results, and account preferences.
          </p>
          <p className="text-gray-600 mb-4">
            On the sonopass.com website only, we use Vercel Web Analytics to count page views and see which pages are used. It does not use cookies and does not track you across other websites. The SonoPass iPhone and Android apps do not include analytics or advertising.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">How We Use Your Information</h3>
          <p className="text-gray-600 mb-4">
            We use your information to provide personalized learning experiences, track your progress, and improve our services.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Data Security</h3>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your personal information from unauthorized access.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
