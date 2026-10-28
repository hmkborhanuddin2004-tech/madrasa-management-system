import React, { useState } from 'react';
import { Student } from '../types';
import { db } from '../services/db';
import { financeService } from '../services/financeService';
import { StudentModal } from '../components/StudentModal';
import { StudentIdCardModal } from '../components/PrintTemplates/StudentIdCard';
import { MarksheetModal } from '../components/PrintTemplates/Marksheet';
import { 
  UserPlus, 
  Search, 
  CreditCard, 
  GraduationCap, 
  Edit, 
  Trash2, 
  Phone
} from 'lucide-react';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => db.getStudents());
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);
  const [marksheetStudent, setMarksheetStudent] = useState<Student | null>(null);

  const reloadData = () => {
    setStudents(db.getStudents());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি শিক্ষার্থী "${name}"-কে তালিকা থেকে মুছে ফেলতে চান?`)) {
      db.deleteStudent(id);
      reloadData();
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          String(s.roll).includes(search) || 
                          s.phone.includes(search);
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">শিক্ষার্থী ও ভর্তি রেজিস্টার</h2>
          <p className="text-xs text-slate-500">মাদ্রাসার সকল ছাত্রের রোল, বিভাগ, আইডি কার্ড ও ফলাফল ব্যবস্থাপনা</p>
        </div>
        <button
          onClick={() => {
            setEditingStudent(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto text-sm"
        >
          <UserPlus className="w-4 h-4" />
          নতুন ছাত্র ভর্তি
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, রোল অথবা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">বিভাগ ফিল্টার:</span>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none bg-white text-slate-700"
          >
            <option value="all">সকল বিভাগ ও শ্রেণি</option>
            <option value="হিফজুল কুরআন বিভাগ">হিফজুল কুরআন বিভাগ</option>
            <option value="নাজেরা বিভাগ">নাজেরা বিভাগ</option>
            <option value="নূরানী ৩য় বর্ষ">নূরানী ৩য় বর্ষ</option>
            <option value="মিযান জামাত (কিতাব বিভাগ)">মিযান জামাত</option>
            <option value="নাহবেমীর জামাত">নাহবেমীর জামাত</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <th className="py-3 px-4 text-center w-16">রোল</th>
                <th className="py-3 px-4">শিক্ষার্থীর নাম ও তথ্য</th>
                <th className="py-3 px-4">বিভাগ ও জামাত</th>
                <th className="py-3 px-4">আবাসিক অবস্থা</th>
                <th className="py-3 px-4 text-right">মাসিক ফি</th>
                <th className="py-3 px-4 text-right">বকেয়া</th>
                <th className="py-3 px-4 text-center w-40">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                      {student.roll}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <strong className="block text-slate-900 font-semibold">{student.name}</strong>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {student.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {student.class}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        student.residentType === 'residential' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.residentType === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {financeService.formatBanglaCurrency(student.monthlyFee)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {student.totalDue > 0 ? (
                        <span className="text-rose-600 font-bold">
                          {financeService.formatBanglaCurrency(student.totalDue)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">পরিশোধিত</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setIdCardStudent(student)}
                          title="আইডি কার্ড প্রিন্ট"
                          className="p-1.5 rounded-lg border border-slate-200 text-brand-700 hover:bg-brand-50 transition"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setMarksheetStudent(student)}
                          title="ফলাফল ও মার্কশিট"
                          className="p-1.5 rounded-lg border border-slate-200 text-purple-700 hover:bg-purple-50 transition"
                        >
                          <GraduationCap className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setModalOpen(true);
                          }}
                          title="তথ্য সম্পাদনা"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          title="ডিলিট"
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
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

      {/* Modals */}
      {modalOpen && (
        <StudentModal
          initialStudent={editingStudent}
          onClose={() => setModalOpen(false)}
          onSaved={reloadData}
        />
      )}

      {idCardStudent && (
        <StudentIdCardModal
          student={idCardStudent}
          onClose={() => setIdCardStudent(null)}
        />
      )}

      {marksheetStudent && (
        <MarksheetModal
          student={marksheetStudent}
          onClose={() => setMarksheetStudent(null)}
        />
      )}
    </div>
  );
};
