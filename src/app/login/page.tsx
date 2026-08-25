'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowRight, ShieldCheck, Sparkles, ExternalLink, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithTelegramData } = useAuth();

  const [role, setRole] = useState<UserRole>('STUDENT');
  const [telegramName, setTelegramName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle(role);
    setIsLoading(false);
    router.push('/profil');
  };

  const handleDirectNameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramName.trim()) return;

    setIsLoading(true);
    await loginWithTelegramData(telegramName.trim(), undefined, role);
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
          <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/25 font-black text-xl tracking-wider">
            <Send className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            CoSaPl Avtorizatsiya
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Telegram bot yoki Google hisobingiz orqali tizimga kiring
          </p>
        </div>

        {/* Role Selector (Talaba / Muallif) */}
        <div className="space-y-1.5 relative z-10">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 text-center">
            Faoliyat turini tanlang:
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

        {/* Telegram Bot Direct Open & TMA */}
        <div className="p-5 bg-sky-50/90 border border-sky-200 rounded-2xl space-y-3 relative z-10">
          <div className="flex items-center justify-between font-bold text-sky-950">
            <span className="flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Rasmiy Telegram Bot:
            </span>
            <span className="text-xs text-sky-700 font-mono font-bold bg-sky-100 px-2 py-0.5 rounded-md">@CoSaPl_bot</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Telegram ilovangiz orqali botga kirsangiz, platforma profilingizni <strong>avtomatik taniydi va ismingiz bilan ochiladi</strong>:
          </p>

          <a
            href="https://t.me/CoSaPl_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] text-xs sm:text-sm"
          >
            <Send className="w-4 h-4" />
            <span>@CoSaPl_bot orqali Kirish / Ochish</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Or Web Input */}
        <div className="space-y-4 relative z-10">
          {!showDirectInput ? (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowDirectInput(true)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <UserIcon className="w-4 h-4 text-slate-600" />
                <span>Ism / Telegram nomini kiritib kirish</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          ) : (
            <form onSubmit={handleDirectNameLogin} className="space-y-3 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ismingiz yoki Telegram Username: *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={telegramName}
                    onChange={(e) => setTelegramName(e.target.value)}
                    placeholder="Masalan: Hojiakbar Turotov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !telegramName.trim()}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Kirish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Telegram WebApp & Firebase Cloud orqali himoyalangan</span>
        </div>
      </div>
    </div>
  );
}
