import React from 'react';
import { Student } from '../../types';
import { Printer, X, Award } from 'lucide-react';

interface Props {
  student: Student;
  onClose: () => void;
}

export const MarksheetModal: React.FC<Props> = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const subjects = [
    { name: 'কুরআনুল কারীম ও তাজবীদ', full: 100, pass: 33, obtained: 94 },
    { name: 'আল-হাদিস ও উসূলে হাদিস', full: 100, pass: 33, obtained: 88 },
    { name: 'আল-ফিকহ ও ফরায়েয', full: 100, pass: 33, obtained: 91 },
    { name: 'আরবি সাহিত্য ও ব্যাকরণ (নাহু-সরফ)', full: 100, pass: 33, obtained: 85 },
    { name: 'আকাইদ ও বালাগাত', full: 100, pass: 33, obtained: 89 },
    { name: 'বাংলা ও সাধারণ গণিত', full: 100, pass: 33, obtained: 82 }
  ];

  const totalObtained = subjects.reduce((acc, s) => acc + s.obtained, 0);
  const percentage = Math.round((totalObtained / (subjects.length * 100)) * 100);

  const getBefaqGrade = (pct: number) => {
    if (pct >= 80) return { grade: 'মুমতাজ (স্টার মার্কস)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (pct >= 65) return { grade: 'জায়্যিদ জিদ্দান (১ম বিভাগ)', color: 'text-brand-700 bg-brand-50 border-brand-300' };
    if (pct >= 50) return { grade: 'জায়্যিদ (২য় বিভাগ)', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    if (pct >= 33) return { grade: 'মাকবুল (৩য় বিভাগ)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { grade: 'রাসিব (অকৃতকার্য)', color: 'text-red-700 bg-red-50 border-red-300' };
  };

  const resultGrade = getBefaqGrade(percentage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
          <div>
            <h3 className="text-base font-bold text-slate-900">বার্ষিক পরীক্ষা ফলাফল ও নম্বরপত্র (Marksheet)</h3>
            <p className="text-xs text-slate-500">বেফাক গ্রেডিং স্ট্যান্ডার্ড অনুযায়ী নম্বর ও গ্রেড শিট</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট করুন
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Container */}
        <div className="mt-4 p-6 border-2 border-slate-700 rounded-xl bg-white text-slate-900 text-xs">
          {/* Header */}
          <div className="text-center pb-3 border-b-2 border-brand-700">
            <h1 className="text-xl font-bold text-brand-800">দারুল উলুম আল-ইসলামিয়া মাদরাসা</h1>
            <p className="text-xs text-slate-600">বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (BEFAQ) অধিভুক্ত</p>
            <h2 className="text-sm font-bold mt-1 text-slate-800 underline decoration-slate-400">
              বার্ষিক পরীক্ষা মূল্যায়ন ও নম্বরপত্র — ২০২৬
            </h2>
          </div>

          {/* Student Meta */}
          <div className="grid grid-cols-2 gap-2 my-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">শিক্ষার্থীর নাম: </span>
              <strong className="text-slate-900">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-500">রোল নম্বর: </span>
              <strong className="text-slate-900 font-mono">{student.roll}</strong>
            </div>
            <div>
              <span className="text-slate-500">পিতার নাম: </span>
              <strong className="text-slate-900">{student.fatherName}</strong>
            </div>
            <div>
              <span className="text-slate-500">শ্রেণি / জামাত: </span>
              <strong className="text-slate-900">{student.class}</strong>
            </div>
          </div>

          {/* Subject Marks Table */}
          <table className="w-full border-collapse border border-slate-300 my-3">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 px-2.5 py-1.5 text-center w-12">ক্র.নং</th>
                <th className="border border-slate-300 px-2.5 py-1.5 text-left">কিতাব / বিষয়ের নাম</th>
                <th className="border border-slate-300 px-2.5 py-1.5 text-center w-20">পূর্ণমান</th>
                <th className="border border-slate-300 px-2.5 py-1.5 text-center w-20">পাস নম্বর</th>
                <th className="border border-slate-300 px-2.5 py-1.5 text-right w-24">প্রাপ্ত নম্বর</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 px-2.5 py-1.5">{sub.name}</td>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono">{sub.full}</td>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono">{sub.pass}</td>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono font-bold text-slate-900">
                    {sub.obtained}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-300 px-2.5 py-2 text-right">
                  সর্বমোট নম্বর ও শতকরা:
                </td>
                <td className="border border-slate-300 px-2.5 py-2 text-center font-mono">
                  {subjects.length * 100}
                </td>
                <td className="border border-slate-300 px-2.5 py-2 text-center text-slate-500">—</td>
                <td className="border border-slate-300 px-2.5 py-2 text-right font-mono text-brand-800 text-sm">
                  {totalObtained} ({percentage}%)
                </td>
              </tr>
            </tbody>
          </table>

          {/* Grade Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg border my-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-brand-600" />
              <div>
                <span className="text-[11px] text-slate-500 block">চূড়ান্ত ফলাফল গ্রেড</span>
                <span className={`inline-block px-3 py-0.5 rounded-full font-bold text-xs border ${resultGrade.color}`}>
                  {resultGrade.grade}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">শ্রেণি মেধা ক্রম</span>
              <strong className="text-sm text-slate-800">১ম স্থান (1st Position)</strong>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="pt-8 mt-6 flex justify-between items-end border-t border-slate-300 text-[10px]">
            <div className="text-center">
              <div className="border-t border-slate-400 w-24 mb-1"></div>
              <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 w-24 mb-1"></div>
              <span>পরীক্ষা নিয়ন্ত্রক</span>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 w-24 mb-1"></div>
              <span>মুহতামিম / প্রিন্সিপাল</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
