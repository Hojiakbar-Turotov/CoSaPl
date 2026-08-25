'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { db, doc, setDoc, getDoc, rtdb, ref, rtdbSet } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithTelegram: (role?: UserRole, customName?: string, customPhone?: string, tgId?: string) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Check if opened via Telegram Web App or URL query parameters from @CoSaPl_bot
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
        saveUserToFirebaseAndLocal(tgUser);
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

  // Telegram 1-Click / Bot Login
  const loginWithTelegram = async (
    selectedRole: UserRole = 'STUDENT',
    customName: string = 'Telegram Foydalanuvchisi',
    customPhone: string = '+998 90 000 00 00',
    tgId?: string
  ) => {
    const userId = tgId ? `tg_${tgId}` : `tg_${Date.now()}`;
    const tgUser: User = {
      id: userId,
      fullName: customName,
      phone: customPhone,
      role: selectedRole,
      telegramUsername: 'cosapl_user',
      telegramId: tgId,
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    await saveUserToFirebaseAndLocal(tgUser);
  };

  // Google 1-Click Login
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
        loginWithTelegram,
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
