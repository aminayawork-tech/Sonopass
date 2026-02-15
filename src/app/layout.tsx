import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SonoPass - Vascular Registry Exam Prep",
  description: "Ace your vascular ultrasound registry exam with 231 real practice questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
