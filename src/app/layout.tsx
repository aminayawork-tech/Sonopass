import type { Metadata } from "next";
import "./globals.css";
import { ModalityProvider } from "@/contexts/ModalityContext";

export const metadata: Metadata = {
  title: "SonoPass - Ultrasound Registry Exam Prep",
  description: "Master your ultrasound registry exam with comprehensive practice questions across all modalities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ModalityProvider>{children}</ModalityProvider>
      </body>
    </html>
  );
}
