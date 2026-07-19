import React, { useState } from 'react';
import { ClassSession, ScheduleItem, Assignment, StudentSubmission, ViewMode } from '../types';
import { TEACHER_CLASSES, TEACHER_SCHEDULE, TEACHER_ASSIGNMENTS, TEACHER_SUBMISSIONS } from '../data/mockData';
import { MarkAttendanceModal } from './modals/MarkAttendanceModal';
import { UploadScoresModal } from './modals/UploadScoresModal';
import { RecordRemarksModal } from './modals/RecordRemarksModal';

interface TeacherDashboardProps {
  onNavigate: (view: ViewMode, studentId?: string) => void;
  onAddRemarkLog: (studentName: string, subject: string, comment: string) => void;
  onAddActivityLog: (type: string, user: string, action: string, target: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigate,
  onAddRemarkLog,
  onAddActivityLog
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('c1');
  const [assignments, setAssignments] = useState(TEACHER_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState(TEACHER_SUBMISSIONS);
  const [schedule] = useState<ScheduleItem[]>(TEACHER_SCHEDULE);
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isScoresModalOpen, setIsScoresModalOpen] = useState(false);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [gradingModalSub, setGradingModalSub] = useState<StudentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeClass = TEACHER_CLASSES.find(c => c.id === selectedClassId) || TEACHER_CLASSES[0];
  const currentAssignments = assignments[selectedClassId] || assignments['c1'];
  const currentSubmissions = submissions[selectedClassId] || submissions['c1'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAttendance = (presentCount: number, total: number) => {
    showToast(`Attendance recorded: ${presentCount}/${total} students marked present for ${activeClass.name}`);
    onAddActivityLog('upload', 'Prof. Marcus Brody', 'marked attendance', `${presentCount}/${total} present for ${activeClass.name}`);
  };

  const handleUploadScore = (title: string, avgPercentage: number) => {
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title,
      submitted: activeClass.studentsCount - 2,
      total: activeClass.studentsCount,
      percentage: avgPercentage,
      colorClass: 'bg-secondary'
    };
    setAssignments(prev => ({
      ...prev,
      [selectedClassId]: [newAsg, ...(prev[selectedClassId] || [])]
    }));
    showToast(`Published grades for "${title}" with class average ${avgPercentage}%`);
    onAddActivityLog('upload', 'Prof. Marcus Brody', 'uploaded score sheet:', `${title} (${activeClass.name})`);
  };

  const handleAddRemark = (studentName: string, subject: string, comment: string) => {
    onAddRemarkLog(studentName, subject, comment);
    showToast(`Remark logged for ${studentName}: "${comment.slice(0, 40)}..."`);
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModalSub || !gradeInput) return;
    const scoreVal = Number(gradeInput) || 88;
    
    setSubmissions(prev => ({
      ...prev,
      [selectedClassId]: prev[selectedClassId].map(sub => 
        sub.id === gradingModalSub.id ? { ...sub, grade: `${scoreVal}/100`, status: 'graded', scoreValue: scoreVal } : sub
      )
    }));

    showToast(`Graded ${gradingModalSub.studentName}: ${scoreVal}/100 for ${gradingModalSub.assignment}`);
    onAddActivityLog('upload', 'Prof. Marcus Brody', 'graded submission:', `${gradingModalSub.studentName} (${scoreVal}/100)`);
    setGradingModalSub(null);
    setGradeInput('');
  };

