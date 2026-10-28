import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { db } from '../services/db';
import { financeService } from '../services/financeService';
import { 
  FileSpreadsheet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PlusCircle, 
  Wallet, 
  Check, 
  X,
  Search
} from 'lucide-react';

export const AccountsDayBook: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => db.getTransactions());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [txType, setTxType] = useState<TransactionType>('income');
  const [category, setCategory] = useState('সাধারণ দান ও অনুদান');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState('নগদ ক্যাশ');
  const [approvedBy, setApprovedBy] = useState('মুহতামিম অফিস');

  const summary = financeService.getFinancialSummary();

  const reloadData = () => {
    setTransactions(db.getTransactions());
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) {
      alert('অনুগ্রহ করে সঠিক শিরোনাম ও টাকার পরিমাণ লিখুন');
      return;
    }

    db.addTransaction({
      voucherNo: (txType === 'income' ? 'IN-' : 'EX-') + Math.floor(1000 + Math.random() * 9000),
      type: txType,
      category,
      title,
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      approvedBy
    });

    reloadData();
    setModalOpen(false);
    setTitle('');
  };

  const filtered = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase()) ||
                          t.voucherNo.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">দৈনিক ক্যাশ ও হিসাব রেজিস্টার (Day Book)</h2>
          <p className="text-xs text-slate-500">সকল আয়, ব্যয়, অনুদান ও সেন্ট্রাল লেজার পরিচালনা</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          নতুন আয়/ব্যয় এন্ট্রি
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-800 uppercase">
            <span>সর্বমোট আয়</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
            {financeService.formatBanglaCurrency(summary.totalIncome)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm bg-gradient-to-br from-white to-rose-50/40">
          <div className="flex justify-between items-center text-xs font-bold text-rose-800 uppercase">
            <span>সর্বমোট ব্যয়</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-700 font-mono mt-1">
            {financeService.formatBanglaCurrency(summary.totalExpense)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-200 p-4 shadow-sm bg-gradient-to-br from-white to-brand-50/40">
          <div className="flex justify-between items-center text-xs font-bold text-brand-800 uppercase">
            <span>ক্যাশ ব্যালেন্স (হাতে নগদ)</span>
            <Wallet className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-xl font-bold text-brand-700 font-mono mt-1">
            {financeService.formatBanglaCurrency(summary.netCashBalance)}
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সকল ট্রানজেকশন ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            শুধুমাত্র আয় (Income)
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            শুধুমাত্র খরচ (Expense)
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="খাত বা ভাউচার দিয়ে খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">ভাউচার</th>
                <th className="py-3 px-4">ধরন</th>
                <th className="py-3 px-4">খাত ও শিরোনাম</th>
                <th className="py-3 px-4 text-right">টাকার পরিমাণ</th>
                <th className="py-3 px-4">তারিখ ও মাধ্যম</th>
                <th className="py-3 px-4">অনুমোদনকারী</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {t.voucherNo}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      t.type === 'income' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {t.type === 'income' ? 'আদায় (Income)' : 'ব্যয় (Expense)'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <strong className="block text-slate-900 font-semibold">{t.title}</strong>
                    <span className="text-[11px] text-slate-500">{t.category}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                    <span className={t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                      {t.type === 'income' ? '+' : '-'} {financeService.formatBanglaCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="block font-medium text-slate-700">{t.date}</span>
                    <span className="text-[11px] text-slate-500">{t.paymentMethod}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {t.approvedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">নতুন আয় / ব্যয় এন্ট্রি করুন</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setTxType('income');
                    setCategory('সাধারণ দান ও অনুদান');
                  }}
                  className={`py-2 rounded-lg font-bold transition text-xs ${
                    txType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  আদায় (Income)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType('expense');
                    setCategory('অফিস ও মেস খরচ');
                  }}
                  className={`py-2 rounded-lg font-bold transition text-xs ${
                    txType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  খরচ (Expense)
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">খাতের নাম (Category)</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিবরণ / শিরোনাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: হাজী আব্দুল করিম অনুদান বা শিক্ষক বেতন"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none bg-white font-medium"
                  >
                    <option value="নগদ ক্যাশ">নগদ ক্যাশ</option>
                    <option value="bKash">বিকাশ</option>
                    <option value="ব্যাংক চেক">ব্যাংক চেক</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অনুমোদনকারী</label>
                <input
                  type="text"
                  value={approvedBy}
                  onChange={e => setApprovedBy(e.target.value)}
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
