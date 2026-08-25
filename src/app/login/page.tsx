'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithTelegram } = useAuth();

  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle(role);
    setIsLoading(false);
    router.push('/profil');
  };

  const handleTelegramLogin = async () => {
    setIsLoading(true);
    await loginWithTelegram(role, 'Telegram Foydalanuvchisi', '+998 90 000 00 00');
    setIsLoading(false);
    router.push('/profil');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-8 space-y-7 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-sky-100 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 font-black text-xl tracking-wider">
            CP
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            CoSaPl ga Kirish
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Quyidagi qulay usullardan biri orqali 1 ta bosishda tizimga kiring:
          </p>
        </div>

        {/* Role Selector (Talaba / Muallif) */}
        <div className="space-y-1.5 relative z-10">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 text-center">
            Hisobingiz turini tanlang:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'STUDENT'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 Talaba (Xaridor)
            </button>
            <button
              type="button"
              onClick={() => setRole('AUTHOR')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'AUTHOR'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✍️ Muallif (Sotuvchi)
            </button>
          </div>
        </div>

        {/* 1-Click Auth Action Buttons */}
        <div className="space-y-3.5 relative z-10">
          {/* Telegram 1-Click Button */}
          <button
            type="button"
            onClick={handleTelegramLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-3 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.01]"
          >
            <Send className="w-5 h-5" />
            <span>Telegram orqali kirish</span>
          </button>

          {/* Google 1-Click Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google orqali kirish</span>
          </button>
        </div>

        {/* Telegram Bot Helper Info */}
        <div className="p-4 bg-sky-50/80 border border-sky-100 rounded-2xl space-y-2 text-xs text-sky-950">
          <div className="flex items-center justify-between font-bold text-sky-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Rasmiy Telegram Bot:
            </span>
            <span className="text-[11px] text-sky-700 font-mono font-bold">@CoSaPl_bot</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Telegram ilovangiz orqali botdan foydalanishingiz mumkin:
          </p>
          <a
            href="https://t.me/CoSaPl_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Botni ochish (@CoSaPl_bot)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Barcha ma'lumotlar Firebase Cloud bazasiga saqlanadi</span>
        </div>
      </div>
    </div>
  );
}
