'use client';

import React, { useState } from 'react';
import { 
  Store, 
  UploadCloud, 
  DollarSign, 
  ShoppingBag, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  PlusCircle, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { WorkCategory, WorkLanguage } from '@/types';
import Link from 'next/link';

export default function SotuvchiPage() {
  const { works, addWork, requestWithdrawal, transactions } = useStore();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'WORKS' | 'UPLOAD' | 'WITHDRAW'>('WORKS');

  // Form states for uploading new work
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<WorkCategory>('KURS_ISHI');
  const [description, setDescription] = useState('');
  const [tableOfContentsText, setTableOfContentsText] = useState('');
  const [introductionPreview, setIntroductionPreview] = useState('');
  const [pagesCount, setPagesCount] = useState<number>(35);
  const [language, setLanguage] = useState<WorkLanguage>('UZ');
  const [price, setPrice] = useState<number>(45000);
  const [uniquenessPercent, setUniquenessPercent] = useState<number>(80);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Withdrawal form states
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100000);
  const [cardNumber, setCardNumber] = useState('8600 ');

  // My uploaded works (filtered by current user or all sample author works)
  const myWorks = works.filter(w => w.authorId === user?.id || w.authorId === 'user_author_1');
  const totalSales = myWorks.reduce((acc, w) => acc + w.salesCount, 0);
  const totalRevenue = myWorks.reduce((acc, w) => acc + (w.salesCount * w.price * 0.85), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleAddWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    const toc = tableOfContentsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    addWork({
      title: title.trim(),
      subject: subject.trim(),
      category,
      description: description.trim() || "Muallif tomonidan tayyorlangan sifatli o'quv ishi.",
      tableOfContents: toc.length > 0 ? toc : ["KIRISH", "I BOB", "II BOB", "XULOSA", "ADABIYOTLAR"],
      introductionPreview: introductionPreview.trim() || "Mavzuning dolzarbligi va asosiy maqsadlari yoritilgan...",
      pagesCount,
      language,
      price,
      uniquenessPercent,
      originalFileUrl: '/uploads/sample_author_work.docx',
      authorId: user?.id || 'user_author_1',
      authorName: user?.fullName || 'Muallif Mutaxassis',
    });

    setToastMessage("Yangi o'quv ishi muvaffaqiyatli sotuvga qo'yildi!");
    setTimeout(() => setToastMessage(null), 3500);

    // Reset Form
    setTitle('');
    setSubject('');
    setDescription('');
    setTableOfContentsText('');
    setIntroductionPreview('');
    setUploadedFileName('');
    setActiveTab('WORKS');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestWithdrawal(withdrawAmount, cardNumber);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Muallif & Sotuvchi Kabineti</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                85% Sof Foyda
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Tayyor ishlaringizni yuklang, mustaqil narx belgilang va har bir xariddan avtomatik daromad oling.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('UPLOAD')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi ish yuklash</span>
        </button>
      </div>

      {/* Analytics Mini Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Yuklangan ishlarim</span>
            <div className="text-2xl font-extrabold text-slate-900">{myWorks.length} ta</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Jami xaridlar soni</span>
            <div className="text-2xl font-extrabold text-emerald-600">{totalSales} ta</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Jami sof tushum</span>
            <div className="text-2xl font-extrabold text-slate-900">{totalRevenue.toLocaleString()} so'm</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('WORKS')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'WORKS'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mening Ishlarim ({myWorks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('UPLOAD')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'UPLOAD'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Yangi Ish Yuklash</span>
        </button>

        <button
          onClick={() => setActiveTab('WITHDRAW')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'WITHDRAW'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Pul Yechib Olish</span>
        </button>
      </div>

      {/* Tab 1: My Works Table */}
      {activeTab === 'WORKS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-700 flex items-center justify-between">
            <span>Yuklangan o'quv ishlari ro'yxati</span>
            <span>Holati & Sotuvlar</span>
          </div>

          <div className="divide-y divide-slate-100">
            {myWorks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Siz hali birorta ish yuklamadingiz. "Yangi Ish Yuklash" bo'limiga o'ting.
              </div>
            ) : (
              myWorks.map((w) => (
                <div key={w.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase text-indigo-600">{w.subject} • {w.category}</span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{w.title}</h3>
                    <p className="text-xs text-slate-500">
                      {w.pagesCount} sahifa • Antiplagiat: {w.uniquenessPercent || 80}% • Til: {w.language}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto text-right">
                    <div>
                      <span className="text-xs text-slate-400 block">Sotilgan:</span>
                      <span className="font-extrabold text-slate-800 text-base">{w.salesCount} marta</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Narxi:</span>
                      <span className="font-extrabold text-emerald-600 text-base">{w.price.toLocaleString()} so'm</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Upload Work Form */}
      {activeTab === 'UPLOAD' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-emerald-600" />
            <span>Sotuvga yangi kurs ishi / MDI / referat yuklash</span>
          </h2>

          <form onSubmit={handleAddWorkSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Ish mavzusi (Sarlavha) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Fan / Yo'nalish *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Masalan: Iqtisodiyot, Axborot texnologiyalari, Huquq..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Ish toifasi *
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800"
                >
                  <option value="KURS_ISHI">Kurs ishi</option>
                  <option value="MDI">MDI (Malakaviy bitiruv / Diplom ishi)</option>
                  <option value="REFERAT">Referat</option>
                  <option value="TAQDIMOT">Taqdimot (PowerPoint .pptx)</option>
                </select>
              </div>

              {/* Pages & Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Sahifalar soni *
                </label>
                <input
                  type="number"
                  min="5"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Sotuv narxi (so'mda) *
                </label>
                <input
                  type="number"
                  step="5000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800 font-bold text-emerald-700"
                />
              </div>

              {/* Uniqueness & Language */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Antiplagiat foizi (%): {uniquenessPercent}%
                </label>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={uniquenessPercent}
                  onChange={(e) => setUniquenessPercent(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Tili *
                </label>
                <select
                  value={language}
                  onChange={(e: any) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800"
                >
                  <option value="UZ">O'zbek tili</option>
                  <option value="RU">Rus tili</option>
                  <option value="EN">Ingliz tili</option>
                </select>
              </div>
            </div>

            {/* Table of contents */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Ishning Mundarijasi (Har bir bandni yangi qatordan yozing)
              </label>
              <textarea
                rows={4}
                value={tableOfContentsText}
                onChange={(e) => setTableOfContentsText(e.target.value)}
                placeholder="KIRISH&#10;I BOB. Nazariy asoslar&#10;II BOB. Amaliy tahlil&#10;XULOSA"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 text-slate-800"
              />
            </div>

            {/* Introduction Preview */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Namunaviy Kirish Qismi (Xaridor bepul o'qishi uchun 1-sahifa matni)
              </label>
              <textarea
                rows={3}
                value={introductionPreview}
                onChange={(e) => setIntroductionPreview(e.target.value)}
                placeholder="Mavzuning dolzarbligi va umumiy maqsadi haqidagi kirish jumlalari..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-slate-800"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                To'liq Ish Fayli (.docx / .pptx) *
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Hujjat faylini tanlang
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    {uploadedFileName ? `Tanlandi: ${uploadedFileName}` : "Asl tahrirlanadigan .docx yoki .pptx fayl"}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Sotuvga chiqarish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Withdrawal Form */}
      {activeTab === 'WITHDRAW' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Mablag'ni bank kartasiga yechish</span>
          </h2>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sizning yechib olishingiz mumkin bo'lgan balansingiz:</span>
            <span className="text-xl font-extrabold text-emerald-600">
              {(user?.balance || 0).toLocaleString()} so'm
            </span>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Bank karta raqami (UZCARD / HUMO) *
              </label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="8600 0000 0000 0000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Yechiladigan summa (so'm) *
              </label>
              <input
                type="number"
                min="50000"
                step="10000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-600 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={(user?.balance || 0) < withdrawAmount}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Yechish so'rovini yuborish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
