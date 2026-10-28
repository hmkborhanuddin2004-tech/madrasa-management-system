import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { StaffMember, PayrollRecord } from '../types';
import { 
  Wallet, 
  Plus, 
  Users, 
  Printer, 
  CheckCircle2, 
  DollarSign, 
  Calendar,
  Building,
  UserCheck,
  CreditCard
} from 'lucide-react';

export const StaffPayroll: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [payrollList, setPayrollList] = useState<PayrollRecord[]>([]);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPaySlip, setSelectedPaySlip] = useState<PayrollRecord | null>(null);

  // New Staff Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [baseSalary, setBaseSalary] = useState(15000);
  const [houseRentAllowance, setHouseRentAllowance] = useState(2000);
  const [foodAllowance, setFoodAllowance] = useState(2000);

  // Pay Salary Form State
  const [payStaffId, setPayStaffId] = useState('');
  const [payMonth, setPayMonth] = useState('অক্টোবর ২০২৬');
  const [payBase, setPayBase] = useState(0);
  const [payAllowance, setPayAllowance] = useState(0);
  const [payDeduction, setPayDeduction] = useState(0);
  const [payMethod, setPayMethod] = useState('নগদ ক্যাশ');

  const loadData = () => {
    setStaffList(db.getStaff());
    setPayrollList(db.getPayroll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStaffSelectForPay = (staffId: string) => {
    setPayStaffId(staffId);
    const staff = staffList.find(s => s.id === staffId);
    if (staff) {
      setPayBase(staff.baseSalary);
      setPayAllowance(staff.houseRentAllowance + staff.foodAllowance);
      setPayDeduction(0);
    }
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) return;

    db.addStaff({
      name,
      designation,
      department: department || 'শিক্ষা বিভাগ',
      phone: phone || '০১৭১১০০০০০০',
      joiningDate: new Date().toISOString().split('T')[0],
      baseSalary: Number(baseSalary),
      houseRentAllowance: Number(houseRentAllowance),
      foodAllowance: Number(foodAllowance),
      status: 'active'
    });

    setIsStaffModalOpen(false);
    setName('');
    setDesignation('');
    setDepartment('');
    setPhone('');
    loadData();
  };

  const handlePaySalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStaffId) return;

    const staff = staffList.find(s => s.id === payStaffId);
    if (!staff) return;

    const netPayable = Number(payBase) + Number(payAllowance) - Number(payDeduction);

    const newPayRecord = db.paySalary({
      staffId: staff.id,
      staffName: staff.name,
      designation: staff.designation,
      month: payMonth,
      baseSalary: Number(payBase),
      allowance: Number(payAllowance),
      deduction: Number(payDeduction),
      netPayable,
      paymentMethod: payMethod,
      paidBy: 'হিসাবরক্ষক'
    });

    setIsPayModalOpen(false);
    loadData();
    setSelectedPaySlip(newPayRecord);
  };

  const totalMonthlyPayroll = staffList.reduce(
    (sum, s) => sum + s.baseSalary + s.houseRentAllowance + s.foodAllowance,
    0
  );

  const totalPaidThisMonth = payrollList
    .filter(p => p.month === 'অক্টোবর ২০২৬' && p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.netPayable, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>শিক্ষক ও কর্মচারী ব্যবস্থাপনা</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">শিক্ষক ও স্টাফ বেতন (Payroll)</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            মাসিক হাদিয়া ও বেতন হিসাব, পে-স্লিপ প্রিন্ট এবং জেনারেল লেজার খরচ সমন্বয়
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStaffModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>নতুন শিক্ষক যুক্ত করুন</span>
          </button>
          <button
            onClick={() => setIsPayModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>বেতন পরিশোধ (Pay Salary)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">মোট উস্তাদ ও কর্মচারী</span>
            <p className="text-2xl font-black text-slate-800">{staffList.length} জন</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">মাসিক মোট বেতন বাজেট</span>
            <p className="text-2xl font-black text-purple-700">৳{totalMonthlyPayroll.toLocaleString('bn-BD')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">চলতি মাসে পরিশোধিত</span>
            <p className="text-2xl font-black text-emerald-600">৳{totalPaidThisMonth.toLocaleString('bn-BD')}</p>
          </div>
        </div>
      </div>

      {/* Staff Master List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-sm">শিক্ষক ও স্টাফ প্রোফাইল ও বেতন কাঠামো</h2>
          <span className="text-xs text-slate-500">{staffList.length} জন সক্রিয় কর্মী</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">নাম ও পদবী</th>
                <th className="px-4 py-3">বিভাগ ও যোগাযোগ</th>
                <th className="px-4 py-3 text-right">মূল বেতন</th>
                <th className="px-4 py-3 text-right">ভাতা (বাড়ি+খাবার)</th>
                <th className="px-4 py-3 text-right">মোট প্রদেয়</th>
                <th className="px-4 py-3 text-center no-print">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map(staff => {
                const total = staff.baseSalary + staff.houseRentAllowance + staff.foodAllowance;
                return (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{staff.name}</div>
                      <div className="text-xs text-brand-700 font-semibold">{staff.designation}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-slate-800">{staff.department}</div>
                      <div className="text-[11px] text-slate-500">{staff.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      ৳{staff.baseSalary.toLocaleString('bn-BD')}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-600">
                      ৳{(staff.houseRentAllowance + staff.foodAllowance).toLocaleString('bn-BD')}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-slate-900">
                      ৳{total.toLocaleString('bn-BD')}
                    </td>
                    <td className="px-4 py-3 text-center no-print">
                      <button
                        onClick={() => {
                          handleStaffSelectForPay(staff.id);
                          setIsPayModalOpen(true);
                        }}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition"
                      >
                        বেতন দিন
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payroll Payment History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-sm">বেতন পরিশোধের সাম্প্রতিক ইতিহাস</h2>
          <span className="text-xs text-slate-500">ভাউচার সহ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ভাউচার ও তারিখ</th>
                <th className="px-4 py-3">শিক্ষক / স্টাফ</th>
                <th className="px-4 py-3">মাস</th>
                <th className="px-4 py-3 text-right">পরিশোধিত অংক</th>
                <th className="px-4 py-3 text-center">মাধ্যম</th>
                <th className="px-4 py-3 text-center">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-center no-print">পে-স্লিপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollList.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-xs text-slate-900">{pay.voucherNo || '—'}</div>
                    <div className="text-[11px] text-slate-500">{pay.paymentDate || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{pay.staffName}</div>
                    <div className="text-xs text-slate-500">{pay.designation}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {pay.month}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-brand-800">
                    ৳{pay.netPayable.toLocaleString('bn-BD')}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600">
                    {pay.paymentMethod || 'ক্যাশ'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      pay.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {pay.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center no-print">
                    <button
                      onClick={() => setSelectedPaySlip(pay)}
                      className="px-2.5 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition"
                    >
                      প্রিন্ট স্লিপ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Slip Modal */}
      {selectedPaySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 font-bangla">
            <div className="p-4 bg-slate-100 border-b flex justify-between items-center no-print">
              <span className="font-bold text-slate-700 text-sm">বেতন রশিদ (Pay Slip) প্রিভিউ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold"
                >
                  প্রিন্ট
                </button>
                <button
                  onClick={() => setSelectedPaySlip(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  বন্ধ
                </button>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="text-center border-b pb-3">
                <span className="text-xs text-brand-900 font-bold block">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <h2 className="text-lg font-black text-brand-900 mt-0.5">দারুল উলুম ইসলামিয়া মাদ্রাসা</h2>
                <p className="text-xs text-slate-500">শিক্ষক ও স্টাফ বেতন ভাউচার</p>
                <div className="inline-block mt-2 px-3 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                  মাস: {selectedPaySlip.month}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>নাম: <b>{selectedPaySlip.staffName}</b></div>
                <div>ভাউচার: <b>{selectedPaySlip.voucherNo}</b></div>
                <div>পদবী: <b>{selectedPaySlip.designation}</b></div>
                <div>পরিশোধের তারিখ: <b>{selectedPaySlip.paymentDate || 'আজ'}</b></div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>মূল বেতন (Basic Salary):</span>
                  <span className="font-semibold">৳{selectedPaySlip.baseSalary.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>ভাতা (House & Food Allowance):</span>
                  <span className="font-semibold">৳{selectedPaySlip.allowance.toLocaleString('bn-BD')}</span>
                </div>
                {selectedPaySlip.deduction > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-100 text-red-600">
                    <span>কর্তন / অগ্রিম (Deduction):</span>
                    <span>-৳{selectedPaySlip.deduction.toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t-2 border-slate-300 font-black text-sm text-brand-900">
                  <span>সর্বমোট প্রদেয় বেতন:</span>
                  <span>৳{selectedPaySlip.netPayable.toLocaleString('bn-BD')}</span>
                </div>
              </div>

              <div className="pt-10 flex justify-between text-xs text-slate-700 text-center">
                <div>
                  <div className="w-24 border-b border-slate-400 pb-1 mb-1"></div>
                  <span>গ্রহীতার স্বাক্ষর</span>
                </div>
                <div>
                  <div className="w-24 border-b border-slate-400 pb-1 mb-1"></div>
                  <span>হিসাবরক্ষক</span>
                </div>
                <div>
                  <div className="w-24 border-b border-slate-400 pb-1 mb-1"></div>
                  <span>মুহতামিম</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 font-bangla">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <h2 className="font-bold text-lg">বেতন প্রদান ফরম</h2>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handlePaySalarySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক / স্টাফ নির্বাচন *</label>
                <select
                  value={payStaffId}
                  onChange={(e) => handleStaffSelectForPay(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                >
                  <option value="">-- শিক্ষক বাছাই করুন --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বেতনের মাস</label>
                  <input
                    type="text"
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মূল বেতন</label>
                  <input
                    type="number"
                    value={payBase}
                    onChange={(e) => setPayBase(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোট ভাতা</label>
                  <input
                    type="number"
                    value={payAllowance}
                    onChange={(e) => setPayAllowance(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কর্তন / অগ্রিম</label>
                  <input
                    type="number"
                    value={payDeduction}
                    onChange={(e) => setPayDeduction(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পরিশোধের মাধ্যম</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                >
                  <option value="নগদ ক্যাশ">নগদ ক্যাশ</option>
                  <option value="ব্যাংক স্থানান্তর">ব্যাংক স্থানান্তর</option>
                  <option value="bKash">বিকাশ (bKash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                </select>
              </div>

              <div className="bg-brand-50 p-3 rounded-xl border border-brand-200 text-center">
                <span className="text-xs text-brand-800 font-semibold">মোট প্রদেয় বেতন:</span>
                <p className="text-xl font-black text-brand-900 mt-0.5">
                  ৳{(Number(payBase) + Number(payAllowance) - Number(payDeduction)).toLocaleString('bn-BD')}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  বেতন পরিশোধ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 font-bangla">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h2 className="font-bold text-lg">নতুন শিক্ষক বা স্টাফ যোগ করুন</h2>
              </div>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পুরো নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: মাওলানা হাফেজ আহমদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পদবী *</label>
                  <input
                    type="text"
                    placeholder="হিফজ শিক্ষক / কিতাব শিক্ষক"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ</label>
                  <input
                    type="text"
                    placeholder="হিফজুল কুরআন বিভাগ"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">মূল বেতন</label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-xl text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">বাড়িভাড়া</label>
                  <input
                    type="number"
                    value={houseRentAllowance}
                    onChange={(e) => setHouseRentAllowance(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-xl text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">খাবার ভাতা</label>
                  <input
                    type="number"
                    value={foodAllowance}
                    onChange={(e) => setFoodAllowance(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-xl text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
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
