import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ModalityProvider } from "@/contexts/ModalityContext";
import AppInitializer from "@/components/AppInitializer";
import SessionProvider from "@/components/providers/SessionProvider";

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
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          <AppInitializer>
            <ModalityProvider>
              {children}
            </ModalityProvider>
          </AppInitializer>
        </SessionProvider>
      </body>
    </html>
  );
}
