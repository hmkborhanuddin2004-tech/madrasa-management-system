import React, { useState } from 'react';
import { FeeInvoice } from '../types';
import { db } from '../services/db';
import { financeService } from '../services/financeService';
import { FeeCollectionModal } from '../components/FeeCollectionModal';
import { MoneyReceiptModal } from '../components/PrintTemplates/MoneyReceipt';
import { Receipt, Search, PlusCircle, Printer } from 'lucide-react';

export const FeeCollection: React.FC = () => {
  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => db.getInvoices());
  const [search, setSearch] = useState('');
  const [posModalOpen, setPosModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);

  const reloadData = () => {
    setInvoices(db.getInvoices());
  };

  const handleInvoiceCreated = (newInv: FeeInvoice) => {
    reloadData();
    setSelectedInvoice(newInv); // Automatically open the receipt for immediate printing!
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
    inv.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
    String(inv.studentRoll).includes(search)
  );

  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ফি আদায় ও মানি রসিদ রেজিস্টার</h2>
          <p className="text-xs text-slate-500">শিক্ষার্থীদের ফি কালেকশন ও ২-কপি ভাউচার প্রিন্ট সেন্টার</p>
        </div>
        <button
          onClick={() => setPosModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          নতুন ফি আদায় (POS)
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">মোট আদায়কৃত ভাউচার</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
              {financeService.formatBanglaNumber(invoices.length)} টি
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase">সর্বমোট সংগৃহীত টাকা</span>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
              {financeService.formatBanglaCurrency(totalCollected)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            ৳
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="রোল, শিক্ষার্থীর নাম বা ভাউচার..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs py-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">ভাউচার নম্বর</th>
                <th className="py-3 px-4">শিক্ষার্থীর নাম ও রোল</th>
                <th className="py-3 px-4">শ্রেণি ও মাস</th>
                <th className="py-3 px-4 text-right">নির্ধারিত ফি</th>
                <th className="py-3 px-4 text-right">ছাড়</th>
                <th className="py-3 px-4 text-right">পরিশোধিত টাকা</th>
                <th className="py-3 px-4">তারিখ ও মাধ্যম</th>
                <th className="py-3 px-4 text-center">রসিদ প্রিন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    কোনো রসিদের তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {inv.voucherNo}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="block text-slate-900 font-semibold">{inv.studentName}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">রোল: {inv.studentRoll}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="block font-medium">{inv.class}</span>
                      <span className="text-[11px] text-slate-500 font-bold">{inv.month}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">
                      {financeService.formatBanglaCurrency(inv.amount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-700">
                      {inv.discount > 0 ? `- ${financeService.formatBanglaCurrency(inv.discount)}` : '০'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 text-sm">
                      {financeService.formatBanglaCurrency(inv.paidAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="block font-medium text-slate-700">{inv.date}</span>
                      <span className="text-[11px] text-slate-500 capitalize">{inv.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100 font-bold text-xs transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        রসিদ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {posModalOpen && (
        <FeeCollectionModal
          onClose={() => setPosModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}

      {selectedInvoice && (
        <MoneyReceiptModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
