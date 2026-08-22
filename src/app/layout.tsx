import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Cursor from "@/components/Cursor";
import AmbientCanvas from "@/components/AmbientCanvas";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sahil Bhagat | Analytics Engineer",
  description: "Analytics Engineer and Data Engineer building scalable pipelines, robust data models, and performance-optimized analytics solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        {/* Global ambient layer — behind everything */}
        <AmbientCanvas />
        {/* Custom cursor — above everything */}
        <Cursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
