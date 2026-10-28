import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Notice } from '../types';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Pin, 
  Calendar, 
  User, 
  Printer, 
  Trash2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printNotice, setPrintNotice] = useState<Notice | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('academic');
  const [targetAudience, setTargetAudience] = useState<Notice['targetAudience']>('all');
  const [author, setAuthor] = useState('মুহতামিম দফতর');
  const [isPinned, setIsPinned] = useState(false);

  const loadData = () => {
    setNotices(db.getNotices());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    db.addNotice({
      title,
      content,
      category,
      targetAudience,
      publishDate: new Date().toISOString().split('T')[0],
      author,
      isPinned
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setIsPinned(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
      db.deleteNotice(id);
      loadData();
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCat === 'all' || n.category === selectedCat;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4 text-brand-600" />
            <span>অফিসিয়াল ঘোষণা ও নির্দেশিকা</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">মাদ্রাসার নোটিশ বোর্ড</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            পরীক্ষা, ছুটি, ভর্তি ও প্রাতিষ্ঠানিক সকল জরুরি আদেশ ও নির্দেশনাবলী
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিশ প্রকাশ করুন</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নোটিশের শিরোনাম বা বিষয় দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'সকল নোটিশ' },
            { key: 'urgent', label: 'জরুরি' },
            { key: 'academic', label: 'একাডেমিক' },
            { key: 'holiday', label: 'ছুটি' },
            { key: 'general', label: 'সাধারণ' },
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCat(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCat === cat.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Cards List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
            কোনো নোটিশ পাওয়া যায়নি
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border transition duration-200 p-5 ${
                notice.isPinned
                  ? 'border-brand-300 ring-2 ring-brand-500/10 shadow-md'
                  : 'border-slate-200/80 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Pin className="w-3 h-3 fill-amber-500" /> পিনযুক্ত
                    </span>
                  )}
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    notice.category === 'urgent'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : notice.category === 'holiday'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {notice.category === 'urgent' && 'জরুরি নোটিশ'}
                    {notice.category === 'academic' && 'একাডেমিক'}
                    {notice.category === 'holiday' && 'ছুটির বিজ্ঞপ্তি'}
                    {notice.category === 'general' && 'সাধারণ'}
                    {notice.category === 'guardian' && 'অভিভাবক বিশেষ'}
                  </span>
                  <span className="text-xs text-slate-400">
                    উদ্দেশ্য: {notice.targetAudience === 'all' ? 'সবার জন্য' : notice.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>প্রকাশ: {notice.publishDate}</span>
                </div>
              </div>

              <div className="py-3">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{notice.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>আদেশক্রমে: {notice.author}</span>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => setPrintNotice(notice)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট নোটিশ</span>
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Printable Notice View Modal */}
      {printNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-100 border-b flex justify-between items-center no-print">
              <span className="font-bold text-slate-700 text-sm">নোটিশ প্যাড ভিউ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold"
                >
                  প্রিন্ট করুন
                </button>
                <button
                  onClick={() => setPrintNotice(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  বন্ধ
                </button>
              </div>
            </div>

            {/* Official Madrasa Pad */}
            <div className="p-10 font-bangla space-y-6">
              <div className="text-center border-b-2 border-brand-800 pb-4">
                <span className="text-xs text-brand-900 font-bold block">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <h2 className="text-2xl font-black text-brand-900 mt-1">দারুল উলুম ইসলামিয়া মাদ্রাসা কমপ্লেক্স</h2>
                <p className="text-xs text-slate-600">কওমি মাদ্রাসা রোড, সদর, ঢাকা • মোবাইল: ০১৭১১-২২৩৩৪৪</p>
                <span className="inline-block mt-3 px-6 py-1 bg-brand-800 text-white font-bold text-sm rounded-md tracking-wider">
                  অফিসিয়াল নোটিশ
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-600">
                <span>স্মারক নং: ডিইউআইএম/নোটিশ/{printNotice.publishDate.replace(/-/g, '')}</span>
                <span>তারিখ: {printNotice.publishDate}</span>
              </div>

              <div className="space-y-4 min-h-[220px]">
                <h3 className="text-lg font-bold text-slate-900 text-center underline decoration-brand-600 underline-offset-4">
                  {printNotice.title}
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line text-justify">
                  {printNotice.content}
                </p>
              </div>

              <div className="pt-12 flex justify-end text-center text-xs">
                <div>
                  <div className="w-36 border-b border-slate-700 pb-1 mb-1 font-bold text-slate-900">
                    {printNotice.author}
                  </div>
                  <span className="text-slate-500">দারুল উলুম ইসলামিয়া মাদ্রাসা</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                <h2 className="font-bold text-lg">নতুন নোটিশ তৈরি করুন</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: ১ম সাময়িক পরীক্ষা সংক্রান্ত জরুরি বিজ্ঞপ্তি"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="academic">একাডেমিক</option>
                    <option value="urgent">জরুরি</option>
                    <option value="holiday">ছুটি</option>
                    <option value="general">সাধারণ</option>
                    <option value="guardian">অভিভাবক বিশেষ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কার জন্য প্রযোজ্য</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="all">সবার জন্য</option>
                    <option value="students">ছাত্রদের জন্য</option>
                    <option value="teachers">উস্তাদগণের জন্য</option>
                    <option value="guardians">অভিভাবকদের জন্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের মূল বক্তব্য *</label>
                <textarea
                  rows={4}
                  placeholder="নোটিশের বিস্তারিত বার্তা লিখুন..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আদেশক্রমে / স্বাক্ষরকারী</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="pin" className="text-xs font-bold text-slate-700">
                  নোটিশটি সবার উপরে পিন (Pin) করে রাখুন
                </label>
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
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
