import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  BookOpen, 
  UtensilsCrossed, 
  FileSpreadsheet, 
  Scale, 
  ShieldCheck,
  BookMarked,
  CalendarCheck,
  Sparkles,
  Megaphone,
  Award,
  Wallet,
  Library
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'students' 
  | 'fees' 
  | 'daybook' 
  | 'boarding' 
  | 'hifz' 
  | 'sabaq'
  | 'attendance'
  | 'events'
  | 'notices'
  | 'exams'
  | 'payroll'
  | 'library'
  | 'denapaona' 
  | 'guardian';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Sidebar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const menuGroups = [
    {
      title: 'মূল হিসাব ও প্রশাসন',
      items: [
        { id: 'dashboard' as TabType, label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
        { id: 'students' as TabType, label: 'শিক্ষার্থী ও ভর্তি', icon: Users },
        { id: 'fees' as TabType, label: 'ফি আদায় (POS)', icon: Receipt, badge: 'রসিদ' },
        { id: 'daybook' as TabType, label: 'ক্যাশ ও ডে-বুক', icon: FileSpreadsheet },
        { id: 'payroll' as TabType, label: 'শিক্ষক ও স্টাফ বেতন', icon: Wallet, badge: 'পে-রোল' },
        { id: 'denapaona' as TabType, label: 'দেনা-পাওনা লেজার', icon: Scale },
      ]
    },
    {
      title: 'তালীমী ও দ্বীনি কার্যক্রম',
      items: [
        { id: 'sabaq' as TabType, label: 'সবক রেজিস্টার', icon: BookMarked, badge: 'দৈনিক' },
        { id: 'hifz' as TabType, label: 'হিফজ ট্র্যাকার', icon: BookOpen, badge: 'কোরআন' },
        { id: 'attendance' as TabType, label: 'উপস্থিতি ও হাজিরা', icon: CalendarCheck },
        { id: 'exams' as TabType, label: 'পরীক্ষা ও রেজাল্ট', icon: Award, badge: 'বেফাক' },
      ]
    },
    {
      title: 'মাদ্রাসা কার্যক্রম ও অন্যান্য',
      items: [
        { id: 'events' as TabType, label: 'অনুষ্ঠান ও মাহফিল', icon: Sparkles, badge: 'ইভেন্ট' },
        { id: 'notices' as TabType, label: 'নোটিশ বোর্ড', icon: Megaphone },
        { id: 'library' as TabType, label: 'কিতাবখানা / লাইব্রেরি', icon: Library },
        { id: 'boarding' as TabType, label: 'লিল্লাহ বোর্ডিং মেস', icon: UtensilsCrossed },
        { id: 'guardian' as TabType, label: 'অভিভাবক পোর্টাল', icon: ShieldCheck },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 p-3.5 shrink-0 min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-auto no-print">
        <div className="space-y-4">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </span>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom PWA Info Card */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200/60 text-xs">
            <span className="font-bold text-brand-900 block text-[11px] mb-0.5">মাদ্রাসা ম্যানেজমেন্ট PWA</span>
            <p className="text-slate-600 text-[10px] leading-relaxed">
              অফলাইন ও মোবাইল ফ্রেন্ডলি সিস্টেম
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar with Horizontal Scroll */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex overflow-x-auto gap-2 no-print shadow-lg scrollbar-none">
        {menuGroups.flatMap(g => g.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition shrink-0 min-w-[62px] ${
                isActive ? 'text-brand-600 font-bold bg-brand-50/80' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
