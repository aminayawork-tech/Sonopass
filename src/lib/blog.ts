// Blog posts live as Markdown files in src/content/blog/*.md (front matter + body + FAQ block).
// They are read at build time, so the blog is fully static (website and app builds).
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface BlogFaq { q: string; a: string }
export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keyword: string;
  date: string;
  readMinutes: number;
  html: string;
  faqs: BlogFaq[];
}

const DIR = path.join(process.cwd(), 'src/content/blog');

function parse(file: string): BlogPost {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!fm) throw new Error(`${file}: missing front matter`);
  const meta: Record<string, string> = {};
  for (const line of fm[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  const rest = raw.slice(fm[0].length);
  const [body, faqBlock = ''] = rest.split('<!-- FAQ -->');
  const faqs: BlogFaq[] = [];
  let current: BlogFaq | null = null;
  for (const line of faqBlock.split('\n')) {
    const t = line.trim();
    if (t.startsWith('Q:')) { current = { q: t.slice(2).trim(), a: '' }; faqs.push(current); }
    else if (t.startsWith('A:') && current) current.a = t.slice(2).trim();
    else if (t && current && current.a) current.a += ` ${t}`;
  }
  return {
    slug: meta.slug || file.replace(/\.md$/, ''),
    title: meta.title,
    metaTitle: meta.metaTitle || `${meta.title} | SonoPass`,
    description: meta.description,
    keyword: meta.keyword ?? '',
    date: meta.date,
    readMinutes: Number(meta.readMinutes) || 6,
    html: marked.parse(body.trim(), { async: false }) as string,
    faqs,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map(parse).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
