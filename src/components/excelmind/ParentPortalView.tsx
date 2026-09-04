import React, { useState } from 'react';
import { StudentProfile } from '../../types/excelmind';
import { CURRENT_STUDENT, SUBJECT_RESULTS_DATA } from '../../data/excelmindData';
import { ParentCommunication } from '../communication/ParentCommunication';

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
  const [selectedChildTab, setSelectedChildTab] = useState<'overview' | 'attendance' | 'fees' | 'teachers'>('overview');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#111B5E] to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-purple-300">
                <span className="material-symbols-outlined text-2xl">family_restroom</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                Guardian & Parent Oversight Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Parent Academic Monitoring Center
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Real-time surveillance of student cognitive progression, daily biometric attendance verification, institutional fee clearance, and teacher hotline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-bold text-white block">Engr. Michael Doe</span>
              <span className="text-xs text-purple-300 font-medium">Verified Parent / Guardian ID</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              MD
            </div>
          </div>
        </div>
      </div>

      {/* Ward Profile Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{student.name}</h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {student.class}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Student ID: <span className="font-mono font-bold">{student.student_id}</span> • {student.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToResults}
            className="px-4 py-2 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">description</span>
            <span>View Full Term Transcript</span>
          </button>
          <button
            onClick={onNavigateToMessages}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Contact Class Tutor</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Academic Average</span>
          <p className="text-3xl font-black text-[#111B5E] dark:text-blue-300 mt-1">{student.overallScore}%</p>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">WAEC A1 Distinction</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Class Rank</span>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            3rd <span className="text-xs text-slate-400">of {student.totalInClass}</span>
          </p>
          <span className="text-xs font-bold text-slate-500 mt-1 block">Top 7th Percentile</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Term Attendance</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{student.attendanceRate}%</p>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">47/50 Days Certified</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Tuition & Portal</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">Cleared</p>
          <span className="text-xs font-bold text-slate-500 mt-1 block">Receipt #TRM-2025-992</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Academic Standing', icon: 'grade' },
          { id: 'attendance', label: 'Daily Attendance Calendar', icon: 'event_available' },
          { id: 'fees', label: 'Bursary & Fee Clearance', icon: 'receipt_long' },
          { id: 'teachers', label: 'Teacher Remarks & Hotline', icon: 'contact_phone' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedChildTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              selectedChildTab === tab.id
                ? 'bg-[#111B5E] text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ACADEMIC STANDING */}
      {selectedChildTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Current Subject Breakdown for John Doe
            </h3>
            <span className="text-xs font-mono text-slate-400 font-bold">Term 1 Evaluation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBJECT_RESULTS_DATA.map((res, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{res.subject}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instructor: {res.teacher}</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">"{res.teacher_comment}"</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black font-mono text-[#111B5E] dark:text-blue-400">
                    {res.totalScore}%
                  </span>
                  <span className="block text-xs font-mono font-bold text-emerald-600">{res.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE CALENDAR */}
      {selectedChildTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Term Biometric Attendance Record (94% Rate)
            </h3>
            <p className="text-xs text-slate-500">47 Days Present • 2 Days Excused Sick Leave • 1 Day School Sports Event</p>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
            <div>
              <span className="font-bold">Full Exam Clearance Qualified:</span> Minimum attendance required for WAEC/NECO center validation is 80%. John Doe has comfortably satisfied this requirement with 94%.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEES & BURSARY */}
      {selectedChildTab === 'fees' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            Tuition Fees & Examination Levy Invoices
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {[
              { title: 'Term 1 Tuition & Laboratory Practical Levy', amount: '₦ 450,000', status: 'Paid in Full', date: 'Sept 04, 2025' },
              { title: 'WAEC National SSCE Registration & Center Fee', amount: '₦ 65,000', status: 'Paid in Full', date: 'Sept 12, 2025' },
              { title: 'JAMB UTME CBT Mock Simulation License', amount: '₦ 15,000', status: 'Paid in Full', date: 'Sept 18, 2025' }
            ].map((inv, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-slate-100">{inv.title}</h4>
                  <span className="text-[11px] text-slate-400">Processed: {inv.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm">{inv.amount}</span>
                  <span className="block text-[10px] text-emerald-600 font-bold uppercase">{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEACHER HOTLINE & COMMUNICATION HUB */}
      {selectedChildTab === 'teachers' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Parent–Teacher Direct Communication Hub
            </h3>
            <p className="text-xs text-slate-500">
              Direct access to call teachers, chat on WhatsApp, or send in-app private messages linked to {student.name}.
            </p>
          </div>

          <ParentCommunication
            studentName={student.name}
            className={student.class}
            admissionNo={student.student_id}
          />
        </div>
      )}

    </div>
  );
};
