import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sonopass.com';
  const pages = ['', '/blog', '/privacy', '/terms', '/support'].map((p) => ({ url: `${base}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.6 }));
  const posts = getAllPosts().map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date, changeFrequency: 'monthly' as const, priority: 0.8 }));
  return [...pages, ...posts];
}
