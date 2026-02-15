import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SonoPass - Vascular Registry Exam Prep",
  description: "Master your vascular sonography registry exam with interactive practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {children}
      </body>
    </html>
  );
}
