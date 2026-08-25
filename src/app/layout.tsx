import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "CoSaPl — Coursework Sales Platform",
  description: "CoSaPl (Coursework Sales Platform) — Tayyor kurs ishlarini xarid qilish, 24-48 soat bepul reja bilan buyurtma berish va rasmiy antiplag.uz sertifikati olish ekotizimi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        {/* Telegram Web App SDK */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <StoreProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
