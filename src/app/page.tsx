'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Brain, BookOpen, TrendingUp, ClipboardList,
  Star, Zap, ShieldCheck,
} from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/app/sonopass';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sonopass';

const FEATURES = [
  {
    Icon: Brain,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Practice Questions',
    desc: '1000+ exam-style questions with detailed explanations — practice by topic or take full mock exams.',
  },
  {
    Icon: ClipboardList,
    color: 'bg-blue-50 text-blue-600',
    title: 'Mock Exams',
    desc: 'Full-length timed practice tests that simulate the real RVT, SPI, and ARDMS registry experience.',
  },
  {
    Icon: BookOpen,
    color: 'bg-violet-50 text-violet-600',
    title: 'Study Guide',
    desc: 'Comprehensive guides covering all exam topics with clinical pearls, anatomy, and key concepts.',
  },
  {
    Icon: TrendingUp,
    color: 'bg-amber-50 text-amber-600',
    title: 'Progress Tracking',
    desc: 'Track your accuracy, identify weak areas, and monitor improvement over time with detailed analytics.',
  },
];

const STEPS = [
  { number: '01', title: 'Choose Your Exam', desc: 'Select RVT, SPI, or other ARDMS certification and get content tailored to your specific test.' },
  { number: '02', title: 'Study & Practice', desc: 'Use study guides, flashcards, and practice questions. Track your progress and focus on weak areas.' },
  { number: '03', title: 'Pass Your Exam', desc: 'Walk in confident and prepared. Join thousands of sonographers who passed with SonoPass.' },
];

const TESTIMONIALS = [
  {
    name: 'Maria L.',
    role: 'RVT Candidate, Vascular',
    stars: 5,
    text: 'The mock exams are so close to the real thing. I did every one twice and passed my RVT on the first try.',
  },
  {
    name: 'Derek T.',
    role: 'New Grad Sonographer',
    stars: 5,
    text: 'The study guide explains the WHY behind every concept. As a new grad this made everything click.',
  },
  {
    name: 'Jasmine K.',
    role: 'SPI Candidate',
    stars: 5,
    text: 'I studied for 3 weeks with SonoPass and passed my SPI. The progress tracker kept me focused on weak spots.',
  },
];

function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04l-.06.17zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div className="text-left">
        <div className="text-[10px] text-gray-300 leading-none mb-0.5">Download on the</div>
        <div className="text-[15px] font-semibold leading-none">App Store</div>
      </div>
    </a>
  );
}

function PlayStoreBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
        <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
      </svg>
      <div className="text-left">
        <div className="text-[10px] text-gray-300 leading-none mb-0.5">Get it on</div>
        <div className="text-[15px] font-semibold leading-none">Google Play</div>
      </div>
    </a>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true ||
      navigator.userAgent.includes('SonoPassApp');
    setIsStandalone(standalone);
    if (standalone) router.replace('/dashboard');
  }, [router]);

  if (isStandalone === null || isStandalone) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            <span className="text-gray-900">Sono</span>
            <span style={{ color: '#3abc83' }}>Pass</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Open App
            </Link>
            <a
              href={APP_STORE_URL}
              className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl transition-opacity hover:opacity-90 text-sm font-semibold"
              style={{ backgroundColor: '#3abc83' }}
            >
              Download App
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-28 pb-24 px-5 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f0fdf6, #ffffff)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border" style={{ backgroundColor: '#e8f8f2', borderColor: '#b6e8d3', color: '#2a9d6f' }}>
                <Zap size={13} />
                <span className="text-xs font-semibold">Built for registry exam candidates</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1] mb-5 text-gray-900">
                Pass your registry<br />
                <span style={{ color: '#3abc83' }}>exam with confidence.</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                The complete prep platform for RVT, SPI, and ARDMS certification. Practice questions, mock exams, and study guides — all in one app.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <AppStoreBadge />
                <PlayStoreBadge />
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-5 mt-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">Loved by students</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span className="text-gray-400 text-sm">Exam-accurate</span>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-[260px] sm:w-[300px]">
                <div className="absolute inset-0 rounded-full blur-3xl scale-110 opacity-30" style={{ backgroundColor: '#3abc83' }} />
                <div className="relative rounded-[38px] bg-black shadow-2xl overflow-hidden border-[3px] border-gray-800">
                  <div className="bg-gray-900 px-5 pt-10 pb-6">
                    <div className="text-2xl font-black mb-1">
                      <span className="text-white">Sono</span>
                      <span style={{ color: '#3abc83' }}>Pass</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-5">Your registry exam prep companion</p>
                    <div className="space-y-2.5">
                      {['Quick 10 · 5 min', 'Study Mode', 'Mock Exams', 'Study Guide'].map((item, i) => (
                        <div key={item} className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3abc8330' }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3abc83' }} />
                          </div>
                          <span className="text-white text-xs font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {[['0', 'Streak'], ['0%', 'Accuracy'], ['0', 'Done']].map(([val, label]) => (
                        <div key={label} className="bg-white/10 rounded-xl p-2.5 text-center">
                          <div className="text-sm font-black text-white">{val}</div>
                          <div className="text-[9px] text-gray-400 mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black flex items-center justify-around px-2 pt-2 pb-1.5">
                    {['Home', 'Study', 'Exams', 'Guide', 'Progress'].map((label, i) => (
                      <div key={label} className="flex flex-col items-center gap-0.5">
                        <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: i === 0 ? '#3abc83' : '#ffffff40' }} />
                        <span className="text-[7px]" style={{ color: i === 0 ? '#3abc83' : '#ffffff70' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-black flex items-center justify-center pb-2 pt-1">
                    <div className="w-16 h-[3px] bg-white/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-5 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#3abc83' }}>Everything in one app</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Stop second-guessing.<br />Start passing.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              SonoPass has everything you need to walk into your registry exam prepared — no cramming, no guessing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.Icon size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#3abc83' }}>Simple by design</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-12">
            Your path to passing.
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {STEPS.map((s, i) => (
              <div key={s.number} className="flex-1 relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+2rem)] w-full h-px bg-gray-200" />
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md text-white font-black text-sm" style={{ backgroundColor: '#3abc83', boxShadow: '0 4px 14px #3abc8340' }}>
                  {s.number}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-5 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#3abc83' }}>Real results</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Students pass with SonoPass.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-5 text-white" style={{ backgroundColor: '#3abc83' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain size={28} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Your registry exam starts here.
          </h2>
          <p className="text-emerald-100 mb-8 leading-relaxed">
            Download SonoPass on iOS and Android, or open the web app and start studying today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <AppStoreBadge />
            <PlayStoreBadge />
          </div>
          <p className="text-emerald-200 text-xs mt-4">Free practice questions · No credit card required</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-5 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black">
            <span className="text-gray-900">Sono</span>
            <span style={{ color: '#3abc83' }}>Pass</span>
          </span>
          <div className="flex items-center gap-5">
            <Link href="/app" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Web App</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Privacy</Link>
            <Link href="/support" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Support</Link>
          </div>
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} SonoPass · For educational use only.
          </p>
        </div>
      </footer>

    </div>
  );
}
