'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { CertificateView } from '@/components/antiplagiat/CertificateView';
import { PlagiarismCheck } from '@/types';
import Link from 'next/link';

export default function AntiplagiatPage() {
  const { plagiarismChecks, submitPlagiarismCheck } = useStore();
  const { user, isAuthenticated } = useAuth();

  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCheckId, setActiveCheckId] = useState<string | null>(null);

  const price = 25000;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleStartCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!fileName || !topic.trim()) return;

    setIsProcessing(true);

    const newId = submitPlagiarismCheck({
      fileName,
      subject: subject.trim() || 'Umumiy fan',
      topic: topic.trim(),
      documentUrl: '/uploads/sample_uploaded_doc.docx',
    });

    setActiveCheckId(newId);

    setTimeout(() => {
      setIsProcessing(false);
    }, 4500);
  };

  // Find the active check or most recent check
  const activeCheck = plagiarismChecks.find(p => p.id === activeCheckId) || (plagiarismChecks.length > 0 ? plagiarismChecks[0] : null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Antiplag.uz — Rasmiy QR-kodli Sertifikat va Tahliliy Hisobot</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Antiplagiat Tekshiruvi Xizmati
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          O'quv ishingizni <a href="https://antiplag.uz/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline">antiplag.uz</a> tizimi orqali tekshirtiring. Hujjat yuklangach, <strong>24 soat ichida</strong> to'liq tekshirilib, rasmiy QR-kodli sertifikat va batafsil PDF hisobot taqdim etiladi.
        </p>
      </div>

      {/* Auth Gate Banner if not logged in */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">
                Antiplagiat tekshiruvidan o'tkazish uchun tizimga kiring
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Tekshirish natijalari va sertifikatni saqlab borish uchun avtorizatsiyadan o'tish lozim.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-sm"
          >
            Tizimga kirish / Ro'yxatdan o'tish
          </Link>
        </div>
      )}

      {/* Main Grid: Submission Form & Service Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>Yangi tekshiruv uchun hujjat yuklash</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 24 soat ichida tayyor
            </span>
          </div>

          <form onSubmit={handleStartCheck} className="space-y-5">
            {/* Topic */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Ish mavzusi *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Masalan: Raqamli iqtisodiyotda blokcheyn texnologiyalari..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Fan / Yo'nalish
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Masalan: Axborot tizimlari, Iqtisodiyot, Huquq..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Hujjat fayli (.docx, .doc, .pdf) *
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Faylni tanlang
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    {fileName ? `Tanlangan fayl: ${fileName}` : "Kurs ishi yoki diplom ishi matni"}
                  </span>
                  <input
                    type="file"
                    required
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Pricing & Submit */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Antiplag.uz tekshiruv xizmati:</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {price.toLocaleString()} so'm
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !fileName || !topic.trim() || !isAuthenticated}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Yuklanmoqda (24s)...</span>
                  </>
                ) : (
                  <>
                    <span>Tekshiruvga yuborish (24 soat)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Processing Animation */}
          {isProcessing && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  https://antiplag.uz/ bazasida tahlil boshlandi...
                </span>
                <span className="text-slate-400">24 soat ichida tayyor bo'ladi</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-pulse w-4/5" />
              </div>
              <p className="text-[11px] text-slate-400">
                Hujjat qabul qilindi. Mutaxassislarimiz uni antiplag.uz orqali to'liq tahlil qilib, 24 soat ichida sertifikatni profilga joylashadi.
              </p>
            </div>
          )}
        </div>

        {/* Info & Guarantees (1 col) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Antiplag.uz Kafolatlari
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>O'zbekistondagi barcha oliy o'quv yurtlari talablariga mos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>24 soat ichida tekshirilib rasmiy sertifikat taqdim etiladi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>QR-kod orqali antiplag.uz da haqiqiylikni bir zumda tekshirish.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Qaysi jumlalar o'zlashtirilganligi ko'rsatilgan batafsil PDF hisobot.</span>
              </li>
            </ul>
          </div>

          {/* Direct Antiplag.uz Link */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-2">
            <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
              <span>Rasmiy Tizim:</span>
              <a href="https://antiplag.uz/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline flex items-center gap-1">
                antiplag.uz <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Barcha ilmiy ishlar, diplom loyihalari va kurs ishlari milliy dissertatsiyalar bazasi hamda xalqaro ilmiy jurnallar bilan to'liq solishtiriladi.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Certificate Display */}
      {activeCheck && activeCheck.status === 'COMPLETED' && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Antiplag.uz Rasmiy Sertifikati
            </h2>
            <p className="text-xs text-slate-500">
              Chop etishingiz yoki PDF holatida yuklab olishingiz mumkin
            </p>
          </div>
          <CertificateView check={activeCheck} />
        </div>
      )}
    </div>
  );
}
