'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { WorkCard } from '@/components/katalog/WorkCard';
import { WorkPreviewModal } from '@/components/katalog/WorkPreviewModal';
import { Work, WorkCategory } from '@/types';
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

        <Link
          href="/buyurtma"
          className="self-start md:self-auto px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs sm:text-sm border border-indigo-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Topilmadimi? Buyurtma bering (24-48s bepul reja)</span>
        </Link>
      </div>

      {/* Search & Main Filter Controls */}
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

        {/* Secondary Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Fan / Yo'nalish:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-600"
            >
              <option value="ALL">Barcha fanlar</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Saralash:</label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-600"
            >
              <option value="NEWEST">Eng so'nggi yuklanganlar</option>
              <option value="POPULAR">Eng ko'p sotilganlar</option>
              <option value="PRICE_ASC">Narxi: Arzondan qimmatga</option>
              <option value="PRICE_DESC">Narxi: Qimmatdan arzonga</option>
            </select>
          </div>

          {/* Min Antiplagiarism Filter */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">
              Antiplagiat foizi (kamida): <strong className="text-indigo-600">{minUniqueness > 0 ? `${minUniqueness}%+` : 'Barchasi'}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minUniqueness}
              onChange={(e) => setMinUniqueness(Number(e.target.value))}
              className="w-full mt-2 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Works Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-500">
            Natijalar: <strong className="text-slate-900">{filteredWorks.length} ta</strong> ish topildi
          </span>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Ushbu so'rov bo'yicha tayyor ish topilmadi</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Xavotir olmang! Siz o'z mavzuingiz bo'yicha buyurtma berishingiz mumkin — mualliflarimiz 24-48 soat ichida bepul reja tayyorlab berishadi.
            </p>
            <Link
              href="/buyurtma"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
            >
              <span>Buyurtma berish</span>
            </Link>
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
