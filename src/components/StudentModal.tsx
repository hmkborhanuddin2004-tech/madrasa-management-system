import React, { useState } from 'react';
import { Student, ResidentType } from '../types';
import { db } from '../services/db';
import { X, UserPlus, Check } from 'lucide-react';

interface Props {
  initialStudent?: Student | null;
  onClose: () => void;
  onSaved: () => void;
}

export const StudentModal: React.FC<Props> = ({ initialStudent, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    roll: initialStudent ? initialStudent.roll : Math.floor(100 + Math.random() * 900),
    name: initialStudent?.name || '',
    fatherName: initialStudent?.fatherName || '',
    phone: initialStudent?.phone || '',
    class: initialStudent?.class || 'হিফজুল কুরআন বিভাগ',
    section: initialStudent?.section || 'ক',
    residentType: (initialStudent?.residentType || 'residential') as ResidentType,
    monthlyFee: initialStudent?.monthlyFee || 2500,
    totalDue: initialStudent?.totalDue || 0,
    photoUrl: initialStudent?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
    admissionDate: initialStudent?.admissionDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('অনুগ্রহ করে শিক্ষার্থীর নাম ও মোবাইল নম্বর পূরণ করুন');
      return;
    }

    if (initialStudent) {
      db.updateStudent({
        ...initialStudent,
        ...formData
      });
    } else {
      db.addStudent({
        ...formData,
        status: 'active'
      });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">
              {initialStudent ? 'শিক্ষার্থীর তথ্য সংশোধন' : 'নতুন শিক্ষার্থী ডিজিটাল ভর্তি ফর্ম'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">রোল নম্বর *</label>
              <input
                type="number"
                value={formData.roll}
                onChange={e => setFormData({ ...formData, roll: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ভর্তির তারিখ</label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={e => setFormData({ ...formData, admissionDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
            <input
              type="text"
              placeholder="যেমন: মুহাম্মাদ আব্দুল্লাহ"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">পিতার নাম</label>
              <input
                type="text"
                placeholder="পিতার নাম লিখুন"
                value={formData.fatherName}
                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর *</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিভাগ / শ্রেণি</label>
              <select
                value={formData.class}
                onChange={e => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="হিফজুল কুরআন বিভাগ">হিফজুল কুরআন বিভাগ</option>
                <option value="নাজেরা বিভাগ">নাজেরা বিভাগ</option>
                <option value="নূরানী ১ম বর্ষ">নূরানী ১ম বর্ষ</option>
                <option value="নূরানী ২য় বর্ষ">নূরানী ২য় বর্ষ</option>
                <option value="নূরানী ৩য় বর্ষ">নূরানী ৩য় বর্ষ</option>
                <option value="মিযান জামাত (কিতাব বিভাগ)">মিযান জামাত</option>
                <option value="নাহবেমীর জামাত">নাহবেমীর জামাত</option>
                <option value="দাওরায়ে হাদিস">দাওরায়ে হাদিস</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">আবাসিক অবস্থা</label>
              <select
                value={formData.residentType}
                onChange={e => setFormData({ ...formData, residentType: e.target.value as ResidentType })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="residential">আবাসিক (বোর্ডিং মিলসহ)</option>
                <option value="non-residential">অনাবাসিক (শুধু পাঠ্য)</option>
                <option value="day-care">ডে-কেয়ার</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">মাসিক বেতন / ফি (৳)</label>
              <input
                type="number"
                value={formData.monthlyFee}
                onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">পূর্বের বকেয়া (যদি থাকে)</label>
              <input
                type="number"
                value={formData.totalDue}
                onChange={e => setFormData({ ...formData, totalDue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-150">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-1.5 shadow transition"
            >
              <Check className="w-4 h-4" />
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
