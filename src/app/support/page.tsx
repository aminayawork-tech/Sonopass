'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Support</h1>
          <p className="text-gray-600">We're here to help you succeed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Email Support</h2>
                <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Send Email
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h2>
                <p className="text-gray-600 mb-4">Chat with our support team</p>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Start Chat
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">FAQ</h2>
              <p className="text-gray-600 mb-4">Find answers to common questions</p>
              <div className="space-y-3">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="font-semibold text-gray-900">How do I reset my password?</h3>
                  <p className="text-sm text-gray-600">Visit the login page and click "Forgot Password"</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Can I access SonoPass offline?</h3>
                  <p className="text-sm text-gray-600">Some features are available offline in our mobile app</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">How do I track my progress?</h3>
                  <p className="text-sm text-gray-600">Visit the Progress page to see detailed analytics</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
