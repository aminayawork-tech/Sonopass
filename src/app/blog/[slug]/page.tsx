import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatPostDate } from '@/lib/blog';
import { BlogShell } from '../BlogShell';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `https://sonopass.com/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.description,
    keywords: post.keyword ? [post.keyword] : undefined,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: post.metaTitle, description: post.description, url, publishedTime: post.date, siteName: 'SonoPass' },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const others = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'SonoPass' },
      publisher: { '@type': 'Organization', name: 'SonoPass', logo: { '@type': 'ImageObject', url: 'https://sonopass.com/icon-512.png' } },
      mainEntityOfPage: `https://sonopass.com/blog/${post.slug}`,
    },
    ...(post.faqs.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }]
      : []),
  ];

  return (
    <BlogShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm font-semibold" style={{ color: '#2a9d6f' }}>← All articles</Link>
        <h1 className="text-3xl sm:text-[40px] font-black tracking-tight text-gray-900 leading-tight mt-4">{post.title}</h1>
        <p className="text-sm text-gray-400 mt-3">{formatPostDate(post.date)} · {post.readMinutes} min read</p>
        <div className="blog-content mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">Frequently asked questions</h2>
            <div className="mt-5 divide-y divide-gray-100 border border-gray-200 rounded-2xl">
              {post.faqs.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 flex justify-between gap-4">
                    {f.q}<span className="text-gray-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-gray-600 mt-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-3xl p-7 sm:p-9 text-white" style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)' }}>
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#4fd49a' }}>Study smarter with SonoPass</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">3,200+ questions. 20 full-length mock exams. All 9 registries.</h2>
          <p className="text-slate-300 mt-3 leading-relaxed">Practice with detailed explanations, take mock exams timed like the real thing, and track your weak spots on your phone and the web. Start free with a daily Quick 10.</p>
          <a href="https://apps.apple.com/app/sonopass" className="inline-flex mt-6 items-center px-5 py-3 rounded-xl font-bold text-gray-900" style={{ backgroundColor: '#4fd49a' }}>Download SonoPass</a>
        </section>

        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black tracking-tight text-gray-900">Keep reading</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block border border-gray-200 rounded-2xl p-4 hover:border-gray-300 hover:shadow-sm transition-all">
                  <p className="font-bold text-gray-900 text-sm leading-snug">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-2">{p.readMinutes} min read</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </BlogShell>
  );
}
