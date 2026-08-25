'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { INITIAL_USERS } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithTelegram: (fullName: string, phone: string, userRole?: UserRole, telegramId?: string) => Promise<void>;
  login: (phone: string, role?: UserRole) => Promise<void>;
  register: (fullName: string, phone: string, role: UserRole, email?: string) => Promise<void>;
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

      if (tgName && tgPhone) {
        const tgUser: User = {
          id: `tg_${tgId || Date.now()}`,
          fullName: decodeURIComponent(tgName),
          phone: decodeURIComponent(tgPhone),
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

  const loginWithTelegram = async (fullName: string, phone: string, userRole: UserRole = 'STUDENT', telegramId?: string) => {
    const existing = INITIAL_USERS.find(u => u.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    if (existing) {
      saveUser({ ...existing, fullName: fullName || existing.fullName, role: userRole });
    } else {
      const newUser: User = {
        id: telegramId ? `tg_${telegramId}` : `user_${Date.now()}`,
        fullName,
        phone,
        role: userRole,
        balance: 0,
        telegramId,
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
    }
  };

  const login = async (phone: string, desiredRole: UserRole = 'STUDENT') => {
    await loginWithTelegram('Foydalanuvchi', phone, desiredRole);
  };

  const register = async (fullName: string, phone: string, userRole: UserRole) => {
    await loginWithTelegram(fullName, phone, userRole);
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
        loginWithTelegram,
        login,
        register,
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
