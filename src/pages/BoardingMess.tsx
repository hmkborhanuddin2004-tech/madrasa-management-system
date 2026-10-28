import React, { useState } from 'react';
import { BoardingMess } from '../types';
import { db } from '../services/db';
import { financeService } from '../services/financeService';
import { UtensilsCrossed, PlusCircle, Check, X, Users } from 'lucide-react';

export const BoardingMessPage: React.FC = () => {
  const [messList, setMessList] = useState<BoardingMess[]>(() => db.getBoardingMess());
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [totalStudentsEating, setTotalStudentsEating] = useState(45);
  const [bazarCost, setBazarCost] = useState(4500);
  const [bazarDetails, setBazarDetails] = useState('');
  const [purchasedBy, setPurchasedBy] = useState('মাওলানা রফিক (বাবুর্চি সহকারী)');
  const [gasWaterMisc, setGasWaterMisc] = useState(250);

  const reloadData = () => {
    setMessList(db.getBoardingMess());
  };

  const handleAddMess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bazarDetails) {
      alert('বাজারের ফর্দ ও বিস্তারিত বিবরণ লিখুন');
      return;
    }

    const totalDailyExpense = Number(bazarCost) + Number(gasWaterMisc);

    db.addBoardingMess({
      date: new Date().toISOString().split('T')[0],
      totalStudentsEating: Number(totalStudentsEating),
      bazarCost: Number(bazarCost),
      bazarDetails,
      purchasedBy,
      gasWaterMisc: Number(gasWaterMisc),
      totalDailyExpense
    });

    reloadData();
    setModalOpen(false);
    setBazarDetails('');
  };

  const totalBazarSpent = messList.reduce((acc, m) => acc + m.totalDailyExpense, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">লিল্লাহ বোর্ডিং ও মেস বাজার হিসাব</h2>
          <p className="text-xs text-slate-500">আবাসিক ছাত্রদের খাবার, মিল গণনা এবং বাবুর্চির দৈনিক বাজার খরচ</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          আজকের বাজার এন্ট্রি
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex justify-between items-center text-xs font-bold text-amber-800 uppercase">
            <span>মোট মেস বাজার খরচ</span>
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 font-mono mt-1">
            {financeService.formatBanglaCurrency(totalBazarSpent)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">খাবার গ্রহণকারী ছাত্র</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              {financeService.formatBanglaNumber(45)} জন
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase">গড় মিল খরচ (প্রতি ছাত্র)</span>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
              ৳ ১১৫ / দিন
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            গড়
          </div>
        </div>
      </div>

      {/* Mess Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4 text-center">ছাত্র সংখ্যা</th>
                <th className="py-3 px-4">বাজারের ফর্দ ও মালামাল</th>
                <th className="py-3 px-4 text-right">বাজার খরচ</th>
                <th className="py-3 px-4 text-right">গ্যাস/অন্যান্য</th>
                <th className="py-3 px-4 text-right">মোট দৈনিক খরচ</th>
                <th className="py-3 px-4">ক্রেতা / বাবুর্চি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {m.date}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {m.totalStudentsEating}
                  </td>
                  <td className="py-3 px-4 max-w-xs text-slate-800 font-medium">
                    {m.bazarDetails}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {financeService.formatBanglaCurrency(m.bazarCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    {financeService.formatBanglaCurrency(m.gasWaterMisc)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 text-sm">
                    {financeService.formatBanglaCurrency(m.totalDailyExpense)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {m.purchasedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Today's Bazar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">লিল্লাহ বোর্ডিং দৈনিক বাজার এন্ট্রি</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMess} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মিল গ্রহণকারী ছাত্র সংখ্যা</label>
                  <input
                    type="number"
                    value={totalStudentsEating}
                    onChange={e => setTotalStudentsEating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">কাঁচাবাজারের খরচ (৳) *</label>
                  <input
                    type="number"
                    value={bazarCost}
                    onChange={e => setBazarCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বাজারের বিবরণ (ফর্দ) *</label>
                <textarea
                  rows={3}
                  placeholder="যেমন: চাল ২৫ কেজি, ডাল ৫ কেজি, আলু ১০ কেজি, সয়াবিন তেল ৩ লিটার..."
                  value={bazarDetails}
                  onChange={e => setBazarDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">গ্যাস, মসলা ও অন্যান্য (৳)</label>
                  <input
                    type="number"
                    value={gasWaterMisc}
                    onChange={e => setGasWaterMisc(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বাজার সংগ্রহকারী</label>
                  <input
                    type="text"
                    value={purchasedBy}
                    onChange={e => setPurchasedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 shadow"
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
