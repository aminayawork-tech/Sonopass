import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/exam/', '/account', '/subscription', '/onboarding', '/login', '/signup'] }],
    sitemap: 'https://sonopass.com/sitemap.xml',
  };
}
