import React, { useState } from 'react';
import { db } from '../services/db';
import { Student, FeeCategory, FeeInvoice } from '../types';
import { Receipt, Check, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onInvoiceCreated: (inv: FeeInvoice) => void;
}

export const FeeCollectionModal: React.FC<Props> = ({ onClose, onInvoiceCreated }) => {
  const students = db.getStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [category, setCategory] = useState<FeeCategory>('tuition');
  const [month, setMonth] = useState('অক্টোবর ২০২৬');
  const [amount, setAmount] = useState<number>(() => {
    const s = students.find(x => x.id === selectedStudentId);
    return s ? s.monthlyFee : 2500;
  });
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bKash' | 'nagad' | 'bank'>('cash');
  const [remarks, setRemarks] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId) as Student;

  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id);
    const s = students.find(x => x.id === id);
    if (s) {
      setAmount(s.monthlyFee);
    }
  };

  const netPayable = Math.max(0, amount - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const newInvoice = db.addInvoice({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentRoll: selectedStudent.roll,
      class: selectedStudent.class,
      category,
      month,
      amount,
      discount,
      netPayable,
      paidAmount: netPayable,
      dueAmount: 0,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      collectedBy: 'মুহতামিম অফিস',
      remarks
    });

    onInvoiceCreated(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">দ্রুত ফি আদায় ও রসিদ তৈরি (POS)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Select Student */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
            <select
              value={selectedStudentId}
              onChange={e => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium text-slate-800"
              required
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  রোল {s.roll} - {s.name} ({s.class}) {s.totalDue > 0 ? `[বকেয়া: ৳${s.totalDue}]` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Student Status Summary Box */}
          {selectedStudent && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 block">মাসিক রেগুলার ফি</span>
                <strong className="text-slate-900 font-mono">৳ {selectedStudent.monthlyFee}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">পূর্বের মোট বকেয়া</span>
                <strong className={`font-mono ${selectedStudent.totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ৳ {selectedStudent.totalDue}
                </strong>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ফি-এর ক্যাটাগরি</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FeeCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="tuition">মাসিক বেতন ও খোরাকি</option>
                <option value="admission">ভর্তি ও সেশন ফি</option>
                <option value="exam">পরীক্ষা ফি ও এডমিট</option>
                <option value="boarding">লিল্লাহ বোর্ডিং ফি</option>
                <option value="books">কিতাব ও বইপত্র</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">মাসের নাম</label>
              <input
                type="text"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">আদায়যোগ্য ফি (৳)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ছাড় / অনুদান (৳)</label>
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none text-amber-700 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="cash">নগদ ক্যাশ (Cash)</option>
                <option value="bKash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="bank">ব্যাংক একাউন্ট</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">মোট পরিশোধিত টাকা (Net)</label>
              <div className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 font-mono text-base font-bold text-emerald-800">
                ৳ {netPayable}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">বিশেষ মন্তব্য (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: অভিভাবক নগদ পরিশোধ করেছেন"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-150">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold flex items-center gap-2 shadow-lg transition"
            >
              <Check className="w-4 h-4" />
              আদায় ও রসিদ প্রিন্ট
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
