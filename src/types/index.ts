export type Role = 'admin' | 'accountant' | 'teacher' | 'guardian';

export type ResidentType = 'residential' | 'non-residential' | 'day-care';

export type StudentStatus = 'active' | 'inactive' | 'graduated';

export interface Student {
  id: string;
  roll: number;
  name: string;
  fatherName: string;
  phone: string;
  class: string;
  section: string;
  residentType: ResidentType;
  status: StudentStatus;
  admissionDate: string;
  monthlyFee: number;
  photoUrl?: string;
  totalDue: number;
}

export type FeeCategory = 'admission' | 'tuition' | 'exam' | 'boarding' | 'books' | 'other';

export interface FeeInvoice {
  id: string;
  voucherNo: string;
  studentId: string;
  studentName: string;
  studentRoll: number;
  class: string;
  category: FeeCategory;
  month: string;
  amount: number;
  discount: number;
  netPayable: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'bKash' | 'nagad' | 'bank';
  date: string;
  collectedBy: string;
  remarks?: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  voucherNo: string;
  type: TransactionType;
  category: string;
  title: string;
  amount: number;
  date: string;
  paymentMethod: string;
  approvedBy: string;
  notes?: string;
}

export interface HifzRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  sabaq: string;       // e.g. "পারা ১, পৃষ্ঠা ৫"
  sabqi: string;       // e.g. "পারা ১, পৃষ্ঠা ১-৪"
  manzil: string;      // e.g. "পারা ৩০ সম্পূর্ণ"
  mistakes: number;
  quality: 'মুমতাজ' | 'জায়্যিদ জিদ্দান' | 'জায়্যিদ' | 'মাকবুল' | 'পরিশ্রম প্রয়োজন';
  ustadhName: string;
}

export interface BoardingMess {
  id: string;
  date: string;
  totalStudentsEating: number;
  bazarCost: number;
  bazarDetails: string;
  purchasedBy: string;
  gasWaterMisc: number;
  totalDailyExpense: number;
}

export interface DenaPaona {
  id: string;
  partyName: string;
  phone: string;
  type: 'dena' | 'paona'; // dena = madrasa owes party, paona = party owes madrasa
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  date: string;
  dueDate: string;
  status: 'pending' | 'partially-paid' | 'cleared';
  purpose: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  role: Role;
  name: string;
  mobile: string;
  institutionName: string;
  institutionCode: string;
}

// --- New Modules Types ---

export interface SabaqRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: number;
  class: string;
  date: string;
  department: 'hifz' | 'kitab' | 'noorani';
  currentSabaq: string; // নতুন সবক
  sabaqSabeq: string;   // সবক সাবেক
  manzil: string;       // আমোখতা / মানজিল
  mistakes: number;
  quality: 'মুমতাজ' | 'জায়্যিদ জিদ্দান' | 'জায়্যিদ' | 'মাকবুল' | 'পরিশ্রম প্রয়োজন';
  ustadhName: string;
  remarks?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: string;
  personId: string;
  personName: string;
  personType: 'student' | 'staff';
  rollOrDesignation: string;
  classOrDepartment: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
}

export interface MadrasaEvent {
  id: string;
  title: string;
  category: 'waz' | 'dastarbandi' | 'qiraat' | 'sports' | 'iftar' | 'other';
  date: string;
  time: string;
  venue: string;
  chiefGuest: string;
  speakers: string[];
  budget: number;
  actualCost: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  coordinator: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'urgent' | 'general' | 'academic' | 'guardian' | 'holiday';
  targetAudience: 'all' | 'students' | 'teachers' | 'guardians';
  publishDate: string;
  expiryDate?: string;
  author: string;
  isPinned: boolean;
}

export interface SubjectMark {
  subjectName: string;
  totalMarks: number;
  obtainedMarks: number;
}

export interface ExamResult {
  id: string;
  examName: string;
  year: string;
  studentId: string;
  studentName: string;
  studentRoll: number;
  class: string;
  subjects: SubjectMark[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: 'মুমতাজ' | 'জায়্যিদ জিদ্দান' | 'জায়্যিদ' | 'মাকবুল' | 'রাসিব';
  position?: number;
  remarks?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  joiningDate: string;
  baseSalary: number;
  houseRentAllowance: number;
  foodAllowance: number;
  status: 'active' | 'on-leave' | 'resigned';
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  designation: string;
  month: string;
  baseSalary: number;
  allowance: number;
  deduction: number;
  netPayable: number;
  paymentStatus: 'paid' | 'pending';
  paymentDate?: string;
  paymentMethod?: string;
  paidBy?: string;
  voucherNo?: string;
}

export interface LibraryBook {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  category: 'তাফসীর' | 'হাদীস' | 'ফিকহ্' | 'আদব ও সাহিত্য' | 'নাহব ও সরফ' | 'সাধারণ';
  shelfNo: string;
  totalCopies: number;
  availableCopies: number;
  publication?: string;
}

export interface BookIssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerType: 'student' | 'staff';
  borrowerPhone: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine: number;
}
