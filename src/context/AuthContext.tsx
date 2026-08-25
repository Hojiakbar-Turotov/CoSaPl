'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { INITIAL_USERS } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
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
    // Check localStorage - do NOT auto-login if nothing is saved
    const savedUser = localStorage.getItem('cosapl_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null); // Anonymous visitor by default
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

  const login = async (phone: string, desiredRole: UserRole = 'STUDENT') => {
    const existing = INITIAL_USERS.find(u => u.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    if (existing) {
      saveUser({ ...existing, role: desiredRole });
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName: 'Foydalanuvchi',
        phone,
        role: desiredRole,
        balance: 0, // Balance starts strictly at 0
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
    }
  };

  const register = async (fullName: string, phone: string, userRole: UserRole, email?: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      fullName,
      phone,
      email,
      role: userRole,
      balance: 0, // Balance starts strictly at 0
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
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
