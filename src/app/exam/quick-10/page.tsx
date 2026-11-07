'use client';

import { useEffect, useState } from 'react';
import ExamInterface from '@/components/ExamInterface';
import { ProPaywall } from '@/components/AccessGuard';
import { shuffleQuestions } from '@/lib/shuffle';
import { useModality } from '@/contexts/ModalityContext';
import { useAuth } from '@/contexts/AuthContext';
import { allQuestions } from '@/lib/questions';
import { completeTodaysQuickTen, quickTenAccess, startTodaysQuickTen, type QuickTenAccess } from '@/lib/freeQuota';

export default function Quick10Page() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [key, setKey] = useState(0);
  const [blocked, setBlocked] = useState<Exclude<QuickTenAccess, { allowed: true }> | null>(null);
  const { currentModality, allModalities, loadQuestions } = useModality();
  const { isPro, ready, proReady } = useAuth();
  const accessKnown = ready && proReady;

  useEffect(() => {
    const loadData = async () => {
      if (!currentModality || !accessKnown) return;

      try {
        const all = allQuestions<any>(await loadQuestions());
        if (isPro) {
          setBlocked(null);
          setQuestions(shuffleQuestions(all).slice(0, 10));
          return;
        }
        // Free: one set of 10 per day, on one registry; coming back resumes the same 10
        const access = quickTenAccess(currentModality.id);
        if (!access.allowed) {
          setBlocked(access);
          return;
        }
        setBlocked(null);
        if (access.resumeIds) {
          const byId = new Map(all.map((q) => [q.id, q]));
          const resumed = access.resumeIds.map((id) => byId.get(id)).filter(Boolean);
          if (resumed.length === access.resumeIds.length) {
            setQuestions(resumed);
            return;
          }
        }
        const picked = shuffleQuestions(all).slice(0, 10);
        startTodaysQuickTen(currentModality.id, picked.map((q) => q.id));
        setQuestions(picked);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    loadData();
  }, [key, currentModality, loadQuestions, isPro, accessKnown]);

  if (blocked) {
    const usedOn = allModalities.find((m) => m.id === blocked.modality)?.shortName ?? 'another registry';
    return (
      <ProPaywall
        title={blocked.reason === 'used' ? 'You’ve done today’s free Quick 10' : `Today’s free Quick 10 was for ${usedOn}`}
        message={
          blocked.reason === 'used'
            ? 'Come back tomorrow for another free set, or go Pro for unlimited questions, every mock exam and all the flashcards.'
            : `Free members get one Quick 10 a day on one registry. Switch back to ${usedOn}, come back tomorrow, or go Pro to study every registry.`
        }
      />
    );
  }

  if (questions.length === 0 || !currentModality) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ExamInterface
      key={key}
      questions={questions}
      title="Quick 10"
      mode="practice"
      examId="quick-10"
      modality={currentModality.id}
      onComplete={isPro ? undefined : completeTodaysQuickTen}
      onRestart={() => setKey(k => k + 1)}
    />
  );
}
