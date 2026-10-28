import React from 'react';
import { UserSession, Role } from '../types';
import { authService } from '../services/authService';
import { 
  Building2, 
  UserCheck, 
  Calendar, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { db } from '../services/db';

interface Props {
  session: UserSession;
  onSessionChange: (session: UserSession) => void;
  onRefresh: () => void;
}

export const Navbar: React.FC<Props> = ({ session, onSessionChange, onRefresh }) => {
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    authService.setRole(newRole);
    onSessionChange(authService.getSession());
  };

  const handleResetData = () => {
    if (window.confirm('আপনি কি টেস্ট ডাটা ডিফল্ট অবস্থায় রিস্টোর করতে চান?')) {
      db.resetAll();
      onRefresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between no-print">
      {/* Brand & Institution Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base lg:text-lg font-bold text-slate-900 leading-tight">
              {session.institutionName}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              লাইভ সিস্টেম
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="font-mono font-medium text-brand-700">{session.institutionCode}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              ২৮ অক্টোবর ২০২৬ | বুধবার
            </span>
          </p>
        </div>
      </div>

      {/* Right Controls: Role Switcher & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data button */}
        <button
          onClick={handleResetData}
          title="ডাটা রিসেট করুন"
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-brand-600 hover:bg-slate-50 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Dynamic Role Switcher */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80">
          <UserCheck className="w-4 h-4 ml-2 text-slate-500 hidden sm:block" />
          <select
            value={session.role}
            onChange={handleRoleChange}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none px-2 py-1 cursor-pointer"
          >
            <option value="admin">মুহতামিম / অ্যাডমিন</option>
            <option value="accountant">হিসাবরক্ষক (Accountant)</option>
            <option value="teacher">শিক্ষক (Teacher)</option>
            <option value="guardian">অভিভাবক ভিউ</option>
          </select>
        </div>

        {/* User Card Pill */}
        <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center text-brand-800 font-bold text-xs">
            {session.name.slice(0, 2)}
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-900 leading-tight">{session.name}</span>
            <span className="block text-[11px] text-slate-500 font-mono">{session.mobile}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
