'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Lock,
  ArrowRight,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminPage() {
  const { 
    works, 
    orders, 
    transactions, 
    plagiarismChecks, 
    approveWork, 
    rejectWork, 
    approveDepositReceipt, 
    rejectDepositReceipt,
    assignAuthor
  } = useStore();
  const { user, role, isAuthenticated } = useAuth();

  const [adminTab, setAdminTab] = useState<'ORDERS' | 'DEPOSITS' | 'WORKS' | 'PLAGIARISM'>('ORDERS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Strict Protection: Only users with ADMIN role can access
  if (!isAuthenticated || role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Admin Panelga Kirish Cheklangan
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ushbu sahifaga faqat maxsus ruxsatga ega administratorlar kirishi mumkin. Iltimos, administrator hisobingiz orqali tizimga kiring.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
            >
              <span>Avtorizatsiyadan o'tish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter pending items
  const pendingDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.provider === 'MANUAL_RECEIPT' && t.status === 'PENDING');
  const pendingOrders = orders.filter(o => o.status === 'PLANNING' || o.status === 'PENDING');
  const pendingWorks = works.filter(w => w.status === 'PENDING');

  const totalPlatformVolume = transactions
    .filter(t => t.status === 'COMPLETED' && (t.type === 'PURCHASE' || t.type === 'DEPOSIT'))
    .reduce((acc, t) => acc + t.amount, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg font-black text-lg">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">CoSaPl Boshqaruv & Moderatsiya Paneli</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/30 text-rose-300 border border-rose-400/30">
                Administrator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Buyurtmalarni mualliflarga taqsimlash, to'lov cheklarini tasdiqlash va ishlarni moderatsiya qilish.
            </p>
          </div>
        </div>

        {/* Global Volume Stat */}
        <div className="bg-slate-800/80 border border-slate-700 px-5 py-3 rounded-2xl">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Umumiy Aylanma</span>
          <span className="text-xl font-extrabold text-emerald-400">
            {totalPlatformVolume.toLocaleString()} so'm
          </span>
        </div>
      </div>

      {/* Pending Items Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setAdminTab('ORDERS')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            adminTab === 'ORDERS'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <FileEdit className="w-5 h-5" />
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              adminTab === 'ORDERS' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {orders.length} ta
            </span>
          </div>
          <div className="text-sm font-bold mt-2">Faol Buyurtmalar</div>
          <div className={`text-xs mt-0.5 ${adminTab === 'ORDERS' ? 'text-indigo-200' : 'text-slate-400'}`}>
            Mualliflar & Chat
          </div>
        </button>

        <button
          onClick={() => setAdminTab('DEPOSITS')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            adminTab === 'DEPOSITS'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-5 h-5" />
            {pendingDeposits.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 animate-pulse">
                {pendingDeposits.length} yangi
              </span>
            )}
          </div>
          <div className="text-sm font-bold mt-2">To'lov Cheklari</div>
          <div className={`text-xs mt-0.5 ${adminTab === 'DEPOSITS' ? 'text-indigo-200' : 'text-slate-400'}`}>
            Admin tasdiqlash
          </div>
        </button>

        <button
          onClick={() => setAdminTab('WORKS')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            adminTab === 'WORKS'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <ShoppingBag className="w-5 h-5" />
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              adminTab === 'WORKS' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {works.length} ta
            </span>
          </div>
          <div className="text-sm font-bold mt-2">Do'kondagi Ishlar</div>
          <div className={`text-xs mt-0.5 ${adminTab === 'WORKS' ? 'text-indigo-200' : 'text-slate-400'}`}>
            Katalog nazorati
          </div>
        </button>

        <button
          onClick={() => setAdminTab('PLAGIARISM')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            adminTab === 'PLAGIARISM'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <ShieldCheck className="w-5 h-5" />
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              adminTab === 'PLAGIARISM' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {plagiarismChecks.length} ta
            </span>
          </div>
          <div className="text-sm font-bold mt-2">Antiplagiat (antiplag.uz)</div>
          <div className={`text-xs mt-0.5 ${adminTab === 'PLAGIARISM' ? 'text-indigo-200' : 'text-slate-400'}`}>
            QR-Sertifikatlar
          </div>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {adminTab === 'ORDERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg">
              Barcha Buyurtmalar Dispetcheri
            </h3>
            <span className="text-xs text-slate-500">24-48s bepul reja monitoringi</span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">#{ord.id}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700">
                      {ord.orderType}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Talaba: <strong className="text-slate-800">{ord.studentName}</strong> ({ord.studentPhone})
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{ord.topic}</h4>
                  <p className="text-xs text-slate-500">
                    Fan: {ord.subject} • Muddat: {ord.deadline} • Narx: {ord.agreedPrice.toLocaleString()} so'm
                  </p>
                  <div className="text-xs text-indigo-600 font-semibold">
                    Mas'ul muallif: {ord.assignedAuthorName || "Hali biriktirilmagan"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!ord.assignedAuthorId && (
                    <button
                      onClick={() => {
                        assignAuthor(ord.id, 'user_author_1', 'Dr. Shahzodbek Mahmudov');
                        showToast("Muallif biriktirildi!");
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Muallif biriktirish
                    </button>
                  )}

                  <Link
                    href={`/profil/buyurtmalar/${ord.id}`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chatga kirish</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Manual Deposit Receipts Verification */}
      {adminTab === 'DEPOSITS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">
            Karta Cheklari & To'lovlarni Tasdiqlash
          </h3>

          {pendingDeposits.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              Hozirda tasdiqlashni kutayotgan yangi cheklar mavjud emas.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDeposits.map((tx) => (
                <div
                  key={tx.id}
                  className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600">ID: {tx.id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-md">
                        Tasdiq kutilmoqda
                      </span>
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">
                      Summa: <span className="text-emerald-700">{tx.amount.toLocaleString()} so'm</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Foydalanuvchi: {tx.userId} • Sana: {new Date(tx.createdAt).toLocaleTimeString('uz-UZ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        approveDepositReceipt(tx.id);
                        showToast("To'lov tasdiqlandi va balans to'ldirildi!");
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tasdiqlash</span>
                    </button>

                    <button
                      onClick={() => {
                        rejectDepositReceipt(tx.id);
                        showToast("Chek rad etildi.");
                      }}
                      className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rad etish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Works list */}
      {adminTab === 'WORKS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">
            Do'kondagi Barcha Tayyor O'quv Ishlari ({works.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {works.map((w) => (
              <div key={w.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{w.subject}</span>
                  <h4 className="font-bold text-slate-900">{w.title}</h4>
                  <div className="text-xs text-slate-400">Muallif: {w.authorName} • {w.pagesCount} bet</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{w.price.toLocaleString()} so'm</span>
                  <div className="text-[11px] text-slate-400">{w.salesCount} ta sotildi</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Plagiarism Checks list */}
      {adminTab === 'PLAGIARISM' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">
            Antiplagiat Tekshiruvlari va QR-Sertifikatlar (https://antiplag.uz/) ({plagiarismChecks.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {plagiarismChecks.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600">{p.certificateCode || 'AP-2026'}</span>
                    <span className="text-xs text-slate-500">({p.userName})</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-0.5">{p.topic}</h4>
                  <div className="text-xs text-slate-400">Fayl: {p.fileName}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 text-base">{p.uniquenessPercent || 85}%</span>
                  <div className="text-[10px] text-slate-400">Holati: {p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
