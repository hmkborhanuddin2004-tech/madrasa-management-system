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
import { 
  INITIAL_STUDENTS, 
  INITIAL_INVOICES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_HIFZ_RECORDS, 
  INITIAL_BOARDING_MESS, 
  INITIAL_DENA_PAONA,
  INITIAL_SABAQ_RECORDS,
  INITIAL_ATTENDANCE,
  INITIAL_EVENTS,
  INITIAL_NOTICES,
  INITIAL_EXAM_RESULTS,
  INITIAL_STAFF,
  INITIAL_PAYROLL,
  INITIAL_BOOKS,
  INITIAL_BOOK_ISSUES
} from './seedData';

class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  // --- Students ---
  getStudents(): Student[] {
    return this.getItem<Student[]>('mms_students', INITIAL_STUDENTS);
  }

  saveStudents(students: Student[]): void {
    this.setItem('mms_students', students);
  }

  addStudent(student: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: 'std-' + Date.now(),
    };
    students.unshift(newStudent);
    this.saveStudents(students);
    return newStudent;
  }

  updateStudent(student: Student): void {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
      this.saveStudents(students);
    }
  }

  deleteStudent(id: string): void {
    const students = this.getStudents().filter(s => s.id !== id);
    this.saveStudents(students);
  }

  // --- Fee Invoices ---
  getInvoices(): FeeInvoice[] {
    return this.getItem<FeeInvoice[]>('mms_invoices', INITIAL_INVOICES);
  }

  addInvoice(invoice: Omit<FeeInvoice, 'id' | 'voucherNo'>): FeeInvoice {
    const invoices = this.getInvoices();
    const voucherNo = 'VR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newInvoice: FeeInvoice = {
      ...invoice,
      id: 'inv-' + Date.now(),
      voucherNo,
    };
    invoices.unshift(newInvoice);
    this.setItem('mms_invoices', invoices);

    // Also record transaction in General Ledger automatically
    this.addTransaction({
      voucherNo: newInvoice.voucherNo,
      type: 'income',
      category: 'শিক্ষার্থী ফি আদায়',
      title: `${newInvoice.studentName} (রোল ${newInvoice.studentRoll}) - ${newInvoice.month} ফি`,
      amount: newInvoice.paidAmount,
      date: newInvoice.date,
      paymentMethod: newInvoice.paymentMethod,
      approvedBy: newInvoice.collectedBy,
      notes: newInvoice.remarks
    });

    // Update student's total due if any
    const students = this.getStudents();
    const targetStudent = students.find(s => s.id === newInvoice.studentId);
    if (targetStudent) {
      targetStudent.totalDue = Math.max(0, targetStudent.totalDue - newInvoice.paidAmount);
      this.saveStudents(students);
    }

    return newInvoice;
  }

  // --- General Ledger Transactions ---
  getTransactions(): Transaction[] {
    return this.getItem<Transaction[]>('mms_transactions', INITIAL_TRANSACTIONS);
  }

  addTransaction(tx: Omit<Transaction, 'id'>): Transaction {
    const transactions = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
    };
    transactions.unshift(newTx);
    this.setItem('mms_transactions', transactions);
    return newTx;
  }

  // --- Hifz Records ---
  getHifzRecords(): HifzRecord[] {
    return this.getItem<HifzRecord[]>('mms_hifz', INITIAL_HIFZ_RECORDS);
  }

  addHifzRecord(record: Omit<HifzRecord, 'id'>): HifzRecord {
    const records = this.getHifzRecords();
    const newRecord: HifzRecord = {
      ...record,
      id: 'hf-' + Date.now(),
    };
    records.unshift(newRecord);
    this.setItem('mms_hifz', records);
    return newRecord;
  }

  // --- Boarding Mess ---
  getBoardingMess(): BoardingMess[] {
    return this.getItem<BoardingMess[]>('mms_boarding_mess', INITIAL_BOARDING_MESS);
  }

  addBoardingMess(entry: Omit<BoardingMess, 'id'>): BoardingMess {
    const list = this.getBoardingMess();
    const newEntry: BoardingMess = {
      ...entry,
      id: 'bm-' + Date.now(),
    };
    list.unshift(newEntry);
    this.setItem('mms_boarding_mess', list);

    // Auto-record expense in transactions
    this.addTransaction({
      voucherNo: 'EX-' + Math.floor(1000 + Math.random() * 9000),
      type: 'expense',
      category: 'লিল্লাহ বোর্ডিং বাজার খরচ',
      title: `দৈনিক মেস বাজার - ${entry.bazarDetails.slice(0, 35)}...`,
      amount: entry.totalDailyExpense,
      date: entry.date,
      paymentMethod: 'নগদ ক্যাশ',
      approvedBy: entry.purchasedBy,
      notes: `${entry.totalStudentsEating} জন ছাত্রের খাবার খরচ`
    });

    return newEntry;
  }

  // --- Dena Paona ---
  getDenaPaona(): DenaPaona[] {
    return this.getItem<DenaPaona[]>('mms_dena_paona', INITIAL_DENA_PAONA);
  }

  addDenaPaona(record: Omit<DenaPaona, 'id'>): DenaPaona {
    const records = this.getDenaPaona();
    const newRec: DenaPaona = {
      ...record,
      id: 'dp-' + Date.now(),
    };
    records.unshift(newRec);
    this.setItem('mms_dena_paona', records);
    return newRec;
  }

  payDenaPaona(id: string, amount: number): void {
    const records = this.getDenaPaona();
    const item = records.find(r => r.id === id);
    if (item) {
      item.paidAmount += amount;
      item.remainingAmount = Math.max(0, item.amount - item.paidAmount);
      item.status = item.remainingAmount === 0 ? 'cleared' : 'partially-paid';
      this.setItem('mms_dena_paona', records);

      // Record transaction
      this.addTransaction({
        voucherNo: 'DP-' + Math.floor(1000 + Math.random() * 9000),
        type: 'expense',
        category: 'বকেয়া মহাজন দেনা পরিশোধ',
        title: `${item.partyName} - দেনা পরিশোধ বাবদ`,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'নগদ ক্যাশ',
        approvedBy: 'হিসাবরক্ষক',
        notes: item.purpose
      });
    }
  }

  // --- Sabaq Register ---
  getSabaqRecords(): SabaqRecord[] {
    return this.getItem<SabaqRecord[]>('mms_sabaq', INITIAL_SABAQ_RECORDS);
  }

  addSabaqRecord(record: Omit<SabaqRecord, 'id'>): SabaqRecord {
    const list = this.getSabaqRecords();
    const newRec: SabaqRecord = {
      ...record,
      id: 'sbq-' + Date.now(),
    };
    list.unshift(newRec);
    this.setItem('mms_sabaq', list);
    return newRec;
  }

  deleteSabaqRecord(id: string): void {
    const list = this.getSabaqRecords().filter(r => r.id !== id);
    this.setItem('mms_sabaq', list);
  }

  // --- Attendance ---
  getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>('mms_attendance', INITIAL_ATTENDANCE);
  }

  saveAttendance(records: AttendanceRecord[]): void {
    this.setItem('mms_attendance', records);
  }

  recordBulkAttendance(records: AttendanceRecord[]): void {
    const current = this.getAttendance();
    const map = new Map<string, AttendanceRecord>();
    current.forEach(r => map.set(`${r.personId}_${r.date}`, r));
    records.forEach(r => map.set(`${r.personId}_${r.date}`, r));
    this.setItem('mms_attendance', Array.from(map.values()));
  }

  // --- Events & Festivals ---
  getEvents(): MadrasaEvent[] {
    return this.getItem<MadrasaEvent[]>('mms_events', INITIAL_EVENTS);
  }

  addEvent(event: Omit<MadrasaEvent, 'id'>): MadrasaEvent {
    const list = this.getEvents();
    const newEv: MadrasaEvent = {
      ...event,
      id: 'ev-' + Date.now(),
    };
    list.unshift(newEv);
    this.setItem('mms_events', list);
    return newEv;
  }

  updateEvent(event: MadrasaEvent): void {
    const list = this.getEvents();
    const idx = list.findIndex(e => e.id === event.id);
    if (idx !== -1) {
      list[idx] = event;
      this.setItem('mms_events', list);
    }
  }

  deleteEvent(id: string): void {
    const list = this.getEvents().filter(e => e.id !== id);
    this.setItem('mms_events', list);
  }

  // --- Notices ---
  getNotices(): Notice[] {
    return this.getItem<Notice[]>('mms_notices', INITIAL_NOTICES);
  }

  addNotice(notice: Omit<Notice, 'id'>): Notice {
    const list = this.getNotices();
    const newNt: Notice = {
      ...notice,
      id: 'nt-' + Date.now(),
    };
    list.unshift(newNt);
    this.setItem('mms_notices', list);
    return newNt;
  }

  deleteNotice(id: string): void {
    const list = this.getNotices().filter(n => n.id !== id);
    this.setItem('mms_notices', list);
  }

  // --- Exam & Results ---
  getExamResults(): ExamResult[] {
    return this.getItem<ExamResult[]>('mms_exam_results', INITIAL_EXAM_RESULTS);
  }

  addExamResult(result: Omit<ExamResult, 'id'>): ExamResult {
    const list = this.getExamResults();
    const newRes: ExamResult = {
      ...result,
      id: 'res-' + Date.now(),
    };
    list.unshift(newRes);
    this.setItem('mms_exam_results', list);
    return newRes;
  }

  deleteExamResult(id: string): void {
    const list = this.getExamResults().filter(r => r.id !== id);
    this.setItem('mms_exam_results', list);
  }

  // --- Staff & Payroll ---
  getStaff(): StaffMember[] {
    return this.getItem<StaffMember[]>('mms_staff', INITIAL_STAFF);
  }

  addStaff(staff: Omit<StaffMember, 'id'>): StaffMember {
    const list = this.getStaff();
    const newStaff: StaffMember = {
      ...staff,
      id: 'stf-' + Date.now(),
    };
    list.push(newStaff);
    this.setItem('mms_staff', list);
    return newStaff;
  }

  getPayroll(): PayrollRecord[] {
    return this.getItem<PayrollRecord[]>('mms_payroll', INITIAL_PAYROLL);
  }

  paySalary(record: Omit<PayrollRecord, 'id' | 'paymentStatus' | 'voucherNo' | 'paymentDate'>): PayrollRecord {
    const list = this.getPayroll();
    const voucherNo = 'SAL-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const date = new Date().toISOString().split('T')[0];
    const newRecord: PayrollRecord = {
      ...record,
      id: 'pay-' + Date.now(),
      paymentStatus: 'paid',
      paymentDate: date,
      voucherNo,
    };
    list.unshift(newRecord);
    this.setItem('mms_payroll', list);

    // Auto-record expense transaction in General Ledger
    this.addTransaction({
      voucherNo,
      type: 'expense',
      category: 'শিক্ষক ও স্টাফ বেতন',
      title: `${record.staffName} (${record.designation}) - ${record.month} বেতন`,
      amount: record.netPayable,
      date,
      paymentMethod: record.paymentMethod || 'নগদ ক্যাশ',
      approvedBy: record.paidBy || 'হিসাবরক্ষক',
      notes: `মূল বেতন: ৳${record.baseSalary}, ভাতা: ৳${record.allowance}, কর্তন: ৳${record.deduction}`
    });

    return newRecord;
  }

  // --- Library Books & Issue ---
  getBooks(): LibraryBook[] {
    return this.getItem<LibraryBook[]>('mms_books', INITIAL_BOOKS);
  }

  addBook(book: Omit<LibraryBook, 'id'>): LibraryBook {
    const list = this.getBooks();
    const newBook: LibraryBook = {
      ...book,
      id: 'bk-' + Date.now(),
    };
    list.unshift(newBook);
    this.setItem('mms_books', list);
    return newBook;
  }

  getBookIssues(): BookIssueRecord[] {
    return this.getItem<BookIssueRecord[]>('mms_book_issues', INITIAL_BOOK_ISSUES);
  }

  issueBook(issue: Omit<BookIssueRecord, 'id' | 'status' | 'fine'>): BookIssueRecord {
    const issues = this.getBookIssues();
    const newIssue: BookIssueRecord = {
      ...issue,
      id: 'iss-' + Date.now(),
      status: 'issued',
      fine: 0,
    };
    issues.unshift(newIssue);
    this.setItem('mms_book_issues', issues);

    // Decrement available copies
    const books = this.getBooks();
    const book = books.find(b => b.id === issue.bookId);
    if (book && book.availableCopies > 0) {
      book.availableCopies -= 1;
      this.setItem('mms_books', books);
    }

    return newIssue;
  }

  returnBook(issueId: string): void {
    const issues = this.getBookIssues();
    const issue = issues.find(i => i.id === issueId);
    if (issue && issue.status !== 'returned') {
      issue.status = 'returned';
      issue.returnDate = new Date().toISOString().split('T')[0];
      this.setItem('mms_book_issues', issues);

      // Increment available copies
      const books = this.getBooks();
      const book = books.find(b => b.id === issue.bookId);
      if (book) {
        book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
        this.setItem('mms_books', books);
      }
    }
  }

  // Reset to seed data
  resetAll(): void {
    localStorage.clear();
    this.saveStudents(INITIAL_STUDENTS);
    this.setItem('mms_invoices', INITIAL_INVOICES);
    this.setItem('mms_transactions', INITIAL_TRANSACTIONS);
    this.setItem('mms_hifz', INITIAL_HIFZ_RECORDS);
    this.setItem('mms_boarding_mess', INITIAL_BOARDING_MESS);
    this.setItem('mms_dena_paona', INITIAL_DENA_PAONA);
    this.setItem('mms_sabaq', INITIAL_SABAQ_RECORDS);
    this.setItem('mms_attendance', INITIAL_ATTENDANCE);
    this.setItem('mms_events', INITIAL_EVENTS);
    this.setItem('mms_notices', INITIAL_NOTICES);
    this.setItem('mms_exam_results', INITIAL_EXAM_RESULTS);
    this.setItem('mms_staff', INITIAL_STAFF);
    this.setItem('mms_payroll', INITIAL_PAYROLL);
    this.setItem('mms_books', INITIAL_BOOKS);
    this.setItem('mms_book_issues', INITIAL_BOOK_ISSUES);
  }
}

export const db = new StorageService();
