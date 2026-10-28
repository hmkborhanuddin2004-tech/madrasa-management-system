import { db } from './db';

export const financeService = {
  getFinancialSummary() {
    const transactions = db.getTransactions();
    const students = db.getStudents();
    const denaPaona = db.getDenaPaona();

    const todayStr = new Date().toISOString().split('T')[0];

    let totalIncome = 0;
    let totalExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;

    transactions.forEach(t => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amount;
        if (t.date === todayStr || t.date.startsWith('2026-10-28')) {
          todayIncome += amount;
        }
      } else {
        totalExpense += amount;
        if (t.date === todayStr || t.date.startsWith('2026-10-28')) {
          todayExpense += amount;
        }
      }
    });

    const netCashBalance = totalIncome - totalExpense;

    const totalStudentDues = students.reduce((acc, s) => acc + (Number(s.totalDue) || 0), 0);

    const totalDena = denaPaona
      .filter(d => d.type === 'dena')
      .reduce((acc, d) => acc + d.remainingAmount, 0);

    const totalPaona = denaPaona
      .filter(d => d.type === 'paona')
      .reduce((acc, d) => acc + d.remainingAmount, 0);

    return {
      totalIncome,
      totalExpense,
      todayIncome,
      todayExpense,
      netCashBalance,
      totalStudentDues,
      totalDena,
      totalPaona,
      totalStudents: students.length,
      residentialStudents: students.filter(s => s.residentType === 'residential').length
    };
  },

  formatBanglaCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('en-IN').format(Math.round(amount));
    // Convert to Bengali digits
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return '৳ ' + formatted.replace(/[0-9]/g, (w) => bengaliDigits[+w]);
  },

  formatBanglaNumber(num: number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => bengaliDigits[+w]);
  }
};
