import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Cursor from "@/components/Cursor";
import AmbientCanvas from "@/components/AmbientCanvas";
import Preloader from "@/components/Preloader";

const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", weight: ["300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sahilbhagat30.github.io/Portfolio-Web-Site"),
  title: "Sahil Bhagat | Data Engineer, Analytics",
  description: "Data Engineer, Analytics",
  icons: {
    icon: "/Portfolio-Web-Site/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        <Preloader />
        {/* Global ambient layer — behind everything */}
        <AmbientCanvas />
        {/* Custom cursor — above everything */}
        <Cursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
