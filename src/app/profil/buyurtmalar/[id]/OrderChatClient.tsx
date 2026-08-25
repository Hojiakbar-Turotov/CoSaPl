'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { OrderChatRoom } from '@/components/chat/OrderChatRoom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface OrderChatClientProps {
  orderId: string;
}

export default function OrderChatClient({ orderId }: OrderChatClientProps) {
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Buyurtma topilmadi</h2>
        <p className="text-sm text-slate-500">Bunday ID bilan buyurtma tizimda mavjud emas.</p>
        <Link
          href="/profil"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Profilga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mening buyurtmalarimga qaytish</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-400">ID: #{order.id}</span>
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            {order.orderType === 'BULK' ? 'Ommaviy buyurtma' : 'Individual buyurtma'}
          </span>
        </div>
      </div>

      {/* Grid: Order Meta Summary & Live Chat Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Order Details Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Buyurtma Tafsilotlari
            </h3>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Mavzu:</span>
              <p className="text-sm font-bold text-slate-800 leading-snug mt-0.5">
                {order.topic}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Fan:</span>
                <span className="font-semibold text-slate-700">{order.subject}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Topshirish:</span>
                <span className="font-semibold text-slate-700">{order.deadline}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Hajmi:</span>
                <span className="font-semibold text-slate-700">{order.pageCount || 30} bet</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tili:</span>
                <span className="font-semibold text-slate-700">{order.language}</span>
              </div>
            </div>

            {order.requirements && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Talablar va metodika:
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {order.requirements}
                </p>
              </div>
            )}

            {/* Price & Author status */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Kelishilgan narx:</span>
              <span className="text-lg font-extrabold text-indigo-600">
                {order.agreedPrice.toLocaleString()} so'm
              </span>
            </div>
          </div>

          {/* Guarantee banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>CoSaPl Xavfsiz Suhbat & Kafolat</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Barcha o'zgartirishlar, reja bandlari va fayllar ushbu chat orqali uzatiladi. Har qanday noaniqlik bo'lsa muallifga bevosita yozishingiz mumkin.
            </p>
          </div>
        </div>

        {/* Right Side (2 cols): Live OrderChatRoom */}
        <div className="lg:col-span-2">
          <OrderChatRoom order={order} />
        </div>
      </div>
    </div>
  );
}
