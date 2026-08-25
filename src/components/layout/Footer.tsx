'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Send, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Phone,
  Mail
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg font-black text-sm">
                CP
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  CoSaPl<span className="text-indigo-400">.web.app</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Coursework Sales Platform
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              CoSaPl (Coursework Sales Platform) — O'zbekistondagi barcha oliygoh talabalari va mutaxassislar uchun yagona o'quv ishlari platformasi. Tayyor ishlar do'koni, individual/ommaviy buyurtmalar va rasmiy antiplagiat sertifikatlari.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Xavfsiz va Kafolatlangan</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>24-48s Bepul Reja</span>
              </div>
            </div>
          </div>

          {/* Col 2: Telegram Ekotizimi */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Telegram Ekotizimi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://t.me/CoSaPl_Admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>Admin (@CoSaPl_Admin)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/CoSaPl_Kanal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Rasmiy Kanal (@CoSaPl_Kanal)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/CoSaPl_Guruh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Muhokama Guruhi (@CoSaPl_Guruh)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Xizmatlar */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Asosiy Bo'limlar
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/katalog" className="hover:text-white transition-colors">
                  Tayyor ishlar do'koni
                </Link>
              </li>
              <li>
                <Link href="/buyurtma" className="hover:text-white transition-colors">
                  Individual buyurtma berish
                </Link>
              </li>
              <li>
                <Link href="/buyurtma" className="hover:text-white transition-colors">
                  Ommaviy buyurtmalar (Guruh)
                </Link>
              </li>
              <li>
                <Link href="/antiplagiat" className="hover:text-white transition-colors">
                  Antiplagiat tekshiruvi & Sertifikat
                </Link>
              </li>
              <li>
                <Link href="/sotuvchi" className="hover:text-white transition-colors">
                  Muallif bo'lib daromad olish
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: To'lovlar & Aloqa */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              To'lov & Aloqa
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-bold text-blue-400 rounded-md">
                CLICK
              </span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-bold text-teal-400 rounded-md">
                PAYME
              </span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-bold text-violet-400 rounded-md">
                UZUM
              </span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 rounded-md">
                HUMO / UZCARD
              </span>
            </div>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>+998 71 200-00-00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@cosapl.web.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CoSaPl (Coursework Sales Platform — cosapl.web.app). Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-6">
            <span>Foydalanish shartlari</span>
            <span>Maxfiylik siyosati</span>
            <span>Ommaviy oferta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
