'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Download, Eye, Star, CheckCircle } from 'lucide-react';
import { Work } from '@/types';
import { useStore } from '@/context/StoreContext';

interface WorkCardProps {
  work: Work;
  onPreview: (work: Work) => void;
  onBuy: (workId: string) => void;
}

export function WorkCard({ work, onPreview, onBuy }: WorkCardProps) {
  const { purchasedWorkIds } = useStore();
  const isPurchased = purchasedWorkIds.includes(work.id);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'KURS_ISHI':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">Kurs ishi</span>;
      case 'MDI':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">MDI (Diplom)</span>;
      case 'REFERAT':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">Referat</span>;
      case 'TAQDIMOT':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">Taqdimot PPT</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">{cat}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Category & Stats */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {getCategoryBadge(work.category)}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{work.rating}</span>
            <span className="text-slate-300">•</span>
            <span>{work.salesCount} ta xarid</span>
          </div>
        </div>

        {/* Subject */}
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {work.subject}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onPreview(work)}
          className="text-base font-bold text-slate-800 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
        >
          {work.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
          {work.description}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            {work.pagesCount} bet
          </span>
          <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Antiplagiat: {work.uniquenessPercent || 80}%+
          </span>
          <span className="bg-slate-50 px-2 py-1 rounded-md text-slate-500 uppercase text-[10px] font-bold">
            {work.language}
          </span>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Narxi:</span>
          <span className="text-lg font-extrabold text-indigo-600">
            {work.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">so'm</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreview(work)}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors"
            title="Namunasini ko'rish"
          >
            <Eye className="w-4 h-4" />
          </button>

          {isPurchased ? (
            <a
              href={work.originalFileUrl}
              download
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yuklab olish</span>
            </a>
          ) : (
            <button
              onClick={() => onBuy(work.id)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-indigo-500/20 transition-all"
            >
              Xarid qilish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
