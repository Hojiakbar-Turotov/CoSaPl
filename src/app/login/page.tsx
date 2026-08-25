'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, User as UserIcon, Send, ArrowRight, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithTelegram } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 90 ');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setIsLoading(true);
    await loginWithTelegram(fullName.trim(), phone.trim(), role);
    setIsLoading(false);
    router.push('/profil');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-8 space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-100 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/25">
            <Send className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Telegram Orqali Avtorizatsiya
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            CoSaPl platformasiga xavfsiz kirish uchun Telegram ma'lumotlaringizni kiriting
          </p>
        </div>

        {/* Telegram Bot Direct Open Banner */}
        <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl space-y-2 text-xs text-sky-950">
          <div className="flex items-center justify-between font-bold text-sky-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Rasmiy Telegram Bot:
            </span>
            <span className="text-[11px] text-sky-600 font-mono">@CoSaPlBot</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Bot orqali avtomatik ro'yxatdan o'tish uchun quyidagi tugmani bosishingiz mumkin:
          </p>
          <a
            href="https://t.me/CoSaPlBot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Botni ochish (@CoSaPlBot)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          <span>yoki sayt orqali tasdiqlash</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Unified Telegram Form: F.I.SH & Phone */}
        <form onSubmit={handleTelegramAuthSubmit} className="space-y-4 relative z-10">
          {/* F.I.SH */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              To'liq F.I.SH (Ism va Familiya) *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Hojiakbar Turotov"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
              />
            </div>
          </div>

          {/* Telegram Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Telegram Telefon Raqamingiz *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
              />
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Faoliyat turi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  role === 'STUDENT'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Talaba (Xaridor)
              </button>
              <button
                type="button"
                onClick={() => setRole('AUTHOR')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  role === 'AUTHOR'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Muallif (Sotuvchi)
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>{isLoading ? "Kirilmoqda..." : "Tasdiqlash va Kirish"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security guarantee */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Telegram API orqali himoyalangan avtorizatsiya</span>
        </div>
      </div>
    </div>
  );
}
