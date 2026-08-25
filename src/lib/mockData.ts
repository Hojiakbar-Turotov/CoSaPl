import { Work, Order, PlagiarismCheck, Transaction, User } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_student_1',
    fullName: 'Azizbek Rahimov',
    phone: '+998 90 123 45 67',
    email: 'azizbek@example.com',
    role: 'STUDENT',
    balance: 0,
    telegramUsername: 'azizbek_dev',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'user_author_1',
    fullName: 'Dr. Shahzodbek Mahmudov',
    phone: '+998 93 987 65 43',
    email: 'shahzod@expert.uz',
    role: 'AUTHOR',
    balance: 0,
    telegramUsername: 'shahzod_author',
    createdAt: '2026-08-15T08:30:00Z',
  },
  {
    id: 'user_admin_1',
    fullName: 'Admin Boshqaruvchi',
    phone: '+998 99 000 11 22',
    email: 'admin@cosapl.uz',
    role: 'ADMIN',
    balance: 0,
    telegramUsername: 'cosapl_admin',
    createdAt: '2026-08-01T00:00:00Z',
  },
];

// Boshlang'ich holatda tayyor ishlar bo'sh
export const INITIAL_WORKS: Work[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_MESSAGES: Record<string, any[]> = {};

export const INITIAL_PLAGIARISM_CHECKS: PlagiarismCheck[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
