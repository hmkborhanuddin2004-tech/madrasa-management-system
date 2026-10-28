import { 
  Student, 
  FeeInvoice, 
  Transaction, 
  HifzRecord, 
  BoardingMess, 
  DenaPaona,
  SabaqRecord,
  AttendanceRecord,
  MadrasaEvent,
  Notice,
  ExamResult,
  StaffMember,
  PayrollRecord,
  LibraryBook,
  BookIssueRecord
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    roll: 101,
    name: 'মুহাম্মাদ আব্দুল্লাহ',
    fatherName: 'মাওলানা রফিকুল ইসলাম',
    phone: '01711223344',
    class: 'হিফজুল কুরআন বিভাগ',
    section: 'ক (হিফজ)',
    residentType: 'residential',
    status: 'active',
    admissionDate: '2026-01-10',
    monthlyFee: 2500,
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    totalDue: 0
  },
  {
    id: 'std-2',
    roll: 102,
    name: 'হুসাইন আহমদ',
    fatherName: 'আব্দুল কাদির',
    phone: '01822334455',
    class: 'হিফজুল কুরআন বিভাগ',
    section: 'ক (হিফজ)',
    residentType: 'residential',
    status: 'active',
    admissionDate: '2026-01-12',
    monthlyFee: 2500,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    totalDue: 1200
  },
  {
    id: 'std-3',
    roll: 103,
    name: 'মুহাম্মাদ রায়হান',
    fatherName: 'শাহিনুর রহমান',
    phone: '01933445566',
    class: 'নূরানী ৩য় বর্ষ',
    section: 'খ (নূরানী)',
    residentType: 'non-residential',
    status: 'active',
    admissionDate: '2026-01-15',
    monthlyFee: 1500,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalDue: 0
  },
  {
    id: 'std-4',
    roll: 104,
    name: 'আবু বকর সিদ্দীক',
    fatherName: 'মুহাম্মাদ ইসমাইল',
    phone: '01644556677',
    class: 'মিযান জামাত (কিতাব বিভাগ)',
    section: 'কিতাব-১',
    residentType: 'residential',
    status: 'active',
    admissionDate: '2026-02-01',
    monthlyFee: 2800,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalDue: 2800
  },
  {
    id: 'std-5',
    roll: 105,
    name: 'মাহমুদুল হাসান',
    fatherName: 'আজিজুল হক',
    phone: '01755667788',
    class: 'নাহবেমীর জামাত',
    section: 'কিতাব-২',
    residentType: 'residential',
    status: 'active',
    admissionDate: '2026-02-05',
    monthlyFee: 3000,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    totalDue: 500
  }
];

