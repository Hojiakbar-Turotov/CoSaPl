'use client';

import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Download, Sparkles, BookOpen, AlertCircle, ShoppingCart } from 'lucide-react';
import { Work } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

interface WorkPreviewModalProps {
  work: Work | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (workId: string) => void;
}

export function WorkPreviewModal({ work, isOpen, onClose, onBuy }: WorkPreviewModalProps) {
  const { purchasedWorkIds } = useStore();
  const { user } = useAuth();

  if (!isOpen || !work) return null;

  const isPurchased = purchasedWorkIds.includes(work.id);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'KURS_ISHI': return 'Kurs ishi';
      case 'MDI': return 'MDI (Diplom ishi)';
      case 'REFERAT': return 'Referat';
      case 'TAQDIMOT': return 'Taqdimot (PPTX)';
      default: return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-100 text-indigo-700">
              {getCategoryLabel(work.category)}
            </span>
            <span className="text-xs text-slate-500 font-medium">{work.subject}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Stats */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {work.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                {work.pagesCount} sahifa
              </span>
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Antiplagiat: {work.uniquenessPercent || 80}%+
              </span>
              <span className="text-slate-400">Muallif: <strong className="text-slate-700">{work.authorName}</strong></span>
              <span className="text-slate-400">Til: <strong className="text-slate-700">{work.language}</strong></span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ish haqida qisqacha
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {work.description}
            </p>
          </div>

          {/* Table of Contents */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" /> Ishning To'liq Mundarijasi
            </h4>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-xs text-slate-700">
              {work.tableOfContents.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Text with Watermark */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Namunaviy Kirish Qismi (Bepul o'qish)
              </h4>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1-sahifa namunasi
              </span>
            </div>

            <div className="relative p-5 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed overflow-hidden">
              {/* Watermark Pattern */}
              <div className="absolute inset-0 watermark-overlay pointer-events-none flex items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900/5 rotate-[-25deg] select-none uppercase tracking-widest">
                  KursIshlari.uz Namunasi
                </span>
              </div>
              <p className="relative z-10 italic">
                "{work.introductionPreview}"
              </p>
              
              {/* Blur Fade for remaining pages */}
              <div className="relative z-10 mt-4 pt-4 border-t border-dashed border-slate-200 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <AlertCircle className="w-4 h-4" />
                  <span>Qolgan {work.pagesCount - 2} sahifa va to'liq .docx fayl xariddan so'ng ochiladi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Ish narxi:</span>
            <span className="text-2xl font-extrabold text-indigo-600">
              {work.price.toLocaleString()} <span className="text-sm font-medium text-slate-600">so'm</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100"
            >
              Yopish
            </button>

            {isPurchased ? (
              <a
                href={work.originalFileUrl}
                download
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Yuklab olish (.docx)</span>
              </a>
            ) : (
              <button
                onClick={() => onBuy(work.id)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Xarid qilish</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
