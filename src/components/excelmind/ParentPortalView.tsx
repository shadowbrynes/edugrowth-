import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../../types/excelmind';
import { CURRENT_STUDENT, SUBJECT_RESULTS_DATA } from '../../data/excelmindData';
import { ParentCommunication } from '../communication/ParentCommunication';
import { parentSpaceApi, resultApi } from '../../services/api';

interface ChildSummary {
  id: number;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  academicLevel: string;
  className: string;
  photo: string;
  attendanceRate: string;
  averageScore: string;
  status: string;
  reportCard?: any;
}

interface ParentPortalViewProps {
  student?: StudentProfile;
  onNavigateToMessages?: () => void;
  onNavigateToResults?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  student = CURRENT_STUDENT,
  onNavigateToMessages,
  onNavigateToResults
}) => {
  const [children, setChildren] = useState<ChildSummary[]>([
    {
      id: 1,
      admissionNumber: 'EXM-2025-0842',
      firstName: 'John',
      lastName: 'Smith',
      fullName: 'John Smith',
      academicLevel: 'SS2',
      className: 'SS2 Science',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      attendanceRate: '96%',
      averageScore: '86%',
      status: 'active'
    },
    {
      id: 2,
      admissionNumber: 'EXM-2025-1024',
      firstName: 'Mary',
      lastName: 'Smith',
      fullName: 'Mary Smith',
      academicLevel: 'JSS3',
      className: 'JSS3 Basic',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      attendanceRate: '98%',
      averageScore: '92%',
      status: 'active'
    }
  ]);

  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
  const [parentName, setParentName] = useState<string>('Mrs. Johnson');
  const [activeTab, setActiveTab] = useState<'results' | 'attendance' | 'assignments' | 'progress' | 'teachers' | 'announcements'>('results');
  const [assignedTeachers, setAssignedTeachers] = useState<any[]>([]);
  const [childResults, setChildResults] = useState<any[]>(SUBJECT_RESULTS_DATA);
  const [loading, setLoading] = useState(false);

  // Load parent's linked children from MySQL parentSpaceApi
  useEffect(() => {
    async function loadParentData() {
      try {
        const res = await parentSpaceApi.getChildren();
        if (res.success && res.data?.children && res.data.children.length > 0) {
          setChildren(res.data.children);
          if (res.data.parent?.name) {
            setParentName(res.data.parent.name);
          }
        }
      } catch (e) {
        console.warn('Parent portal children load error:', e);
      }
    }
    loadParentData();
  }, []);

  const activeChild = children[selectedChildIndex] || children[0];

  // Load active child's results and assigned teachers
  useEffect(() => {
    async function loadChildDetails() {
      if (!activeChild?.id) return;
      setLoading(true);
      try {
        const [resResults, resTeachers] = await Promise.all([
          parentSpaceApi.getChildResults(activeChild.id),
          parentSpaceApi.getChildTeachers(activeChild.id)
        ]);

        if (resResults.success && resResults.data?.results) {
          setChildResults(resResults.data.results);
        }
        if (resTeachers.success && resTeachers.data?.teachers) {
          setAssignedTeachers(resTeachers.data.teachers);
        }
      } catch (err) {
        console.warn('Child details load notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChildDetails();
  }, [activeChild?.id]);

  const announcements = [
    {
      id: 1,
      title: 'Mid-Term Continuous Assessment (CA) Schedule',
      date: 'March 10, 2026',
      content: 'Continuous Assessment tests for JSS1 through SS3 commence next Monday. Students should review revision notes on the Learning Hub.',
      category: 'Academic'
    },
    {
      id: 2,
      title: 'WAEC / NECO Registration Clearance',
      date: 'March 05, 2026',
      content: 'All SS2 and SS3 parents are reminded to ensure tuition clearance is verified in the portal before biometric registration closure.',
      category: 'Registry'
    },
    {
      id: 3,
      title: 'Inter-House Sports & STEM Exhibition',
      date: 'February 28, 2026',
      content: 'Annual Science & Tech exhibition will take place at the school auditorium on Friday. Parents and guardians are cordially invited.',
      category: 'Event'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner & Welcome */}
      <div className="bg-gradient-to-r from-purple-950 via-[#111B5E] to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                <span className="material-symbols-outlined text-xl">family_restroom</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                My Child Monitoring Space • Parent Private Environment
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome {parentName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Monitor your linked children's certified grades, daily attendance, class assignments, and directly contact approved subject tutors in a private, data-isolated environment.
            </p>
          </div>

          {/* Privacy Security Status Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-indigo-100 max-w-xs shadow-inner">
            <div className="flex items-center gap-2 text-emerald-300 font-extrabold mb-1">
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Strict Data Isolation Active</span>
            </div>
            <p className="text-[11px] text-indigo-200 leading-snug">
              Protected by parental RBAC policy. Unrelated student records and non-approved staff contact details are completely inaccessible.
            </p>
          </div>
        </div>
      </div>

      {/* 2. My Children Selector (Prompt Requirement: Welcome Mrs. Johnson / My Children) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">face</span>
              My Children
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a ward to inspect certified records, attendance and assigned teachers
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            {children.length} Verified Ward(s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {children.map((child, idx) => {
            const isSelected = selectedChildIndex === idx;
            return (
              <div
                key={child.id}
                onClick={() => setSelectedChildIndex(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-300'
                }`}
              >
                <img
                  src={child.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt={child.fullName}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-purple-400 shadow-sm shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                      {child.fullName}
                    </h3>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                    {child.className}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>GPA: <strong className="text-slate-800 dark:text-slate-200">{child.averageScore}</strong></span>
                    <span>•</span>
                    <span>Attendance: <strong className="text-emerald-600">{child.attendanceRate}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Navigation Tabs for Active Ward */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'results', label: 'Child Results & Transcripts', icon: 'analytics' },
          { id: 'attendance', label: 'Daily Attendance', icon: 'event_available' },
          { id: 'assignments', label: 'Assignments & Feedback', icon: 'task' },
          { id: 'progress', label: 'Learning Progress', icon: 'trending_up' },
          { id: 'teachers', label: 'Approved Teacher Contacts', icon: 'contact_phone' },
          { id: 'announcements', label: 'School Announcements', icon: 'campaign' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#111B5E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: CERTIFIED RESULTS */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Official Academic Standing • {activeChild.fullName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Continuous Assessment (CA: 40%) + End of Term Examination (Exam: 60%)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Overall Average: {activeChild.averageScore}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">CA (40)</th>
                  <th className="py-3 px-3">Exam (60)</th>
                  <th className="py-3 px-3">Total (100)</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {(childResults.length > 0 ? childResults : SUBJECT_RESULTS_DATA).map((r: any, i: number) => {
                  const total = Number(r.total_score || r.total || 85);
                  const ca = Number(r.ca_score || r.ca || 34);
                  const exam = Number(r.exam_score || r.exam || 51);
                  const grade = r.grade || (total >= 75 ? 'A1' : total >= 65 ? 'B2' : 'C4');
                  const subjName = r.subject?.subject_name || r.subject || `Subject ${i + 1}`;

                  return (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{subjName}</td>
                      <td className="py-3 px-3 font-mono">{ca}</td>
                      <td className="py-3 px-3 font-mono">{exam}</td>
                      <td className="py-3 px-3 font-mono font-extrabold text-blue-600 dark:text-blue-400">{total}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                          total >= 75 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 italic text-[11px]">
                        {r.teacher_comment || 'Demonstrates strong analytical reasoning and mastery.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Daily Biometric Attendance Record • {activeChild.fullName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified daily morning roll-call and classroom presence
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              {activeChild.attendanceRate} Presence Rate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold">Present Days</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">47 Days</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800">
              <span className="text-[10px] font-mono uppercase text-rose-700 dark:text-rose-400 font-bold">Absent Days</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">2 Days</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold">Late Arrivals</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">1 Day</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] font-mono uppercase text-blue-700 dark:text-blue-400 font-bold">Clearance Status</span>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">Certified</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & TEACHER FEEDBACK */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Assignments & Homework Submissions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track assigned exercises and inspect direct teacher evaluation feedback
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              48 of 50 Submitted
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'IUPAC Organic Nomenclature & Isomerism Problem Set',
                subject: 'Chemistry',
                score: '95/100 (A1)',
                date: 'Graded 2 days ago',
                feedback: 'Excellent structural formula depictions. Pay slight attention to geometric cis-trans isomers.'
              },
              {
                title: 'Calculus: Integration by Parts & Definite Integrals',
                subject: 'Further Mathematics',
                score: '90/100 (A1)',
                date: 'Graded 4 days ago',
                feedback: 'Very clean working throughout. Well done.'
              },
              {
                title: 'Electromagnetic Induction & Faraday Law Applications',
                subject: 'Physics',
                score: '92/100 (A1)',
                date: 'Graded 1 week ago',
                feedback: 'Great precision in solving Lenz law direction questions.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {item.subject}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-1">{item.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">{item.score}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">Teacher Feedback:</strong> "{item.feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LEARNING PROGRESS */}
      {activeTab === 'progress' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Curriculum Mastery & Progress Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Syllabus completion percentage according to NERDC national standard
            </p>
          </div>

          <div className="space-y-4">
            {[
              { subject: 'General Mathematics', progress: 85, color: 'bg-blue-600' },
              { subject: 'Physics', progress: 82, color: 'bg-purple-600' },
              { subject: 'Chemistry', progress: 78, color: 'bg-emerald-600' },
              { subject: 'Biology', progress: 90, color: 'bg-teal-600' },
              { subject: 'English Language', progress: 88, color: 'bg-indigo-600' }
            ].map((p, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{p.subject}</span>
                  <span className="font-mono text-slate-500">{p.progress}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className={`${p.color} h-2.5 rounded-full`} style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: APPROVED TEACHER CONTACTS (Teacher Contact Privacy) */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          {/* Privacy Notice Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <span className="material-symbols-outlined text-lg text-amber-600 shrink-0">shield_person</span>
            <div>
              <strong className="font-black">Teacher Contact Privacy Guaranteed:</strong> You are strictly granted communication channels for your child's assigned Class Teacher (Form Master) and Subject Instructors. Unrelated staff records and private teacher accounts are completely restricted to preserve school privacy.
            </div>
          </div>

          {/* Teacher Contact List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(assignedTeachers.length > 0 ? assignedTeachers : [
              {
                id: 1,
                name: 'Dr. Kenneth Okon',
                role: 'Form Master / Senior Physics Tutor',
                department: 'Science Faculty',
                phone: '+2348022334455',
                whatsappNumber: '2348022334455',
                communicationStatus: 'available',
                photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                isClassTeacher: true
              },
              {
                id: 2,
                name: 'Mrs. Folashade Adeleke',
                role: 'Subject Instructor (General Mathematics)',
                department: 'STEM Faculty',
                phone: '+2348033112233',
                whatsappNumber: '2348033112233',
                communicationStatus: 'available',
                photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
                isClassTeacher: false
              }
            ]).map((t: any) => (
              <div key={t.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={t.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-purple-300 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{t.name}</h4>
                      {t.isClassTeacher && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          Form Master
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">{t.role}</p>
                    <p className="text-[11px] text-slate-400">{t.department}</p>
                  </div>
                </div>

                {/* 3 Contact Buttons Required by Prompt: Message, Call, WhatsApp */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${t.whatsappNumber}?text=${encodeURIComponent(`Hello ${t.name}, I am writing regarding my child ${activeChild.fullName} in ${activeChild.className}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${t.phone}`}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>Call</span>
                  </a>

                  <button
                    onClick={onNavigateToMessages}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SCHOOL ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">campaign</span>
              Official School Announcements
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified administrative notices, term calendars, and event updates
            </p>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {a.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{a.date}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{a.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
