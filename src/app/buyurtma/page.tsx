'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileEdit, 
  Users, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  Lock
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { OrderType, WorkLanguage } from '@/types';
import Link from 'next/link';

export default function BuyurtmaPage() {
  const router = useRouter();
  const { createOrder } = useStore();
  const { user, isAuthenticated } = useAuth();

  const [orderType, setOrderType] = useState<OrderType>('INDIVIDUAL');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('2026-09-20');
  const [pageCount, setPageCount] = useState<number>(30);
  const [studentCount, setStudentCount] = useState<number>(10);
  const [language, setLanguage] = useState<WorkLanguage>('UZ');
  const [attachments, setAttachments] = useState<{ name: string; url: string; size: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachments([
        ...attachments,
        {
          name: file.name,
          url: '/uploads/sample_upload.pdf',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        }
      ]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!subject.trim() || !topic.trim()) return;

    setIsSubmitting(true);

    const calculatedPrice = orderType === 'INDIVIDUAL'
      ? Math.max(70000, pageCount * 3000)
      : studentCount * 45000;

    const newOrderId = createOrder({
      orderType,
      subject: subject.trim(),
      topic: topic.trim(),
      requirements: requirements.trim(),
      deadline,
      pageCount: orderType === 'INDIVIDUAL' ? pageCount : undefined,
      language,
      attachments,
      agreedPrice: calculatedPrice,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to the newly created live chat room for this order
      router.push(`/profil/buyurtmalar/${newOrderId}`);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>24–48 Soat Ichida Mutaxassislarimizdan Bepul Sifatli Reja</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          O'quv Ishi Uchun Buyurtma Berish
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Mavzuingiz va talablaringizni yuboring. Mualliflar jamoasi bepul reja tayyorlab beradi va buyurtma ichida siz bilan jonli chat ochiladi.
        </p>
      </div>

      {/* Auth Gate Banner if not logged in */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">
                Buyurtma berish uchun avtorizatsiyadan o'tish shart
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Buyurtma holatini kuzatish va muallif bilan jonli chatda yozishish uchun tizimga kiring.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-sm"
          >
            Tizimga kirish / Ro'yxatdan o'tish
          </Link>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Order Type Tabs */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setOrderType('INDIVIDUAL')}
            className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              orderType === 'INDIVIDUAL'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Individual Buyurtma</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('BULK')}
            className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              orderType === 'BULK'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Ommaviy Buyurtma (Guruh uchun)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Free Guarantee Notice */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong className="font-bold">24-48 Soat Bepul Reja Kafolati:</strong> Buyurtma berishingiz bilanoq buyurtma chati ochiladi. Malakali mualliflarimiz kafedra talablariga mos sifatli reja tuzib beradi. Reja ma'qul bo'lgach, yozish jarayoni boshlanadi.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Subject */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Fan yoki Yo'nalish nomi *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Masalan: Axborot texnologiyalari, Fuqarolik huquqi, Makroiqtisodiyot..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>

            {/* Topic / Topics Collection */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {orderType === 'INDIVIDUAL' ? 'Kurs ishi / MDI mavzusi *' : 'Guruh mavzular to\'plami nomi *'}
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  orderType === 'INDIVIDUAL'
                    ? "Mavzuni to'liq kiriting (masalan: Bank tizimida kredit risklarini boshqarish)"
                    : "Masalan: 3-kurs Moliya guruhi uchun 15 ta mavzular to'plami"
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Topshirish muddati (Deadline) *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Yozilish tili *
              </label>
              <select
                value={language}
                onChange={(e: any) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
              >
                <option value="UZ">O'zbek tili (Lotin)</option>
                <option value="RU">Rus tili</option>
                <option value="EN">Ingliz tili</option>
              </select>
            </div>

            {/* Pages count or Students count */}
            {orderType === 'INDIVIDUAL' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Taxminiy sahifalar soni
                </label>
                <input
                  type="number"
                  min="15"
                  max="150"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Talabalar soni (Mavzular soni)
                </label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Requirements Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Kafedra talablari va qo'shimcha ko'rsatmalar
            </label>
            <textarea
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Boblar soni, antiplagiat foizi, foydalanish kerak bo'lgan manbalar yoki o'qituvchining maxsus talablari..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
            />
          </div>

          {/* File Upload (Metodika / Topics List) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Metodik qo'llanma yoki fayllarni biriktirish (.pdf, .docx)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Faylni tanlang
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Metodik qo'llanma, namunaviy reja yoki talablar hujjati
                </span>
                <input
                  type="file"
                  onChange={handleMockFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Attached files list */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900"
                  >
                    <span className="font-semibold">{file.name} ({file.size})</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      O'chirish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Yuborilgandan so'ng darhol jonli chat ochiladi</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>{isSubmitting ? "Yuborilmoqda..." : "Buyurtmani yuborish & Chatga o'tish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
