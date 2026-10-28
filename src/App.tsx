import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { FeeCollection } from './pages/FeeCollection';
import { AccountsDayBook } from './pages/AccountsDayBook';
import { BoardingMessPage } from './pages/BoardingMess';
import { HifzTrackerPage } from './pages/HifzTracker';
import { DenaPaonaPage } from './pages/DenaPaona';
import { GuardianPortal } from './pages/GuardianPortal';
import { SabaqRegister } from './pages/SabaqRegister';
import { Attendance } from './pages/Attendance';
import { EventsFestivals } from './pages/EventsFestivals';
import { NoticeBoard } from './pages/NoticeBoard';
import { ExamResultPage } from './pages/ExamResult';
import { StaffPayroll } from './pages/StaffPayroll';
import { Library } from './pages/Library';
import { StudentModal } from './components/StudentModal';
import { FeeCollectionModal } from './components/FeeCollectionModal';
import { MoneyReceiptModal } from './components/PrintTemplates/MoneyReceipt';
import { authService } from './services/authService';
import { UserSession, FeeInvoice } from './types';

export const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>(() => authService.getSession());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [, setRefreshKey] = useState(0);

  // Global Quick Modals
  const [isFeePosOpen, setIsFeePosOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<FeeInvoice | null>(null);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleInvoiceCreated = (inv: FeeInvoice) => {
    triggerRefresh();
    setActiveReceipt(inv);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F9FA] text-slate-800 font-bangla antialiased">
      {/* Top Fixed Navbar */}
      <Navbar
        session={session}
        onSessionChange={setSession}
        onRefresh={triggerRefresh}
      />

      {/* Main Body with Sidebar + Tab Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={setActiveTab}
              onOpenFeePos={() => setIsFeePosOpen(true)}
              onOpenNewStudent={() => setIsStudentModalOpen(true)}
              onViewInvoice={setActiveReceipt}
            />
          )}

          {activeTab === 'students' && <Students />}

          {activeTab === 'fees' && <FeeCollection />}

          {activeTab === 'daybook' && <AccountsDayBook />}

          {activeTab === 'boarding' && <BoardingMessPage />}

          {activeTab === 'hifz' && <HifzTrackerPage />}

          {activeTab === 'denapaona' && <DenaPaonaPage />}

          {activeTab === 'sabaq' && <SabaqRegister />}

          {activeTab === 'attendance' && <Attendance />}

          {activeTab === 'events' && <EventsFestivals />}

          {activeTab === 'notices' && <NoticeBoard />}

          {activeTab === 'exams' && <ExamResultPage />}

          {activeTab === 'payroll' && <StaffPayroll />}

          {activeTab === 'library' && <Library />}

          {activeTab === 'guardian' && <GuardianPortal />}
        </main>
      </div>

      {/* Global Modals */}
      {isFeePosOpen && (
        <FeeCollectionModal
          onClose={() => setIsFeePosOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}

      {isStudentModalOpen && (
        <StudentModal
          onClose={() => setIsStudentModalOpen(false)}
          onSaved={triggerRefresh}
        />
      )}

      {activeReceipt && (
        <MoneyReceiptModal
          invoice={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
};

export default App;
