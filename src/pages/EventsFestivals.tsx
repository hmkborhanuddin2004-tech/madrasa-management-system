import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { MadrasaEvent } from '../types';
import { 
  Sparkles, 
  Plus, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  DollarSign, 
  Clock, 
  Trash2, 
  CheckCircle,
  Trophy
} from 'lucide-react';

export const EventsFestivals: React.FC = () => {
  const [events, setEvents] = useState<MadrasaEvent[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MadrasaEvent['category']>('waz');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [chiefGuest, setChiefGuest] = useState('');
  const [speakersInput, setSpeakersInput] = useState('');
  const [budget, setBudget] = useState(0);
  const [coordinator, setCoordinator] = useState('');
  const [description, setDescription] = useState('');

  const loadData = () => {
    setEvents(db.getEvents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const speakers = speakersInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    db.addEvent({
      title,
      category,
      date,
      time: time || 'বাদ আসর',
      venue: venue || 'মাদ্রাসা প্রাঙ্গণ',
      chiefGuest: chiefGuest || 'সম্মানিত ওলামায়ে কেরাম',
      speakers: speakers.length > 0 ? speakers : ['আমন্ত্রিত ওলামাবৃন্দ'],
      budget: Number(budget),
      actualCost: 0,
      status: 'upcoming',
      coordinator: coordinator || 'মুহতামিম দফতর',
      description
    });

    setIsModalOpen(false);
    // Reset
    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setChiefGuest('');
    setSpeakersInput('');
    setBudget(0);
    setCoordinator('');
    setDescription('');
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই অনুষ্ঠানটি মুছে ফেলতে চান?')) {
      db.deleteEvent(id);
      loadData();
    }
  };

  const handleStatusToggle = (event: MadrasaEvent) => {
    const nextStatus: MadrasaEvent['status'] = 
      event.status === 'upcoming' ? 'ongoing' :
      event.status === 'ongoing' ? 'completed' : 'upcoming';
    
    db.updateEvent({ ...event, status: nextStatus });
    loadData();
  };

  const filteredEvents = events.filter(e => {
    if (selectedCat === 'all') return true;
    return e.category === selectedCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>দ্বীনি ও ঐতিহ্যবাহী উৎসব</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">মাদ্রাসার অনুষ্ঠান ও মাহফিল</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            বার্ষিক ওয়াজ মাহফিল, দস্তারবন্দী সমাবর্তন, কুরআন ক্বিরাত প্রতিযোগিতা ও সাংস্কৃতিক উৎসব
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অনুষ্ঠান যুক্ত করুন</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'সকল অনুষ্ঠান' },
          { key: 'waz', label: 'ওয়াজ মাহফিল' },
          { key: 'dastarbandi', label: 'দস্তারবন্দী পাগড়ী' },
          { key: 'qiraat', label: 'কুরআন প্রতিযোগিতা' },
          { key: 'sports', label: 'ক্রীড়া ও সাংস্কৃতিক' },
          { key: 'iftar', label: 'রমজান ইফতার মাহফিল' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCat(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCat === cat.key
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(event => (
          <div 
            key={event.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:border-brand-300 transition duration-200"
          >
            {/* Event Header Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-brand-900 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-amber-300 inline-block mb-1">
                  {event.category === 'waz' && 'ঐতিহাসিক ওয়াজ মাহফিল'}
                  {event.category === 'dastarbandi' && 'দস্তারবন্দী সমাবর্তন'}
                  {event.category === 'qiraat' && 'ক্বিরাত ও হিফজ প্রতিযোগিতা'}
                  {event.category === 'sports' && 'ক্রীড়া ও সংস্কৃতি সপ্তাহ'}
                  {event.category === 'iftar' && 'মাহে রমজান ইফতার'}
                  {event.category === 'other' && 'বিশেষ অনুষ্ঠান'}
                </span>
                <h3 className="font-black text-lg leading-tight mt-1">{event.title}</h3>
              </div>

              <button
                onClick={() => handleStatusToggle(event)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition shrink-0 ${
                  event.status === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : event.status === 'ongoing'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 animate-pulse'
                    : 'bg-white/20 border-white/40 text-white'
                }`}
              >
                {event.status === 'completed' && '✓ সম্পন্ন'}
                {event.status === 'ongoing' && '● চলমান'}
                {event.status === 'upcoming' && 'আসন্ন'}
              </button>
            </div>

            {/* Event Details */}
            <div className="p-5 flex-1 space-y-3.5 text-sm text-slate-700">
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-semibold">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 col-span-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <User className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">প্রধান মেহমান: </span>
                    <span className="text-slate-700">{event.chiefGuest}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">অন্যান্য আলোচক: </span>
                    <span className="text-slate-700">{event.speakers.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs bg-slate-50/60 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-500">বাজেট:</span>
                  <span className="font-bold text-slate-900 ml-1">৳{event.budget.toLocaleString('bn-BD')}</span>
                </div>
                <div>
                  <span className="text-slate-500">ইনচার্জ:</span>
                  <span className="font-semibold text-brand-700 ml-1">{event.coordinator}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">স্ট্যাটাস বদলাতে ব্যাজে ক্লিক করুন</span>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold p-1 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h2 className="font-bold text-lg">নতুন অনুষ্ঠান বা মাহফিল যুক্ত করুন</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অনুষ্ঠানের নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: বাৎসরিক ওয়াজ মাহফিল ও দস্তারবন্দী"
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
                    <option value="waz">ওয়াজ মাহফিল</option>
                    <option value="dastarbandi">দস্তারবন্দী পাগড়ী</option>
                    <option value="qiraat">কুরআন প্রতিযোগিতা</option>
                    <option value="sports">ক্রীড়া ও সংস্কৃতি</option>
                    <option value="iftar">ইফতার মাহফিল</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সময়</label>
                  <input
                    type="text"
                    placeholder="যেমন: বাদ মাগরিব"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্থান / ভেন্যু</label>
                  <input
                    type="text"
                    placeholder="যেমন: মাদ্রাসা ময়দান"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রধান মেহমান / বক্তা</label>
                <input
                  type="text"
                  placeholder="যেমন: আল্লামা মুফতী সৈয়দ রেজাউল করীম"
                  value={chiefGuest}
                  onChange={(e) => setChiefGuest(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অন্যান্য আলোচকবৃন্দ (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  placeholder="মাওলানা ক, মাওলানা খ, মুফতী গ"
                  value={speakersInput}
                  onChange={(e) => setSpeakersInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আনুমানিক বাজেট (টাকা)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">দায়িত্বপ্রাপ্ত উস্তাদ</label>
                  <input
                    type="text"
                    placeholder="উস্তাদের নাম"
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অনুষ্ঠানের বিবরণ</label>
                <textarea
                  rows={2}
                  placeholder="অনুষ্ঠানের মূল লক্ষ্য ও বিস্তারিত..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
