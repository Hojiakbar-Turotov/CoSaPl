'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  FileEdit, 
  ShieldCheck, 
  User as UserIcon, 
  PlusCircle, 
  Menu, 
  X, 
  Wallet,
  LayoutDashboard,
  Store,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DepositModal } from '@/components/payment/DepositModal';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, isAuthenticated, logout } = useAuth();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Base navigation links
  const navLinks = [
    { name: 'Katalog (Do\'kon)', href: '/katalog', icon: ShoppingBag },
    { name: 'Buyurtma berish', href: '/buyurtma', icon: FileEdit, badge: '24-48s bepul' },
    { name: 'Antiplagiat (antiplag.uz)', href: '/antiplagiat', icon: ShieldCheck },
    { name: 'Sotuvchi bo\'limi', href: '/sotuvchi', icon: Store },
  ];

  // Admin panel is strictly conditional - only visible to authenticated admins
  if (isAuthenticated && role === 'ADMIN') {
    navLinks.push({ name: 'Admin panel', href: '/admin', icon: LayoutDashboard });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo: Clean CoSaPl */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform font-black text-base tracking-wider">
                CP
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  CoSaPl
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                  Coursework Sales Platform
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User & Balance or Login Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Balance Widget */}
                  <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-xl p-1 pl-3 shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-2">
                      <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{(user?.balance || 0).toLocaleString()} so'm</span>
                    </div>
                    <button
                      onClick={() => setIsDepositOpen(true)}
                      className="p-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">To'ldirish</span>
                    </button>
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/profil"
                    className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <span className="block text-xs font-semibold text-slate-800 truncate max-w-[100px]">
                        {user?.fullName || 'Kabinet'}
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase font-medium">
                        {role === 'STUDENT' ? 'Talaba' : role === 'AUTHOR' ? 'Muallif' : 'Admin'}
                      </span>
                    </div>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    title="Chiqish"
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kirish / Ro'yxatdan o'tish</span>
                </Link>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-indigo-500" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Deposit Modal */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </>
  );
}
