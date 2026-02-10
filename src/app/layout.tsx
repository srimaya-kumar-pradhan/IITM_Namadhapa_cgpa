import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CGPAProvider } from "@/components/shared/CGPAProvider";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IITM BS CGPA Calculator & Planner",
  description: "A precision academic calculator and planner for IIT Madras BS Degree students in Data Science and Electronic Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/20 selection:text-primary scroll-smooth`}
      >
        <CGPAProvider>
          <Header />
          <main className="pt-24 min-h-screen max-w-7xl mx-auto px-6 md:px-12 overflow-x-hidden">
            {children}
          </main>
          <Toaster position="top-center" richColors />
          <Footer />
        </CGPAProvider>
      </body>
    </html>
  );
}
