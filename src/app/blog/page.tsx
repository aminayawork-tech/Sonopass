import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatPostDate } from '@/lib/blog';
import { BlogShell } from './BlogShell';

export const metadata: Metadata = {
  title: 'Sonography Registry Exam Blog | SonoPass',
  description: 'Study plans, exam-day tips and content breakdowns for the ARDMS SPI, RVT and specialty registry exams.',
  alternates: { canonical: 'https://sonopass.com/blog' },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <BlogShell>
      <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#2a9d6f' }}>SonoPass Blog</p>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mt-2">Pass your registry exam with a plan</h1>
      <p className="text-gray-500 text-lg mt-3 max-w-2xl">Study plans, exam-day tips and honest guides for the ARDMS SPI, RVT and specialty exams.</p>
      <div className="grid sm:grid-cols-2 gap-5 mt-10">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all">
            <p className="text-xs font-semibold text-gray-400">{formatPostDate(p.date)} · {p.readMinutes} min read</p>
            <h2 className="text-lg font-bold text-gray-900 mt-2 leading-snug group-hover:text-emerald-700 transition-colors">{p.title}</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{p.description}</p>
            <p className="text-sm font-semibold mt-4" style={{ color: '#2a9d6f' }}>Read article →</p>
          </Link>
        ))}
      </div>
    </BlogShell>
  );
}
