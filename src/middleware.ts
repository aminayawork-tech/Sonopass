export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/practice/:path*',
    '/exam/:path*',
    '/study-guide/:path*',
    '/glossary/:path*',
    '/progress/:path*',
    '/stats/:path*',
    '/learn/:path*',
    '/admin/:path*',
  ],
};
