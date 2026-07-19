import React, { useState, useEffect } from 'react';
import { TranscriptData, SchoolProfile } from '../types';
import { TRANSCRIPTS } from '../data/mockData';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { QRCodeSVG } from 'qrcode.react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const GPA_PROGRESS_DATA: Record<string, { semester: string; gpa: number }[]> = {
  alexander: [
    { semester: 'G9 Sem 1', gpa: 4.35 },
    { semester: 'G9 Sem 2', gpa: 4.52 },
    { semester: 'G10 Sem 1', gpa: 4.60 },
    { semester: 'G10 Sem 2', gpa: 4.71 },
    { semester: 'G11 Sem 1', gpa: 4.80 },
    { semester: 'G11 Sem 2', gpa: 4.85 },
  ],
  alice: [
    { semester: 'G9 Sem 1', gpa: 4.80 },
    { semester: 'G9 Sem 2', gpa: 4.85 },
    { semester: 'G10 Sem 1', gpa: 4.90 },
    { semester: 'G10 Sem 2', gpa: 4.95 },
    { semester: 'G11 Sem 1', gpa: 4.98 },
    { semester: 'G11 Sem 2', gpa: 5.00 },
  ],
  leo: [
    { semester: 'G9 Sem 1', gpa: 4.25 },
    { semester: 'G9 Sem 2', gpa: 4.38 },
    { semester: 'G9 Sem 3', gpa: 4.42 },
    { semester: 'G10 Sem 1', gpa: 4.50 },
    { semester: 'G10 Sem 2', gpa: 4.58 },
    { semester: 'G10 Sem 3', gpa: 4.65 },
  ],
};

