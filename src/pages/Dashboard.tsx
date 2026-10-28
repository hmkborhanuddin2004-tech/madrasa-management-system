import React from 'react';
import { SpotlightCard } from '../components/SpotlightCard';
import { financeService } from '../services/financeService';
import { db } from '../services/db';
import { TabType } from '../components/Sidebar';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Users, 
  Receipt, 
  PlusCircle, 
  BookOpen, 
  UtensilsCrossed,
  Sparkles,
  Printer,
  BookMarked,
  CalendarCheck,
  Megaphone,
  Award,
  Library
} from 'lucide-react';
import { FeeInvoice } from '../types';

interface Props {
  onNavigate: (tab: TabType) => void;
  onOpenFeePos: () => void;
  onOpenNewStudent: () => void;
  onViewInvoice: (inv: FeeInvoice) => void;
}

export const Dashboard: React.FC<Props> = ({ 
  onNavigate, 
  onOpenFeePos, 
  onOpenNewStudent,
  onViewInvoice 
}) => {
  const summary = financeService.getFinancialSummary();
  const transactions = db.getTransactions().slice(0, 5);
  const recentInvoices = db.getInvoices().slice(0, 4);
  const hifzRecords = db.getHifzRecords().slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-700 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-brand-700/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>মাদরাসার হিসাব ও শিক্ষা অটোমেশন</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              আসসালামু আলাইকুম, মুহতামিম সাহেব!
            </h2>
            <p className="text-sm text-slate-100/90 mt-1.5 max-w-xl">
              আজকের ক্যাশ লেনদেন, ছাত্রদের মাসিক ফি আদায় ও হিফজের দৈনিক সবক আপডেট এক স্ক্রিনে পরিচালনা করুন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenFeePos}
              className="flex items-center gap-2 bg-white text-brand-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition transform active:scale-95"
            >
              <Receipt className="w-4 h-4 text-brand-600" />
              ফি আদায় (POS)
            </button>
            <button
              onClick={onOpenNewStudent}
              className="flex items-center gap-2 bg-brand-800/80 hover:bg-brand-900 border border-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              নতুন ভর্তি
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bento-Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Income */}
        <SpotlightCard className="border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">আজকের আদায়</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {financeService.formatBanglaCurrency(summary.todayIncome)}
            </div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
              <span>● ফি ও সাধারণ অনুদান</span>
            </p>
          </div>
        </SpotlightCard>

        {/* Card 2: Today Expense */}
        <SpotlightCard className="border-rose-200/60 bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">আজকের খরচ</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {financeService.formatBanglaCurrency(summary.todayExpense)}
            </div>
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-semibold">
              <span>● মেস বাজার ও অফিস বিল</span>
            </p>
          </div>
        </SpotlightCard>

        {/* Card 3: Net Cash Balance */}
        <SpotlightCard className="border-brand-200/80 bg-gradient-to-br from-white to-brand-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">বর্তমান ক্যাশ ব্যালেন্স</span>
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-700 font-mono">
              {financeService.formatBanglaCurrency(summary.netCashBalance)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              মোট আয়: {financeService.formatBanglaCurrency(summary.totalIncome)}
            </p>
          </div>
        </SpotlightCard>

        {/* Card 4: Students & Dues */}
        <SpotlightCard className="border-amber-200/70 bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">মোট শিক্ষার্থী ও বকেয়া</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {financeService.formatBanglaNumber(summary.totalStudents)} জন
            </div>
            <p className="text-xs text-amber-700 font-bold mt-1">
              ছাত্র বকেয়া: {financeService.formatBanglaCurrency(summary.totalStudentDues)}
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* Main Grid: Recent Invoices & Hifz Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Fee Invoices with Print option */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক ফি আদায় রসিদ</h3>
              <p className="text-xs text-slate-500">শিক্ষার্থীদের কাছ থেকে আদায়কৃত সর্বশেষ মানি রসিদ</p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 transition"
            >
              সবগুলো দেখুন →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs">
                    {inv.studentRoll}
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">{inv.studentName}</strong>
                    <span className="text-xs text-slate-500 font-mono">{inv.voucherNo} • {inv.month}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="block text-sm font-bold text-emerald-600 font-mono">
                      + {financeService.formatBanglaCurrency(inv.paidAmount)}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">{inv.paymentMethod}</span>
                  </div>
                  <button
                    onClick={() => onViewInvoice(inv)}
                    title="রসিদ প্রিন্ট করুন"
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Hifz & Mess Quick Widget */}
        <div className="space-y-6">
          {/* Hifz Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">আজকের হিফজ সবক</h3>
              </div>
              <button
                onClick={() => onNavigate('hifz')}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                বিস্তারিত
              </button>
            </div>
            <div className="space-y-2.5 mt-3">
              {hifzRecords.map((hf) => (
                <div key={hf.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-slate-900">{hf.studentName}</strong>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {hf.quality}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>সবক:</strong> {hf.sabaq}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Boarding Mess Shortcut */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5">
              <UtensilsCrossed className="w-4 h-4 text-amber-700" />
              <span>লিল্লাহ বোর্ডিং ও মেস বাজার</span>
            </div>
            <p className="text-slate-600 mb-3 text-[11px]">
              আবাসিক ছাত্রদের দৈনন্দিন মিল খরচ ও বাবুর্চির বাজার হিসাব স্বয়ংক্রিয় রাখুন।
            </p>
            <button
              onClick={() => onNavigate('boarding')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-center transition"
            >
              মেস খতিয়ান খুলুন
            </button>
          </div>

          {/* Quick Access to New Madrasa Modules */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm text-xs">
            <h3 className="font-bold text-slate-900 mb-2.5">তালীমী ও প্রশাসনিক শর্টকাট</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('sabaq')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-150 transition font-semibold text-[11px] text-slate-700 text-left"
              >
                <BookMarked className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">সবক রেজিস্টার</span>
              </button>
              <button
                onClick={() => onNavigate('attendance')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-150 transition font-semibold text-[11px] text-slate-700 text-left"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">হাজিরা খাতা</span>
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-150 transition font-semibold text-[11px] text-slate-700 text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">মাহফিল ও উৎসব</span>
              </button>
              <button
                onClick={() => onNavigate('notices')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-150 transition font-semibold text-[11px] text-slate-700 text-left"
              >
                <Megaphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">নোটিশ বোর্ড</span>
              </button>
              <button
                onClick={() => onNavigate('exams')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-150 transition font-semibold text-[11px] text-slate-700 text-left"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">পরীক্ষা ও রেজাল্ট</span>
              </button>
              <button
                onClick={() => onNavigate('library')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-150 transition font-semibold text-[11px] text-slate-700 text-left"
              >
                <Library className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="truncate">কিতাবখানা</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