export const INITIAL_INVOICES: FeeInvoice[] = [
  {
    id: 'inv-101',
    voucherNo: 'VR-2026-0891',
    studentId: 'std-1',
    studentName: 'মুহাম্মাদ আব্দুল্লাহ',
    studentRoll: 101,
    class: 'হিফজুল কুরআন বিভাগ',
    category: 'tuition',
    month: 'অক্টোবর ২০২৬',
    amount: 2500,
    discount: 0,
    netPayable: 2500,
    paidAmount: 2500,
    dueAmount: 0,
    paymentMethod: 'cash',
    date: '2026-10-25',
    collectedBy: 'মুহতামিম অফিস',
    remarks: 'মাসিক বেতন ও বোর্ডিং ফি'
  },
  {
    id: 'inv-102',
    voucherNo: 'VR-2026-0892',
    studentId: 'std-3',
    studentName: 'মুহাম্মাদ রায়হান',
    studentRoll: 103,
    class: 'নূরানী ৩য় বর্ষ',
    category: 'tuition',
    month: 'অক্টোবর ২০২৬',
    amount: 1500,
    discount: 200,
    netPayable: 1300,
    paidAmount: 1300,
    dueAmount: 0,
    paymentMethod: 'bKash',
    date: '2026-10-26',
    collectedBy: 'হিসাবরক্ষক',
    remarks: 'বিশেষ সুবিধায় ২০০ টাকা ছাড়'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    voucherNo: 'IN-101',
    type: 'income',
    category: 'শিক্ষার্থী ফি আদায়',
    title: 'মুহাম্মাদ আব্দুল্লাহ - অক্টোবর বেতন',
    amount: 2500,
    date: '2026-10-25',
    paymentMethod: 'নগদ ক্যাশ',
    approvedBy: 'হিসাবরক্ষক'
  },
  {
    id: 'tx-2',
    voucherNo: 'IN-102',
    type: 'income',
    category: 'সাধারণ অনুদান ও সাদাকাহ',
    title: 'হাজী ফজলুর রহমান - মসজিদ ও মাদ্রাসা দান',
    amount: 15000,
    date: '2026-10-26',
    paymentMethod: 'ব্যাংক চেক',
    approvedBy: 'মুহতামিম'
  },
  {
    id: 'tx-3',
    voucherNo: 'EX-201',
    type: 'expense',
    category: 'লিল্লাহ বোর্ডিং বাজার খরচ',
    title: 'দৈনিক মেস বাজার (চাল, ডাল, তেল, সবজি)',
    amount: 4850,
    date: '2026-10-27',
    paymentMethod: 'নগদ ক্যাশ',
    approvedBy: 'মেস ইনচার্জ'
  },
  {
    id: 'tx-4',
    voucherNo: 'EX-202',
    type: 'expense',
    category: 'বিদ্যুৎ বিল ও ইউটিলিটি',
    title: 'পল্লী বিদ্যুৎ সেপ্টেম্বর মাস বিল',
    amount: 3420,
    date: '2026-10-27',
    paymentMethod: 'bKash',
    approvedBy: 'হিসাবরক্ষক'
  }
];

export const INITIAL_HIFZ_RECORDS: HifzRecord[] = [
  {
    id: 'hf-1',
    studentId: 'std-1',
    studentName: 'মুহাম্মাদ আব্দুল্লাহ',
    date: '2026-10-28',
    sabaq: 'পারা ১৫, পৃষ্ঠা ৮ (সূরা বনী ইসরাঈল)',
    sabqi: 'পারা ১৫, পৃষ্ঠা ১-৭',
    manzil: 'পারা ৫ সম্পূর্ণ',
    mistakes: 1,
    quality: 'মুমতাজ',
    ustadhName: 'ক্বারী হাবিবুর রহমান'
  },
  {
    id: 'hf-2',
    studentId: 'std-2',
    studentName: 'হুসাইন আহমদ',
    date: '2026-10-28',
    sabaq: 'পারা ৮, পৃষ্ঠা ১২ (সূরা আল-আনাম)',
    sabqi: 'পারা ৮, পৃষ্ঠা ১-১১',
    manzil: 'পারা ২ সম্পূর্ণ',
    mistakes: 3,
    quality: 'জায়্যিদ',
    ustadhName: 'ক্বারী হাবিবুর রহমান'
  }
];

export const INITIAL_BOARDING_MESS: BoardingMess[] = [
  {
    id: 'bm-1',
    date: '2026-10-27',
    totalStudentsEating: 45,
    bazarCost: 4850,
    bazarDetails: 'চাল ২৫ কেজি, মুসুর ডাল ৫ কেজি, আলু ১০ কেজি, সয়াবিন তেল ৩ লিটার, মসলা ও কাঁচাবাজার',
    purchasedBy: 'মাওলানা রফিক (বাবুর্চি সহকারী)',
    gasWaterMisc: 350,
    totalDailyExpense: 5200
  },
  {
    id: 'bm-2',
    date: '2026-10-26',
    totalStudentsEating: 45,
    bazarCost: 5100,
    bazarDetails: 'পোল্ট্রি মুরগি ১৮ কেজি, পেঁয়াজ, রসুন, আদা ও ডিম ৫০ পিস',
    purchasedBy: 'কারী ইমরান',
    gasWaterMisc: 200,
    totalDailyExpense: 5300
  }
];

