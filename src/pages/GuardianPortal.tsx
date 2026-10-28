import React, { useState } from 'react';
import { db } from '../services/db';
import { financeService } from '../services/financeService';
import { Student, FeeInvoice, HifzRecord } from '../types';
import { MoneyReceiptModal } from '../components/PrintTemplates/MoneyReceipt';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  Printer, 
  BookOpen, 
  Phone
} from 'lucide-react';

export const GuardianPortal: React.FC = () => {
  const [institutionCode, setInstitutionCode] = useState('MMS-786');
  const [rollNumber, setRollNumber] = useState('101');
  const [searched, setSearched] = useState(true);
  const [student, setStudent] = useState<Student | null>(() => {
    return db.getStudents().find(s => s.roll === 101) || null;
  });

  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const students = db.getStudents();
    const found = students.find(s => String(s.roll) === rollNumber.trim());
    setStudent(found || null);
    setSearched(true);
  };

  const invoices = student 
    ? db.getInvoices().filter(inv => inv.studentId === student.id)
    : [];

  const hifzLogs = student 
    ? db.getHifzRecords().filter(h => h.studentId === student.id)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-brand-700 to-emerald-800 rounded-3xl p-6 lg:p-8 text-white text-center shadow-xl relative overflow-hidden">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 backdrop-blur-md">
          <ShieldCheck className="w-8 h-8 text-gold-400" />
        </div>
        <h2 className="text-2xl font-bold">অভিভাবক এক্সেস পোর্টাল (Guardian Gateway)</h2>
        <p className="text-xs text-slate-100/90 mt-1 max-w-md mx-auto">
          কোনো পাসওয়ার্ড ছাড়াই শুধু প্রতিষ্ঠান কোড ও রোল নম্বর দিয়ে আপনার সন্তানের বকেয়া ফি, মানি রসিদ ও সবক চেক করুন।
        </p>

        {/* 2-Step Search Form */}
        <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <input
            type="text"
            placeholder="প্রতিষ্ঠান কোড"
            value={institutionCode}
            onChange={e => setInstitutionCode(e.target.value)}
            className="w-full sm:w-1/3 px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-mono font-bold focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="শিক্ষার্থীর রোল নম্বর"
            value={rollNumber}
            onChange={e => setRollNumber(e.target.value)}
            className="w-full sm:w-2/3 px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-mono font-bold focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            <Search className="w-3.5 h-3.5" />
            অনুসন্ধান
          </button>
        </form>
      </div>

      {/* Result Section */}
      {searched && (
        <>
          {student ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                    alt={student.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                        রোল {student.roll}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      পিতা: <strong>{student.fatherName}</strong> • শ্রেণি: <strong>{student.class}</strong>
                    </p>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                      <Phone className="w-3 h-3" /> {student.phone}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right self-start sm:self-auto min-w-[150px]">
                  <span className="text-xs text-slate-500 block">বর্তমান ফি বকেয়া</span>
                  {student.totalDue > 0 ? (
                    <strong className="text-lg font-mono font-bold text-rose-600">
                      {financeService.formatBanglaCurrency(student.totalDue)}
                    </strong>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> কোনো বকেয়া নেই
                    </span>
                  )}
                </div>
              </div>

              {/* Two Column Grid: Invoices & Hifz Record */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Fee Receipts */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Receipt className="w-4 h-4 text-brand-600" />
                    <h4 className="text-sm font-bold text-slate-900">পরিশোধিত মানি রসিদ সমূহ</h4>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {invoices.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">এখনো কোনো রসিদ ইস্যু হয়নি।</p>
                    ) : (
                      invoices.map((inv) => (
                        <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <strong className="text-slate-800 font-mono text-[11px]">{inv.voucherNo}</strong>
                            <span className="block text-slate-500 text-[11px]">{inv.month} • {inv.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-600">
                              {financeService.formatBanglaCurrency(inv.paidAmount)}
                            </span>
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              title="রসিদ ডাউনলোড ও প্রিন্ট"
                              className="p-1 rounded-lg border border-slate-200 text-brand-600 hover:bg-brand-50"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: Hifz Sabak Record */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900">হিফজ ও পড়ার সাম্প্রতিক অগ্রগতি</h4>
                  </div>

                  <div className="space-y-2.5 mt-3 text-xs">
                    {hifzLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">কোনো হিফজ রেকর্ড পাওয়া যায়নি।</p>
                    ) : (
                      hifzLogs.map((h) => (
                        <div key={h.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-mono text-slate-500">{h.date}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {h.quality}
                            </span>
                          </div>
                          <p className="text-slate-800 text-[11px]">
                            <strong>সবক:</strong> {h.sabaq}
                          </p>
                          <p className="text-slate-500 text-[10px] mt-0.5">
                            উস্তাদ: {h.ustadhName}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">কোনো তথ্য পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 mt-1">
                রোল নম্বরটি সঠিক কিনা পরীক্ষা করে আবার চেষ্টা করুন অথবা মাদ্রাসার অফিসে যোগাযোগ করুন।
              </p>
            </div>
          )}
        </>
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
