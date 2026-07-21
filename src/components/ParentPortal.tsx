import React, { useState } from 'react';
import { ChildRecord, ViewMode, SchoolProfile } from '../types';
import { ASSETS } from '../data/mockData';
import { ContactTeacherModal } from './modals/ContactTeacherModal';

interface ParentPortalProps {
  childrenRecords: ChildRecord[];
  onNavigate: (view: ViewMode, studentId?: string) => void;
  onSendMessage: (teacherName: string, message: string) => void;
  schoolProfile?: SchoolProfile;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  childrenRecords,
  onNavigate,
  onSendMessage,
  schoolProfile
}) => {
  const [selectedChildId, setSelectedChildId] = useState<string>(childrenRecords[0]?.id || 'child-1');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'billing'>('dashboard');

  // Local Billing & Transactions State
  const [billingSummary, setBillingSummary] = useState<Record<string, { total: number; paid: number; status: 'Paid' | 'Partial' | 'Overdue' }>>({
    'child-1': { total: 2730, paid: 1450, status: 'Partial' },
    'child-2': { total: 2500, paid: 2500, status: 'Paid' }
  });

  const [invoices, setInvoices] = useState<Array<{ id: string; childId: string; title: string; amount: number; dueDate: string; status: 'Paid' | 'Unpaid'; category: string }>>([
    { id: 'inv-1', childId: 'child-1', title: 'Tuition Fee (Term 1)', amount: 2500, dueDate: 'Nov 30, 2023', status: 'Unpaid', category: 'Tuition' },
    { id: 'inv-2', childId: 'child-1', title: 'Science Laboratory Fee', amount: 150, dueDate: 'Oct 15, 2023', status: 'Paid', category: 'Lab' },
    { id: 'inv-3', childId: 'child-1', title: 'School Bus Pass', amount: 80, dueDate: 'Nov 20, 2023', status: 'Unpaid', category: 'Transport' },
    { id: 'inv-4', childId: 'child-2', title: 'Tuition Fee (Term 1)', amount: 2500, dueDate: 'Nov 30, 2023', status: 'Paid', category: 'Tuition' }
  ]);

  const [paymentHistory, setPaymentHistory] = useState<Array<{ id: string; childId: string; invoiceId: string; title: string; amount: number; date: string; method: string; status: string }>>([
    { id: 'pay-1', childId: 'child-1', invoiceId: 'inv-1', title: 'Tuition Fee Partial Payment', amount: 1300, date: 'Nov 01, 2023, 10:24', method: 'Credit Card', status: 'Success' },
    { id: 'pay-2', childId: 'child-1', invoiceId: 'inv-2', title: 'Science Lab Fee Full Payment', amount: 150, date: 'Oct 15, 2023, 14:05', method: 'Bank Transfer', status: 'Success' },
    { id: 'pay-3', childId: 'child-2', invoiceId: 'inv-4', title: 'Tuition Fee Full Payment', amount: 2500, date: 'Nov 01, 2023, 11:12', method: 'Credit Card', status: 'Success' }
  ]);

  // Payment Modal States
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [payAmount, setPayAmount] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const handleOpenPayModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    const childSum = billingSummary[selectedChildId];
    const remaining = invoice.amount - (invoice.id === 'inv-1' ? 1300 : 0); // mock calculation of remaining Tuition balance
    setPayAmount(remaining > 0 ? remaining : invoice.amount);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || payAmount <= 0) return;

    // Process payment in memory
    const paymentId = `pay-${Date.now()}`;
    const newPayment = {
      id: paymentId,
      childId: selectedChildId,
      invoiceId: selectedInvoice.id,
      title: `${selectedInvoice.title} Payment`,
      amount: payAmount,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      method: paymentMethod,
      status: 'Success'
    };

    // Update payment history
    setPaymentHistory(prev => [newPayment, ...prev]);

    // Update invoices
    setInvoices(prev => prev.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return { ...inv, status: 'Paid' as const };
      }
      return inv;
    }));

    // Update billing summary
    setBillingSummary(prev => {
      const childSum = prev[selectedChildId];
      const newPaid = childSum.paid + payAmount;
      const isAllPaid = newPaid >= childSum.total;
      return {
        ...prev,
        [selectedChildId]: {
          ...childSum,
          paid: newPaid,
          status: isAllPaid ? 'Paid' as const : 'Partial' as const
        }
      };
    });

    showToast(`Payment of $${payAmount} processed successfully for ${selectedInvoice.title}!`);
    setIsPayModalOpen(false);
    setSelectedInvoice(null);
  };

  // Homework Assignments mock data mapped to children
  const [childAssignments] = useState([
    { id: 'asg-1', title: 'Calculus Quiz 4', dueDate: 'Nov 18, 2023', maxPoints: 100, childId: 'child-1' },
    { id: 'asg-2', title: 'Newtonian Mechanics Essay', dueDate: 'Nov 22, 2023', maxPoints: 50, childId: 'child-1' },
    { id: 'asg-3', title: 'Geometry Midterm Prep', dueDate: 'Nov 28, 2023', maxPoints: 100, childId: 'child-1' },
    
    { id: 'asg-4', title: 'Thermodynamics Lab Report', dueDate: 'Nov 19, 2023', maxPoints: 100, childId: 'child-2' },
    { id: 'asg-5', title: 'Wave Equation Homework', dueDate: 'Nov 24, 2023', maxPoints: 50, childId: 'child-2' }
  ]);

  const leoTimetable: Record<string, Array<{ time: string; subject: string; room: string; teacher: string }>> = {
    'Monday': [
      { time: '08:00 - 09:30', subject: 'Mathematics', room: 'Room 402', teacher: 'Ms. Sarah Jenkins' },
      { time: '10:00 - 11:30', subject: 'English Lit', room: 'Room 102', teacher: 'Prof. Arthur Pendelton' },
      { time: '12:30 - 14:00', subject: 'Chemistry Lab', room: 'Lab B', teacher: 'Dr. Elena Rostova' }
    ],
    'Tuesday': [
      { time: '08:00 - 09:30', subject: 'Physics Lecture', room: 'Lab A', teacher: 'Prof. Marcus Brody' },
      { time: '10:00 - 11:30', subject: 'World History', room: 'Room 205', teacher: 'Prof. Arthur Pendelton' },
      { time: '12:30 - 14:00', subject: 'Physical Ed', room: 'Gymnasium', teacher: 'Mr. David Roth' }
    ],
    'Wednesday': [
      { time: '08:00 - 09:30', subject: 'Calculus Advanced', room: 'Room 402', teacher: 'Ms. Sarah Jenkins' },
      { time: '10:00 - 11:30', subject: 'Organic Chem', room: 'Lab B', teacher: 'Dr. Elena Rostova' },
      { time: '12:30 - 14:00', subject: 'Robotics Seminar', room: 'STEM Lab', teacher: 'Dr. Elena Rostova' }
    ],
    'Thursday': [
      { time: '08:00 - 09:30', subject: 'Creative Writing', room: 'Room 102', teacher: 'Prof. Arthur Pendelton' },
      { time: '10:00 - 11:30', subject: 'Physics Problems', room: 'Lab A', teacher: 'Prof. Marcus Brody' },
      { time: '12:30 - 14:00', subject: 'Biology Seminar', room: 'Room 404', teacher: 'Dr. Elena Rostova' }
    ],
    'Friday': [
      { time: '08:00 - 09:30', subject: 'Algebra Review', room: 'Room 402', teacher: 'Ms. Sarah Jenkins' },
      { time: '10:00 - 11:30', subject: 'Human Geography', room: 'Room 205', teacher: 'Prof. Arthur Pendelton' },
      { time: '12:30 - 14:00', subject: 'Visual Arts', room: 'Art Studio', teacher: 'Mr. David Roth' }
    ]
  };

  const mayaTimetable: Record<string, Array<{ time: string; subject: string; room: string; teacher: string }>> = {
    'Monday': [
      { time: '08:00 - 09:30', subject: 'General Science', room: 'Room 301', teacher: 'Dr. Elena Rostova' },
      { time: '10:00 - 11:30', subject: 'Pre-Algebra', room: 'Room 304', teacher: 'Ms. Sarah Jenkins' },
      { time: '12:30 - 14:00', subject: 'Creative Writing', room: 'Room 201', teacher: 'Prof. Arthur Pendelton' }
    ],
    'Tuesday': [
      { time: '08:00 - 09:30', subject: 'Introduction to STEM', room: 'STEM Lab', teacher: 'Dr. Elena Rostova' },
      { time: '10:00 - 11:30', subject: 'Early World History', room: 'Room 306', teacher: 'Prof. Arthur Pendelton' },
      { time: '12:30 - 14:00', subject: 'Gym & Fitness', room: 'Gymnasium', teacher: 'Mr. David Roth' }
    ],
    'Wednesday': [
      { time: '08:00 - 09:30', subject: 'Basic Algebra', room: 'Room 304', teacher: 'Ms. Sarah Jenkins' },
      { time: '10:00 - 11:30', subject: 'Science Lab Practice', room: 'Room 301', teacher: 'Dr. Elena Rostova' },
      { time: '12:30 - 14:00', subject: 'Basic Coding', room: 'Computer Lab', teacher: 'Dr. Elena Rostova' }
    ],
    'Thursday': [
      { time: '08:00 - 09:30', subject: 'English Grammar', room: 'Room 201', teacher: 'Prof. Arthur Pendelton' },
      { time: '10:00 - 11:30', subject: 'Earth Science', room: 'Room 301', teacher: 'Dr. Elena Rostova' },
      { time: '12:30 - 14:00', subject: 'Health & Nutrition', room: 'Room 306', teacher: 'Mr. David Roth' }
    ],
    'Friday': [
      { time: '08:00 - 09:30', subject: 'Pre-Algebra Review', room: 'Room 304', teacher: 'Ms. Sarah Jenkins' },
      { time: '10:00 - 11:30', subject: 'Social Studies', room: 'Room 306', teacher: 'Prof. Arthur Pendelton' },
      { time: '12:30 - 14:00', subject: 'Intro to Art', room: 'Art Studio', teacher: 'Mr. David Roth' }
    ]
  };

  // Submissions state
  const [childSubmissions, setChildSubmissions] = useState([
    { id: 'sub-1', assignmentId: 'asg-1', status: 'graded', grade: '92/100', feedback: 'Excellent work on the derivatives section!' },
    { id: 'sub-3', assignmentId: 'asg-3', status: 'graded', grade: '88/100', feedback: 'Good effort, check question 4 again.' },
    { id: 'sub-4', assignmentId: 'asg-4', status: 'graded', grade: '96/100', feedback: 'Outstanding analysis of the heat cycle.' },
    { id: 'sub-5', assignmentId: 'asg-5', status: 'pending', grade: null, feedback: null }
  ]);

  // Submit modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<any>(null);
  const [commentInput, setCommentInput] = useState('');
  const [mockFileName, setMockFileName] = useState('');

  const handleOpenSubmitModal = (asg: any) => {
    setSelectedAsgForSubmit(asg);
    setMockFileName('');
    setCommentInput('');
    setIsSubmitModalOpen(true);
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgForSubmit || !mockFileName) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      assignmentId: selectedAsgForSubmit.id,
      status: 'pending' as const,
      grade: null,
      feedback: null
    };

    setChildSubmissions(prev => [...prev, newSub]);
    showToast(`Successfully submitted "${selectedAsgForSubmit.title}" to subject teacher!`);
    setIsSubmitModalOpen(false);
    setSelectedAsgForSubmit(null);
  };

  const activeChild = childrenRecords.find(c => c.id === selectedChildId) || childrenRecords[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadPdf = () => {
    showToast(`Generating Term Summary PDF for ${activeChild.name}...`);
    setTimeout(() => {
      window.print();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface relative">
      {/* Background Watermark (Visible in print/PDF summary) */}
      {schoolProfile?.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.08] pointer-events-none select-none z-0">
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <img 
              src={schoolProfile.logoUrl} 
              alt="Watermark" 
              className="w-[450px] h-[450px] object-contain animate-fadeIn" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </div>
      )}
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-4 md:px-8 py-3 sticky top-10 z-20 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight">EduGrowth</h1>
          <span className="hidden sm:inline-block text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 ml-2">
            Parent Portal • Saint Jude's Academy
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant hover:bg-surface-container-low'} px-3 py-1 transition-all border-none bg-transparent cursor-pointer`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`${activeTab === 'billing' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant hover:bg-surface-container-low'} px-3 py-1 transition-all border-none bg-transparent cursor-pointer`}
            >
              Billing & Fees
            </button>
            <button
              onClick={() => onNavigate('transcript', activeChild.name.includes('Leo') ? 'leo' : 'alexander')}
              className="text-on-surface-variant hover:bg-surface-container-low px-3 py-1 rounded-lg transition-all border-none bg-transparent cursor-pointer"
            >
              Academic Records
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("No urgent notification alerts.")}
              className="text-secondary p-2 rounded-full hover:bg-surface-container-low transition-colors relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>
            
            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant shadow-sm ring-2 ring-secondary/20">
              <img
                src={ASSETS.parentHeaderAvatar}
                alt="Parent Eleanor Vance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Drawer (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-10 border-r border-outline-variant bg-surface-container w-[280px] z-30 pt-20 shadow-sm no-print">
        <div className="px-6 py-6 flex flex-col items-start gap-2 border-b border-outline-variant/60">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-1 ring-2 ring-secondary/30 shadow-md">
            <img
              src={ASSETS.parentSidebarAvatar}
              alt="Eleanor Vance"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Eleanor Vance</h3>
            <p className="text-xs text-on-surface-variant font-mono">Institutional Admin & Guardian</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 mt-4 px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${activeTab === 'dashboard' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'} rounded-full px-4 py-3 flex items-center gap-4 transition-colors text-left border-none cursor-pointer`}
          >
            <span className="material-symbols-outlined" style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`${activeTab === 'billing' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'} rounded-full px-4 py-3 flex items-center gap-4 transition-colors text-left border-none cursor-pointer`}
          >
            <span className="material-symbols-outlined" style={activeTab === 'billing' ? { fontVariationSettings: "'FILL' 1" } : {}}>payments</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Billing & Fees</span>
          </button>
          
          <button
            onClick={() => onNavigate('admin')}
            className="text-on-surface-variant hover:bg-surface-container-high px-4 py-3 flex items-center gap-4 transition-colors rounded-full text-left border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined">badge</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Staff Directory</span>
          </button>
          
          <button
            onClick={() => onNavigate('transcript', activeChild.name.includes('Leo') ? 'leo' : 'alexander')}
            className="text-on-surface-variant hover:bg-surface-container-high px-4 py-3 flex items-center gap-4 transition-colors rounded-full text-left border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Academic Records</span>
          </button>
        </nav>

        <div className="mt-auto p-6 border-t border-outline-variant/60">
          <div className="bg-surface p-3 rounded-xl border border-outline-variant/50 text-xs">
            <span className="font-bold text-secondary block">Guardian Active Status</span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Linked to Leo Vance (Gr 10) and Maya Vance (Gr 8).</p>
          </div>
          <span className="text-[10px] font-mono text-outline-variant block text-center mt-3">v2.4.0 • Parent Portal</span>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-[280px] p-4 md:p-8 max-w-7xl mx-auto pb-24 pt-28">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-primary text-white p-4 rounded-xl shadow-2xl border border-secondary flex items-center justify-between animate-fadeIn mb-6 z-50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary-fixed text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-xs font-semibold">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/70 hover:text-white">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Child Selector & Header */}
        <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-1 tracking-tight">Welcome back, Eleanor</h2>
            <p className="text-sm text-on-surface-variant">Monitoring progress for your children at Saint Jude's Academy.</p>
          </div>

          <div className="bg-surface-container p-1.5 rounded-2xl flex gap-1.5 shadow-inner border border-outline-variant/40">
            {childrenRecords.map(child => {
              const isSelected = child.id === selectedChildId;
              return (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChildId(child.id);
                    showToast(`Switched portal context to ${child.name} (${child.grade})`);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSelected ? 'bg-white text-secondary shadow-md border border-outline-variant/30 scale-100' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined text-base" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
                  <span>{child.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">
                    {child.currentGpa.toFixed(2)} GPA
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {activeTab === 'dashboard' ? (
          /* Bento Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Academic Progress Chart (Level 1 Surface) */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm bento-card flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-on-surface">Academic Progress</h3>
                  <span className="text-xs font-mono font-bold bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full">
                    {activeChild.grade}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">GPA Trend - Fall Semester 2023</p>
              </div>

              <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +0.2 GPA
              </div>
            </div>

            <div className="h-56 w-full relative chart-gradient rounded-xl border-b border-l border-outline-variant overflow-hidden p-4">
              {/* SVG Chart Line */}
              <svg className="w-full h-40 overflow-visible" viewBox="0 0 800 160">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#316BF3" />
                    <stop offset="100%" stopColor="#0051D5" />
                  </linearGradient>
                </defs>
                <path
                  d={activeChild.name.includes('Leo') ? "M0,140 Q200,110 400,80 T600,40 T800,20" : "M0,60 Q200,45 400,30 T600,20 T800,10"}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
                <circle cx="200" cy={activeChild.name.includes('Leo') ? "110" : "45"} r="7" fill="#0051D5" className="hover:scale-150 transition-transform cursor-pointer" />
                <circle cx="400" cy={activeChild.name.includes('Leo') ? "80" : "30"} r="7" fill="#0051D5" className="hover:scale-150 transition-transform cursor-pointer" />
                <circle cx="600" cy={activeChild.name.includes('Leo') ? "40" : "20"} r="7" fill="#0051D5" className="hover:scale-150 transition-transform cursor-pointer" />
                <circle cx="800" cy={activeChild.name.includes('Leo') ? "20" : "10"} r="7" fill="#0051D5" className="hover:scale-150 transition-transform cursor-pointer" />
              </svg>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-2 text-xs font-mono font-bold text-outline">
                {activeChild.months.map(m => <span key={m}>{m}</span>)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3.5 bg-surface rounded-xl border border-outline-variant/50 shadow-sm hover:border-secondary/40 transition-colors">
                <p className="text-xs uppercase font-bold text-on-surface-variant">Current GPA</p>
                <p className="text-2xl font-bold text-secondary font-mono mt-0.5">{activeChild.currentGpa.toFixed(2)}</p>
              </div>
              <div className="text-center p-3.5 bg-surface rounded-xl border border-outline-variant/50 shadow-sm hover:border-secondary/40 transition-colors">
                <p className="text-xs uppercase font-bold text-on-surface-variant">Class Rank</p>
                <p className="text-2xl font-bold text-secondary font-mono mt-0.5">{activeChild.rank}</p>
              </div>
              <div className="text-center p-3.5 bg-surface rounded-xl border border-outline-variant/50 shadow-sm hover:border-secondary/40 transition-colors">
                <p className="text-xs uppercase font-bold text-on-surface-variant">Target</p>
                <p className="text-2xl font-bold text-secondary font-mono mt-0.5">{activeChild.targetGpa.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-4 flex flex-col">
            <div className="bg-secondary-container text-on-secondary-container p-6 rounded-xl shadow-sm bento-card h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Quick Actions</h3>
                <p className="text-xs opacity-90">Administrative tools for {activeChild.name}'s records.</p>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => onNavigate('transcript', activeChild.name.includes('Leo') ? 'leo' : 'alexander')}
                  className="w-full bg-white text-secondary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-md group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">analytics</span>
                  <span>View Report Card</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="w-full border-2 border-white/80 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-secondary transition-all group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">download</span>
                  <span>Download PDF Summary</span>
                </button>

                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full border-2 border-white/80 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-secondary transition-all group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">mail</span>
                  <span>Contact Class Teacher</span>
                </button>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <a
                    href={`https://wa.me/2348012345678?text=${encodeURIComponent(`Hello Ms. Sarah Jenkins, I am inquiring about ${activeChild.name}'s progress on EduGrowth.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm no-underline"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>WhatsApp Teacher</span>
                  </a>
                  <a
                    href={`mailto:s.jenkins@edugrowth.edu?subject=${encodeURIComponent(`Inquiry regarding ${activeChild.name}`)}&body=${encodeURIComponent(`Hello Ms. Jenkins,\n\nI would like to inquire about ${activeChild.name}'s recent performance appraisals.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm no-underline"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span>Email Teacher</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="md:col-span-5 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm bento-card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-on-surface">Attendance Summary</h3>
                <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg">October 2023</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center mb-4 font-mono">
                <div className="text-[11px] font-bold opacity-50">M</div>
                <div className="text-[11px] font-bold opacity-50">T</div>
                <div className="text-[11px] font-bold opacity-50">W</div>
                <div className="text-[11px] font-bold opacity-50">T</div>
                <div className="text-[11px] font-bold opacity-50">F</div>
                <div className="text-[11px] font-bold opacity-50">S</div>
                <div className="text-[11px] font-bold opacity-50">S</div>

                {/* Days 1 to 14 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(day => {
                  const isWeekend = day === 6 || day === 7 || day === 13 || day === 14;
                  const status = activeChild.attendanceDays[day];
                  const isExcusedAbsent = day === 3 && activeChild.name.includes('Leo');

                  if (isWeekend) {
                    return (
                      <div key={day} className="h-9 flex items-center justify-center text-xs opacity-20 rounded-lg">
                        {day}
                      </div>
                    );
                  }

                  if (isExcusedAbsent) {
                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDayInfo("Oct 3: Absent (Excused) • Medical appointment verified by school nurse.")}
                        className="h-9 flex items-center justify-center text-xs bg-error-container text-on-error-container font-bold rounded-lg cursor-pointer ring-2 ring-error/30 hover:scale-105 transition-all shadow-sm"
                        title="Click to view excuse note"
                      >
                        {day}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDayInfo(`Oct ${day}: Present • Checked in at 07:54 AM.`)}
                      className="h-9 flex items-center justify-center text-xs bg-surface-container-high rounded-lg font-semibold hover:bg-surface-container-highest cursor-pointer transition-colors"
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {selectedDayInfo && (
                <div className="p-2.5 bg-primary-container text-white rounded-xl text-xs flex items-center justify-between mb-4 animate-fadeIn">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-tertiary-fixed">event_note</span>
                    {selectedDayInfo}
                  </span>
                  <button onClick={() => setSelectedDayInfo(null)} className="text-white/70 hover:text-white">
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-around pt-4 border-t border-outline-variant text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-surface-container-high rounded-full border border-outline-variant"></div>
                <span className="font-semibold text-on-surface-variant">Present (97%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-error rounded-full shadow-sm"></div>
                <span className="font-semibold text-on-surface-variant">Absent (Excused)</span>
              </div>
            </div>
          </div>

          {/* Recent Comments Feed */}
          <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm bento-card flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-on-surface">Recent Teacher Remarks</h3>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Reply to Teacher
              </button>
            </div>

            <div className="space-y-4">
              {activeChild.remarks.map((rem, idx) => (
                <div key={rem.id} className="flex gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 hover:border-outline-variant transition-colors">
                  <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-bold shadow-sm ${idx === 0 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-on-surface">{rem.teacher}</h4>
                      <span className="text-[10px] font-mono text-outline-variant uppercase">{rem.timeAgo}</span>
                    </div>
                    <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-1 mt-0.5">{rem.subject}</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">"{rem.comment}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homework & Assignment Tracker */}
          <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm bento-card flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-on-surface">Assignments & Homework</h3>
                <span className="text-[10px] font-mono font-bold bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full uppercase">
                  {selectedChildId === 'child-1' ? 'Leo - Gr 10' : 'Maya - Gr 8'}
                </span>
              </div>

              <div className="space-y-3">
                {childAssignments
                  .filter(asg => asg.childId === selectedChildId)
                  .map((asg) => {
                    const sub = childSubmissions.find(s => s.assignmentId === asg.id);
                    return (
                      <div key={asg.id} className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between gap-4 hover:border-outline-variant transition-colors">
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{asg.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-on-surface-variant font-mono">Due: {asg.dueDate}</span>
                            <span className="text-[10px] text-outline">•</span>
                            <span className="text-[10px] text-on-surface-variant font-mono">{asg.maxPoints} pts</span>
                          </div>
                        </div>

                        <div>
                          {sub ? (
                            sub.status === 'graded' ? (
                              <div className="text-right">
                                <span className="inline-block px-2.5 py-0.5 bg-[#d1e7dd] text-[#0f5132] rounded-md text-[10px] font-mono font-bold shadow-xs">
                                  {sub.grade}
                                </span>
                                {sub.feedback && (
                                  <p className="text-[9px] text-emerald-700 italic mt-0.5 max-w-[120px] truncate" title={sub.feedback}>
                                    "{sub.feedback}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
                                Pending Grade
                              </span>
                            )
                          ) : (
                            <button
                              onClick={() => handleOpenSubmitModal(asg)}
                              className="bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer border-none"
                            >
                              <span className="material-symbols-outlined text-[11px]">upload</span>
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Weekly Class Timetable */}
          <div className="md:col-span-12 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm bento-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Weekly Class Timetable</h3>
                <p className="text-xs text-on-surface-variant">Daily subject schedule, timing, and classroom allocations</p>
              </div>
              <button 
                onClick={() => showToast("Timetable synced with Google Calendar!")}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1.5 bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/40 cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined text-sm">sync</span>
                Sync Calendar
              </button>
            </div>

            {/* Timetable Weekly Columns */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const scheduleForDay = selectedChildId === 'child-1' 
                  ? leoTimetable[day] 
                  : mayaTimetable[day];

                return (
                  <div key={day} className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-3 hover:border-outline-variant transition-colors">
                    <span className="text-xs font-black uppercase text-secondary tracking-wider block border-b border-outline-variant pb-2">
                      {day}
                    </span>

                    <div className="space-y-3 flex-1">
                      {scheduleForDay?.map((slot: any, idx: number) => (
                        <div key={idx} className="bg-white border border-outline-variant/30 rounded-lg p-2.5 shadow-xs hover:shadow-sm transition-shadow">
                          <span className="text-[10px] font-bold text-primary font-mono block mb-1">
                            {slot.time}
                          </span>
                          <span className="text-xs font-bold text-on-surface block">
                            {slot.subject}
                          </span>
                          <span className="text-[9px] text-on-surface-variant block mt-0.5 font-mono">
                            {slot.room} • {slot.teacher}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* School Announcements Banner */}
          <div className="md:col-span-12 bg-inverse-surface text-inverse-on-surface p-6 md:p-8 rounded-2xl shadow-lg bento-card flex flex-col md:flex-row gap-6 items-center justify-between border border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-surface-container-highest rounded-2xl flex items-center justify-center text-primary-container shadow-inner">
                <span className="material-symbols-outlined text-4xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    LATEST NEWS
                  </span>
                  <span className="text-xs font-mono text-inverse-on-surface/70">Nov 15, 2023</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">Annual Winter Gala: Ticket Sales Now Open</h3>
                <p className="text-xs md:text-sm text-inverse-on-surface/80 max-w-2xl leading-relaxed">
                  Join us for the 45th Annual Winter Gala on December 20th. All proceeds go to the Science Lab renovation project. Early bird discounts available until Sunday.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="bg-surface text-primary px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap hover:bg-surface-container-low hover:scale-105 transition-all shadow-md self-stretch md:self-center"
            >
              Read More
            </button>
          </div>

        </div>
        ) : (
          /* Billing & Fees Section */
          <div className="space-y-6 animate-fadeIn">
            {/* Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Total Billed */}
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">account_balance</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Total Billed Dues</span>
                  <span className="text-xl font-bold font-mono text-on-surface">
                    ${billingSummary[selectedChildId]?.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card 2: Total Paid */}
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/60 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Total Verified Paid</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">
                    ${billingSummary[selectedChildId]?.paid.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card 3: Balance */}
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100/60 text-red-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">pending</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Outstanding Balance</span>
                  <span className="text-xl font-bold font-mono text-red-600">
                    ${(billingSummary[selectedChildId]?.total - billingSummary[selectedChildId]?.paid).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Pending Fees & Invoices</h3>
              <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="hidden md:grid md:grid-cols-5 bg-surface-container-low p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                  <span>Fee Category</span>
                  <span>Description</span>
                  <span>Due Date</span>
                  <span>Amount</span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="divide-y divide-outline-variant">
                  {invoices
                    .filter(inv => inv.childId === selectedChildId)
                    .map(inv => {
                      return (
                        <div key={inv.id} className="p-4 hover:bg-surface-container-lowest transition-colors flex flex-col md:grid md:grid-cols-5 md:items-center gap-2 md:gap-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary uppercase tracking-wider">
                              {inv.category}
                            </span>
                          </div>

                          <div>
                            <span className="font-bold text-sm text-on-surface block">{inv.title}</span>
                          </div>

                          <span className="text-xs font-mono text-on-surface-variant">{inv.dueDate}</span>

                          <div>
                            <span className="text-sm font-bold font-mono text-on-surface block">
                              ${inv.amount.toLocaleString()}
                            </span>
                            {inv.id === 'inv-1' && (
                              <span className="text-[10px] text-on-surface-variant block">Paid: $1,300</span>
                            )}
                          </div>

                          <div className="text-right">
                            {inv.status === 'Paid' ? (
                              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg shadow-sm">
                                Fully Paid
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenPayModal(inv)}
                                className="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity border-none cursor-pointer"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Payment History & Receipts</h3>
              <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="hidden md:grid md:grid-cols-5 bg-surface-container-low p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                  <span>Transaction ID</span>
                  <span>Payment Description</span>
                  <span>Date & Time</span>
                  <span>Amount Paid</span>
                  <span className="text-right">Receipt</span>
                </div>

                <div className="divide-y divide-outline-variant">
                  {paymentHistory
                    .filter(pay => pay.childId === selectedChildId)
                    .map(pay => (
                      <div key={pay.id} className="p-4 hover:bg-surface-container-lowest transition-colors flex flex-col md:grid md:grid-cols-5 md:items-center gap-2 md:gap-0">
                        <span className="text-xs font-mono text-on-surface-variant">{pay.id}</span>
                        <div>
                          <span className="font-bold text-sm text-on-surface block">{pay.title}</span>
                          <span className="text-[10px] text-on-surface-variant">{pay.method}</span>
                        </div>
                        <span className="text-xs font-mono text-on-surface-variant">{pay.date}</span>
                        <span className="text-sm font-bold font-mono text-emerald-700">${pay.amount.toLocaleString()}</span>
                        <div className="text-right">
                          <button
                            onClick={() => setSelectedReceipt(pay)}
                            className="text-secondary font-bold text-xs hover:underline bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/40 cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Announcement Details Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
                <div>
                  <h3 className="text-lg font-bold">Annual Winter Gala 2023</h3>
                  <p className="text-xs text-on-primary-container">Saint Jude's Academy Community Event</p>
                </div>
              </div>
              <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-white/80 hover:text-white p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-outline-variant text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-on-surface-variant">Event Date:</span>
                  <span className="font-mono font-bold text-secondary">Saturday, Dec 20, 2023 • 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-on-surface-variant">Location:</span>
                  <span className="font-bold text-on-surface">Saint Jude's Grand Ballroom</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-on-surface-variant">Dress Code:</span>
                  <span className="font-bold text-on-surface">Formal Evening Attire</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                We cordially invite all parents, alumni, and faculty to our annual celebration of institutional excellence. Featuring live musical performances by our Grade 11 Symphony Orchestra, gourmet dining, and our silent charity auction.
              </p>
              <p className="text-xs font-bold text-secondary">
                ✨ Early bird parent tickets ($45/person) are available through the school finance portal. All proceeds directly fund advanced lab equipment for STEM honors students!
              </p>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface"
                >
                  Close Notice
                </button>
                <button
                  onClick={() => {
                    alert("Ticket reservation link sent to eleanor.vance@gmail.com!");
                    setIsAnnouncementModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">local_activity</span>
                  Reserve Tickets Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 flex justify-around items-center h-16 bg-surface border-t border-outline-variant px-2 shadow-lg no-print">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center px-4 py-1 border-none bg-transparent cursor-pointer ${activeTab === 'dashboard' ? 'bg-secondary-container text-on-secondary-container rounded-full scale-95 font-bold' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] uppercase font-semibold">Home</span>
        </button>
        <button
          onClick={() => onNavigate('transcript', activeChild.name.includes('Leo') ? 'leo' : 'alexander')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-secondary border-none bg-transparent cursor-pointer"
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[10px] uppercase font-semibold">Stats</span>
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex flex-col items-center justify-center px-4 py-1 border-none bg-transparent cursor-pointer ${activeTab === 'billing' ? 'bg-secondary-container text-on-secondary-container rounded-full scale-95 font-bold' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[10px] uppercase font-semibold">Billing</span>
        </button>
        <button
          onClick={() => showToast("Parent profile active: Eleanor Vance.")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-secondary border-none bg-transparent cursor-pointer"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] uppercase font-semibold">Settings</span>
        </button>
      </nav>

      {/* Contact Teacher Modal */}
      <ContactTeacherModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        studentName={activeChild.name}
        onSendMessage={onSendMessage}
      />

      {/* Submit Homework Modal */}
      {isSubmitModalOpen && selectedAsgForSubmit && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn no-print">
          <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-secondary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
                <div>
                  <h3 className="text-lg font-bold">Submit Assignment</h3>
                  <p className="text-xs text-secondary-fixed">Student: {activeChild.name} • Homework Portal</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsSubmitModalOpen(false); setSelectedAsgForSubmit(null); }} 
                className="text-white/80 hover:text-white p-1 rounded-full border-none bg-transparent cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Assignment</label>
                <input 
                  type="text" 
                  value={selectedAsgForSubmit.title} 
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-gray-50 text-sm font-semibold focus:outline-none" 
                  disabled 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Attach Homework File</label>
                <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-6 text-center hover:bg-surface transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setMockFileName(file.name);
                    }}
                  />
                  <span className="material-symbols-outlined text-outline text-3xl block mb-2">cloud_upload</span>
                  <span className="text-xs font-bold text-on-surface block">
                    {mockFileName || 'Click to select or drag PDF/Word document'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block mt-1">Maximum file size: 10MB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Remarks or Notes for Teacher</label>
                <textarea
                  rows={3}
                  placeholder="Leave a note for the teacher (e.g. Completed questions 1-10, had some trouble with the last graph)..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsSubmitModalOpen(false); setSelectedAsgForSubmit(null); }} 
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!mockFileName}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none border-none"
                >
                  <span className="material-symbols-outlined text-sm">cloud_done</span>
                  Submit Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Fee Modal */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn no-print">
          <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-secondary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>payment</span>
                <div>
                  <h3 className="text-lg font-bold">Secure Fee Payment</h3>
                  <p className="text-xs text-secondary-fixed">Invoice: {selectedInvoice.title}</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsPayModalOpen(false); setSelectedInvoice(null); }} 
                className="text-white/80 hover:text-white p-1 rounded-full border-none bg-transparent cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Select Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-semibold"
                >
                  <option value="Credit Card">Credit/Debit Card (Instant)</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                  <option value="PayPal">PayPal / Digital Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedInvoice.amount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-bold font-mono"
                />
              </div>

              {paymentMethod === 'Credit Card' && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-outline-variant/60 text-[11px] leading-relaxed text-on-surface-variant space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-on-surface">Transfer Instructions:</span>
                  <p>Please pay into the school account details below:</p>
                  <p className="font-mono">Bank: Saint Jude Trust Bank</p>
                  <p className="font-mono">Account Name: Saint Jude Academy Funds</p>
                  <p className="font-mono">Account Number: 0982-1102-8812</p>
                  <p className="italic text-red-600 font-semibold">Please input the Child ID as transfer reference.</p>
                </div>
              )}

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsPayModalOpen(false); setSelectedInvoice(null); }} 
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                  Pay ${payAmount.toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Print Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            
            {/* Modal Actions Header */}
            <div className="p-4 bg-surface-container border-b border-outline-variant flex justify-between items-center no-print">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Transaction Receipt</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-secondary/90 cursor-pointer border-none shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print
                </button>
                <button 
                  onClick={() => setSelectedReceipt(null)} 
                  className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full border-none bg-transparent cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Receipt Printable Document */}
            <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[70vh] printable-receipt-doc">
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b border-outline-variant/60 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-base">school</span>
                    </div>
                    <span className="text-sm font-black text-primary tracking-tight">SAINT JUDE'S ACADEMY</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">102 School Avenue, Science District</p>
                  <p className="text-[10px] text-on-surface-variant">billing@stjudeacademy.edu • +1 (555) 0192</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
                    PAYMENT SUCCESS
                  </span>
                  <p className="text-xs font-bold text-on-surface">Receipt #: {selectedReceipt.id.toUpperCase()}</p>
                  <p className="text-[10px] text-on-surface-variant">Date: {selectedReceipt.date}</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-outline-variant/50">
                <div>
                  <span className="font-bold text-on-surface-variant block mb-1">Billed To (Guardian)</span>
                  <p className="font-bold text-on-surface">Eleanor Vance</p>
                  <p className="text-on-surface-variant">eleanor.vance@gmail.com</p>
                </div>
                <div>
                  <span className="font-bold text-on-surface-variant block mb-1">Student Context</span>
                  <p className="font-bold text-on-surface">{activeChild.name}</p>
                  <p className="text-on-surface-variant">Grade: {activeChild.grade}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 text-xs font-bold text-on-surface-variant border-b border-outline-variant pb-2 px-1">
                  <span>Description</span>
                  <span className="text-center">Method</span>
                  <span className="text-right">Amount</span>
                </div>
                <div className="grid grid-cols-3 text-xs text-on-surface py-2 px-1 border-b border-outline-variant/30">
                  <span className="font-medium">{selectedReceipt.title}</span>
                  <span className="text-center font-mono text-on-surface-variant">{selectedReceipt.method}</span>
                  <span className="text-right font-mono font-bold">${selectedReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-end pt-4">
                <div className="w-1/2 space-y-2 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">${selectedReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant border-b border-outline-variant/50 pb-2">
                    <span>Processing Fee (0.00%):</span>
                    <span className="font-mono">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-on-surface">
                    <span>Total Paid:</span>
                    <span className="font-mono text-emerald-700">${selectedReceipt.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-outline-variant/50 pt-6 text-center space-y-2">
                <div className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant font-mono">
                  <span className="material-symbols-outlined text-[12px] text-emerald-600">lock</span>
                  Secured by EduGrowth Billing Core
                </div>
                <p className="text-[9px] text-on-surface-variant">This is a computer-generated transaction record and serves as official proof of payment.</p>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