export const INITIAL_DENA_PAONA: DenaPaona[] = [
  {
    id: 'dp-1',
    partyName: 'বিসমিল্লাহ জেনারেল স্টোর (মুদি দোকান)',
    phone: '01718990011',
    type: 'dena',
    amount: 12500,
    paidAmount: 5000,
    remainingAmount: 7500,
    date: '2026-10-01',
    dueDate: '2026-11-05',
    status: 'partially-paid',
    purpose: 'বোর্ডিংয়ের মাসিক চাল ও তেলের বকেয়া চালান'
  },
  {
    id: 'dp-2',
    partyName: 'হাজী ব্রাদার্স হার্ডওয়্যার',
    phone: '01912445588',
    type: 'dena',
    amount: 4200,
    paidAmount: 4200,
    remainingAmount: 0,
    date: '2026-09-15',
    dueDate: '2026-10-20',
    status: 'cleared',
    purpose: 'ছাত্রাবাসের বৈদ্যুতিক ফ্যান ও তার মেরামত'
  }
];

export const INITIAL_SABAQ_RECORDS: SabaqRecord[] = [
  {
    id: 'sbq-1',
    studentId: 'std-1',
    studentName: 'মুহাম্মাদ আব্দুল্লাহ',
    studentRoll: 101,
    class: 'হিফজুল কুরআন বিভাগ',
    department: 'hifz',
    date: '2026-10-28',
    currentSabaq: 'পারা ১৫, পৃষ্ঠা ৮ (আয়াত ৪০-৬৫)',
    sabaqSabeq: 'পারা ১৫, পৃষ্ঠা ১-৭',
    manzil: 'পারা ৫ সম্পূর্ণ',
    mistakes: 1,
    quality: 'মুমতাজ',
    ustadhName: 'ক্বারী হাবিবুর রহমান',
    remarks: 'মাশাআল্লাহ! তাজবীদ ও মাখরাজ সুন্দর।'
  },
  {
    id: 'sbq-2',
    studentId: 'std-2',
    studentName: 'হুসাইন আহমদ',
    studentRoll: 102,
    class: 'হিফজুল কুরআন বিভাগ',
    department: 'hifz',
    date: '2026-10-28',
    currentSabaq: 'পারা ৮, পৃষ্ঠা ১২',
    sabaqSabeq: 'পারা ৮, পৃষ্ঠা ১-১১',
    manzil: 'পারা ২ সম্পূর্ণ',
    mistakes: 3,
    quality: 'জায়্যিদ',
    ustadhName: 'ক্বারী হাবিবুর রহমান',
    remarks: 'মানজিলে আরও মেহনত করতে হবে।'
  },
  {
    id: 'sbq-3',
    studentId: 'std-4',
    studentName: 'আবু বকর সিদ্দীক',
    studentRoll: 104,
    class: 'মিযান জামাত (কিতাব বিভাগ)',
    department: 'kitab',
    date: '2026-10-28',
    currentSabaq: 'মিযানুস সরফ: বহস ইসমুল ফায়েল ও মাফঊল',
    sabaqSabeq: 'ছলাসী মুজাররদ এর ৬ বাব মুখস্থ',
    manzil: 'হরুফে মুসাব্বাহা বিল-ফেল',
    mistakes: 0,
    quality: 'মুমতাজ',
    ustadhName: 'মাওলানা এনামুল হাসান',
    remarks: 'সরফের বহস খুব পরিষ্কার হয়েছে।'
  },
  {
    id: 'sbq-4',
    studentId: 'std-5',
    studentName: 'মাহমুদুল হাসান',
    studentRoll: 105,
    class: 'নাহবেমীর জামাত',
    department: 'kitab',
    date: '2026-10-28',
    currentSabaq: 'নাহবেমীর: মারফূআত এর পরিচয় ও প্রকারভেদ',
    sabaqSabeq: 'আমেল ও মা’মূল এর সম্পর্ক',
    manzil: 'তারকীব অনুশীলনী',
    mistakes: 2,
    quality: 'জায়্যিদ জিদ্দান',
    ustadhName: 'মুফতী মাহফুজুর রহমান',
    remarks: 'তারকীব বিশুদ্ধ হয়েছে।'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    personId: 'std-1',
    personName: 'মুহাম্মাদ আব্দুল্লাহ',
    personType: 'student',
    rollOrDesignation: 'রোল ১০১',
    classOrDepartment: 'হিফজুল কুরআন বিভাগ',
    date: '2026-10-28',
    status: 'present',
    note: 'ফজর পর সবক উপস্থিত'
  },
  {
    id: 'att-2',
    personId: 'std-2',
    personName: 'হুসাইন আহমদ',
    personType: 'student',
    rollOrDesignation: 'রোল ১০২',
    classOrDepartment: 'হিফজুল কুরআন বিভাগ',
    date: '2026-10-28',
    status: 'present'
  },
  {
    id: 'att-3',
    personId: 'std-3',
    personName: 'মুহাম্মাদ রায়হান',
    personType: 'student',
    rollOrDesignation: 'রোল ১০৩',
    classOrDepartment: 'নূরানী ৩য় বর্ষ',
    date: '2026-10-28',
    status: 'late',
    note: '১৫ মিনিট দেরি (বৃষ্টির কারণে)'
  },
  {
    id: 'att-4',
    personId: 'std-4',
    personName: 'আবু বকর সিদ্দীক',
    personType: 'student',
    rollOrDesignation: 'রোল ১০৪',
    classOrDepartment: 'মিযান জামাত (কিতাব বিভাগ)',
    date: '2026-10-28',
    status: 'present'
  },
  {
    id: 'att-5',
    personId: 'std-5',
    personName: 'মাহমুদুল হাসান',
    personType: 'student',
    rollOrDesignation: 'রোল ১০৫',
    classOrDepartment: 'নাহবেমীর জামাত',
    date: '2026-10-28',
    status: 'leave',
    note: 'অসুস্থতার ছুটি'
  },
  {
    id: 'att-6',
    personId: 'stf-1',
    personName: 'মুফতী মাহফুজুর রহমান',
    personType: 'staff',
    rollOrDesignation: 'মুহতামিম',
    classOrDepartment: 'প্রশাসন ও ইফতা',
    date: '2026-10-28',
    status: 'present'
  },
  {
    id: 'att-7',
    personId: 'stf-2',
    personName: 'মাওলানা এনামুল হাসান',
    personType: 'staff',
    rollOrDesignation: 'নাযেমে তালিমাত',
    classOrDepartment: 'কিতাব বিভাগ',
    date: '2026-10-28',
    status: 'present'
  },
  {
    id: 'att-8',
    personId: 'stf-3',
    personName: 'ক্বারী হাবিবুর রহমান',
    personType: 'staff',
    rollOrDesignation: 'প্রধান ক্বারী',
    classOrDepartment: 'হিফজ বিভাগ',
    date: '2026-10-28',
    status: 'present'
  }
];

