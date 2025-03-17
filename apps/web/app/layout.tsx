import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs"
import { Appbar } from "./components/Appbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Photo AI",
  description: "Transform your photos with AI-powered enhancement and editing tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
            <Appbar />
            <Toaster position="top-center" />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
