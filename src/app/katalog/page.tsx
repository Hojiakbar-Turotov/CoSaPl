'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  BookOpen, 
  CheckCircle2, 
  X,
  Plus,
  Store,
  FileEdit,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { WorkCard } from '@/components/katalog/WorkCard';
import { WorkPreviewModal } from '@/components/katalog/WorkPreviewModal';
import { Work } from '@/types';
import Link from 'next/link';

export default function KatalogPage() {
  const { works, buyWork } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'POPULAR'>('NEWEST');
  const [minUniqueness, setMinUniqueness] = useState<number>(0);

  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available subjects list
  const subjects = useMemo(() => {
    const set = new Set<string>();
    works.forEach(w => set.add(w.subject));
    return Array.from(set);
  }, [works]);

  const filteredWorks = useMemo(() => {
    return works.filter(w => {
      // Category filter
      if (selectedCategory !== 'ALL' && w.category !== selectedCategory) return false;
      // Subject filter
      if (selectedSubject !== 'ALL' && w.subject !== selectedSubject) return false;
      // Min Uniqueness
      if (minUniqueness > 0 && (w.uniquenessPercent || 0) < minUniqueness) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = w.title.toLowerCase().includes(q);
        const matchSubject = w.subject.toLowerCase().includes(q);
        const matchDesc = w.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSubject && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      if (sortBy === 'POPULAR') return b.salesCount - a.salesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [works, selectedCategory, selectedSubject, minUniqueness, searchQuery, sortBy]);

  const handlePreview = (work: Work) => {
    setSelectedWork(work);
    setIsPreviewOpen(true);
  };

  const handleBuy = (workId: string) => {
    const res = buyWork(workId);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories: { label: string; value: string }[] = [
    { label: 'Barchasi', value: 'ALL' },
    { label: 'Kurs ishlari', value: 'KURS_ISHI' },
    { label: 'MDI (Diplom)', value: 'MDI' },
    { label: 'Referatlar', value: 'REFERAT' },
    { label: 'Taqdimotlar', value: 'TAQDIMOT' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Tayyor Ishlar Do'koni</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Katalog va O'quv Hujjatlari
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Mavzularni qidiring, mundarija va namunasini bepul ko'ring, kerakli ishni darhol yuklab oling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/sotuvchi"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs sm:text-sm border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Store className="w-4 h-4" />
            <span>Ish yuklash (Sotuvchi)</span>
          </Link>

          <Link
            href="/buyurtma"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buyurtma berish (24-48s bepul reja)</span>
          </Link>
        </div>
      </div>

      {/* Search & Main Filter Controls (Visible when there are items or searching) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mavzu, fan yoki kalit so'z bo'yicha qidiring (masalan: Iqtisodiyot, Kiberxavfsizlik, Pedagogika)..."
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Works Grid */}
      <div>
        {filteredWorks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200 shadow-sm space-y-5 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Hozircha tayyor o'quv ishlari joylanmagan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Do'konga yangi sifatli kurs ishlari, MDI va referatlar joylanish jarayonida. Siz o'zingizning aniq mavzuingiz bo'yicha buyurtma berishingiz mumkin — mualliflarimiz <strong>24–48 soatda bepul reja</strong> tuzib berishadi!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/buyurtma"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <FileEdit className="w-4 h-4" />
                <span>Buyurtma berish (24-48s bepul reja)</span>
              </Link>

              <Link
                href="/sotuvchi"
                className="px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs sm:text-sm border border-emerald-200 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Store className="w-4 h-4" />
                <span>Muallif sifatida ish yuklash</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onPreview={handlePreview}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <WorkPreviewModal
        work={selectedWork}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onBuy={handleBuy}
      />
    </div>
  );
}