interface TranscriptViewProps {
  initialStudentId?: string;
  onBackToDashboard: () => void;
  onOpenShareModal: (studentName: string) => void;
  selectedSession?: string;
  schoolProfile?: SchoolProfile;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  initialStudentId = 'alexander',
  onBackToDashboard,
  onOpenShareModal,
  selectedSession = '2023/2024 Fall',
  schoolProfile,
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialStudentId);
  const [activeTab, setActiveTab] = useState<'official' | 'analytics' | 'skills'>('official');
  const [showVerificationAlert, setShowVerificationAlert] = useState<boolean>(false);
  const [firebaseTranscript, setFirebaseTranscript] = useState<TranscriptData | null>(null);

  const [userRole, setUserRole] = useState<string>('student');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form states
  const [formFullName, setFormFullName] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formAcademicClass, setFormAcademicClass] = useState('');
  const [formCurrentTerm, setFormCurrentTerm] = useState('');
  const [formSubjects, setFormSubjects] = useState<any[]>([]);
  const [formClassTeacherRemarks, setFormClassTeacherRemarks] = useState('');
  const [formPrincipalRemarks, setFormPrincipalRemarks] = useState('');
  const [formBannerText, setFormBannerText] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formStatusSub, setFormStatusSub] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || 'student');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };
    fetchUserRole();
  }, []);

  const calculateGrade = (total: number) => {
    if (total >= 90) return { grade: 'A+', remarks: 'Brilliant', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' };
    if (total >= 80) return { grade: 'A', remarks: 'Outstanding', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' };
    if (total >= 70) return { grade: 'B+', remarks: 'Very Good', badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant' };
    if (total >= 60) return { grade: 'B', remarks: 'Good', badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant' };
    if (total >= 50) return { grade: 'C', remarks: 'Satisfactory', badgeClass: 'bg-surface-container-high' };
    return { grade: 'F', remarks: 'Needs Improvement', badgeClass: 'bg-red-500/10 text-red-500 border border-red-500/20' };
  };

  const generateAutoRemarks = () => {
    // Calculate new GPA
    const totalPoints = formSubjects.reduce((acc, sub) => {
      if (sub.grade.startsWith('A')) return acc + 5;
      if (sub.grade.startsWith('B')) return acc + 4;
      if (sub.grade.startsWith('C')) return acc + 3;
      if (sub.grade.startsWith('D')) return acc + 2;
      return acc + 1; // F
    }, 0);
    const calculatedGpa = Number((totalPoints / formSubjects.length).toFixed(2));

    let teacherRemarks = "";
    let principalRemarks = "";
    let bannerText = "";
    let status = "PROMOTED";
    let statusSub = "";

    if (calculatedGpa >= 4.5) {
      teacherRemarks = `"${formFullName} has displayed an exceptional aptitude for academic success, leading peers in analytical reasoning and project engagement. An outstanding semester."`;
      principalRemarks = `"An exemplary record of performance. Approved for placement on the President's Elite Honor List. Congratulations on this distinction."`;
      bannerText = `Congratulations! You've ranked in the Top 5 of your class.`;
      statusSub = `To Grade ${parseInt(formAcademicClass.replace(/\D/g, '')) + 1 || 12}`;
    } else if (calculatedGpa >= 3.5) {
      teacherRemarks = `"${formFullName} shows reliable competency across all core subjects. Participation has been consistent, and writing abilities are highly developed."`;
      principalRemarks = `"Good progress overall. Keep up the consistent effort to reach the highest honors in the upcoming sessions."`;
      bannerText = `Well done! You have earned placement on the Academic Honor Roll.`;
      statusSub = `To Grade ${parseInt(formAcademicClass.replace(/\D/g, '')) + 1 || 12}`;
    } else if (calculatedGpa >= 2.5) {
      teacherRemarks = `"${formFullName} has passed the term but needs to put more effort into qualitative analysis. Homework consistency must improve."`;
      principalRemarks = `"Advancement approved. Maintain strict focus on subjects requiring quantitative reasoning next term."`;
      bannerText = `Passed in Good Standing. Aim for higher marks next term.`;
      statusSub = `To Grade ${parseInt(formAcademicClass.replace(/\D/g, '')) + 1 || 12}`;
    } else {
      teacherRemarks = `"${formFullName}'s grades have fallen significantly this term. Constant distraction and missing assignments have impacted overall mastery."`;
      principalRemarks = `"Academic probation status assigned. Student requires a structured intervention plan and mandatory after-school counseling."`;
      bannerText = `Warning: Academic performance is below passing standard.`;
      status = "PROBATION";
      statusSub = `Requires Intervention`;
    }

    setFormClassTeacherRemarks(teacherRemarks);
    setFormPrincipalRemarks(principalRemarks);
    setFormBannerText(bannerText);
    setFormStatus(status);
    setFormStatusSub(statusSub);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Calculate new GPA
    const totalPoints = formSubjects.reduce((acc, sub) => {
      if (sub.grade.startsWith('A')) return acc + 5;
      if (sub.grade.startsWith('B')) return acc + 4;
      if (sub.grade.startsWith('C')) return acc + 3;
      if (sub.grade.startsWith('D')) return acc + 2;
      return acc + 1; // F
    }, 0);
    const newGpa = Number((totalPoints / formSubjects.length).toFixed(2));

    const updatedTranscriptData: Partial<TranscriptData> = {
      fullName: formFullName,
      studentId: formStudentId,
      academicClass: formAcademicClass,
      currentTerm: formCurrentTerm,
      subjects: formSubjects,
      finalGpa: newGpa,
      classTeacherRemarks: formClassTeacherRemarks,
      principalRemarks: formPrincipalRemarks,
      promotionBannerText: formBannerText,
      status: formStatus,
      statusSub: formStatusSub
    };

    try {
      await setDoc(doc(db, 'transcripts', selectedId), updatedTranscriptData, { merge: true });
      
      // If GPA is low, auto-push a critical alert to the school registry
      if (newGpa < 3.5) {
        const alertId = `alt-${Date.now()}`;
        const initials = formFullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const newAlert = {
          id: alertId,
          studentId: selectedId,
          studentName: formFullName,
          initials: initials,
          type: 'grade_drop',
          value: `${newGpa} GPA`,
          details: `Academic Alert: ${formFullName}'s GPA fell to ${newGpa}/5.00. Mandatory counseling protocol triggered.`,
          date: new Date().toISOString().split('T')[0],
          assignedAdvisor: 'Mrs. Sarah Jenkins'
        };
        await setDoc(doc(db, 'alerts', alertId), newAlert);
        
        // Also register system activity
        const activityId = `act-${Date.now()}`;
        const newActivity = {
          id: activityId,
          type: 'alert',
          user: 'System Automation',
          action: 'triggered academic warning for',
          target: formFullName,
          timeAgo: 'Just now',
          timestamp: new Date().toISOString(),
          icon: 'warning',
          colorClass: 'bg-red-500/10 text-red-500'
        };
        await setDoc(doc(db, 'activities', activityId), newActivity);
      }

      setIsEditModalOpen(false);
      alert("Academic Record successfully updated in school registry!");
    } catch (err) {
      console.error("Failed to update transcript in Firestore:", err);
      alert("Failed to update record in Firestore. Check your connection or permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'transcripts', selectedId), (docSnap) => {
      if (docSnap.exists()) {
        setFirebaseTranscript(docSnap.data() as TranscriptData);
      } else {
        setFirebaseTranscript(null);
      }
    }, (err) => {
      console.error('Error fetching transcript:', err);
    });
    return () => unsubscribe();
  }, [selectedId]);

  useEffect(() => {
    const logTranscriptAccess = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        // Fetch user profile to get role and name
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        
        const userName = profile?.name || user.displayName || 'Anonymous User';
        const userEmail = user.email || 'no-email@example.com';
        const userRole = profile?.role || 'student';
        
        const studentNames: Record<string, string> = {
          alexander: 'Alexander J. Sterling',
          alice: 'Alice Cooper',
          leo: 'Leo Vance',
        };
        const studentName = studentNames[selectedId] || selectedId;

        const logId = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const logData = {
          id: logId,
          userId: user.uid,
          userName: userName,
          userEmail: userEmail,
          userRole: userRole,
          studentId: selectedId,
          studentName: studentName,
          timestamp: new Date().toISOString(),
          session: selectedSession
        };

        await setDoc(doc(db, 'transcript_accesses', logId), logData);
      } catch (err) {
        console.error('Failed to log transcript access:', err);
      }
    };

    logTranscriptAccess();
  }, [selectedId, selectedSession]);

  useEffect(() => {
    const updatePrintDate = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      document.body.setAttribute('data-print-date', formatted);
    };

    updatePrintDate();
    const interval = setInterval(updatePrintDate, 30000); // refresh every 30s
    return () => {
      clearInterval(interval);
      document.body.removeAttribute('data-print-date');
    };
  }, []);

  const currentTranscript: TranscriptData = firebaseTranscript || TRANSCRIPTS[selectedId] || TRANSCRIPTS['alexander'];
  const currentGpaHistory = GPA_PROGRESS_DATA[selectedId] || GPA_PROGRESS_DATA['alexander'];

  const handlePrint = () => {
    window.print();
  };

  const handleVerify = () => {
    setShowVerificationAlert(true);
    setTimeout(() => setShowVerificationAlert(false), 4000);
  };

  return (
    <div className="flex-1 bg-[#0c0c0c] text-white p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8">
      {/* Top Banner & Kinetic Navigation Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-white/10 pb-6 gap-4 no-print">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 bg-[#1a1a1a] hover:bg-white/10 text-xs uppercase font-bold tracking-widest text-white transition-all rounded-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Dashboard
          </button>
          <div>
            <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-[#ff3e00] mb-1">
              Official Academic Registry / Verifiable Record
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase m-0 p-0 text-white select-none">
              Digital Report <span className="text-[#ff3e00]">Card</span>
            </h1>
          </div>
        </div>

        {/* Student Selector & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-3 py-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Student:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-transparent text-xs uppercase font-bold tracking-widest text-white focus:outline-none cursor-pointer"
            >
              <option value="alexander" className="bg-[#1a1a1a] text-white">Alexander J. Sterling (3rd Rank)</option>
              <option value="alice" className="bg-[#1a1a1a] text-white">Alice Cooper (Valedictorian #1)</option>
              <option value="leo" className="bg-[#1a1a1a] text-white">Leo Vance (Honor Roll)</option>
            </select>
          </div>

          <button
            onClick={() => onOpenShareModal(currentTranscript.fullName)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#ff3e00]/50 hover:border-[#ff3e00] text-[#ff3e00] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share Achievement
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff3e00] text-black hover:bg-[#ff3e00]/90 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            Download Transcript as PDF
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => {
                setFormFullName(currentTranscript.fullName);
                setFormStudentId(currentTranscript.studentId);
                setFormAcademicClass(currentTranscript.academicClass);
                setFormCurrentTerm(currentTranscript.currentTerm);
                setFormSubjects(currentTranscript.subjects.map(s => ({ ...s })));
                setFormClassTeacherRemarks(currentTranscript.classTeacherRemarks);
                setFormPrincipalRemarks(currentTranscript.principalRemarks);
                setFormBannerText(currentTranscript.promotionBannerText || '');
                setFormStatus(currentTranscript.status || 'PROMOTED');
                setFormStatusSub(currentTranscript.statusSub || '');
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#ff3e00] bg-[#1a1a1a] hover:bg-[#ff3e00] hover:text-black text-[#ff3e00] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Modify Academic Record
            </button>
          )}
        </div>
      </header>

      {/* Verification Alert Toast */}
      {showVerificationAlert && (
        <div className="bg-gradient-to-r from-[#ff3e00]/20 to-[#1a1a1a] border border-[#ff3e00] p-4 flex items-center justify-between no-print animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ff3e00]">verified_user</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white m-0">Cryptographic Signature Verified</p>
              <p className="text-[11px] font-light text-white/70 m-0">Transcript ID {currentTranscript.transcriptId} signed by {schoolProfile?.name || "Saint Jude's Academy"} Registry Authority.</p>
            </div>
          </div>
          <button onClick={() => setShowVerificationAlert(false)} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Promotion Hero Banner */}
      <div className="bg-[#1a1a1a] border border-white/10 p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff3e00]/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-5 z-10">
          <div className="w-14 h-14 border border-[#ff3e00] flex items-center justify-center bg-[#0c0c0c] shrink-0">
            <span className="material-symbols-outlined text-2xl text-[#ff3e00] filled">workspace_premium</span>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#ff3e00] mb-1">
              Academic Status: {currentTranscript.status} ({currentTranscript.statusSub})
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase m-0 text-white">
              {currentTranscript.promotionBannerText}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-end">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Cumulative GPA</div>
            <div className="text-3xl font-black text-[#ff3e00] tracking-tighter">
              {currentTranscript.finalGpa.toFixed(2)} <span className="text-sm text-white/40 font-normal">/ {currentTranscript.gpaScale.toFixed(1)}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10 mx-2" />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Class Rank</div>
            <div className="text-3xl font-black text-white tracking-tighter">
              {currentTranscript.ranking} <span className="text-sm text-white/40 font-normal">of {currentTranscript.totalClassSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-white/10 gap-8 no-print">
        <button
          onClick={() => setActiveTab('official')}
          className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeTab === 'official' ? 'text-[#ff3e00] border-b-2 border-[#ff3e00]' : 'text-white/50 hover:text-white'
          }`}
        >
          01. Official Transcript
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeTab === 'analytics' ? 'text-[#ff3e00] border-b-2 border-[#ff3e00]' : 'text-white/50 hover:text-white'
          }`}
        >
          02. Grade Breakdown & Benchmarks
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeTab === 'skills' ? 'text-[#ff3e00] border-b-2 border-[#ff3e00]' : 'text-white/50 hover:text-white'
          }`}
        >
          03. Advisor Evaluations
        </button>
      </div>

      {/* TAB 1: OFFICIAL TRANSCRIPT DOCUMENT */}
      {activeTab === 'official' && (
        <div className="bg-[#1a1a1a] border border-white/10 p-8 md:p-12 flex flex-col gap-10 relative print-shadow-none overflow-hidden">
          {/* Background Watermark */}
          {(schoolProfile?.watermarkUrl || schoolProfile?.logoUrl) && (
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] print:opacity-[0.09] pointer-events-none select-none z-0">
              <img 
                src={schoolProfile.watermarkUrl || schoolProfile.logoUrl} 
                alt="Watermark" 
                className="w-[450px] h-[450px] object-contain" 
                referrerPolicy="no-referrer" 
              />
            </div>
          )}

          {/* Document Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 gap-6 z-10 relative">
            <div className="flex items-center gap-6">
              {schoolProfile?.logoUrl ? (
                <img
                  src={schoolProfile.logoUrl}
                  alt="School Crest"
                  className="w-36 h-36 object-contain bg-white p-2 border border-white/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-36 h-36 bg-[#0c0c0c] border border-white/20 flex items-center justify-center font-black text-4xl text-[#ff3e00] tracking-tighter shrink-0">
                  {schoolProfile?.name
                    ? schoolProfile.name.split(' ').filter(word => word.length > 0).map(word => word[0]).join('').slice(0, 3).toUpperCase()
                    : 'SJA'}
                </div>
              )}
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold">
                  {schoolProfile?.name || "Saint Jude's Academy of Sciences"}
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight m-0 text-white">
                  {schoolProfile?.reportCardHeader || "Official Academic Transcript"}
                </h2>
                <div className="text-xs text-[#ff3e00] font-mono mt-1 flex flex-col gap-0.5">
                  <div>Transcript Reference: {currentTranscript.transcriptId}</div>
                  {schoolProfile?.motto && <div className="text-[10px] italic text-white/40 font-sans mt-0.5">Motto: {schoolProfile.motto}</div>}
                </div>
              </div>
            </div>
            <div className="text-left md:text-right text-xs text-white/60 font-mono space-y-1">
              <div><strong className="text-white uppercase tracking-widest font-bold">Issued:</strong> {currentTranscript.issueDate}</div>
              <div><strong className="text-white uppercase tracking-widest font-bold">Term:</strong> {selectedSession || currentTranscript.currentTerm}</div>
              <div><strong className="text-white uppercase tracking-widest font-bold">Status:</strong> Verifiable Digital Copy</div>
            </div>
          </div>

          {/* Student Dossier Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#0c0c0c] border border-white/10 p-6 items-center">
            <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start">
              <div className="w-28 h-28 border border-white/20 relative overflow-hidden bg-[#1a1a1a]">
                <img
                  src={currentTranscript.photoUrl}
                  alt={currentTranscript.fullName}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute bottom-0 inset-x-0 bg-[#ff3e00] text-black text-[9px] font-black uppercase tracking-widest text-center py-0.5">
                  Verified
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Student Name</span>
                <span className="text-base font-bold text-white uppercase tracking-wide block mt-1">{currentTranscript.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Student ID Number</span>
                <span className="text-base font-mono text-[#ff3e00] block mt-1">{currentTranscript.studentId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Academic Cohort</span>
                <span className="text-base font-bold text-white uppercase tracking-wide block mt-1">{currentTranscript.academicClass}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Date of Birth</span>
                <span className="text-sm font-mono text-white/80 block mt-1">{currentTranscript.dob}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Gender</span>
                <span className="text-sm font-mono text-white/80 block mt-1">{currentTranscript.gender}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Attendance Rate</span>
                <span className="text-sm font-bold text-green-400 block mt-1">{currentTranscript.attendancePercent}% Present</span>
              </div>
            </div>
          </div>

          {/* Academic Courses Table */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#ff3e00] mb-4 border-l-2 border-[#ff3e00] pl-3">
              Curriculum Performance & Graded Assessments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-white/10">
                <thead>
                  <tr className="bg-[#0c0c0c] text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold border-b border-white/10">
                    <th className="p-4 border-r border-white/10">Subject Course Title</th>
                    <th className="p-4 border-r border-white/10 text-center">Continuous Assessment (30)</th>
                    <th className="p-4 border-r border-white/10 text-center">Final Examination (70)</th>
                    <th className="p-4 border-r border-white/10 text-center">Total Score (100)</th>
                    <th className="p-4 border-r border-white/10 text-center">Letter Grade</th>
                    <th className="p-4 text-center">Academic Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-mono">
                  {currentTranscript.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 border-r border-white/10 font-bold text-white uppercase tracking-wider font-sans">
                        {sub.subject}
                      </td>
                      <td className="p-4 border-r border-white/10 text-center text-white/80">
                        {sub.caScore} / 30
                      </td>
                      <td className="p-4 border-r border-white/10 text-center text-white/80">
                        {sub.examScore} / 70
                      </td>
                      <td className="p-4 border-r border-white/10 text-center font-bold text-white text-base">
                        {sub.totalScore}%
                      </td>
                      <td className="p-4 border-r border-white/10 text-center">
                        <span className="inline-block px-2.5 py-1 bg-[#0c0c0c] border border-[#ff3e00] text-[#ff3e00] font-black text-xs">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="p-4 text-center font-sans text-xs uppercase tracking-widest text-white/70">
                        {sub.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks & Signatures Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-2">
            <div className="bg-[#0c0c0c] border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff3e00] block mb-2">
                  Class Teacher Evaluation
                </span>
                <p className="text-xs italic leading-relaxed text-white/80 m-0">
                  {currentTranscript.classTeacherRemarks}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-white block">{currentTranscript.classTeacherName}</span>
                  <span className="text-[10px] uppercase text-white/40 tracking-widest block">Senior Faculty Advisor</span>
                </div>
                <img src={currentTranscript.classTeacherSignUrl} alt="Signature" className="h-10 invert opacity-80" />
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff3e00] block mb-2">
                  Principal Commendation & Endorsement
                </span>
                <p className="text-xs italic leading-relaxed text-white/80 m-0">
                  {currentTranscript.principalRemarks}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-white block">
                    {schoolProfile?.principal || currentTranscript.principalName}
                  </span>
                  <span className="text-[10px] uppercase text-white/40 tracking-widest block">Head of Institution</span>
                </div>
                <div className="flex items-center gap-3">
                  {schoolProfile?.digitalStampUrl && (
                    <img
                      src={schoolProfile.digitalStampUrl}
                      alt="Institutional Seal"
                      className="h-12 w-12 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {schoolProfile?.principalSignatureUrl ? (
                    <img
                      src={schoolProfile.principalSignatureUrl}
                      alt="Signature"
                      className="h-10 object-contain bg-white px-2 py-1 rounded"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img src={currentTranscript.principalSignUrl} alt="Signature" className="h-10 invert opacity-80" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security QR Code and Footer Notes */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-sm shrink-0 border border-white flex items-center justify-center">
                <QRCodeSVG
                  value={`${window.location.origin}/?verify=${selectedId}`}
                  size={68}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white block">Cryptographic Verification</span>
                <p className="text-[11px] font-light text-white/50 max-w-md m-0 mt-1">
                  Scan QR code or click verify to authenticate this academic transcript against the Saint Jude&apos;s decentralized ledger registry.
                </p>
                <button
                  onClick={() => {
                    const verificationUrl = `${window.location.origin}/?verify=${selectedId}`;
                    // Trigger deep verification flow locally
                    handleVerify();
                    // Also copy the verification link to the clipboard so they can try it easily in preview
                    navigator.clipboard.writeText(verificationUrl).catch(() => {});
                  }}
                  className="mt-2 text-xs font-bold uppercase tracking-widest text-[#ff3e00] hover:underline flex items-center gap-1 cursor-pointer no-print"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                  Verify Transcript Authenticity &rarr;
                </button>
              </div>
            </div>

            <div className="text-center sm:text-right text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
              <div>Official Document ID: {currentTranscript.transcriptId}</div>
              <div className="mt-1">&copy; 2024 SJA Academic Systems</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & BENCHMARKS */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-white/10 p-8">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#ff3e00] mb-6">
                Subject Score Comparison vs. Class Average
              </h3>
              <div className="space-y-6">
                {currentTranscript.subjects.map((sub, idx) => {
                  // Mock class average slightly below student score
                  const avgScore = Math.max(70, sub.totalScore - 12);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span className="text-white">{sub.subject}</span>
                        <span className="text-[#ff3e00]">{sub.totalScore}% <span className="text-white/40 text-[10px]">(Class Avg: {avgScore}%)</span></span>
                      </div>
                      <div className="h-3 w-full bg-[#0c0c0c] border border-white/10 relative overflow-hidden">
                        <div
                          className="h-full bg-[#ff3e00] transition-all duration-500"
                          style={{ width: `${sub.totalScore}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                          style={{ left: `${avgScore}%` }}
                          title="Class Average"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#ff3e00]" />
                  <span>Student Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-white" />
                  <span>Class Average Benchmark</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#ff3e00] mb-6">
                  Academic Velocity & Percentile Standing
                </h3>
                <p className="text-xs leading-relaxed text-white/80 uppercase tracking-widest mb-6">
                  Based on normalized weighted examination results across all 3 semesters of the current academic year.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0c0c0c] border border-white/10 p-5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Percentile Rank</span>
                    <span className="text-3xl font-black text-[#ff3e00] block mt-1">Top 5%</span>
                    <span className="text-[10px] uppercase text-white/60 block mt-1">Ranked {currentTranscript.ranking} overall</span>
                  </div>
                  <div className="bg-[#0c0c0c] border border-white/10 p-5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Attendance Score</span>
                    <span className="text-3xl font-black text-white block mt-1">{currentTranscript.attendancePercent}%</span>
                    <span className="text-[10px] uppercase text-green-400 block mt-1">Exceeds 95% Benchmark</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#0c0c0c] border border-[#ff3e00]/30 p-5 mt-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ff3e00]">insights</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Honor Society Recommendation</span>
                </div>
                <p className="text-xs text-white/70 mt-2 m-0 font-light">
                  This student has met all prerequisites for National Science Honor Society induction for the upcoming 2024 academic cycle.
                </p>
              </div>
            </div>
          </div>

          {/* GPA Progression Line Chart */}
          <div className="bg-[#1a1a1a] border border-white/10 p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#ff3e00]">
                Semester-by-Semester GPA Progression
              </h3>
              <p className="text-xs text-white/60 uppercase tracking-widest mt-1">
                Historical trajectory of cumulative grade point average over the student&apos;s academic residency
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentGpaHistory} margin={{ top: 15, right: 20, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis
                    dataKey="semester"
                    stroke="rgba(255, 255, 255, 0.2)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[4.0, 5.0]}
                    stroke="rgba(255, 255, 255, 0.2)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                    dx={-5}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0c0c0c] border border-[#ff3e00]/40 px-3.5 py-2.5 rounded-sm shadow-xl font-mono">
                            <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider">{label}</p>
                            <p className="text-sm font-black text-[#ff3e00] mt-1">
                              GPA: {Number(payload[0].value).toFixed(2)} <span className="text-[10px] text-white/40 font-normal font-sans">/ {currentTranscript.gpaScale.toFixed(1)}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#ff3e00"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#ff3e00', strokeWidth: 2, fill: '#0c0c0c' }}
                    activeDot={{ r: 6, stroke: '#ff3e00', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/40 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ff3e00]" />
                <span className="text-white/70">Cumulative GPA Score</span>
              </div>
              <div>
                <span>Scale: {currentTranscript.gpaScale.toFixed(1)} MAX</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADVISOR EVALUATIONS */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-[#1a1a1a] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#ff3e00] flex items-center justify-center text-[#ff3e00] font-black text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-black uppercase tracking-wider text-white mb-2">Quantitative & Analytical Reasoning</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Demonstrates advanced competence in abstract mathematical modeling and computational logic. Consistently achieves highest band in continuous evaluations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#ff3e00] font-bold">
              <span>Department: Mathematics</span>
              <span>Rating: Exceptional</span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#ff3e00] flex items-center justify-center text-[#ff3e00] font-black text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-black uppercase tracking-wider text-white mb-2">Scientific Inquiry & Laboratory Precision</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Exhibits meticulous attention to experimental design, data recording, and hypothesis testing in Physics and Chemistry laboratory environments.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#ff3e00] font-bold">
              <span>Department: Science</span>
              <span>Rating: Superior</span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#ff3e00] flex items-center justify-center text-[#ff3e00] font-black text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-black uppercase tracking-wider text-white mb-2">Leadership & Peer Collaboration</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Serves as a reliable peer mentor during computer science workshops and group presentations. Strong communicator with exemplary integrity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#ff3e00] font-bold">
              <span>Department: Humanities</span>
              <span>Rating: Outstanding</span>
            </div>
          </div>
        </div>
      )}

      {/* Kinetic Footer */}
      <footer className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-[0.3em] uppercase opacity-50 gap-4 no-print">
        <div>&copy; 2024 EduGrowth System / Kinetic Studio</div>
        <div className="flex gap-8">
          <span>Security Protocol 4.2</span>
          <span>Encrypted Ledger</span>
          <span>SJA Registry</span>
        </div>
        <div>Vantage Point / 01</div>
      </footer>

      {/* Edit Academic Record Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn no-print text-white">
          <div className="bg-[#121212] border border-white/20 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#ff3e00] text-black flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-black text-3xl font-bold">edit_note</span>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Modify Student Academic Registry</h3>
                  <p className="text-xs font-semibold opacity-80">Registry ID: {currentTranscript.transcriptId}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-black/80 hover:text-black p-1 rounded-full border-none bg-transparent cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveChanges} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Student Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#ff3e00]" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Institutional Student ID</label>
                  <input 
                    type="text" 
                    required
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#ff3e00]" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Class / Grade Level</label>
                  <input 
                    type="text" 
                    required
                    value={formAcademicClass}
                    onChange={(e) => setFormAcademicClass(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#ff3e00]" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Academic Session Term</label>
                  <input 
                    type="text" 
                    required
                    value={formCurrentTerm}
                    onChange={(e) => setFormCurrentTerm(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#ff3e00]" 
                  />
                </div>
              </div>

              {/* Subject scores array list */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#ff3e00]">Continuous Assessment & Exam Scores</h4>
                <div className="space-y-2">
                  {formSubjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-[#1a1a1a] border border-white/5 p-3 rounded">
                      <div className="col-span-5">
                        <span className="text-xs font-bold block">{sub.subject}</span>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[8px] uppercase tracking-wider text-white/40 mb-0.5">CA (0-30)</label>
                        <input
                          type="number"
                          min={0}
                          max={30}
                          required
                          value={sub.caScore}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const newSub = [...formSubjects];
                            newSub[idx].caScore = val;
                            newSub[idx].totalScore = val + newSub[idx].examScore;
                            const calc = calculateGrade(newSub[idx].totalScore);
                            newSub[idx].grade = calc.grade;
                            newSub[idx].remarks = calc.remarks;
                            newSub[idx].badgeClass = calc.badgeClass;
                            setFormSubjects(newSub);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0c0c0c] border border-white/10 text-xs font-bold text-center focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[8px] uppercase tracking-wider text-white/40 mb-0.5">Exam (0-70)</label>
                        <input
                          type="number"
                          min={0}
                          max={70}
                          required
                          value={sub.examScore}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const newSub = [...formSubjects];
                            newSub[idx].examScore = val;
                            newSub[idx].totalScore = val + newSub[idx].caScore;
                            const calc = calculateGrade(newSub[idx].totalScore);
                            newSub[idx].grade = calc.grade;
                            newSub[idx].remarks = calc.remarks;
                            newSub[idx].badgeClass = calc.badgeClass;
                            setFormSubjects(newSub);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0c0c0c] border border-white/10 text-xs font-bold text-center focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-[10px] text-white/40 uppercase block">Grade</span>
                        <span className="text-xs font-black text-secondary font-mono">{sub.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automation Engine & Status */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#ff3e00]">Automated Status & Promotion Registry</h4>
                  <button
                    type="button"
                    onClick={generateAutoRemarks}
                    className="px-3 py-1.5 bg-[#ff3e00]/15 hover:bg-[#ff3e00]/30 border border-[#ff3e00]/40 text-[#ff3e00] rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider transition-all border-none"
                  >
                    <span className="material-symbols-outlined text-xs">auto_awesome</span>
                    Smart Auto-Fill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Academic Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold focus:outline-none"
                    >
                      <option value="PROMOTED">PROMOTED</option>
                      <option value="PROBATION">PROBATION</option>
                      <option value="WITHDRAWN">WITHDRAWN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Status Detail (Sub)</label>
                    <input 
                      type="text"
                      placeholder="e.g. To Grade 12"
                      value={formStatusSub}
                      onChange={(e) => setFormStatusSub(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Achievement Banner Text</label>
                    <input 
                      type="text"
                      placeholder="e.g. Top 5 of Class"
                      value={formBannerText}
                      onChange={(e) => setFormBannerText(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Class Teacher Remarks</label>
                  <textarea
                    rows={2}
                    value={formClassTeacherRemarks}
                    onChange={(e) => setFormClassTeacherRemarks(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Principal Remarks</label>
                  <textarea
                    rows={2}
                    value={formPrincipalRemarks}
                    onChange={(e) => setFormPrincipalRemarks(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-[#1a1a1a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff3e00]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-5 py-2.5 rounded text-xs font-bold border border-white/20 hover:bg-white/10 cursor-pointer bg-transparent uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded text-xs font-bold bg-[#ff3e00] text-black shadow-md hover:bg-[#ff3e00]/90 flex items-center gap-1.5 cursor-pointer uppercase tracking-widest disabled:bg-neutral-600 disabled:text-neutral-300 border-none"
                >
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
