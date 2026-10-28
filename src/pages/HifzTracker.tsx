import React, { useState } from 'react';
import { HifzRecord } from '../types';
import { db } from '../services/db';
import { BookOpen, PlusCircle, Award, Check, X, Bookmark } from 'lucide-react';

export const HifzTrackerPage: React.FC = () => {
  const [records, setRecords] = useState<HifzRecord[]>(() => db.getHifzRecords());
  const students = db.getStudents().filter(s => s.class.includes('হিফজ'));
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [sabaq, setSabaq] = useState('');
  const [sabqi, setSabqi] = useState('');
  const [manzil, setManzil] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [quality, setQuality] = useState<'মুমতাজ' | 'জায়্যিদ জিদ্দান' | 'জায়্যিদ' | 'মাকবুল' | 'পরিশ্রম প্রয়োজন'>('মুমতাজ');
  const [ustadhName, setUstadhName] = useState('ক্বারী হাবিবুর রহমান');

  const reloadData = () => {
    setRecords(db.getHifzRecords());
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId);
    if (!st || !sabaq) {
      alert('শিক্ষার্থী ও আজকের সবক নির্ধারণ করুন');
      return;
    }

    db.addHifzRecord({
      studentId: st.id,
      studentName: st.name,
      date: new Date().toISOString().split('T')[0],
      sabaq,
      sabqi: sabqi || 'গত ৩ পৃষ্ঠা',
      manzil: manzil || 'নির্ধারিত পারা',
      mistakes: Number(mistakes),
      quality,
      ustadhName
    });

    reloadData();
    setModalOpen(false);
    setSabaq('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">হিফজ ও নাজেরা কোরআন প্রগ্রেস ট্র্যাকার</h2>
          <p className="text-xs text-slate-500">সবক, সবকি, মঞ্জিল ও পারাভিত্তিক হিফজ সম্পূর্ণতার ভিজ্যুয়াল অ্যানালিটিক্স</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          আজকের সবক এন্ট্রি
        </button>
      </div>

      {/* Visual 30-Para Memorization Progress Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">হিফজ ছাত্রদের ৩০-পারা অগ্রগতি (Quran Progress Heatmap)</h3>
          </div>
          <span className="text-xs text-slate-500">মোট হিফজ শিক্ষার্থী: {students.length} জন</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {students.map((st, idx) => {
            const completedParas = idx === 0 ? 15 : idx === 1 ? 8 : 4;
            const percentage = Math.round((completedParas / 30) * 100);
            return (
              <div key={st.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {st.roll}
                    </div>
                    <div>
                      <strong className="block text-sm text-slate-900">{st.name}</strong>
                      <span className="text-[11px] text-slate-500">{st.class}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                    {completedParas} পারা সমাপ্ত ({percentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* 30-Para Mini Grid */}
                <div className="grid grid-cols-10 gap-1 pt-1">
                  {Array.from({ length: 30 }).map((_, pIdx) => (
                    <div
                      key={pIdx}
                      title={`পারা ${pIdx + 1}`}
                      className={`h-4 rounded text-[9px] font-mono flex items-center justify-center font-bold ${
                        pIdx < completedParas
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {pIdx + 1}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Sabaq Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">দৈনিক সবক, সবকি ও মঞ্জিল রেকর্ড</h3>
          <span className="text-xs text-slate-500">উস্তাদের মূল্যায়ন ও ভুলের সংখ্যা</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-3 px-4">সবক (নতুন পড়া)</th>
                <th className="py-3 px-4">সবকি (পেছনের পড়া)</th>
                <th className="py-3 px-4">মঞ্জিল (রিভিশন)</th>
                <th className="py-3 px-4 text-center">ভুল</th>
                <th className="py-3 px-4 text-center">মূল্যায়ন</th>
                <th className="py-3 px-4">মুয়াল্লিম / উস্তাদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-medium text-slate-600">{r.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">{r.sabaq}</td>
                  <td className="py-3 px-4 text-slate-700">{r.sabqi}</td>
                  <td className="py-3 px-4 text-slate-700">{r.manzil}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-amber-700">
                    {r.mistakes} টি
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {r.quality}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{r.ustadhName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">আজকের সবক রেকর্ড এন্ট্রি</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
                <select
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none bg-white font-medium"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      রোল {s.roll} - {s.name} ({s.class})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">সবক (নতুন পড়া) *</label>
                <input
                  type="text"
                  placeholder="যেমন: পারা ১৫, পৃষ্ঠা ৯ (সূরা বনী ইসরাঈল আয়াত ১-১০)"
                  value={sabaq}
                  onChange={e => setSabaq(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সবকি (পেছনের পড়া)</label>
                  <input
                    type="text"
                    placeholder="যেমন: পারা ১৫, পৃষ্ঠা ১-৮"
                    value={sabqi}
                    onChange={e => setSabqi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মঞ্জিল (আমপারা/রিভিশন)</label>
                  <input
                    type="text"
                    placeholder="যেমন: পারা ৬ সম্পূর্ণ"
                    value={manzil}
                    onChange={e => setManzil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ভুলের সংখ্যা</label>
                  <input
                    type="number"
                    value={mistakes}
                    onChange={e => setMistakes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">উস্তাদের মূল্যায়ন</label>
                  <select
                    value={quality}
                    onChange={e => setQuality(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none bg-white font-medium"
                  >
                    <option value="মুমতাজ">মুমতাজ (অসাধারণ)</option>
                    <option value="জায়্যিদ জিদ্দান">জায়্যিদ জিদ্দান (খুব ভালো)</option>
                    <option value="জায়্যিদ">জায়্যিদ (ভালো)</option>
                    <option value="মাকবুল">মাকবুল (মোটামুটি)</option>
                    <option value="পরিশ্রম প্রয়োজন">পরিশ্রম প্রয়োজন</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">উস্তাদের নাম</label>
                <input
                  type="text"
                  value={ustadhName}
                  onChange={e => setUstadhName(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow"
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
