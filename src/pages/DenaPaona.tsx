import React, { useState } from 'react';
import { DenaPaona } from '../types';
import { db } from '../services/db';
import { financeService } from '../services/financeService';
import { Scale, PlusCircle, Check, X, CreditCard } from 'lucide-react';

export const DenaPaonaPage: React.FC = () => {
  const [list, setList] = useState<DenaPaona[]>(() => db.getDenaPaona());
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalItem, setPayModalItem] = useState<DenaPaona | null>(null);
  const [payAmount, setPayAmount] = useState<number>(1000);

  // New Record state
  const [partyName, setPartyName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'dena' | 'paona'>('dena');
  const [amount, setAmount] = useState<number>(5000);
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [purpose, setPurpose] = useState('');

  const reloadData = () => {
    setList(db.getDenaPaona());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName || amount <= 0) {
      alert('সঠিক নাম ও টাকার পরিমাণ লিখুন');
      return;
    }

    db.addDenaPaona({
      partyName,
      phone,
      type,
      amount,
      paidAmount: 0,
      remainingAmount: amount,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'pending',
      purpose
    });

    reloadData();
    setModalOpen(false);
    setPartyName('');
    setPurpose('');
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalItem || payAmount <= 0) return;

    db.payDenaPaona(payModalItem.id, payAmount);
    reloadData();
    setPayModalItem(null);
  };

  const totalDena = list.filter(x => x.type === 'dena').reduce((acc, x) => acc + x.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">দেনা-পাওনা ও বাকির খতিয়ান</h2>
          <p className="text-xs text-slate-500">স্থানীয় মুদি দোকানদার, হার্ডওয়্যার বা মহাজনদের বাকি ও কিস্তি পরিশোধ</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          নতুন বাকির হিসাব যোগ
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm bg-gradient-to-br from-white to-rose-50/40">
          <div className="flex justify-between items-center text-xs font-bold text-rose-800 uppercase">
            <span>মাদরাসার মোট দেনা (দোকানদার/মহাজন বাকি)</span>
            <Scale className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-700 font-mono mt-1">
            {financeService.formatBanglaCurrency(totalDena)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">বকেয়া লেনদেনকারী প্রতিষ্ঠান</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              {financeService.formatBanglaNumber(list.filter(x => x.remainingAmount > 0).length)} টি
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">নির্ধারিত সময়ে কিস্তি পরিশোধযোগ্য</span>
        </div>
      </div>

      {/* Dena Paona Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">প্রতিষ্ঠান / ব্যক্তির নাম</th>
                <th className="py-3 px-4">উদ্দেশ্য ও বিবরণ</th>
                <th className="py-3 px-4 text-right">মোট বাকি</th>
                <th className="py-3 px-4 text-right">পরিশোধিত</th>
                <th className="py-3 px-4 text-right">অবশিষ্ট বকেয়া</th>
                <th className="py-3 px-4">পরিশোধের শেষ তারিখ</th>
                <th className="py-3 px-4 text-center">অবস্থা</th>
                <th className="py-3 px-4 text-center">কিস্তি প্রদান</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <strong className="block text-slate-900 font-semibold">{item.partyName}</strong>
                    <span className="text-[11px] text-slate-500 font-mono">{item.phone}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs">
                    {item.purpose}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {financeService.formatBanglaCurrency(item.amount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                    {financeService.formatBanglaCurrency(item.paidAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 font-bold text-sm">
                    {financeService.formatBanglaCurrency(item.remainingAmount)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {item.dueDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'cleared'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'partially-paid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status === 'cleared' ? 'পরিশোধিত' : item.status === 'partially-paid' ? 'আংশিক পরিশোধ' : 'বকেয়া'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.remainingAmount > 0 ? (
                      <button
                        onClick={() => {
                          setPayModalItem(item);
                          setPayAmount(item.remainingAmount);
                        }}
                        className="inline-flex items-center gap-1 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 font-bold px-2.5 py-1 rounded-lg text-[11px] transition"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        টাকা দিন
                      </button>
                    ) : (
                      <span className="text-emerald-600 text-xs font-bold">✓ ক্লিয়ার</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Installment Modal */}
      {payModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 my-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">দেনা কিস্তি পরিশোধ</h3>
            <p className="text-xs text-slate-500 mb-4">{payModalItem.partyName}</p>

            <form onSubmit={handlePay} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">অবশিষ্ট মোট দেনা</span>
                <strong className="text-base font-mono text-rose-600 font-bold">
                  {financeService.formatBanglaCurrency(payModalItem.remainingAmount)}
                </strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">আজকে পরিশোধের পরিমাণ (৳)</label>
                <input
                  type="number"
                  max={payModalItem.remainingAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-base font-mono font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  পরিশোধ নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Dena-Paona Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">নতুন বাকির হিসাব যুক্ত করুন</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">দোকান / মহাজনের নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: ভাই ভাই মুদি স্টোর"
                  value={partyName}
                  onChange={e => setPartyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বাকির পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বাকির কারণ বা মালামাল</label>
                <input
                  type="text"
                  placeholder="যেমন: বোর্ডিংয়ের ২৫ বস্তা চালের চালান"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">পরিশোধের সম্ভাব্য তারিখ</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
