'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, User as UserIcon, Lock, ArrowRight, CheckCircle2, Send, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'TELEGRAM'>('LOGIN');
  const [phone, setPhone] = useState('+998 90 ');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'LOGIN') {
      await login(phone, role);
    } else {
      await register(fullName || 'Foydalanuvchi', phone, role);
    }

    setIsLoading(false);
    router.push('/profil');
  };

  const handleTelegramAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setIsLoading(true);
    await register(fullName.trim(), phone.trim(), 'STUDENT');
    setIsLoading(false);
    router.push('/profil');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/20 font-black text-lg">
            CP
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {mode === 'LOGIN' ? 'CoSaPl ga Kirish' : mode === 'REGISTER' ? 'Ro\'yxatdan O\'tish' : 'Telegram Bot Orqali Kirish'}
          </h2>
          <p className="text-xs text-slate-500">
            CoSaPl — Coursework Sales Platform
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'LOGIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => setMode('REGISTER')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'REGISTER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
          <button
            type="button"
            onClick={() => setMode('TELEGRAM')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'TELEGRAM' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Telegram Bot
          </button>
        </div>

        {/* Telegram Auth Mode */}
        {mode === 'TELEGRAM' ? (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl text-xs text-sky-950 space-y-2 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-sky-800">
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram Bot (@CoSaPlBot):</span>
              </div>
              <p>
                Botimiz orqali <b>to'liq F.I.SH (Ism, Familiya)</b> va <b>telefon raqamingizni</b> yuborib bir zumda ro'yxatdan o'tishingiz mumkin:
              </p>
              <a
                href="https://t.me/CoSaPlBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-sky-600 underline pt-1"
              >
                <span>Telegram botni ochish (@CoSaPlBot)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <form onSubmit={handleTelegramAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  F.I.SH (To'liq Ism va Familiyangiz) *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Turotov Hojiakbar..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-slate-800"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-sky-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>{isLoading ? "Kirilmoqda..." : "Telegram orqali tasdiqlash"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Standard Login & Register Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  F.I.SH (Ism va Familiya) *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Hojiakbar Turotov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Telefon raqamingiz *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-600 text-slate-800"
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Foydalanuvchi turi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    role === 'STUDENT'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
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
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Muallif (Sotuvchi)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>{isLoading ? "Kutilmoqda..." : mode === 'LOGIN' ? "Kirish" : "Ro'yxatdan o'tish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
