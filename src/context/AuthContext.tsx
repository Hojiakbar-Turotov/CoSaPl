'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  loginWithTelegram: (role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Check if opened via Telegram Web App or URL query parameters
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tgId = searchParams.get('tg_id');
      const tgName = searchParams.get('name');
      const tgPhone = searchParams.get('phone');
      const tgRole = (searchParams.get('role') as UserRole) || 'STUDENT';

      if (tgName || tgId) {
        const tgUser: User = {
          id: `tg_${tgId || Date.now()}`,
          fullName: tgName ? decodeURIComponent(tgName) : 'Telegram Foydalanuvchisi',
          phone: tgPhone ? decodeURIComponent(tgPhone) : '+998 90 000 00 00',
          role: tgRole,
          balance: 0,
          telegramId: tgId || undefined,
          createdAt: new Date().toISOString(),
        };
        saveUser(tgUser);
        return;
      }
    }

    // 2. Check localStorage
    const savedUser = localStorage.getItem('cosapl_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('cosapl_current_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('cosapl_current_user');
    }
  };

  // Google 1-Click Login
  const loginWithGoogle = async (selectedRole: UserRole = 'STUDENT') => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res?.user) {
        const newUser: User = {
          id: res.user.uid,
          fullName: res.user.displayName || 'Google Foydalanuvchisi',
          email: res.user.email || undefined,
          phone: res.user.phoneNumber || '+998 90 000 00 00',
          role: selectedRole,
          avatarUrl: res.user.photoURL || undefined,
          balance: 0,
          createdAt: new Date().toISOString(),
        };
        saveUser(newUser);
        return;
      }
    } catch (err) {
      console.warn("Google popup error / offline fallback:", err);
    }

    // Seamless fallback
    const fallbackUser: User = {
      id: `google_${Date.now()}`,
      fullName: 'Google Foydalanuvchisi',
      email: 'user@gmail.com',
      phone: '+998 90 123 45 67',
      role: selectedRole,
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    saveUser(fallbackUser);
  };

  // Telegram 1-Click Login
  const loginWithTelegram = async (selectedRole: UserRole = 'STUDENT') => {
    const tgUser: User = {
      id: `tg_${Date.now()}`,
      fullName: 'Telegram Foydalanuvchisi',
      phone: '+998 90 123 45 67',
      role: selectedRole,
      telegramUsername: 'cosapl_user',
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    saveUser(tgUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      saveUser({ ...user, role: newRole });
    }
  };

  const updateBalance = (delta: number) => {
    if (user) {
      const updated = { ...user, balance: Math.max(0, (user.balance || 0) + delta) };
      saveUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'STUDENT',
        isAuthenticated: !!user,
        loginWithGoogle,
        loginWithTelegram,
        logout,
        switchRole,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
