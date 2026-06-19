import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Music School — A Private Conservatory",
  description:
    "A premium music education app for songwriters, producers, composers, and serious students of music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen bg-ivory">
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
