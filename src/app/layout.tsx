import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Plus Jakarta Sans (SIL Open Font License), bundled so builds don't depend on Google Fonts
const sans = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  weight: "200 800",
  variable: "--font-sans",
  display: "swap",
});
import { ModalityProvider } from "@/contexts/ModalityContext";
import AppInitializer from "@/components/AppInitializer";
import { AuthProvider } from "@/contexts/AuthContext";
import AccessGuard from "@/components/AccessGuard";

export const metadata: Metadata = {
  title: "SonoPass - Ultrasound Registry Exam Prep",
  description: "Master your ultrasound registry exam with comprehensive practice questions across all modalities",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SonoPass",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable}>
      <head>
        {/* Store app: mark <html> for the status-bar spacing in globals.css; skip the website home page; and since a
            reload of e.g. /account is answered with the home page file, load account.html instead */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(!/SonoPassApp/.test(navigator.userAgent))return;document.documentElement.classList.add('native-app');var l=location,p=l.pathname;if(p==='/'||p==='/index.html'){l.replace('/dashboard.html');return}if(p.split('/').pop().indexOf('.')<0){l.replace(p.replace(/\\/$/,'')+'.html'+l.search+l.hash)}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ModalityProvider>
          <AuthProvider>
            <AppInitializer>
              <AccessGuard>{children}</AccessGuard>
            </AppInitializer>
          </AuthProvider>
        </ModalityProvider>
      </body>
    </html>
  );
}
