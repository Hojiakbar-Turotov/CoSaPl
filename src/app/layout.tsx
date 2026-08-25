import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "CoSaPl — Coursework Sales Platform (Kurs ishlari, MDI va o'quv ishlari platformasi)",
  description: "CoSaPl (Coursework Sales Platform — cosapl.web.app) — Tayyor kurs ishlarini xarid qilish, 24-48 soat bepul reja bilan individual va ommaviy buyurtma berish hamda rasmiy antiplagiat sertifikati olish ekotizimi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
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
