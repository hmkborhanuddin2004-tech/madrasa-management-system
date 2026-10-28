import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { SabaqRecord, Student } from '../types';
import { 
  BookMarked, 
  Plus, 
  Search, 
  Trash2, 
  Printer, 
  Award, 
  BookOpen,
  Calendar,
  UserCheck
} from 'lucide-react';

export const SabaqRegister: React.FC = () => {
  const [records, setRecords] = useState<SabaqRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDept, setSelectedDept] = useState<'all' | 'hifz' | 'kitab' | 'noorani'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState<'hifz' | 'kitab' | 'noorani'>('hifz');
  const [currentSabaq, setCurrentSabaq] = useState('');
  const [sabaqSabeq, setSabaqSabeq] = useState('');
  const [manzil, setManzil] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [quality, setQuality] = useState<SabaqRecord['quality']>('মুমতাজ');
  const [ustadhName, setUstadhName] = useState('ক্বারী হাবিবুর রহমান');
  const [remarks, setRemarks] = useState('');

  const loadData = () => {
    setRecords(db.getSabaqRecords());
    setStudents(db.getStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStudentSelect = (id: string) => {
    setStudentId(id);
    const s = students.find(item => item.id === id);
    if (s) {
      if (s.class.includes('হিফজ')) setDepartment('hifz');
      else if (s.class.includes('নূরানী')) setDepartment('noorani');
      else setDepartment('kitab');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !currentSabaq) return;

    const selectedStudent = students.find(s => s.id === studentId);
    if (!selectedStudent) return;

    db.addSabaqRecord({
      studentId,
      studentName: selectedStudent.name,
      studentRoll: selectedStudent.roll,
      class: selectedStudent.class,
      department,
      date,
      currentSabaq,
      sabaqSabeq,
      manzil,
      mistakes: Number(mistakes),
      quality,
      ustadhName,
      remarks
    });

    setIsModalOpen(false);
    // Reset fields
    setCurrentSabaq('');
    setSabaqSabeq('');
    setManzil('');
    setMistakes(0);
    setRemarks('');
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই সবক রেকর্ডটি ডিলিট করতে চান?')) {
      db.deleteSabaqRecord(id);
      loadData();
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesDept = selectedDept === 'all' || r.department === selectedDept;
    const matchesQuery = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.studentRoll.toString().includes(searchQuery) ||
                         r.currentSabaq.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.class.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const mumtazCount = records.filter(r => r.quality === 'মুমতাজ').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <BookMarked className="w-4 h-4" />
            <span>তালীমী কার্যক্রম</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">দৈনিক সবক রেজিস্টার (Sabaq Log)</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            হিফজ ও কিতাব বিভাগের প্রতিদিনের নতুন সবক, সবক সাবেক ও মানজিল মূল্যায়ন খাতা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>প্রিন্ট শীট</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সবক এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">মোট সবক এন্ট্রি</span>
            <p className="text-2xl font-black text-slate-800">{records.length} জন</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">মুমতাজ (উত্তম)</span>
            <p className="text-2xl font-black text-emerald-600">{mumtazCount} জন</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">হিফজ শিক্ষার্থী</span>
            <p className="text-2xl font-black text-blue-600">
              {records.filter(r => r.department === 'hifz').length} জন
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">আজকের তারিখ</span>
            <p className="text-lg font-black text-slate-800">{new Date().toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ছাত্রের নাম, রোল, জামাত বা সবক দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {(['all', 'hifz', 'kitab', 'noorani'] as const).map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {dept === 'all' && 'সকল বিভাগ'}
              {dept === 'hifz' && 'হিফজুল কুরআন'}
              {dept === 'kitab' && 'কিতাব বিভাগ'}
              {dept === 'noorani' && 'নূরানী বিভাগ'}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">তারিখ ও ছাত্র</th>
                <th className="px-4 py-3.5">আজকের নতুন সবক</th>
                <th className="px-4 py-3.5">সবক সাবেক</th>
                <th className="px-4 py-3.5">মানজিল / আমোখতা</th>
                <th className="px-4 py-3.5 text-center">ভুল</th>
                <th className="px-4 py-3.5 text-center">মান</th>
                <th className="px-4 py-3.5">উস্তাদ ও মন্তব্য</th>
                <th className="px-4 py-3.5 text-center no-print">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    কোনো সবক রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{r.studentName}</div>
                      <div className="text-xs text-slate-500">
                        রোল: {r.studentRoll} • {r.class}
                      </div>
                      <div className="text-[11px] text-brand-700 mt-0.5">{r.date}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {r.currentSabaq}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {r.sabaqSabeq || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {r.manzil || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        r.mistakes === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.mistakes} টি
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                        r.quality === 'মুমতাজ'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.quality === 'জায়্যিদ জিদ্দান'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.quality}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-800">{r.ustadhName}</div>
                      {r.remarks && <div className="text-[11px] text-slate-500 mt-0.5">{r.remarks}</div>}
                    </td>
                    <td className="px-4 py-3 text-center no-print">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sabaq Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5" />
                <h2 className="font-bold text-lg">দৈনিক সবক এন্ট্রি ফরম</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষার্থী নির্বাচন করুন *
                </label>
                <select
                  value={studentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- শিক্ষার্থী বাছাই করুন --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      রোল {s.roll} - {s.name} ({s.class})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="hifz">হিফজুল কুরআন</option>
                    <option value="kitab">কিতাব বিভাগ</option>
                    <option value="noorani">নূরানী বিভাগ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আজকের নতুন সবক (আজকের পাঠ) *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পারা ১৫, পৃষ্ঠা ৮ (আয়াত ৪০-৬৫)"
                  value={currentSabaq}
                  onChange={(e) => setCurrentSabaq(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সবক সাবেক (পেছনের পড়া)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: পারা ১৫, পৃষ্ঠা ১-৭"
                    value={sabaqSabeq}
                    onChange={(e) => setSabaqSabeq(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আমোখতা / মানজিল
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: পারা ৫ সম্পূর্ণ"
                    value={manzil}
                    onChange={(e) => setManzil(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভুলের সংখ্যা</label>
                  <input
                    type="number"
                    min="0"
                    value={mistakes}
                    onChange={(e) => setMistakes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মান / মূল্যায়ন</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="মুমতাজ">মুমতাজ (চমৎকার)</option>
                    <option value="জায়্যিদ জিদ্দান">জায়্যিদ জিদ্দান (উত্তম)</option>
                    <option value="জায়্যিদ">জায়্যিদ (ভালো)</option>
                    <option value="মাকবুল">মাকবুল (চলতি)</option>
                    <option value="পরিশ্রম প্রয়োজন">পরিশ্রম প্রয়োজন</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">উস্তাদের নাম</label>
                <input
                  type="text"
                  value={ustadhName}
                  onChange={(e) => setUstadhName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">উস্তাদের মন্তব্য</label>
                <input
                  type="text"
                  placeholder="যেমন: মাশাআল্লাহ! উচ্চারণ শুদ্ধ হয়েছে।"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition"
                >
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
