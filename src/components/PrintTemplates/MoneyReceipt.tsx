import React from 'react';
import { FeeInvoice } from '../../types';
import { financeService } from '../../services/financeService';
import { Printer, X } from 'lucide-react';

interface Props {
  invoice: FeeInvoice;
  onClose: () => void;
}

export const MoneyReceiptModal: React.FC<Props> = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const renderSingleVoucher = (copyTitle: string) => (
    <div className="border-2 border-slate-700 p-5 rounded-lg bg-white text-slate-900 relative text-xs">
      {/* Top Header */}
      <div className="text-center pb-2 border-b border-slate-300">
        <span className="inline-block px-3 py-0.5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 border border-slate-300 mb-1">
          {copyTitle}
        </span>
        <h2 className="text-lg font-bold text-brand-700 leading-tight">দারুল উলুম আল-ইসলামিয়া মাদরাসা</h2>
        <p className="text-[11px] text-slate-600">ডাকঘর ও থানা: সদর, জেলা: ঢাকা | মোবাইল: ০১৭০০-০০০০০০</p>
        <div className="mt-1 flex justify-between items-center text-[11px] font-semibold text-slate-700 pt-1 border-t border-dotted border-slate-300">
          <span>ভাউচার নং: <strong className="font-mono text-xs">{invoice.voucherNo}</strong></span>
          <span>তারিখ: {invoice.date}</span>
        </div>
      </div>

      {/* Student Details Row */}
      <div className="grid grid-cols-2 gap-2 my-3 bg-slate-50 p-2 rounded border border-slate-200">
        <div>
          <span className="text-slate-500">শিক্ষার্থীর নাম: </span>
          <strong className="text-slate-900">{invoice.studentName}</strong>
        </div>
        <div>
          <span className="text-slate-500">রোল নং: </span>
          <strong className="text-slate-900 font-mono text-xs">{invoice.studentRoll}</strong>
        </div>
        <div>
          <span className="text-slate-500">বিভাগ / শ্রেণি: </span>
          <strong className="text-slate-900">{invoice.class}</strong>
        </div>
        <div>
          <span className="text-slate-500">মাসের নাম: </span>
          <strong className="text-slate-900 font-bold text-brand-700">{invoice.month}</strong>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <table className="w-full border-collapse border border-slate-300 my-2">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="border border-slate-300 px-2 py-1 text-left">বিবরণ</th>
            <th className="border border-slate-300 px-2 py-1 text-right">পরিমাণ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-300 px-2 py-1.5">
              {invoice.category === 'tuition' && 'মাসিক বেতন ও খোরাকি ফি'}
              {invoice.category === 'admission' && 'ভর্তি ও সেশন ফি'}
              {invoice.category === 'exam' && 'পরীক্ষা ফি ও এডমিট কার্ড'}
              {invoice.category === 'boarding' && 'আবাসিক বোর্ডিং খাবার খরচ'}
              {invoice.category === 'books' && 'কিতাব ও পাঠ্যপুস্তক'}
              {invoice.category === 'other' && 'বিবিধ ও অন্যান্য'}
              {invoice.remarks && <span className="block text-[10px] text-slate-500">{invoice.remarks}</span>}
            </td>
            <td className="border border-slate-300 px-2 py-1.5 text-right font-mono">
              {financeService.formatBanglaCurrency(invoice.amount)}
            </td>
          </tr>
          {invoice.discount > 0 && (
            <tr className="text-amber-800 bg-amber-50/50">
              <td className="border border-slate-300 px-2 py-1 text-left font-medium">বিশেষ ছাড় (Waiver / Discount)</td>
              <td className="border border-slate-300 px-2 py-1 text-right font-mono">
                - {financeService.formatBanglaCurrency(invoice.discount)}
              </td>
            </tr>
          )}
          <tr className="bg-slate-50 font-bold">
            <td className="border border-slate-300 px-2 py-1.5 text-left text-brand-800">মোট আদায়কৃত টাকা</td>
            <td className="border border-slate-300 px-2 py-1.5 text-right font-mono text-brand-800 text-sm">
              {financeService.formatBanglaCurrency(invoice.paidAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer & Signature */}
      <div className="pt-6 mt-4 flex justify-between items-end border-t border-dotted border-slate-300 text-[10px]">
        <div className="text-center">
          <div className="border-t border-slate-400 w-24 mb-1"></div>
          <span>আদায়কারীর স্বাক্ষর</span>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 border border-dashed border-emerald-600 rounded-full flex items-center justify-center text-[9px] text-emerald-800 font-bold uppercase rotate-[-12deg] mx-auto opacity-80">
            পরিশোধিত <br /> PAID
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-slate-400 w-24 mb-1"></div>
          <span>মুহতামিম / প্রধান শিক্ষক</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 my-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div>
            <h3 className="text-lg font-bold text-slate-900">মানি রসিদ ও ভাউচার প্রিভিউ</h3>
            <p className="text-xs text-slate-500">প্রিন্ট করলে ২টি কপি একসাথে A4 পেইজে প্রিন্ট হবে (অফিস কপি ও গ্রাহক কপি)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট করুন (Print)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="mt-4 space-y-6">
          {renderSingleVoucher('১ম কপি — মাদরাসা অফিস')}
          <div className="border-b border-dashed border-slate-400 my-4 text-center relative no-print">
            <span className="bg-white px-2 text-[10px] text-slate-400">কেটে পৃথক করুন</span>
          </div>
          {renderSingleVoucher('২য় কপি — শিক্ষার্থী / অভিভাবক')}
        </div>
      </div>
    </div>
  );
};
