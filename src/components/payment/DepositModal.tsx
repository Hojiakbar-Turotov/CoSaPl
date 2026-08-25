'use client';

import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, UploadCloud, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { addDeposit } = useStore();
  const { user } = useAuth();
  const [provider, setProvider] = useState<'CLICK' | 'PAYME' | 'MANUAL_RECEIPT'>('CLICK');
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('50000');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [25000, 50000, 100000, 200000, 500000];

  const handleQuickSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount(amt.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setAmount(Number(val) || 0);
  };

  const handleMockUpload = () => {
    setReceiptImage('/uploads/sample_check_receipt.jpg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    addDeposit(amount, provider, receiptImage || undefined);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Balansni to'ldirish</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">
              {provider === 'MANUAL_RECEIPT' ? "Chek muvaffaqiyatli yuborildi!" : "To'lov muvaffaqiyatli amalga oshirildi!"}
            </h4>
            <p className="text-slate-500 text-sm">
              {provider === 'MANUAL_RECEIPT'
                ? "Admin chekni tekshirgach, 5-15 daqiqa ichida hisobingiz to'ldiriladi."
                : `${amount.toLocaleString()} so'm balansingizga qo'shildi.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Provider Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                To'lov usulini tanlang
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setProvider('CLICK')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    provider === 'CLICK'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-sm font-bold tracking-tight text-blue-600">CLICK</span>
                  <span className="text-[11px] text-slate-500">Tezkor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('PAYME')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    provider === 'PAYME'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-sm font-bold tracking-tight text-teal-600">PAYME</span>
                  <span className="text-[11px] text-slate-500">0% komissiya</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('MANUAL_RECEIPT')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    provider === 'MANUAL_RECEIPT'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-sm font-bold tracking-tight text-violet-600">Karta / Chek</span>
                  <span className="text-[11px] text-slate-500">Admin tasdiq</span>
                </button>
              </div>
            </div>

            {/* Quick Amounts */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Summani tanlang (so'm)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {quickAmounts.slice(0, 3).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickSelect(amt)}
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
                      amount === amt
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.slice(3).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickSelect(amt)}
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
                      amount === amt
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {amt.toLocaleString()} so'm
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mt-3 relative">
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomChange}
                  placeholder="Boshqa summa..."
                  className="w-full pl-4 pr-16 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 font-semibold text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  so'm
                </span>
              </div>
            </div>

            {/* Manual card details if selected */}
            {provider === 'MANUAL_RECEIPT' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Admin karta raqami:</span>
                  <div className="flex items-center justify-between mt-1 p-2 bg-white rounded-lg border border-slate-200 font-mono font-bold text-slate-900">
                    <span>9860 3501 8842 1290</span>
                    <span className="text-[11px] font-sans font-normal text-slate-500">HUMO (A.R.)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    To'lov chekini (skrinshot) biriktiring:
                  </label>
                  {receiptImage ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Chek skrinshoti yuklandi
                      </span>
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        className="text-red-500 hover:text-red-700 underline text-[11px]"
                      >
                        O'chirish
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleMockUpload}
                      className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white transition-colors"
                    >
                      <UploadCloud className="w-4 h-4" /> Chek rasmini tanlash
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>To'lovlar 256-bitli shifrlangan xavfsiz protokol orqali amalga oshiriladi.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={amount <= 0 || (provider === 'MANUAL_RECEIPT' && !receiptImage)}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{amount.toLocaleString()} so'm to'lash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
