import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { AttendanceRecord, AttendanceStatus, Student, StaffMember } from '../types';
import { 
  CalendarCheck, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Printer,
  Save,
  Search
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'staff'>('students');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const stds = db.getStudents();
    const stfs = db.getStaff();
    const existingAtt = db.getAttendance();

    setStudents(stds);
    setStaffList(stfs);

    // Populate current date's attendance if any
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    existingAtt.filter(a => a.date === selectedDate).forEach(a => {
      map[a.personId] = { status: a.status, note: a.note || '' };
    });

    // For any student or staff not in existing attendance, default to 'present'
    stds.forEach(s => {
      if (!map[s.id]) map[s.id] = { status: 'present', note: '' };
    });
    stfs.forEach(s => {
      if (!map[s.id]) map[s.id] = { status: 'present', note: '' };
    });

    setAttendanceMap(map);
  }, [selectedDate]);

  const handleStatusChange = (personId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [personId]: { ...prev[personId], status }
    }));
  };

  const handleNoteChange = (personId: string, note: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [personId]: { ...prev[personId], note }
    }));
  };

  const handleMarkAllPresent = () => {
    const map = { ...attendanceMap };
    if (activeTab === 'students') {
      students.forEach(s => {
        map[s.id] = { status: 'present', note: '' };
      });
    } else {
      staffList.forEach(s => {
        map[s.id] = { status: 'present', note: '' };
      });
    }
    setAttendanceMap(map);
  };

  const handleSave = () => {
    const recordsToSave: AttendanceRecord[] = [];

    if (activeTab === 'students') {
      students.forEach(s => {
        const att = attendanceMap[s.id] || { status: 'present', note: '' };
        recordsToSave.push({
          id: `att-${s.id}-${selectedDate}`,
          personId: s.id,
          personName: s.name,
          personType: 'student',
          rollOrDesignation: `রোল ${s.roll}`,
          classOrDepartment: s.class,
          date: selectedDate,
          status: att.status,
          note: att.note
        });
      });
    } else {
      staffList.forEach(s => {
        const att = attendanceMap[s.id] || { status: 'present', note: '' };
        recordsToSave.push({
          id: `att-${s.id}-${selectedDate}`,
          personId: s.id,
          personName: s.name,
          personType: 'staff',
          rollOrDesignation: s.designation,
          classOrDepartment: s.department,
          date: selectedDate,
          status: att.status,
          note: att.note
        });
      });
    }

    db.recordBulkAttendance(recordsToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Filtered Lists
  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.roll.toString().includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const filteredStaff = staffList.filter(s => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.designation.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const currentList = activeTab === 'students' ? filteredStudents : filteredStaff;

  // Stats calculation
  const totalCount = currentList.length;
  const presentCount = currentList.filter(item => attendanceMap[item.id]?.status === 'present').length;
  const absentCount = currentList.filter(item => attendanceMap[item.id]?.status === 'absent').length;
  const lateCount = currentList.filter(item => attendanceMap[item.id]?.status === 'late').length;
  const leaveCount = currentList.filter(item => attendanceMap[item.id]?.status === 'leave').length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>উপস্থিতি ও হাজিরা রেজিস্টার</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">দৈনিক হাজিরা খাতা</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            শিক্ষার্থী ও সম্মানিত উস্তাদগণের প্রতিদিনের ডিজিটাল উপস্থিতি ও ছুটির হিসাব
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              সংরক্ষিত হয়েছে!
            </span>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>প্রিন্ট খাতা</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>হাজিরা সংরক্ষণ</span>
          </button>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'students'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>শিক্ষার্থী হাজিরা ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'staff'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>উস্তাদ ও স্টাফ হাজিরা ({staffList.length})</span>
          </button>
        </div>

        {/* Date & Quick actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition whitespace-nowrap"
          >
            ✓ সবাই উপস্থিত
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500">মোট তালিকাভুক্ত</span>
          <p className="text-xl font-black text-slate-800 mt-0.5">{totalCount} জন</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/20">
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> উপস্থিত
          </span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">{presentCount} জন</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-red-200 shadow-sm bg-red-50/20">
          <span className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
            <UserX className="w-3.5 h-3.5" /> অনুপস্থিত
          </span>
          <p className="text-xl font-black text-red-600 mt-0.5">{absentCount} জন</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-sm bg-amber-50/20">
          <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> ছুটি / বিলম্ব
          </span>
          <p className="text-xl font-black text-amber-600 mt-0.5">{leaveCount + lateCount} জন</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-brand-200 shadow-sm bg-brand-50/20 col-span-2 md:col-span-1">
          <span className="text-[11px] font-semibold text-brand-700">উপস্থিতির হার</span>
          <p className="text-xl font-black text-brand-700 mt-0.5">{percentage}%</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'students' ? "ছাত্রের নাম বা রোল দিয়ে খুঁজুন..." : "উস্তাদের নাম বা পদবী..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          />
        </div>

        {activeTab === 'students' && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl"
          >
            <option value="all">সকল জামাত / বিভাগ</option>
            <option value="হিফজুল কুরআন বিভাগ">হিফজুল কুরআন বিভাগ</option>
            <option value="নূরানী ৩য় বর্ষ">নূরানী ৩য় বর্ষ</option>
            <option value="মিযান জামাত (কিতাব বিভাগ)">মিযান জামাত (কিতাব বিভাগ)</option>
            <option value="নাহবেমীর জামাত">নাহবেমীর জামাত</option>
          </select>
        )}
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">ব্যক্তি / রোল</th>
                <th className="px-4 py-3.5">জামাত / পদবী</th>
                <th className="px-4 py-3.5 text-center">উপস্থিতি স্ট্যাটাস</th>
                <th className="px-4 py-3.5">মন্তব্য / ছুটির কারণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'students' ? (
                filteredStudents.map(student => {
                  const att = attendanceMap[student.id] || { status: 'present', note: '' };
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">রোল: {student.roll} • {student.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {student.class}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {(
                            [
                              { key: 'present', label: 'উপস্থিত', color: 'bg-emerald-600 text-white', inactive: 'bg-slate-100 text-slate-600' },
                              { key: 'absent', label: 'অনুপস্থিত', color: 'bg-red-600 text-white', inactive: 'bg-slate-100 text-slate-600' },
                              { key: 'leave', label: 'ছুটি', color: 'bg-amber-500 text-white', inactive: 'bg-slate-100 text-slate-600' },
                              { key: 'late', label: 'বিলম্ব', color: 'bg-purple-600 text-white', inactive: 'bg-slate-100 text-slate-600' }
                            ] as const
                          ).map(btn => (
                            <button
                              key={btn.key}
                              type="button"
                              onClick={() => handleStatusChange(student.id, btn.key)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                att.status === btn.key ? btn.color : btn.inactive
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="কারণ / মন্তব্য লিখুন..."
                          value={att.note}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredStaff.map(staff => {
                  const att = attendanceMap[staff.id] || { status: 'present', note: '' };
                  return (
                    <tr key={staff.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{staff.name}</div>
                        <div className="text-xs text-slate-500">{staff.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 text-xs">{staff.designation}</div>
                        <div className="text-[11px] text-slate-500">{staff.department}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {(
                            [
                              { key: 'present', label: 'উপস্থিত', color: 'bg-emerald-600 text-white', inactive: 'bg-slate-100 text-slate-600' },
                              { key: 'absent', label: 'অনুপস্থিত', color: 'bg-red-600 text-white', inactive: 'bg-slate-100 text-slate-600' },
                              { key: 'leave', label: 'ছুটি', color: 'bg-amber-500 text-white', inactive: 'bg-slate-100 text-slate-600' },
                              { key: 'late', label: 'বিলম্ব', color: 'bg-purple-600 text-white', inactive: 'bg-slate-100 text-slate-600' }
                            ] as const
                          ).map(btn => (
                            <button
                              key={btn.key}
                              type="button"
                              onClick={() => handleStatusChange(staff.id, btn.key)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                att.status === btn.key ? btn.color : btn.inactive
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="মন্তব্য..."
                          value={att.note}
                          onChange={(e) => handleNoteChange(staff.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
