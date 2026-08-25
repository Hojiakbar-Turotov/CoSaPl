'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  FileEdit, 
  ShieldCheck, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  BookOpen,
  Award,
  Store,
  Plus
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { WorkCard } from '@/components/katalog/WorkCard';
import { WorkPreviewModal } from '@/components/katalog/WorkPreviewModal';
import { Work } from '@/types';

export default function HomePage() {
  const { works, buyWork } = useStore();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePreview = (work: Work) => {
    setSelectedWork(work);
    setIsPreviewOpen(true);
  };

  const handleBuy = (workId: string) => {
    const res = buyWork(workId);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const featuredWorks = works.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>CoSaPl — Coursework Sales Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Kurs ishlari, MDI va Referatlar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Tayyor do'kon yoki Buyurtma
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Tayyor kurs ishlarini namunasi bilan ko'rib xarid qiling yoki o'z mavzuingiz bo'yicha buyurtma bering — <strong className="text-white font-semibold">inson mualliflar jamoasi 24–48 soat ichida bepul reja</strong> tayyorlab beradi.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/katalog"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Tayyor ishlar do'koni</span>
            </Link>

            <Link
              href="/buyurtma"
              className="px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 font-bold rounded-2xl border border-slate-700 flex items-center gap-2 transition-all hover:scale-105"
            >
              <FileEdit className="w-5 h-5 text-indigo-400" />
              <span>Buyurtma berish</span>
              <span className="px-2 py-0.5 text-[11px] bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30">
                24-48s bepul reja
              </span>
            </Link>

            <Link
              href="/antiplagiat"
              className="px-7 py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold rounded-2xl border border-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Antiplagiat (antiplag.uz)</span>
            </Link>
          </div>

          {/* Mini Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80 text-center">
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">CoSaPl</span>
              <span className="text-xs text-slate-400">Milliy Ekotizim</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400">24-48s</span>
              <span className="text-xs text-slate-400">Bepul reja kafolati</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-400">antiplag.uz</span>
              <span className="text-xs text-slate-400">Rasmiy sertifikat</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400">100%</span>
              <span className="text-xs text-slate-400">Xavfsiz to'lovlar</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Nega aynan CoSaPl?
          </h2>
          <p className="text-sm text-slate-500">
            CoSaPl (Coursework Sales Platform) — talaba va mualliflar uchun eng qulay, xavfsiz va shaffof ekotizim
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Do'kon */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. Tayyor Ishlar Do'koni</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Barcha fanlar bo'yicha tayyor kurs ishlari, MDI va referatlar. Mundarijasi va kirish qismini bepul o'qib, Click/Payme orqali bir zumda yuklab oling.
            </p>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 pt-2"
            >
              <span>Katalogni ko'rish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Buyurtma & Inson Rejasi */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 border border-indigo-800 shadow-lg space-y-4 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">2. Bepul 24-48s Reja & Chat</h3>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-md">
                KAFOLAT
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Individual yoki guruh bo'lib ommaviy buyurtma bering. Mualliflar jamoasi 24-48 soat ichida sifatli rejani bepul tuzib beradi. Har bir buyurtmachi bilan jonli suhbat chati ochiladi.
            </p>
            <Link
              href="/buyurtma"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200 pt-2"
            >
              <span>Buyurtma berish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Antiplagiat */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. Antiplagiat (antiplag.uz)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              O'quv ishingizni 24 soat ichida rasmiy antiplag.uz tizimida tekshirtiring. Natijada QR-kodli rasmiy sertifikat va to'liq PDF tahliliy hisobot oling.
            </p>
            <Link
              href="/antiplagiat"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 pt-2"
            >
              <span>Tekshirish xizmati</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Katalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Tayyor O'quv Ishlari Do'koni
            </h2>
          </div>
          <Link
            href="/katalog"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Works Grid or Empty Placeholder */}
        {featuredWorks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto">
            <BookOpen className="w-12 h-12 text-indigo-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
              Tayyor kurs ishlari tez kunda joylanadi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Hozirda yangi o'quv ishlari bazasi shakllantirilmoqda. Siz o'z mavzuingiz bo'yicha buyurtma berishingiz mumkin:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/buyurtma"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
              >
                Buyurtma berish (24-48s bepul reja)
              </Link>
              <Link
                href="/sotuvchi"
                className="px-5 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs sm:text-sm border border-emerald-200 hover:bg-emerald-100"
              >
                Muallif sifatida ish yuklash
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onPreview={handlePreview}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}
      </section>

      {/* Telegram Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold text-sky-300">
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram Ekotizimi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Savollaringiz bormi? CoSaPl Telegram kanali va guruhiga qo'shiling
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Admin bilan to'g'ridan-to'g'ri aloqa, eng yangi ishlar bazasi e'lon qilinadigan kanal va talaba hamda mualliflarning rasmiy muhokama guruhi siz uchun ochiq.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://t.me/CoSaPl_Admin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-sm shadow-md hover:bg-slate-100 flex items-center gap-2 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Admin bilan bog'lanish</span>
              </a>

              <a
                href="https://t.me/CoSaPl_Kanal"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Rasmiy Kanal</span>
              </a>

              <a
                href="https://t.me/CoSaPl_Guruh"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Users className="w-4 h-4" />
                <span>Muhokama Guruhi</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Work Preview Modal */}
      <WorkPreviewModal
        work={selectedWork}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onBuy={handleBuy}
      />
    </div>
  );
}
