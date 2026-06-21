import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hit Camp — Learn. Make Hit Records.",
  description:
    "Hit Camp by HitLab — a premium training platform for songwriters, producers, and artists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-studio font-sans text-ink antialiased">
        <div className="flex min-h-screen bg-studio">
          <Sidebar />
          <main className="flex-1 lg:ml-[264px]">
            <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-8 lg:px-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
