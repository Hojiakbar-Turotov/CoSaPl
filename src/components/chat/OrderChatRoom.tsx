'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Clock, 
  CheckCheck, 
  Sparkles, 
  User as UserIcon, 
  FileText, 
  ShieldCheck, 
  Download,
  AlertCircle,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { Order, OrderMessage, UserRole } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

interface OrderChatRoomProps {
  order: Order;
}

export function OrderChatRoom({ order }: OrderChatRoomProps) {
  const { messages, sendMessage, submitPreparedPlan, updateOrderStatus } = useStore();
  const { user, role } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [showAuthorPlanModal, setShowAuthorPlanModal] = useState(false);
  const [planDraft, setPlanDraft] = useState(
    "1. Kirish\n2. I Bob. Nazariy va metodologik asoslar\n3. II Bob. Amaliy tahlil va statistik hisob-kitoblar\n4. III Bob. Takomillashtirish yo'llari va istiqbollar\n5. Xulosa va Foydalanilgan adabiyotlar"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const orderMessages: OrderMessage[] = messages[order.id] || [];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(order.id, inputText.trim());
    setInputText('');
  };

  const handleAttachMock = () => {
    sendMessage(
      order.id,
      "Fayl biriktirildi:",
      "/uploads/metodik_qollanma_tuzatish.pdf",
      "Metodik_qollanma_tuzatish.pdf"
    );
  };

  const handleAuthorSubmitPlan = () => {
    if (!planDraft.trim()) return;
    submitPreparedPlan(order.id, planDraft.trim());
    setShowAuthorPlanModal(false);
  };

  const getRoleBadge = (senderRole: UserRole) => {
    switch (senderRole) {
      case 'ADMIN':
        return <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Admin</span>;
      case 'AUTHOR':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Muallif</span>;
      case 'STUDENT':
        return <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Buyurtmachi</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">
              Buyurtma #{order.id}: {order.topic.substring(0, 40)}...
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-100 text-indigo-700">
              {order.orderType === 'BULK' ? 'Ommaviy' : 'Individual'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fan: <span className="text-slate-700 font-medium">{order.subject}</span> • Muddat: <span className="text-slate-700 font-medium">{order.deadline}</span>
          </p>
        </div>

        {/* Free plan status indicator */}
        <div className="flex items-center gap-2">
          {order.freePlanStatus === 'COMPLETED' ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bepul reja topshirilgan</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Reja tayyorlanmoqda (24-48s bepul)</span>
            </div>
          )}

          {/* If current role is Author or Admin and plan not submitted yet, show Submit Plan button */}
          {(role === 'AUTHOR' || role === 'ADMIN') && order.freePlanStatus !== 'COMPLETED' && (
            <button
              onClick={() => setShowAuthorPlanModal(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Rejani topshirish</span>
            </button>
          )}
        </div>
      </div>

      {/* Free Plan Banner if prepared */}
      {order.preparedPlanText && (
        <div className="bg-emerald-50/70 border-b border-emerald-200/80 p-3.5 px-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Mualliflar jamoasi tomonidan tayyorlangan bepul reja:
              </span>
              <pre className="text-xs text-emerald-950 font-sans whitespace-pre-line bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                {order.preparedPlanText}
              </pre>
            </div>
            {order.status === 'PLANNING' && role === 'STUDENT' && (
              <button
                onClick={() => {
                  updateOrderStatus(order.id, 'IN_PROGRESS');
                  sendMessage(order.id, "✅ Reja tasdiqlandi! Ishni yozishni boshlashingiz mumkin.");
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm flex-shrink-0 transition-colors"
              >
                Rejani tasdiqlash
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {orderMessages.map((msg) => {
          const isMe = msg.senderId === user?.id || (msg.senderRole === role && msg.senderId !== 'system');
          const isSystem = msg.senderId === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-slate-200/70 text-slate-700 text-xs px-4 py-2 rounded-xl max-w-md text-center border border-slate-300/60 leading-relaxed shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-semibold text-slate-700">{msg.senderName}</span>
                {getRoleBadge(msg.senderRole)}
                <span className="text-[10px] text-slate-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div
                className={`max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Attachment if present */}
                {msg.attachmentUrl && (
                  <div className={`mt-2.5 p-2 rounded-lg flex items-center justify-between gap-3 text-xs ${
                    isMe ? 'bg-indigo-700/60 text-indigo-100 border border-indigo-500' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate font-medium">{msg.attachmentName || 'Biriktirilgan fayl'}</span>
                    </div>
                    <a
                      href={msg.attachmentUrl}
                      download
                      className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
                      title="Yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions pills */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/70 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-600">
        <span className="font-semibold text-slate-400 flex-shrink-0">Tezkor:</span>
        <button
          type="button"
          onClick={() => setInputText("Assalomu alaykum, buyurtma holatini bilsam bo'ladimi?")}
          className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap transition-colors"
        >
          Holatni bilish
        </button>
        <button
          type="button"
          onClick={() => setInputText("Metodik qo'llanmani chatga yukladim, iltimos tekshirib ko'ring.")}
          className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap transition-colors"
        >
          Metodika yuklandi
        </button>
        <button
          type="button"
          onClick={() => setInputText("Rejani tasdiqlayman, ishni yozishni boshlayvering.")}
          className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap transition-colors"
        >
          Rejani tasdiqlash
        </button>
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          type="button"
          onClick={handleAttachMock}
          className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Fayl biriktirish"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Xabaringizni yozing (savollar, talablar, aniqlashtirishlar)..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium text-sm flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Yuborish</span>
        </button>
      </form>

      {/* Author Prepare Plan Modal */}
      {showAuthorPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Talabaga bepul reja taqdim etish (24-48s)
            </h3>
            <p className="text-xs text-slate-500">
              Ushbu reja kafedra talablariga mos tuziladi va talaba tomonidan tasdiqlanishi uchun yuboriladi.
            </p>

            <textarea
              rows={6}
              value={planDraft}
              onChange={(e) => setPlanDraft(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none text-slate-800"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAuthorPlanModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleAuthorSubmitPlan}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                Rejani talabaga yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
