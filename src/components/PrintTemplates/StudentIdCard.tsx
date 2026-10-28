import React from 'react';
import { Student } from '../../types';
import { Printer, X } from 'lucide-react';

interface Props {
  student: Student;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<Props> = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div>
            <h3 className="text-base font-bold text-slate-900">শিক্ষার্থী পরিচয়পত্র (ID Card)</h3>
            <p className="text-xs text-slate-500">কালার প্রিন্ট করে প্লাস্টিক আইডি কার্ড পাউচে ব্যবহার উপযোগী</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Card Itself */}
        <div className="mt-5 flex justify-center">
          <div className="w-[300px] h-[460px] bg-white rounded-2xl shadow-xl border-2 border-brand-700 flex flex-col overflow-hidden relative text-slate-800">
            {/* Top Arc Header */}
            <div className="bg-gradient-to-r from-brand-700 to-emerald-700 text-white p-4 text-center rounded-b-[30px] shadow-md">
              <span className="text-[10px] tracking-widest text-gold-400 font-bold uppercase">পরিচয়পত্র • IDENTITY CARD</span>
              <h2 className="text-sm font-bold mt-0.5 leading-snug">দারুল উলুম আল-ইসলামিয়া মাদরাসা</h2>
              <p className="text-[9px] opacity-90">সদর, ঢাকা | ইআইআইএন: ১৩৮৭৬২</p>
            </div>

            {/* Photo & Roll */}
            <div className="flex flex-col items-center mt-3">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 ring-2 ring-brand-500">
                <img
                  src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{student.name}</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs border border-brand-200 mt-0.5">
                রোল নং: {student.roll}
              </span>
            </div>

            {/* Info Table */}
            <div className="px-5 mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">পিতার নাম:</span>
                <span className="font-semibold text-slate-800">{student.fatherName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">বিভাগ / শ্রেণি:</span>
                <span className="font-semibold text-slate-800">{student.class}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">ধরন:</span>
                <span className="font-semibold text-emerald-700">
                  {student.residentType === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">জরুরি যোগাযোগ:</span>
                <span className="font-semibold font-mono text-slate-800">{student.phone}</span>
              </div>
            </div>

            {/* Barcode & Signature */}
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[10px]">
              <div>
                {/* Fake Barcode Representation */}
                <div className="flex items-center space-x-0.5 h-6">
                  {[4, 2, 6, 3, 5, 2, 7, 3, 2, 6, 4, 3, 5].map((h, i) => (
                    <div key={i} className="bg-slate-800" style={{ width: `${(i % 3) + 1.5}px`, height: `${h * 3.5}px` }}></div>
                  ))}
                </div>
                <span className="font-mono text-[8px] text-slate-500">MMS-{student.roll}-2026</span>
              </div>
              <div className="text-center">
                <div className="border-t border-slate-400 w-16 mb-0.5"></div>
                <span className="text-[9px] font-semibold text-slate-600">মুহতামিম স্বাক্ষর</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
