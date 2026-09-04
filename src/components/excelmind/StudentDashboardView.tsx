import React from 'react';
import { ActiveModule, StudentProfile } from '../../types/excelmind';
import { COURSES_DATA, ASSIGNMENTS_DATA, TIMETABLE_DATA, CBT_EXAMS_DATA } from '../../data/excelmindData';

interface StudentDashboardViewProps {
  student: StudentProfile;
  onNavigate: (module: ActiveModule) => void;
  onSelectCourse?: (courseId: string) => void;
  onSelectExam?: (examId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  onNavigate,
  onSelectCourse,
  onSelectExam
}) => {
  const pendingAssignments = ASSIGNMENTS_DATA.filter(a => a.submission_status === 'pending');
  const todayClasses = TIMETABLE_DATA.filter(t => t.day === 'Monday').slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Section (Exact prompt specification) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111B5E] via-[#1B2A80] to-purple-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        
        {/* Decorative glass glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111B5E] flex items-center justify-center text-[10px]" title="Online Active">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Welcome Back, {student.name} 👋
                </h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {student.class}
                </span>
              </div>

              <p className="text-sm font-semibold text-blue-300 mt-1">
                Your Academic Companion
              </p>
              <p className="text-xs text-indigo-200/80 font-medium italic mt-0.5">
                "Stay ahead, every step of the way."
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-indigo-200 font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-blue-400">domain</span>
                  {student.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-blue-400">calendar_month</span>
                  {student.academicSession}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-amber-400">military_tech</span>
                  Rank #{student.rank} of {student.totalInClass} Students
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
            <button
              onClick={() => onNavigate('student_directory')}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>Digital ID & Directory</span>
            </button>

            <button
              onClick={() => onNavigate('curriculum')}
              className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">auto_stories</span>
              <span>Curriculum Engine</span>
            </button>

            <button
              onClick={() => onNavigate('coach')}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">neurology</span>
              <span>AI Coach & Streak ({student.studyStreakDays}d 🔥)</span>
            </button>

            <button
              onClick={() => onNavigate('cbt')}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>Take CBT Exam</span>
            </button>

            <button
              onClick={() => onNavigate('ai_tutor')}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-blue-300">smart_toy</span>
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Analytics Cards (Exact prompt metrics & circular progress) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Academic Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Academic Performance
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-[#111B5E] dark:text-blue-300">
                  {student.overallScore}%
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +{student.scoreImprovement}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Improvement compared to last term
              </p>
            </div>

            {/* Circular Progress Indicator */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${student.overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-black font-mono text-slate-800 dark:text-slate-200">
                {student.overallScore}%
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Class Average: 71%</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">Top 7% Tier</span>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Attendance Rate
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {student.attendanceRate}%
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Exemplary
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                47 of 50 school days logged
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${student.attendanceRate}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Required: 80%</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Full Clearance</span>
            </div>
          </div>
        </div>

        {/* Card 3: Assignment Progress */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Assignment Progress
              </p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {student.assignmentsSubmitted}
                </span>
                <span className="text-lg font-bold text-slate-400">
                  /{student.assignmentsTotal}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Assignments submitted
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(student.assignmentsSubmitted / student.assignmentsTotal) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{student.assignmentsTotal - student.assignmentsSubmitted} Remaining</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">90% Completion</span>
            </div>
          </div>
        </div>

        {/* Card 4: CBT Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                CBT Performance
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {student.cbtAverageScore}%
                </span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                  WAEC A1 Dist.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Average CBT score across 12 tests
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">speed</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">JAMB Sim: 328/400</span>
            <button
              onClick={() => onNavigate('cbt')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              Take Mock <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Continue Learning & Active Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Continue Learning & Courses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Continue Learning Featured Banner (Mathematics 75%) */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-800/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40">
                  Course In Progress
                </span>
                <span className="text-xs text-blue-200">MTH 301</span>
              </div>
              <h3 className="text-lg font-black text-white">General Mathematics & Further Maths</h3>
              <p className="text-xs text-indigo-200">
                Next Up: <span className="text-amber-300 font-semibold">Definite Integration & Area Under Curves</span>
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-36 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-200">75% Complete</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('learning_hub')}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs transition shadow-md whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue Learning</span>
              <span className="material-symbols-outlined text-sm">play_circle</span>
            </button>
          </div>

          {/* Enrolled Courses Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Enrolled Subjects & Modules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Curriculum aligned with WAEC, NECO & Cambridge A-Levels
                </p>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View All (6) <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {COURSES_DATA.slice(0, 4).map((course) => (
                <div
                  key={course.course_id}
                  onClick={() => {
                    onSelectCourse?.(course.course_id);
                    onNavigate('learning_hub');
                  }}
                  className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {course.code}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                      {course.progress}%
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Teacher: {course.teacher}
                  </p>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-medium">
                    <span>{course.materialsCount.videos} Videos • {course.materialsCount.pdfs} Notes</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline">Study →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Timetable Schedule */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">schedule</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Today's Schedule (Monday)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full Week Timetable →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {todayClasses.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[11px] w-24">
                      {item.time}
                    </span>
                    <div>
                      <p className="font-black text-slate-900 dark:text-slate-100">{item.subject}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.teacher}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Upcoming Deadlines & AI Tutor Widget */}
        <div className="space-y-6">
          
          {/* Upcoming Assignments / Academic Planner Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-lg">assignment_late</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Pending Deadlines
                </h3>
              </div>
              <span className="text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">
                {pendingAssignments.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingAssignments.slice(0, 3).map((asn) => (
                <div
                  key={asn.assignment_id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {asn.subject}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-900/30 px-2 py-0.5 rounded">
                      Due: {asn.deadline}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                    {asn.title}
                  </h4>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Max Score: {asn.maxScore}</span>
                    <button
                      onClick={() => onNavigate('assignments')}
                      className="px-2.5 py-1 rounded-lg bg-[#111B5E] text-white text-[10px] font-bold hover:bg-blue-900 transition"
                    >
                      Submit Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('assignments')}
              className="w-full mt-4 py-2 text-center text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Open Academic Planner →
            </button>
          </div>

          {/* AI Academic Companion Widget */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-[#111B5E] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-yellow-300 text-xl">auto_awesome</span>
              <h3 className="text-base font-black text-white">ExcelMind AI Tutor</h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Have doubts on quadratic equations, redox balancing, or physics vectors? Get step-by-step explanations instantly.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigate('ai_tutor')}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-xs text-white transition flex items-center justify-between group"
              >
                <span>"Explain quadratic equations"</span>
                <span className="material-symbols-outlined text-xs text-blue-300 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigate('ai_tutor')}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-xs text-white transition flex items-center justify-between group"
              >
                <span>"Generate 7-day study timetable"</span>
                <span className="material-symbols-outlined text-xs text-blue-300 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('ai_tutor')}
              className="w-full mt-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow transition"
            >
              Launch ExcelMind AI Tutor
            </button>
          </div>

          {/* Recent CBT Mock Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Active CBT Simulation
              </span>
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold">
                WAEC Standard
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
              WAEC SSSCE Mathematics National Standard Mock 2025
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              15 Questions • 45 Minutes • Auto-Marking with WAEC Grading
            </p>
            <button
              onClick={() => {
                onSelectExam?.(CBT_EXAMS_DATA[0].exam_id);
                onNavigate('cbt');
              }}
              className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              <span>Start Examination Engine</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
