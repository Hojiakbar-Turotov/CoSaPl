'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User as UserIcon, 
  ShoppingBag, 
  FileEdit, 
  ShieldCheck, 
  Clock, 
  Download, 
  MessageSquare, 
  Wallet, 
  PlusCircle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { DepositModal } from '@/components/payment/DepositModal';
import { CertificateView } from '@/components/antiplagiat/CertificateView';
import { PlagiarismCheck } from '@/types';

export default function ProfilPage() {
  const { works, orders, purchasedWorkIds, plagiarismChecks, transactions } = useStore();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'PURCHASES' | 'ORDERS' | 'CERTIFICATES' | 'TRANSACTIONS'>('ORDERS');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<PlagiarismCheck | null>(null);

  const myPurchasedWorks = works.filter(w => purchasedWorkIds.includes(w.id));
  const myOrders = orders; // All active orders
  const myPlagiarism = plagiarismChecks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{user?.fullName || 'Foydalanuvchi'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                {role === 'STUDENT' ? 'Talaba' : role === 'AUTHOR' ? 'Muallif' : 'Admin'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tel: {user?.phone || '+998 90 000 00 00'} {user?.telegramUsername ? `• @${user.telegramUsername}` : ''}
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Mavjud Balans</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              {(user?.balance || 0).toLocaleString()} <span className="text-xs font-normal text-slate-300">so'm</span>
            </span>
          </div>
          <button
            onClick={() => setIsDepositOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>To'ldirish</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ORDERS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Buyurtmalarim ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PURCHASES')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PURCHASES'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Xarid qilingan ishlar ({myPurchasedWorks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CERTIFICATES')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'CERTIFICATES'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Antiplagiat Sertifikatlari ({myPlagiarism.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'TRANSACTIONS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>To'lovlar tarixi</span>
        </button>
      </div>

      {/* Tab 1: Orders (With 24-48h Free Plan & Live Chat links) */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <FileEdit className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">Sizda hali faol buyurtmalar yo'q</h3>
              <Link
                href="/buyurtma"
                className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Yangi buyurtma berish (24-48s bepul reja)
              </Link>
            </div>
          ) : (
            myOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-300 transition-all"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">#{ord.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-700">
                      {ord.orderType === 'BULK' ? 'Ommaviy buyurtma' : 'Individual buyurtma'}
                    </span>
                    {ord.freePlanStatus === 'COMPLETED' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Bepul reja tayyor
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" /> Reja tuzilmoqda (24-48s)
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{ord.topic}</h3>
                  <p className="text-xs text-slate-500">
                    Fan: <strong className="text-slate-700">{ord.subject}</strong> • Muddat: <strong className="text-slate-700">{ord.deadline}</strong> • Narx: <strong className="text-indigo-600">{ord.agreedPrice.toLocaleString()} so'm</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <Link
                    href={`/profil/buyurtmalar/${ord.id}`}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Jonli Chatni ochish</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Purchases */}
      {activeTab === 'PURCHASES' && (
        <div className="space-y-4">
          {myPurchasedWorks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">Siz hali birorta tayyor ish xarid qilmadingiz</h3>
              <Link
                href="/katalog"
                className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Katalogga o'tish
              </Link>
            </div>
          ) : (
            myPurchasedWorks.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs text-indigo-600 font-bold uppercase">{work.subject}</span>
                  <h3 className="font-bold text-slate-900 text-base">{work.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{work.pagesCount} sahifa</span>
                    <span>•</span>
                    <span>Antiplagiat: {work.uniquenessPercent || 80}%</span>
                  </div>
                </div>
                <a
                  href={work.originalFileUrl}
                  download
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Faylni yuklab olish (.docx)</span>
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Certificates */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myPlagiarism.map((plg) => (
              <div
                key={plg.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600">{plg.certificateCode || 'EM-2026'}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                    O'ziga xoslik: {plg.uniquenessPercent || 85}%
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{plg.topic}</h4>
                <div className="text-xs text-slate-500">
                  Fayl: <span className="font-mono">{plg.fileName}</span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {new Date(plg.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                  <button
                    onClick={() => setSelectedCert(plg)}
                    className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Sertifikatni ko'rish
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedCert && (
            <div className="pt-6">
              <CertificateView check={selectedCert} />
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Transactions */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700">
            Hisob operatsiyalari va to'lovlar
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-slate-800">{tx.description}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(tx.createdAt).toLocaleString('uz-UZ')} • Provayder: {tx.provider}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-bold ${
                    tx.type === 'DEPOSIT' || tx.type === 'EARNING' ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'EARNING' ? '+' : '-'}{tx.amount.toLocaleString()} so'm
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tx.status === 'COMPLETED' ? 'Muvaffaqiyatli' : 'Kutilmoqda'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}
