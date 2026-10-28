import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { LibraryBook, BookIssueRecord, Student, StaffMember } from '../types';
import { 
  Library as LibraryIcon, 
  Plus, 
  Search, 
  BookOpen, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  User, 
  Layers,
  ArrowRightLeft
} from 'lucide-react';

export const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'issues'>('books');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [issues, setIssues] = useState<BookIssueRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);

  // Add Book Form
  const [accessionNo, setAccessionNo] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<LibraryBook['category']>('হাদীস');
  const [shelfNo, setShelfNo] = useState('আলমারি ক-১');
  const [totalCopies, setTotalCopies] = useState(5);
  const [publication, setPublication] = useState('');

  // Issue Form
  const [issueBookId, setIssueBookId] = useState('');
  const [borrowerType, setBorrowerType] = useState<'student' | 'staff'>('student');
  const [borrowerId, setBorrowerId] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });

  const loadData = () => {
    setBooks(db.getBooks());
    setIssues(db.getBookIssues());
    setStudents(db.getStudents());
    setStaffList(db.getStaff());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle) return;

    db.addBook({
      accessionNo: accessionNo || 'LIB-' + Math.floor(100 + Math.random() * 900),
      title: bookTitle,
      author: author || 'অজ্ঞাত',
      category,
      shelfNo: shelfNo || 'সাধারণ শেলফ',
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies),
      publication
    });

    setIsAddBookOpen(false);
    setBookTitle('');
    setAuthor('');
    setPublication('');
    loadData();
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookId || !borrowerId) return;

    const book = books.find(b => b.id === issueBookId);
    if (!book || book.availableCopies <= 0) {
      alert('এই কিতাবটি বর্তমানে লাইব্রেরিতে নেই!');
      return;
    }

    let borrowerName = '';
    let borrowerPhone = '';

    if (borrowerType === 'student') {
      const s = students.find(item => item.id === borrowerId);
      if (s) {
        borrowerName = `${s.name} (রোল: ${s.roll})`;
        borrowerPhone = s.phone;
      }
    } else {
      const st = staffList.find(item => item.id === borrowerId);
      if (st) {
        borrowerName = `${st.name} (${st.designation})`;
        borrowerPhone = st.phone;
      }
    }

    db.issueBook({
      bookId: book.id,
      bookTitle: book.title,
      borrowerId,
      borrowerName,
      borrowerType,
      borrowerPhone,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate
    });

    setIsIssueOpen(false);
    setIssueBookId('');
    setBorrowerId('');
    loadData();
  };

  const handleReturnBook = (issueId: string) => {
    if (confirm('আপনি কি এই কিতাবটি ফেরত গ্রহণ করতে চান?')) {
      db.returnBook(issueId);
      loadData();
    }
  };

  const filteredBooks = books.filter(b => {
    const matchesCat = selectedCat === 'all' || b.category === selectedCat;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.accessionNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCopiesCount = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalAvailableCount = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const activeIssuedCount = issues.filter(i => i.status === 'issued').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-1">
            <LibraryIcon className="w-4 h-4 text-brand-600" />
            <span>দ্বীনি কুতুবখানা ও লাইব্রেরি</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">মাদ্রাসার কিতাবখানা (Library)</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            তাফসীর, হাদীস, ফিকহ ও আদবের কিতাব ক্যাটালগ এবং ছাত্র-উস্তাদ ইস্যু রেজিস্টার
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddBookOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>নতুন কিতাব যোগ</span>
          </button>
          <button
            onClick={() => setIsIssueOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>কিতাব ইস্যু করুন</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">মোট কিতাবের শিরোনাম</span>
            <p className="text-2xl font-black text-slate-800">{books.length} টি</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">মোট কিতাব কপি</span>
            <p className="text-2xl font-black text-purple-700">{totalCopiesCount} খণ্ড</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">উপলব্ধ কপি (শেলফে)</span>
            <p className="text-2xl font-black text-emerald-600">{totalAvailableCount} খণ্ড</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">বর্তমানে ইস্যুকৃত</span>
            <p className="text-2xl font-black text-amber-600">{activeIssuedCount} টি</p>
          </div>
        </div>
      </div>

      {/* Tabs Switch */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 no-print">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'books'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>কিতাব ক্যাটালগ তালিকা ({books.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'issues'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>কিতাব ইস্যু ও ফেরত রেজিস্টার ({issues.length})</span>
        </button>
      </div>

      {/* Books Catalog View */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="কিতাবের নাম, লেখক বা অ্যাকসেশন নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'হাদীস', 'তাফসীর', 'ফিকহ্', 'আদব ও সাহিত্য', 'নাহব ও সরফ'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    selectedCat === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'সকল বিষয়' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">নম্বর ও কিতাবের নাম</th>
                    <th className="px-4 py-3.5">মুসান্নিফ / লেখক</th>
                    <th className="px-4 py-3.5">বিষয়</th>
                    <th className="px-4 py-3.5">শেলফ / আলমারি</th>
                    <th className="px-4 py-3.5 text-center">মোট কপি</th>
                    <th className="px-4 py-3.5 text-center">উপলব্ধ কপি</th>
                    <th className="px-4 py-3.5 text-center no-print">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{book.title}</div>
                        <div className="text-xs text-slate-500">{book.accessionNo} • {book.publication}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 font-medium">
                        {book.author}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {book.shelfNo}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">
                        {book.totalCopies}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                          book.availableCopies > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCopies} টি
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center no-print">
                        <button
                          disabled={book.availableCopies <= 0}
                          onClick={() => {
                            setIssueBookId(book.id);
                            setIsIssueOpen(true);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            book.availableCopies > 0
                              ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          ইস্যু করুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Book Issues & Returns View */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">কিতাবের নাম</th>
                  <th className="px-4 py-3.5">গ্রহীতা</th>
                  <th className="px-4 py-3.5">ইস্যুর তারিখ</th>
                  <th className="px-4 py-3.5">ফেরতের শেষ তারিখ</th>
                  <th className="px-4 py-3.5 text-center">স্ট্যাটাস</th>
                  <th className="px-4 py-3.5 text-center no-print">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      কোনো কিতাব ইস্যুর রেকর্ড নেই
                    </td>
                  </tr>
                ) : (
                  issues.map(iss => (
                    <tr key={iss.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {iss.bookTitle}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{iss.borrowerName}</div>
                        <div className="text-xs text-slate-500">{iss.borrowerPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {iss.issueDate}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-brand-800">
                        {iss.dueDate}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          iss.status === 'returned'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {iss.status === 'returned' ? '✓ ফেরতপ্রাপ্ত' : 'ইস্যুকৃত'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center no-print">
                        {iss.status === 'issued' && (
                          <button
                            onClick={() => handleReturnBook(iss.id)}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>ফেরত গ্রহণ</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-bangla">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h2 className="font-bold text-lg">নতুন কিতাব সংযোজন</h2>
              </div>
              <button onClick={() => setIsAddBookOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কিতাবের নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: সহীহ আল-বুখারী (১ম খণ্ড)"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মুসান্নিফ / লেখক</label>
                  <input
                    type="text"
                    placeholder="ইমাম বুখারী রহ."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিষয় / বিভাগ</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="হাদীস">হাদীস</option>
                    <option value="তাফসীর">তাফসীর</option>
                    <option value="ফিকহ্">ফিকহ্</option>
                    <option value="আদব ও সাহিত্য">আদব ও সাহিত্য</option>
                    <option value="নাহব ও সরফ">নাহব ও সরফ</option>
                    <option value="সাধারণ">সাধারণ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শেলফ / আলমারি নম্বর</label>
                  <input
                    type="text"
                    placeholder="আলমারি ক-১"
                    value={shelfNo}
                    onChange={(e) => setShelfNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কপি সংখ্যা</label>
                  <input
                    type="number"
                    min="1"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রকাশনা / প্রেস</label>
                <input
                  type="text"
                  placeholder="যেমন: এমদাদিয়া লাইব্রেরি"
                  value={publication}
                  onChange={(e) => setPublication(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
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

      {/* Issue Book Modal */}
      {isIssueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-bangla">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                <h2 className="font-bold text-lg">কিতাব ইস্যু ফরম</h2>
              </div>
              <button onClick={() => setIsIssueOpen(false)} className="text-white/80 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কিতাব নির্বাচন *</label>
                <select
                  value={issueBookId}
                  onChange={(e) => setIssueBookId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                >
                  <option value="">-- কিতাব বাছাই করুন --</option>
                  {books.filter(b => b.availableCopies > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} (অবশিষ্ট: {b.availableCopies} খণ্ড)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">গ্রহীতার ধরণ</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="bType"
                      checked={borrowerType === 'student'}
                      onChange={() => { setBorrowerType('student'); setBorrowerId(''); }}
                    />
                    শিক্ষার্থী
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="bType"
                      checked={borrowerType === 'staff'}
                      onChange={() => { setBorrowerType('staff'); setBorrowerId(''); }}
                    />
                    উস্তাদ / স্টাফ
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {borrowerType === 'student' ? 'শিক্ষার্থী নির্বাচন *' : 'উস্তাদ নির্বাচন *'}
                </label>
                <select
                  value={borrowerId}
                  onChange={(e) => setBorrowerId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                >
                  <option value="">-- বাছাই করুন --</option>
                  {borrowerType === 'student' ? (
                    students.map(s => (
                      <option key={s.id} value={s.id}>
                        রোল {s.roll} - {s.name} ({s.class})
                      </option>
                    ))
                  ) : (
                    staffList.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.designation})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ফেরতের শেষ তারিখ</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsIssueOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  ইস্যু নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
