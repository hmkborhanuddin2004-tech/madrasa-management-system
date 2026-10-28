import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { ExamResult, Student, SubjectMark } from '../types';
import { 
  Award, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  CheckCircle2, 
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';

export const ExamResultPage: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewResult, setViewResult] = useState<ExamResult | null>(null);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [examName, setExamName] = useState('১ম সাময়িক পরীক্ষা ২০২৬');
  const [year, setYear] = useState('২০২৬');
  const [subjects, setSubjects] = useState<SubjectMark[]>([
    { subjectName: 'হিফজুল কুরআন / নাযেরা', totalMarks: 100, obtainedMarks: 90 },
    { subjectName: 'তাজবীদ ও কিরাত', totalMarks: 100, obtainedMarks: 85 },
    { subjectName: 'হাদীস ও ফিকহ্', totalMarks: 100, obtainedMarks: 80 },
    { subjectName: 'আরবী ব্যাকরণ ও সাহিত্য', totalMarks: 100, obtainedMarks: 75 },
    { subjectName: 'বাংলা ও সাধারণ জ্ঞান', totalMarks: 100, obtainedMarks: 78 }
  ]);
  const [remarks, setRemarks] = useState('');

  const loadData = () => {
    setResults(db.getExamResults());
    setStudents(db.getStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubjectChange = (index: number, field: 'subjectName' | 'totalMarks' | 'obtainedMarks', val: any) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: val };
    setSubjects(updated);
  };

  const addSubjectRow = () => {
    setSubjects([...subjects, { subjectName: '', totalMarks: 100, obtainedMarks: 0 }]);
  };

  const removeSubjectRow = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const calculateGrade = (percentage: number): ExamResult['grade'] => {
    if (percentage >= 80) return 'মুমতাজ';
    if (percentage >= 65) return 'জায়্যিদ জিদ্দান';
    if (percentage >= 50) return 'জায়্যিদ';
    if (percentage >= 33) return 'মাকবুল';
    return 'রাসিব';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    const selectedStudent = students.find(s => s.id === studentId);
    if (!selectedStudent) return;

    const totalMarks = subjects.reduce((sum, s) => sum + Number(s.totalMarks), 0);
    const obtainedMarks = subjects.reduce((sum, s) => sum + Number(s.obtainedMarks), 0);
    const percentage = totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2)) : 0;
    const grade = calculateGrade(percentage);

    db.addExamResult({
      examName,
      year,
      studentId,
      studentName: selectedStudent.name,
      studentRoll: selectedStudent.roll,
      class: selectedStudent.class,
      subjects,
      totalMarks,
      obtainedMarks,
      percentage,
      grade,
      remarks
    });

    setIsModalOpen(false);
    setRemarks('');
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই রেজাল্টটি মুছে ফেলতে চান?')) {
      db.deleteExamResult(id);
      loadData();
    }
  };

  const filteredResults = results.filter(r => {
    const matchesExam = selectedExam === 'all' || r.examName === selectedExam;
    const matchesQuery = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.studentRoll.toString().includes(searchQuery) ||
                         r.class.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>বেফাক ও মাদ্রাসা মূল্যায়ন পদ্ধতি</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">পরীক্ষা ও রেজাল্ট শিট (Exam & Results)</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            সাময়িক পরীক্ষা, বার্ষিক ও বেফাকুল মাদারিস স্ট্যান্ডার্ড মার্কশিট ও ফলাফল ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>ফলাফল বিবরণী প্রিন্ট</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ফলাফল এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Grade Scale Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-brand-900 text-white p-4 rounded-2xl shadow-sm text-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <span className="font-bold text-amber-300">বেফাক গ্রেড স্কেল:</span>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-white/10 px-2 py-0.5 rounded">৮০-১০০%: <b>মুমতাজ (Star)</b></span>
          <span className="bg-white/10 px-2 py-0.5 rounded">৬৫-৭৯%: <b>জায়্যিদ জিদ্দান (1st)</b></span>
          <span className="bg-white/10 px-2 py-0.5 rounded">৫০-৬৪%: <b>জায়্যিদ (2nd)</b></span>
          <span className="bg-white/10 px-2 py-0.5 rounded">৩৩-৪৯%: <b>মাকবুল (Pass)</b></span>
          <span className="bg-red-500/30 px-2 py-0.5 rounded text-red-200">৩৩% এর কম: <b>রাসিব (Fail)</b></span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ছাত্রের নাম, রোল বা বিভাগ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          />
        </div>

        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl"
        >
          <option value="all">সকল পরীক্ষা</option>
          <option value="১ম সাময়িক পরীক্ষা ২০২৬">১ম সাময়িক পরীক্ষা ২০২৬</option>
          <option value="২য় সাময়িক পরীক্ষা ২০২৬">২য় সাময়িক পরীক্ষা ২০২৬</option>
          <option value="বার্ষিক পরীক্ষা ২০২৬">বার্ষিক পরীক্ষা ২০২৬</option>
          <option value="বেফাক মডেল টেস্ট">বেফাক মডেল টেস্ট</option>
        </select>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">রোল ও শিক্ষার্থী</th>
                <th className="px-4 py-3.5">পরীক্ষার নাম</th>
                <th className="px-4 py-3.5 text-center">মোট নম্বর</th>
                <th className="px-4 py-3.5 text-center">প্রাপ্ত নম্বর</th>
                <th className="px-4 py-3.5 text-center">শতকরা</th>
                <th className="px-4 py-3.5 text-center">বেফাক গ্রেড</th>
                <th className="px-4 py-3.5 text-center no-print">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    কোনো পরীক্ষার ফলাফল পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{res.studentName}</div>
                      <div className="text-xs text-slate-500">
                        রোল: {res.studentRoll} • {res.class}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                      {res.examName} ({res.year})
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">
                      {res.totalMarks}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">
                      {res.obtainedMarks}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-brand-700">
                      {res.percentage}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                        res.grade === 'মুমতাজ'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : res.grade === 'জায়্যিদ জিদ্দান'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : res.grade === 'জায়্যিদ'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {res.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center no-print">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewResult(res)}
                          className="px-2.5 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition"
                        >
                          মার্কশিট
                        </button>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marksheet Modal Preview */}
      {viewResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 font-bangla">
            <div className="p-4 bg-slate-100 border-b flex justify-between items-center no-print">
              <span className="font-bold text-slate-700 text-sm">অফিসিয়াল মার্কশিট প্রিভিউ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold"
                >
                  প্রিন্ট মার্কশিট
                </button>
                <button
                  onClick={() => setViewResult(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  বন্ধ
                </button>
              </div>
            </div>

            <div className="p-8 space-y-5">
              <div className="text-center border-b-2 border-brand-800 pb-3">
                <span className="text-xs text-brand-900 font-bold block">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <h2 className="text-xl font-black text-brand-900 mt-0.5">দারুল উলুম ইসলামিয়া মাদ্রাসা</h2>
                <span className="inline-block mt-2 px-4 py-0.5 bg-brand-800 text-white font-bold text-xs rounded">
                  {viewResult.examName} ({viewResult.year})
                </span>
                <h3 className="text-sm font-bold text-slate-700 mt-1">নম্বরপত্র / একাডেমিক মার্কশিট</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span className="text-slate-500">শিক্ষার্থীর নাম:</span> <b>{viewResult.studentName}</b></div>
                <div><span className="text-slate-500">রোল নং:</span> <b>{viewResult.studentRoll}</b></div>
                <div><span className="text-slate-500">জামাত / শ্রেণী:</span> <b>{viewResult.class}</b></div>
                <div>
                  <span className="text-slate-500">চূড়ান্ত ফলাফল:</span>{' '}
                  <b className="text-brand-800 font-black">{viewResult.grade}</b>
                </div>
              </div>

              {/* Subject Table */}
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 border">বিষয়</th>
                    <th className="p-2 border text-center">পূর্ণমান</th>
                    <th className="p-2 border text-center">প্রাপ্ত নম্বর</th>
                  </tr>
                </thead>
                <tbody>
                  {viewResult.subjects.map((sub, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 border font-medium">{sub.subjectName}</td>
                      <td className="p-2 border text-center">{sub.totalMarks}</td>
                      <td className="p-2 border text-center font-bold text-slate-900">{sub.obtainedMarks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-black border-t-2 border-slate-300">
                    <td className="p-2 border">সর্বমোট</td>
                    <td className="p-2 border text-center">{viewResult.totalMarks}</td>
                    <td className="p-2 border text-center text-brand-800">{viewResult.obtainedMarks}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center text-xs pt-2">
                <div>শতকরা প্রাপ্তি: <b>{viewResult.percentage}%</b></div>
                <div>গ্রেড: <b className="text-brand-800 text-sm">{viewResult.grade}</b></div>
              </div>

              <div className="pt-8 flex justify-between text-xs text-slate-700 text-center">
                <div>
                  <div className="w-28 border-b border-slate-500 pb-1 mb-1"></div>
                  <span>শ্রেণী উস্তাদের স্বাক্ষর</span>
                </div>
                <div>
                  <div className="w-28 border-b border-slate-500 pb-1 mb-1"></div>
                  <span>নাযেমে তালিমাত</span>
                </div>
                <div>
                  <div className="w-28 border-b border-slate-500 pb-1 mb-1"></div>
                  <span>মুহতামিম</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200 font-bangla">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h2 className="font-bold text-lg">পরীক্ষার ফলাফল এন্ট্রি ফরম</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থী নির্বাচন *</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
                  <select
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="১ম সাময়িক পরীক্ষা ২০২৬">১ম সাময়িক পরীক্ষা ২০২৬</option>
                    <option value="২য় সাময়িক পরীক্ষা ২০২৬">২য় সাময়িক পরীক্ষা ২০২৬</option>
                    <option value="বার্ষিক পরীক্ষা ২০২৬">বার্ষিক পরীক্ষা ২০২৬</option>
                    <option value="বেফাক মডেল টেস্ট">বেফাক মডেল টেস্ট</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাবর্ষ</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Dynamic Subject Marks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">বিষয় ও নম্বর এন্ট্রি</label>
                  <button
                    type="button"
                    onClick={addSubjectRow}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800"
                  >
                    + বিষয় যোগ করুন
                  </button>
                </div>

                <div className="space-y-2">
                  {subjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="বিষয়ের নাম"
                        value={sub.subjectName}
                        onChange={(e) => handleSubjectChange(idx, 'subjectName', e.target.value)}
                        required
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="মোট"
                        value={sub.totalMarks}
                        onChange={(e) => handleSubjectChange(idx, 'totalMarks', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 text-xs border border-slate-300 rounded-lg text-center"
                      />
                      <input
                        type="number"
                        placeholder="প্রাপ্ত"
                        value={sub.obtainedMarks}
                        onChange={(e) => handleSubjectChange(idx, 'obtainedMarks', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 text-xs border border-slate-300 rounded-lg text-center font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubjectRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">উস্তাদের মন্তব্য</label>
                <input
                  type="text"
                  placeholder="যেমন: পড়ালেখায় অনেক মনোযোগী"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  রেজাল্ট সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
