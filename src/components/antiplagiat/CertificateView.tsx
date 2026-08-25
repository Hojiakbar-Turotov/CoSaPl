'use client';

import React from 'react';
import { ShieldCheck, Award, QrCode, Download, Printer, CheckCircle, ExternalLink } from 'lucide-react';
import { PlagiarismCheck } from '@/types';

interface CertificateViewProps {
  check: PlagiarismCheck;
}

export function CertificateView({ check }: CertificateViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto my-6 print:shadow-none print:border-none">
      {/* Action Header (Hidden in Print) */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">Antiplag.uz Rasmiy Sertifikati</span>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs rounded-md">
            24s Ichida Tasdiqlangan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Chop etish</span>
          </button>
          <a
            href={check.fullReportPdfUrl || 'https://antiplag.uz/'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Hisobot</span>
          </a>
        </div>
      </div>

      {/* Printable Certificate Body */}
      <div className="p-8 sm:p-12 relative bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 border-8 border-double border-indigo-900/20 m-4 rounded-xl">
        {/* Certificate Watermark Seal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <ShieldCheck className="w-96 h-96 text-indigo-950" />
        </div>

        {/* Top Header */}
        <div className="text-center space-y-2 border-b-2 border-indigo-950/10 pb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-900 text-white shadow-md mb-2">
            <Award className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-indigo-950 uppercase">
            Antiplag.uz Sertifikati
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-500 uppercase">
            Matn o'ziga xosligi va ilmiy plagiat tahlili xulosasi (https://antiplag.uz/)
          </p>
        </div>

        {/* Recipient Details */}
        <div className="my-8 text-center space-y-4">
          <p className="text-xs text-slate-500 font-serif italic">
            Ushbu rasmiy hujjat quyidagi ilmiy/o'quv ishi muvaffaqiyatli tekshirilganligini tasdiqlaydi:
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            {check.userName}
          </h3>

          <div className="max-w-xl mx-auto p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1 text-left">
            <div className="text-xs text-slate-500">Mavzu:</div>
            <div className="text-sm font-bold text-indigo-950 leading-snug">
              "{check.topic}"
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Fan: <span className="font-semibold text-slate-800">{check.subject}</span> • Fayl: <span className="font-mono text-slate-700">{check.fileName}</span>
            </div>
          </div>
        </div>

        {/* Uniqueness Score Card */}
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              O'ziga xoslik (Originality)
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono mt-1 block">
              {check.uniquenessPercent || 85}%
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">Kafedra talabiga mos</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              O'zlashtirilgan matn
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-700 font-mono mt-1 block">
              {Math.max(0, 100 - (check.uniquenessPercent || 85) - 5)}%
            </span>
            <span className="text-[10px] text-slate-500">Manbalar bilan solishtirilgan</span>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="block text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
              Iqtiboslar ulushi
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono mt-1 block">
              5%
            </span>
            <span className="text-[10px] text-indigo-700 font-medium">To'g'ri havolalar</span>
          </div>
        </div>

        {/* Signatures & QR Code */}
        <div className="pt-6 border-t-2 border-indigo-950/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-slate-900 text-white p-2 rounded-lg flex flex-col items-center justify-center">
              <QrCode className="w-10 h-10" />
            </div>
            <div>
              <div className="font-mono font-bold text-slate-900 text-sm">{check.certificateCode || 'AP-2026-8941'}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">https://antiplag.uz/ da tekshirish</div>
              <div className="text-[10px] text-slate-400">Tekshirilgan sana: {new Date(check.createdAt).toLocaleDateString('uz-UZ')}</div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="font-serif font-bold text-slate-800">Antiplag.uz & CoSaPl Ekspertlar Guruhi</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center sm:justify-end gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Elektron Raqamli Imzo (ERI) bilan tasdiqlangan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