export const INITIAL_EVENTS: MadrasaEvent[] = [
  {
    id: 'ev-1',
    title: 'বাৎসরিক ইসলামী মহাসম্মেলন ও ওয়াজ মাহফিল ২০২৬',
    category: 'waz',
    date: '2026-11-20',
    time: 'বাদ মাগরিব হতে গভীর রাত পর্যন্ত',
    venue: 'মাদ্রাসা সংলগ্ন বিশাল ঈদগাহ ময়দান',
    chiefGuest: 'আল্লামা মুফতী সৈয়দ রেজাউল করীম (পীর সাহেব চরমোনাই)',
    speakers: ['মাওলানা মামুনুল হক', 'ড. এনায়েতুল্লাহ আব্বাসী', 'মুফতী সৈয়দ ফয়জুল করীম'],
    budget: 150000,
    actualCost: 120000,
    status: 'upcoming',
    coordinator: 'মাওলানা হাবিবুল্লাহ (নাযেমে তালিমাত)',
    description: 'মাদ্রাসার ২৫তম ঐতিহাসিক ওয়াজ মাহফিল ও ছাত্রদের দস্তারবন্দী পুরস্কার বিতরণ।'
  },
  {
    id: 'ev-2',
    title: 'খতমে বুখারী ও দস্তারবন্দী সমাবর্তন সম্মেলন',
    category: 'dastarbandi',
    date: '2026-12-15',
    time: 'সকাল ১০:০০ টা - দুপুর ১:০০ টা',
    venue: 'মাদ্রাসা জামে মসজিদ কমপ্লেক্স',
    chiefGuest: 'শায়খুল হাদীস আল্লামা আশরাফ আলী রহ. এর সুযোগ্য সাহেবজাদা',
    speakers: ['মুহতামিম মুফতী মাহফুজুর রহমান', 'মুফতী এনামুল হক'],
    budget: 65000,
    actualCost: 60000,
    status: 'upcoming',
    coordinator: 'ক্বারী হাবিবুর রহমান',
    description: 'হিফজ সমাপ্তকারী ২৫ জন হাফেজে কুরআনকে পাগড়ী ও সনদ প্রদান অনুষ্ঠান।'
  },
  {
    id: 'ev-3',
    title: '৩য় জাতীয় হিফজুল কুরআন ও ক্বিরাত প্রতিযোগিতা',
    category: 'qiraat',
    date: '2026-10-15',
    time: 'সকাল ৯:০০ টা - বিকাল ৫:০০ টা',
    venue: 'মাদ্রাসা অডিটোরিয়াম',
    chiefGuest: 'আন্তর্জাতিক ক্বারী আহমদ বিন ইউসুফ আল আজহারী',
    speakers: ['আন্তর্জাতিক বিচারক প্যানেল'],
    budget: 45000,
    actualCost: 44200,
    status: 'completed',
    coordinator: 'ক্বারী রফিকুল ইসলাম',
    description: '১০ পারা, ২০ পারা ও ৩০ পারা গ্রুপে সারা দেশের ৮০ জন প্রতিযোগী অংশগ্রহণ করেছে।'
  },
  {
    id: 'ev-4',
    title: 'বার্ষিক ক্রীড়া ও ইসলামিক সাংস্কৃতিক উৎসব',
    category: 'sports',
    date: '2026-11-05',
    time: 'সকাল ৮:৩০ টা - বিকাল ৪:৩০ টা',
    venue: 'মাদ্রাসা খেলার মাঠ',
    chiefGuest: 'স্থানীয় পৌর মেয়র ও ম্যানেজিং কমিটি সভাপতি',
    speakers: ['শিক্ষকবৃন্দ'],
    budget: 35000,
    actualCost: 0,
    status: 'upcoming',
    coordinator: 'মাওলানা শফিউল্লাহ',
    description: 'কুরআন তিলাওয়াত, হামদ-নাত, ইসলামী বক্তৃতা, দৌড়, বালিশ খেলা ও যেমন খুশি সাজো।'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'nt-1',
    title: 'আগামী ১৫ নভেম্বর থেকে ১ম সাময়িক পরীক্ষা শুরু সংক্রান্ত বিজ্ঞপ্তি',
    content: 'সকল শিক্ষার্থী ও অভিভাবকদের জানানো যাচ্ছে যে, আগামী ১৫ নভেম্বর ২০২৬ রোজ রবিবার থেকে মাদ্রাসার সকল বিভাগের ১ম সাময়িক পরীক্ষা অনুষ্ঠিত হবে। পরীক্ষায় অংশগ্রহণের জন্য আগামী ১০ নভেম্বরের মধ্যে সকল বকেয়া ফি পরিশোধ করে অফিস কক্ষ থেকে প্রবেশপত্র (Admit Card) সংগ্রহ করতে অনুরোধ করা যাচ্ছে।',
    category: 'academic',
    targetAudience: 'all',
    publishDate: '2026-10-25',
    expiryDate: '2026-11-25',
    author: 'নাযেমে তালিমাত অফিস',
    isPinned: true
  },
  {
    id: 'nt-2',
    title: 'ছাত্রাবাসে স্মার্টফোন ও ইলেকট্রনিক ডিভাইস ব্যবহার কঠোরভাবে নিষিদ্ধ',
    content: 'ছাত্রাবাসের শৃংখলা ও পড়াশোনার পবিত্র পরিবেশ বজায় রাখতে আবাসিক শিক্ষার্থীদের জন্য অ্যান্ড্রয়েড স্মার্টফোন রাখা সম্পূর্ণ নিষিদ্ধ করা হয়েছে। কোনো শিক্ষার্থীর কাছে ক্যামেরা বা নেটযুক্ত ফোন পাওয়া গেলে তা বাজেয়াপ্ত করা হবে। অভিভাবকের সাথে যোগাযোগের জন্য নির্ধারিত বাটন ফোন ইনচার্জের তত্বাবধানে ব্যবহার করতে হবে।',
    category: 'urgent',
    targetAudience: 'students',
    publishDate: '2026-10-20',
    author: 'মুহতামিম দফতর',
    isPinned: true
  },
  {
    id: 'nt-3',
    title: 'ম্যানেজিং কমিটি ও শূরার জরুরি সাধারণ বৈঠক',
    content: 'আসন্ন বার্ষিক ওয়াজ মাহফিলের প্রস্তুতি ও লিল্লাহ বোর্ডিংয়ের নতুন ভবন নির্মাণের বিষয়ে আগামী শুক্রবার বাদ আসর মাদ্রাসার কনফারেন্স কক্ষে এক জরুরি পরামর্শ বৈঠক আহ্বান করা হয়েছে। সকল সম্মানিত সূরা সদস্যকে যথাসময়ে উপস্থিত থাকতে বিনীত অনুরোধ করা হলো।',
    category: 'general',
    targetAudience: 'teachers',
    publishDate: '2026-10-27',
    author: 'মুহতামিম মুফতী মাহফুজুর রহমান',
    isPinned: false
  },
  {
    id: 'nt-4',
    title: 'রমযানুল মোবারক ও ঈদুল ফিতরের বিশেষ ছুটি',
    content: 'পবিত্র মাহে রমযান উপলক্ষে ২০ রমযান হতে ঈদুল ফিতরের পরবর্তী ৬ষ্ঠ দিন পর্যন্ত মাদ্রাসার নিয়মিত পাঠদান স্থগিত থাকবে। হিফজ বিভাগের বিশেষ দৌর ক্লাসের সময়সূচি শীঘ্রই নোটিশে জানানো হবে।',
    category: 'holiday',
    targetAudience: 'guardians',
    publishDate: '2026-10-10',
    author: 'মুহতামিম দফতর',
    isPinned: false
  }
];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    examName: '১ম সাময়িক পরীক্ষা ২০২৬',
    year: '২০২৬',
    studentId: 'std-1',
    studentName: 'মুহাম্মাদ আব্দুল্লাহ',
    studentRoll: 101,
    class: 'হিফজুল কুরআন বিভাগ',
    subjects: [
      { subjectName: 'হিফজুল কুরআন (তিলাওয়াত ও মুখস্থ)', totalMarks: 100, obtainedMarks: 98 },
      { subjectName: 'তাজবীদ ও মাখরাজ', totalMarks: 100, obtainedMarks: 94 },
      { subjectName: 'মাসআলা ও ফারায়েয', totalMarks: 100, obtainedMarks: 88 },
      { subjectName: 'আদাবুল কুরআন ও চরিত্র গঠন', totalMarks: 100, obtainedMarks: 95 }
    ],
    totalMarks: 400,
    obtainedMarks: 375,
    percentage: 93.75,
    grade: 'মুমতাজ',
    position: 1,
    remarks: 'মেধাবী ছাত্র, হিফজে বিশেষ নৈপুণ্য প্রদর্শন করেছে।'
  },
  {
    id: 'res-2',
    examName: '১ম সাময়িক পরীক্ষা ২০২৬',
    year: '২০২৬',
    studentId: 'std-4',
    studentName: 'আবু বকর সিদ্দীক',
    studentRoll: 104,
    class: 'মিযান জামাত (কিতাব বিভাগ)',
    subjects: [
      { subjectName: 'মিযানুস সরফ ও মুনশাইব', totalMarks: 100, obtainedMarks: 91 },
      { subjectName: 'ফিকহ (নূরুল ঈযাহ)', totalMarks: 100, obtainedMarks: 86 },
      { subjectName: 'আরবী ব্যাকরণ ও তারকীব', totalMarks: 100, obtainedMarks: 82 },
      { subjectName: 'উর্দু কিতাব (বেহেশতী জেওর)', totalMarks: 100, obtainedMarks: 89 },
      { subjectName: 'বাংলা ও সাধারণ গণিত', totalMarks: 100, obtainedMarks: 80 }
    ],
    totalMarks: 500,
    obtainedMarks: 428,
    percentage: 85.6,
    grade: 'জায়্যিদ জিদ্দান',
    position: 2,
    remarks: 'ভালো ফলাফল করেছে, আরবী তর্জমায় আরও মনোযোগ চাই।'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'মুফতী মাহফুজুর রহমান',
    designation: 'মুহতামিম ও প্রধান মুফতী',
    department: 'প্রশাসন ও ইফতা',
    phone: '01711002233',
    joiningDate: '2020-01-01',
    baseSalary: 28000,
    houseRentAllowance: 5000,
    foodAllowance: 2000,
    status: 'active'
  },
  {
    id: 'stf-2',
    name: 'মাওলানা এনামুল হাসান',
    designation: 'নাযেমে তালিমাত ও কিতাব শিক্ষক',
    department: 'শিক্ষা বিভাগ (দরসে নেযামী)',
    phone: '01812334455',
    joiningDate: '2021-03-15',
    baseSalary: 18000,
    houseRentAllowance: 3000,
    foodAllowance: 2000,
    status: 'active'
  },
  {
    id: 'stf-3',
    name: 'ক্বারী হাবিবুর রহমান',
    designation: 'প্রধান ক্বারী ও হিফজ ইনচার্জ',
    department: 'হিফজুল কুরআন বিভাগ',
    phone: '01913445566',
    joiningDate: '2022-01-10',
    baseSalary: 16000,
    houseRentAllowance: 2500,
    foodAllowance: 2000,
    status: 'active'
  },
  {
    id: 'stf-4',
    name: 'মাওলানা শফিউল্লাহ',
    designation: 'নূরানী বিভাগ প্রধান ও মুয়াজ্জিন',
    department: 'নূরানী ও মসজিদ',
    phone: '01614556677',
    joiningDate: '2023-06-01',
    baseSalary: 13000,
    houseRentAllowance: 2000,
    foodAllowance: 2000,
    status: 'active'
  },
  {
    id: 'stf-5',
    name: 'আব্দুল কাদের',
    designation: 'প্রধান বাবুর্চি ও মেস খাদেম',
    department: 'লিল্লাহ বোর্ডিং',
    phone: '01515667788',
    joiningDate: '2022-08-01',
    baseSalary: 11000,
    houseRentAllowance: 1000,
    foodAllowance: 2000,
    status: 'active'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay-1',
    staffId: 'stf-1',
    staffName: 'মুফতী মাহফুজুর রহমান',
    designation: 'মুহতামিম ও প্রধান মুফতী',
    month: 'অক্টোবর ২০২৬',
    baseSalary: 28000,
    allowance: 7000,
    deduction: 0,
    netPayable: 35000,
    paymentStatus: 'paid',
    paymentDate: '2026-10-25',
    paymentMethod: 'ব্যাংক স্থানান্তর',
    paidBy: 'হিসাবরক্ষক',
    voucherNo: 'SAL-2026-101'
  },
  {
    id: 'pay-2',
    staffId: 'stf-2',
    staffName: 'মাওলানা এনামুল হাসান',
    designation: 'নাযেমে তালিমাত ও কিতাব শিক্ষক',
    month: 'অক্টোবর ২০২৬',
    baseSalary: 18000,
    allowance: 5000,
    deduction: 500,
    netPayable: 22500,
    paymentStatus: 'paid',
    paymentDate: '2026-10-25',
    paymentMethod: 'নগদ ক্যাশ',
    paidBy: 'মুহতামিম অফিস',
    voucherNo: 'SAL-2026-102'
  },
  {
    id: 'pay-3',
    staffId: 'stf-3',
    staffName: 'ক্বারী হাবিবুর রহমান',
    designation: 'প্রধান ক্বারী ও হিফজ ইনচার্জ',
    month: 'অক্টোবর ২০২৬',
    baseSalary: 16000,
    allowance: 4500,
    deduction: 0,
    netPayable: 20500,
    paymentStatus: 'pending'
  }
];

