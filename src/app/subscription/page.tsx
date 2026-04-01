'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { CreditCard, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Subscription</h1>
          <p className="text-gray-600">View and manage your SonoPass subscription</p>
        </div>

        <Card className="p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Current Plan</h2>
              <p className="text-2xl font-bold text-emerald-600">Free Trial</p>
              <p className="text-sm text-gray-600">Full access to all features</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Billing Cycle</h2>
                <p className="text-gray-600 mb-1">Next billing date</p>
                <p className="text-lg font-semibold text-gray-900">No active subscription</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Payment Method</h2>
                <p className="text-gray-600 mb-3">No payment method on file</p>
                <Button variant="outline" size="sm">
                  Add Payment Method
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 rounded-2xl shadow-md bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Upgrade to Premium</h2>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span className="text-gray-700">Unlimited practice questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span className="text-gray-700">Access to all mock exams</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span className="text-gray-700">Detailed performance analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span className="text-gray-700">Study together features</span>
            </li>
          </ul>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Upgrade Now - $9.99/month
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
}
