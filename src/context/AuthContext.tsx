'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { db, doc, setDoc, getDoc, rtdb, ref, rtdbSet } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithTelegramData: (fullName: string, phone?: string, userRole?: UserRole, tgId?: string, username?: string) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateBalance: (amount: number) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check Telegram Web App native user data (Inside Telegram Mini App)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (tgUser) {
        const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || tgUser.username || `User ${tgUser.id}`;
        const authenticatedUser: User = {
          id: `tg_${tgUser.id}`,
          fullName,
          telegramId: tgUser.id.toString(),
          telegramUsername: tgUser.username,
          avatarUrl: tgUser.photo_url,
          role: 'STUDENT',
          balance: 0,
          createdAt: new Date().toISOString(),
        };
        saveUserToFirebaseAndLocal(authenticatedUser);
        return;
      }
    }

    // 2. Check URL query params from @CoSaPl_bot
    const searchParams = new URLSearchParams(window.location.search);
    const tgId = searchParams.get('tg_id');
    const tgName = searchParams.get('name');
    const tgPhone = searchParams.get('phone');
    const tgUsername = searchParams.get('username');
    const tgRole = (searchParams.get('role') as UserRole) || 'STUDENT';

    if (tgName || tgId) {
      const realName = tgName ? decodeURIComponent(tgName) : (tgUsername ? `@${tgUsername}` : `Telegram Foydalanuvchi`);
      const authenticatedUser: User = {
        id: `tg_${tgId || Date.now()}`,
        fullName: realName,
        phone: tgPhone ? decodeURIComponent(tgPhone) : undefined,
        telegramId: tgId || undefined,
        telegramUsername: tgUsername || undefined,
        role: tgRole,
        balance: 0,
        createdAt: new Date().toISOString(),
      };
      saveUserToFirebaseAndLocal(authenticatedUser);
      return;
    }

    // 3. Check localStorage
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

  const saveUserToFirebaseAndLocal = async (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('cosapl_current_user', JSON.stringify(u));

      // Save to Firebase Firestore & RTDB
      try {
        await setDoc(doc(db, 'users', u.id), u, { merge: true });
      } catch (err) {
        console.warn("Firestore sync error:", err);
      }
      try {
        await rtdbSet(ref(rtdb, `users/${u.id}`), u);
      } catch (err) {
        console.warn("RTDB sync error:", err);
      }
    } else {
      localStorage.removeItem('cosapl_current_user');
    }
  };

  const loginWithTelegramData = async (
    fullName: string,
    phone?: string,
    selectedRole: UserRole = 'STUDENT',
    tgId?: string,
    username?: string
  ) => {
    const userId = tgId ? `tg_${tgId}` : `tg_${Date.now()}`;
    const cleanUser: User = {
      id: userId,
      fullName: fullName.trim(),
      phone: phone || '+998 90 000 00 00',
      role: selectedRole,
      telegramUsername: username,
      telegramId: tgId,
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    await saveUserToFirebaseAndLocal(cleanUser);
  };

  const loginWithGoogle = async (selectedRole: UserRole = 'STUDENT') => {
    const googleUser: User = {
      id: `google_${Date.now()}`,
      fullName: 'Google Foydalanuvchisi',
      email: 'user@gmail.com',
      phone: '+998 90 123 45 67',
      role: selectedRole,
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    await saveUserToFirebaseAndLocal(googleUser);
  };

  const logout = () => {
    saveUserToFirebaseAndLocal(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      saveUserToFirebaseAndLocal({ ...user, role: newRole });
    }
  };

  const updateBalance = (delta: number) => {
    if (user) {
      const updated = { ...user, balance: Math.max(0, (user.balance || 0) + delta) };
      saveUserToFirebaseAndLocal(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'STUDENT',
        isAuthenticated: !!user,
        loginWithTelegramData,
        loginWithGoogle,
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