export const INITIAL_BOOKS: LibraryBook[] = [
  {
    id: 'bk-1',
    accessionNo: 'LIB-001',
    title: 'সহীহ আল-বুখারী (১ম-৮ম খণ্ড পূর্ণাঙ্গ সেট)',
    author: 'ইমাম মুহাম্মাদ ইবনে ইসমাঈল বুখারী রহ.',
    category: 'হাদীস',
    shelfNo: 'আলমারি ক-১',
    totalCopies: 5,
    availableCopies: 4,
    publication: 'দারুল উলুম দেওবন্দ প্রেস'
  },
  {
    id: 'bk-2',
    accessionNo: 'LIB-002',
    title: 'সহীহ মুসলিম শরীফ (১ম-৪র্থ খণ্ড)',
    author: 'ইমাম মুসলিম ইবনুল হাজ্জাজ রহ.',
    category: 'হাদীস',
    shelfNo: 'আলমারি ক-২',
    totalCopies: 4,
    availableCopies: 3,
    publication: 'দারুল কুতুবিল ইলমিয়্যাহ বৈরুত'
  },
  {
    id: 'bk-3',
    accessionNo: 'LIB-003',
    title: 'আল-হিদায়া শরীফ (ফিকহুল হানাফী ১ম-৪র্থ খণ্ড)',
    author: 'আল্লামা বুরহানুদ্দীন আল-মারগীনানী রহ.',
    category: 'ফিকহ্',
    shelfNo: 'আলমারি খ-১',
    totalCopies: 8,
    availableCopies: 6,
    publication: 'মাকতাবাতুল বুশরা করাচি'
  },
  {
    id: 'bk-4',
    accessionNo: 'LIB-004',
    title: 'মুখতাসারুল কুদূরী',
    author: 'ইমাম আবুল হুসাইন আহমদ আল-কুদূরী রহ.',
    category: 'ফিকহ্',
    shelfNo: 'আলমারি খ-২',
    totalCopies: 12,
    availableCopies: 10,
    publication: 'এমদাদিয়া লাইব্রেরি ঢাকা'
  },
  {
    id: 'bk-5',
    accessionNo: 'LIB-005',
    title: 'তাফসীরে মাআরিফুল কুরআন (৮ খণ্ড)',
    author: 'মুফতী মুহাম্মাদ শফী রহ.',
    category: 'তাফসীর',
    shelfNo: 'আলমারি গ-১',
    totalCopies: 3,
    availableCopies: 2,
    publication: 'ইসলামিক ফাউন্ডেশন বাংলাদেশ'
  },
  {
    id: 'bk-6',
    accessionNo: 'LIB-006',
    title: 'নূরুল আনওয়ার (উসূলে ফিকহ)',
    author: 'মোল্লা জীওয়ান রহ.',
    category: 'ফিকহ্',
    shelfNo: 'আলমারি খ-৩',
    totalCopies: 10,
    availableCopies: 9,
    publication: 'রশিদিয়া প্রেস'
  }
];

export const INITIAL_BOOK_ISSUES: BookIssueRecord[] = [
  {
    id: 'iss-1',
    bookId: 'bk-1',
    bookTitle: 'সহীহ আল-বুখারী (১ম খণ্ড)',
    borrowerId: 'std-4',
    borrowerName: 'আবু বকর সিদ্দীক',
    borrowerType: 'student',
    borrowerPhone: '01644556677',
    issueDate: '2026-10-20',
    dueDate: '2026-11-04',
    status: 'issued',
    fine: 0
  },
  {
    id: 'iss-2',
    bookId: 'bk-5',
    bookTitle: 'তাফসীরে মাআরিফুল কুরআন (৩য় খণ্ড)',
    borrowerId: 'stf-2',
    borrowerName: 'মাওলানা এনামুল হাসান',
    borrowerType: 'staff',
    borrowerPhone: '01812334455',
    issueDate: '2026-10-15',
    dueDate: '2026-10-30',
    status: 'issued',
    fine: 0
  }
];