  const filteredSubmissions = currentSubmissions.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.assignment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Navigation Drawer (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-10 border-r border-outline-variant bg-surface-container dark:bg-inverse-surface w-[280px] z-30 pt-20 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">EduGrowth</span>
        </div>

        <div className="px-3 py-4 flex flex-col gap-1.5">
          <button
            onClick={() => {}}
            className="flex items-center gap-4 p-3.5 bg-secondary-container text-on-secondary-container rounded-full mx-2 font-bold translate-x-1 transition-transform duration-200 shadow-sm text-left"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Faculty Dashboard</span>
          </button>
          
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-4 p-3.5 text-on-surface-variant hover:bg-surface-container-high rounded-full mx-2 transition-colors text-left"
          >
            <span className="material-symbols-outlined">badge</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Admin Directory</span>
          </button>
          
          <button
            onClick={() => onNavigate('transcript', 'alexander')}
            className="flex items-center gap-4 p-3.5 text-on-surface-variant hover:bg-surface-container-high rounded-full mx-2 transition-colors text-left"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Academic Records</span>
          </button>
          
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-4 p-3.5 text-on-surface-variant hover:bg-surface-container-high rounded-full mx-2 transition-colors text-left"
          >
            <span className="material-symbols-outlined">terminal</span>
            <span className="text-xs uppercase tracking-wider font-semibold">System Logs</span>
          </button>
        </div>

        <div className="mt-auto p-6 border-t border-outline-variant/60">
          <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-outline-variant/50">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shadow-sm">
              MB
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Prof. M. Brody</p>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Senior Faculty</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-mono text-outline text-center">v2.4.0 • Faculty Build</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-[280px] min-h-screen pb-20 lg:pb-12 pt-28">
        
        {/* TopAppBar */}
        <header className="fixed top-10 left-0 lg:left-[280px] right-0 z-20 flex justify-between items-center px-4 md:px-8 py-3 bg-surface border-b border-outline-variant shadow-sm">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">school</span>
            </div>
            <h1 className="text-xl font-bold text-primary lg:hidden">EduGrowth Faculty</h1>
            <span className="hidden lg:inline-block text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              Active Faculty Session: Saint Jude's Academy
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/60 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
              <input
                type="text"
                placeholder="Search class assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs w-48 text-on-surface"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              )}
            </div>

            <button
              onClick={() => showToast("No unread department notices.")}
              className="relative p-2 hover:bg-surface-container-low rounded-full transition-colors text-secondary"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Toast Alert */}
          {toastMessage && (
            <div className="bg-primary text-white p-4 rounded-xl shadow-2xl border border-secondary flex items-center justify-between animate-fadeIn z-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-white/70 hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Dashboard Header & Class Selector */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-secondary-container bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block">
                Welcome back, Professor
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Faculty Dashboard</h2>
            </div>

            <div className="relative group w-full md:w-72">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Active Class Session</label>
              <div className="relative">
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    showToast(`Switched active workspace to: ${TEACHER_CLASSES.find(c => c.id === e.target.value)?.name}`);
                  }}
                  className="w-full bg-white border-2 border-outline-variant rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm font-bold text-primary shadow-sm cursor-pointer"
                >
                  {TEACHER_CLASSES.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.room} • {cls.studentsCount} Students)
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-3.5 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </section>

          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Task Shortcuts */}
            <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="flex flex-col items-center justify-center gap-4 p-6 bg-surface border border-outline-variant rounded-xl hover:border-secondary hover:shadow-lg transition-all group text-center"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                </div>
                <div>
                  <span className="text-base font-bold text-on-surface block">Mark Attendance</span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 block">{activeClass.name} roster</span>
                </div>
              </button>

              <button
                onClick={() => setIsScoresModalOpen(true)}
                className="flex flex-col items-center justify-center gap-4 p-6 bg-surface border border-outline-variant rounded-xl hover:border-secondary hover:shadow-lg transition-all group text-center"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
                </div>
                <div>
                  <span className="text-base font-bold text-on-surface block">Upload Scores</span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 block">CSV import & Quiz grades</span>
                </div>
              </button>

              <button
                onClick={() => setIsRemarksModalOpen(true)}
                className="flex flex-col items-center justify-center gap-4 p-6 bg-surface border border-outline-variant rounded-xl hover:border-secondary hover:shadow-lg transition-all group text-center"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                </div>
                <div>
                  <span className="text-base font-bold text-on-surface block">Record Remarks</span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 block">Report card observations</span>
                </div>
              </button>
            </div>

            {/* Today's Schedule */}
            <div className="md:col-span-12 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
                <h3 className="text-lg font-bold text-on-surface">Today's Schedule</h3>
                <span className="text-xs font-mono font-bold text-secondary bg-surface-container px-2.5 py-1 rounded-lg">Oct 24, 2023</span>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-3.5 rounded-xl border-l-4 transition-all ${item.isActive ? 'border-secondary bg-surface-container-low shadow-sm' : 'border-outline-variant/60 bg-surface/50 hover:bg-surface'}`}
                  >
                    <span className={`text-sm font-mono font-bold w-14 flex-shrink-0 ${item.isActive ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {item.time}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{item.subject}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{item.location}</p>
                    </div>
                    {item.isActive && (
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-secondary text-white px-2 py-0.5 rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="w-full py-2 bg-surface-container text-secondary rounded-xl text-xs font-bold hover:bg-surface-container-highest transition-colors uppercase tracking-wider"
              >
                Start Class Session
              </button>
            </div>

            {/* Assignment Status */}
            <div className="md:col-span-12 lg:col-span-7 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Active Assignments</h3>
                  <p className="text-xs text-on-surface-variant">Real-time submission tracking for {activeClass.name}</p>
                </div>
                <button
                  onClick={() => setIsScoresModalOpen(true)}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Assessment
                </button>
              </div>

              <div className="space-y-6">
                {currentAssignments.map((asg) => (
                  <div key={asg.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-on-surface">{asg.title}</span>
                      <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-outline-variant/40">
                        {asg.submitted}/{asg.total} Submitted ({asg.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`${asg.colorClass} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${asg.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Analytics Donut */}
            <div className="md:col-span-12 lg:col-span-5 bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Assessment Distribution</h3>
                <p className="text-xs text-on-surface-variant mb-4">Cumulative grade breakdown for {activeClass.name}</p>
              </div>

              <div className="flex-grow flex items-center justify-around gap-6 py-4">
                <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center flex-shrink-0">
                  {/* Styled CSS Donut Chart */}
                  <div className="absolute inset-0 rounded-full border-[14px] border-surface-container-high"></div>
                  <div className="absolute inset-0 rounded-full border-[14px] border-secondary border-t-transparent border-r-transparent transition-transform duration-700" style={{ transform: 'rotate(55deg)' }}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-full m-4 shadow-inner">
                    <span className="text-3xl font-bold text-secondary font-mono">B+</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-0.5">AVG GRADE</span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-outline-variant/40">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-secondary flex-shrink-0"></span>
                      <span className="font-semibold">A (Excellence):</span>
                    </div>
                    <span className="font-mono font-bold text-primary">12 Students</span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-outline-variant/40">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-secondary-container flex-shrink-0"></span>
                      <span className="font-semibold">B (Honor Track):</span>
                    </div>
                    <span className="font-mono font-bold text-primary">18 Students</span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-outline-variant/40">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-surface-container-high flex-shrink-0"></span>
                      <span className="font-semibold">C (Satisfactory):</span>
                    </div>
                    <span className="font-mono font-bold text-primary">8 Students</span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-outline-variant/40">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-error flex-shrink-0"></span>
                      <span className="font-semibold">D/F (Intervention):</span>
                    </div>
                    <span className="font-mono font-bold text-error">2 Students</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-outline-variant/50">
                <span className="text-[11px] text-on-surface-variant">Class average performance is <strong className="text-tertiary-fixed-dim">+4.2% higher</strong> than department target.</span>
              </div>
            </div>
          </div>

          {/* Recent Student Submissions Table (Mobile-Responsive Card Pattern) */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Recent Student Submissions</h3>
                <p className="text-xs text-on-surface-variant">Pending reviews and graded papers for {activeClass.name}</p>
              </div>
              <span className="text-xs font-mono font-bold bg-surface-container px-3 py-1.5 rounded-lg text-secondary">
                {filteredSubmissions.length} Items in Queue
              </span>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="hidden md:grid md:grid-cols-5 bg-surface-container-low p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                <span>Student Name</span>
                <span>Assignment</span>
                <span>Date</span>
                <span>Grade</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-outline-variant">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-8 text-center text-on-surface-variant">
                    <p className="text-sm font-semibold">No submissions match your search query.</p>
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 hover:bg-surface-container-lowest transition-colors flex flex-col md:grid md:grid-cols-5 md:items-center gap-3 md:gap-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0 ${sub.status === 'graded' ? 'bg-secondary' : 'bg-error'}`}>
                          {sub.initials}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-on-surface block">{sub.studentName}</span>
                          <span className="text-[11px] text-on-surface-variant md:hidden">{sub.assignment}</span>
                        </div>
                      </div>

                      <span className="text-xs text-on-surface-variant font-semibold hidden md:block">{sub.assignment}</span>
                      <span className="text-xs font-mono text-on-surface-variant">{sub.date}</span>

                      <div>
                        {sub.status === 'graded' && sub.grade ? (
                          <span className="inline-block px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg text-xs font-mono font-bold shadow-sm">
                            {sub.grade}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 bg-error-container text-on-error-container rounded-lg text-xs font-bold animate-pulse">
                            Pending Grade
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {sub.status === 'graded' ? (
                          <button
                            onClick={() => {
                              setGradingModalSub(sub);
                              setGradeInput(sub.scoreValue ? String(sub.scoreValue) : '90');
                            }}
                            className="text-secondary font-bold text-xs hover:underline bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/40"
                          >
                            Review / Edit Grade
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setGradingModalSub(sub);
                              setGradeInput('88');
                            }}
                            className="bg-secondary text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                            Grade Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Instant Grading Modal */}
      {gradingModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-secondary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
                <div>
                  <h3 className="text-lg font-bold">Grade Student Submission</h3>
                  <p className="text-xs text-secondary-fixed">{gradingModalSub.studentName} • {gradingModalSub.assignment}</p>
                </div>
              </div>
              <button onClick={() => setGradingModalSub(null)} className="text-white/80 hover:text-white p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGradeSubmission} className="p-6 space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-outline-variant/60">
                <p className="text-xs text-on-surface-variant font-semibold">Submitted File:</p>
                <div className="flex items-center gap-2 mt-1 font-mono text-xs text-secondary font-bold">
                  <span className="material-symbols-outlined text-base">description</span>
                  {gradingModalSub.assignment.toLowerCase().replace(/\s+/g, '_')}_{gradingModalSub.initials.toLowerCase()}.pdf
                </div>
                <p className="text-[11px] text-on-surface-variant mt-2">Submitted timestamp: {gradingModalSub.date}. AI Plagiarism check: <strong className="text-tertiary-fixed-dim">0% (Verified Original)</strong>.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Assign Numerical Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  autoFocus
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-secondary bg-surface focus:outline-none focus:ring-4 focus:ring-secondary/20 text-xl font-mono font-bold text-center text-primary"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGradingModalSub(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Publish Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contextual FAB (Only on Faculty Dashboard) */}
      <button
        onClick={() => setIsScoresModalOpen(true)}
        className="fixed right-6 bottom-20 md:bottom-10 w-14 h-14 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
        title="Quick Upload Scores or Assignment"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-3 bg-primary text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-bold">
          New Assessment
        </span>
      </button>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 flex justify-around items-center h-16 bg-surface border-t border-outline-variant px-2 shadow-lg">
        <div className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-95 transition-transform duration-200 font-bold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] uppercase font-semibold">Home</span>
        </div>
        <button onClick={() => onNavigate('admin')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[10px] uppercase font-semibold">Admin</span>
        </button>
        <button onClick={() => onNavigate('transcript', 'alexander')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
          <span className="material-symbols-outlined">description</span>
          <span className="text-[10px] uppercase font-semibold">Records</span>
        </button>
        <button onClick={() => showToast("Settings: Faculty Session active.")} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] uppercase font-semibold">Settings</span>
        </button>
      </nav>

      {/* Interactive Modals */}
      <MarkAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        classNameTitle={activeClass.name}
        onSaveAttendance={handleSaveAttendance}
      />

      <UploadScoresModal
        isOpen={isScoresModalOpen}
        onClose={() => setIsScoresModalOpen(false)}
        classNameTitle={activeClass.name}
        onUploadScore={handleUploadScore}
      />

      <RecordRemarksModal
        isOpen={isRemarksModalOpen}
        onClose={() => setIsRemarksModalOpen(false)}
        classNameTitle={activeClass.name}
        onAddRemark={handleAddRemark}
      />
    </div>
  );
};
