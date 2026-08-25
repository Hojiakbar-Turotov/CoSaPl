'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Work, Order, OrderMessage, PlagiarismCheck, Transaction, WorkStatus, OrderStatus } from '@/types';
import { INITIAL_WORKS, INITIAL_ORDERS, INITIAL_MESSAGES, INITIAL_PLAGIARISM_CHECKS, INITIAL_TRANSACTIONS } from '@/lib/mockData';
import { db, doc, setDoc, collection, addDoc, getDocs, rtdb, ref, rtdbSet } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface StoreContextType {
  works: Work[];
  orders: Order[];
  messages: Record<string, OrderMessage[]>;
  plagiarismChecks: PlagiarismCheck[];
  transactions: Transaction[];
  purchasedWorkIds: string[];
  
  // Work Actions
  addWork: (work: Omit<Work, 'id' | 'createdAt' | 'status' | 'salesCount' | 'downloadsCount' | 'rating'>) => void;
  approveWork: (id: string) => void;
  rejectWork: (id: string) => void;
  buyWork: (workId: string) => { success: boolean; message: string };
  
  // Order Actions
  createOrder: (orderData: Partial<Order>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus, resultFileUrl?: string) => void;
  assignAuthor: (orderId: string, authorId: string, authorName: string) => void;
  submitPreparedPlan: (orderId: string, planText: string, agreedPrice?: number) => void;
  sendMessage: (orderId: string, text: string, attachmentUrl?: string, attachmentName?: string) => void;
  
  // Plagiarism Actions
  submitPlagiarismCheck: (checkData: Partial<PlagiarismCheck>) => string;
  completePlagiarismCheck: (id: string, percent: number, reportUrl: string, certUrl: string) => void;
  
  // Transactions & Deposit
  addDeposit: (amount: number, provider: 'CLICK' | 'PAYME' | 'MANUAL_RECEIPT', receiptImg?: string) => void;
  approveDepositReceipt: (txId: string) => void;
  rejectDepositReceipt: (txId: string) => void;
  requestWithdrawal: (amount: number, cardNumber: string) => { success: boolean; message: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, updateBalance } = useAuth();
  
  const [works, setWorks] = useState<Work[]>(INITIAL_WORKS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [messages, setMessages] = useState<Record<string, OrderMessage[]>>(INITIAL_MESSAGES);
  const [plagiarismChecks, setPlagiarismChecks] = useState<PlagiarismCheck[]>(INITIAL_PLAGIARISM_CHECKS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [purchasedWorkIds, setPurchasedWorkIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWorks = localStorage.getItem('cosapl_works');
    if (savedWorks) {
      try { setWorks(JSON.parse(savedWorks)); } catch (e) { setWorks([]); }
    } else {
      setWorks([]);
    }

    const savedOrders = localStorage.getItem('cosapl_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { setOrders([]); }
    }

    const savedMsgs = localStorage.getItem('cosapl_messages');
    if (savedMsgs) {
      try { setMessages(JSON.parse(savedMsgs)); } catch (e) { setMessages({}); }
    }

    const savedPlg = localStorage.getItem('cosapl_plagiarism');
    if (savedPlg) {
      try { setPlagiarismChecks(JSON.parse(savedPlg)); } catch (e) { setPlagiarismChecks([]); }
    }

    const savedTx = localStorage.getItem('cosapl_transactions');
    if (savedTx) {
      try { setTransactions(JSON.parse(savedTx)); } catch (e) { setTransactions([]); }
    }

    const savedPurchased = localStorage.getItem('cosapl_purchased');
    if (savedPurchased) {
      try { setPurchasedWorkIds(JSON.parse(savedPurchased)); } catch (e) { setPurchasedWorkIds([]); }
    }
  }, []);

  // Save changes to localStorage and Firebase
  const saveWorks = async (newWorks: Work[]) => {
    setWorks(newWorks);
    localStorage.setItem('cosapl_works', JSON.stringify(newWorks));
    try {
      await rtdbSet(ref(rtdb, 'works'), newWorks);
    } catch (e) {
      console.warn("RTDB works sync:", e);
    }
  };

  const saveOrders = async (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('cosapl_orders', JSON.stringify(newOrders));
    try {
      await rtdbSet(ref(rtdb, 'orders'), newOrders);
    } catch (e) {
      console.warn("RTDB orders sync:", e);
    }
  };

  const saveMessages = async (newMsgs: Record<string, OrderMessage[]>) => {
    setMessages(newMsgs);
    localStorage.setItem('cosapl_messages', JSON.stringify(newMsgs));
    try {
      await rtdbSet(ref(rtdb, 'messages'), newMsgs);
    } catch (e) {
      console.warn("RTDB messages sync:", e);
    }
  };

  const savePlagiarism = async (newPlg: PlagiarismCheck[]) => {
    setPlagiarismChecks(newPlg);
    localStorage.setItem('cosapl_plagiarism', JSON.stringify(newPlg));
    try {
      await rtdbSet(ref(rtdb, 'plagiarism'), newPlg);
    } catch (e) {
      console.warn("RTDB plagiarism sync:", e);
    }
  };

  const saveTransactions = async (newTx: Transaction[]) => {
    setTransactions(newTx);
    localStorage.setItem('cosapl_transactions', JSON.stringify(newTx));
    try {
      await rtdbSet(ref(rtdb, 'transactions'), newTx);
    } catch (e) {
      console.warn("RTDB transactions sync:", e);
    }
  };

  const savePurchased = (ids: string[]) => {
    setPurchasedWorkIds(ids);
    localStorage.setItem('cosapl_purchased', JSON.stringify(ids));
  };

  // --- Work methods ---
  const addWork = async (workData: Omit<Work, 'id' | 'createdAt' | 'status' | 'salesCount' | 'downloadsCount' | 'rating'>) => {
    const id = `work_${Date.now()}`;
    const newWork: Work = {
      ...workData,
      id,
      status: 'APPROVED',
      salesCount: 0,
      downloadsCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };
    await saveWorks([newWork, ...works]);
    try {
      await setDoc(doc(db, 'works', id), newWork);
    } catch (e) {
      console.warn("Firestore addWork:", e);
    }
  };

  const approveWork = (id: string) => {
    saveWorks(works.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
  };

  const rejectWork = (id: string) => {
    saveWorks(works.map(w => w.id === id ? { ...w, status: 'REJECTED' } : w));
  };

  const buyWork = (workId: string) => {
    const work = works.find(w => w.id === workId);
    if (!work) return { success: false, message: 'Ish topilmadi' };
    if (!user) return { success: false, message: 'Iltimos, avval tizimga kiring' };
    if (purchasedWorkIds.includes(workId)) return { success: true, message: 'Siz bu ishni allaqachon xarid qilgansiz' };

    if (user.balance < work.price) {
      return { success: false, message: "Mablag' yetarli emas. Iltimos, balansingizni to'ldiring." };
    }

    // Deduct user balance
    updateBalance(-work.price);

    // Record purchase transaction
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'PURCHASE',
      provider: 'BALANCE',
      amount: work.price,
      status: 'COMPLETED',
      description: `"${work.title.substring(0, 45)}..." xaridi`,
      createdAt: new Date().toISOString(),
    };
    saveTransactions([newTx, ...transactions]);

    // Add author earnings (85% author share)
    const authorEarnings = Math.round(work.price * 0.85);
    const earnTx: Transaction = {
      id: `tx_earn_${Date.now()}`,
      userId: work.authorId,
      type: 'EARNING',
      provider: 'BALANCE',
      amount: authorEarnings,
      status: 'COMPLETED',
      description: `"${work.title.substring(0, 30)}..." sotuvidan daromad`,
      createdAt: new Date().toISOString(),
    };
    saveTransactions([earnTx, newTx, ...transactions]);

    // Update work sales count
    saveWorks(works.map(w => w.id === workId ? { ...w, salesCount: w.salesCount + 1, downloadsCount: w.downloadsCount + 1 } : w));

    // Save purchased ID
    savePurchased([...purchasedWorkIds, workId]);

    return { success: true, message: "Muvaffaqiyatli xarid qilindi! Faylni yuklab olishingiz mumkin." };
  };

  // --- Order methods ---
  const createOrder = (orderData: Partial<Order>): string => {
    const orderId = `ord_${Date.now().toString().slice(-4)}`;
    const newOrder: Order = {
      id: orderId,
      orderType: orderData.orderType || 'INDIVIDUAL',
      studentId: user?.id || 'guest',
      studentName: user?.fullName || 'Foydalanuvchi',
      studentPhone: user?.phone || '+998 90 000 00 00',
      subject: orderData.subject || 'Umumiy fan',
      topic: orderData.topic || 'Mavzu kiritilmagan',
      requirements: orderData.requirements || '',
      deadline: orderData.deadline || '2026-09-30',
      pageCount: orderData.pageCount || 30,
      language: orderData.language || 'UZ',
      attachments: orderData.attachments || [],
      freePlanStatus: 'IN_PROGRESS',
      agreedPrice: orderData.agreedPrice || (orderData.orderType === 'BULK' ? 500000 : 100000),
      status: 'PLANNING',
      createdAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...orders]);
    try {
      setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (e) {
      console.warn("Firestore createOrder:", e);
    }

    // Create initial welcome system message in chat
    const initialMsg: OrderMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: 'system',
      senderName: 'CoSaPl Dispetcher',
      senderRole: 'ADMIN',
      text: `Assalomu alaykum ${newOrder.studentName}! Sizning ${newOrder.orderType === 'BULK' ? 'Ommaviy' : 'Individual'} buyurtmangiz qabul qilindi. 24-48 soat ichida mutaxassislarimiz rejani bepul tayyorlab ushbu chatga yuklashadi. Qo'shimcha savollaringizni shu yerda yozishingiz mumkin.`,
      timestamp: new Date().toISOString(),
    };
    saveMessages({ ...messages, [orderId]: [initialMsg] });

    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, resultFileUrl?: string) => {
    saveOrders(orders.map(o => o.id === orderId ? { ...o, status, ...(resultFileUrl ? { resultFileUrl } : {}) } : o));
  };

  const assignAuthor = (orderId: string, authorId: string, authorName: string) => {
    saveOrders(orders.map(o => o.id === orderId ? { ...o, assignedAuthorId: authorId, assignedAuthorName: authorName } : o));
  };

  const submitPreparedPlan = (orderId: string, planText: string, agreedPrice?: number) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          freePlanStatus: 'COMPLETED' as const,
          freePlanCompletedAt: new Date().toISOString(),
          preparedPlanText: planText,
          status: 'PLANNING' as OrderStatus,
          ...(agreedPrice ? { agreedPrice } : {}),
        };
      }
      return o;
    });
    saveOrders(updatedOrders);

    sendMessage(
      orderId,
      `📋 BEPUL REJA TAYYOR BO'LDI:\n\n${planText}\n\nIltimos, rejani tekshirib ko'ring va tasdiqlang.`,
    );
  };

  const sendMessage = (orderId: string, text: string, attachmentUrl?: string, attachmentName?: string) => {
    const newMsg: OrderMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: user?.id || 'guest',
      senderName: user?.fullName || 'Foydalanuvchi',
      senderRole: user?.role || 'STUDENT',
      text,
      attachmentUrl,
      attachmentName,
      timestamp: new Date().toISOString(),
    };

    const currentOrderMsgs = messages[orderId] || [];
    saveMessages({
      ...messages,
      [orderId]: [...currentOrderMsgs, newMsg],
    });
  };

  // --- Plagiarism methods ---
  const submitPlagiarismCheck = (checkData: Partial<PlagiarismCheck>): string => {
    const id = `plg_${Date.now().toString().slice(-4)}`;
    const price = 25000;
    
    if (user && user.balance >= price) {
      updateBalance(-price);
    }

    const newCheck: PlagiarismCheck = {
      id,
      userId: user?.id || 'guest',
      userName: user?.fullName || 'Talaba',
      userPhone: user?.phone || '+998 90 000 00 00',
      documentUrl: checkData.documentUrl || '/uploads/sample_doc.docx',
      fileName: checkData.fileName || 'Hujjat.docx',
      subject: checkData.subject || 'Umumiy fan',
      topic: checkData.topic || 'Mavzu kiritilmagan',
      price,
      isPaid: true,
      status: 'CHECKING',
      createdAt: new Date().toISOString(),
    };

    savePlagiarism([newCheck, ...plagiarismChecks]);
    try {
      setDoc(doc(db, 'plagiarism', id), newCheck);
    } catch (e) {
      console.warn("Firestore plagiarism check:", e);
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user?.id || 'guest',
      type: 'PLAGIARISM_PAYMENT',
      provider: 'BALANCE',
      amount: price,
      status: 'COMPLETED',
      description: `Antiplag.uz tekshiruvi: "${newCheck.fileName}"`,
      createdAt: new Date().toISOString(),
    };
    saveTransactions([newTx, ...transactions]);

    return id;
  };

  const completePlagiarismCheck = (id: string, percent: number, reportUrl: string, certUrl: string) => {
    setPlagiarismChecks(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const certCode = p.certificateCode || `AP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          return {
            ...p,
            status: 'COMPLETED' as const,
            uniquenessPercent: percent,
            fullReportPdfUrl: reportUrl,
            certificatePdfUrl: certUrl,
            certificateCode: certCode,
            completedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      localStorage.setItem('cosapl_plagiarism', JSON.stringify(updated));
      return updated;
    });
  };

  // --- Transactions and Deposits ---
  const addDeposit = (amount: number, provider: 'CLICK' | 'PAYME' | 'MANUAL_RECEIPT', receiptImg?: string) => {
    if (!user) return;
    const isManual = provider === 'MANUAL_RECEIPT';
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'DEPOSIT',
      provider,
      amount,
      receiptImageUrl: receiptImg,
      status: isManual ? 'PENDING' : 'COMPLETED',
      description: isManual ? "Karta cheki orqali hisob to'ldirish (Moderatsiya kutilmoqda)" : `${provider} orqali tezkor to'lov`,
      createdAt: new Date().toISOString(),
    };

    saveTransactions([newTx, ...transactions]);

    if (!isManual) {
      updateBalance(amount);
    }
  };

  const approveDepositReceipt = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'PENDING') return;

    saveTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'COMPLETED' } : t));
    if (user && user.id === tx.userId) {
      updateBalance(tx.amount);
    }
  };

  const rejectDepositReceipt = (txId: string) => {
    saveTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'FAILED' } : t));
  };

  const requestWithdrawal = (amount: number, cardNumber: string) => {
    if (!user || user.balance < amount) {
      return { success: false, message: "Balansda yetarli mablag' mavjud emas" };
    }
    updateBalance(-amount);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'WITHDRAWAL',
      provider: 'MANUAL_RECEIPT',
      amount,
      status: 'PENDING',
      description: `Karta raqamiga yechib olish: ${cardNumber}`,
      createdAt: new Date().toISOString(),
    };
    saveTransactions([newTx, ...transactions]);
    return { success: true, message: "Pul yechish so'rovi qabul qilindi. 24 soat ichida kartangizga o'tkaziladi." };
  };

  return (
    <StoreContext.Provider
      value={{
        works,
        orders,
        messages,
        plagiarismChecks,
        transactions,
        purchasedWorkIds,
        addWork,
        approveWork,
        rejectWork,
        buyWork,
        createOrder,
        updateOrderStatus,
        assignAuthor,
        submitPreparedPlan,
        sendMessage,
        submitPlagiarismCheck,
        completePlagiarismCheck,
        addDeposit,
        approveDepositReceipt,
        rejectDepositReceipt,
        requestWithdrawal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within an StoreProvider');
  }
  return context;
}
