import React, { useState } from 'react';
import { COURSES_DATA, CBT_EXAMS_DATA } from '../../data/excelmindData';
import { AcademicRecordsCentreView } from './AcademicRecordsCentreView';
import { StudentDirectory } from '../directory/StudentDirectory';

export const AdminPortalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'directory' | 'academic_centre' | 'classes' | 'exams' | 'reports'>('academic_centre');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleUsers = [
    { id: 'EXM-2025-0842', name: 'John Doe', role: 'Student', class: 'SSS 3 Gold', status: 'Active' },
    { id: 'EXM-2025-0843', name: 'Chidinma Eze', role: 'Student', class: 'SSS 3 Gold', status: 'Active' },
    { id: 'EXM-2025-0844', name: 'Abdulrahman Bello', role: 'Student', class: 'SSS 3 Silver', status: 'Active' },
    { id: 'TCH-001', name: 'Dr. Kenneth Okon', role: 'Teacher', class: 'Physics / SSS 3', status: 'Active' },
    { id: 'TCH-002', name: 'Mrs. Folashade Adeleke', role: 'Teacher', class: 'Maths / SSS 3', status: 'Active' },
    { id: 'PRT-9021', name: 'Engr. Michael Doe', role: 'Parent', class: 'Ward: John Doe', status: 'Active' }
  ];

  const filteredUsers = sampleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#111B5E] to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-amber-300">
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                Institutional Administration & Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ExcelMind Institutional Administration
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Configure curriculum structures, schedule school-wide examinations, manage role-based user directory permissions, and oversee institutional quality metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-bold text-white block">Vice Principal Academic</span>
              <span className="text-xs text-amber-300 font-medium">Registry & Board Admin</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              VP
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Enrolled Students</span>
          <p className="text-3xl font-black text-[#111B5E] dark:text-blue-300 mt-1">428</p>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">Across SSS 1 - SSS 3</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Faculty Teachers</span>
          <p className="text-3xl font-black text-amber-600 mt-1">36</p>
          <span className="text-xs font-bold text-slate-500 mt-1 block">Full-time Certified</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Active CBT Sessions</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{CBT_EXAMS_DATA.length}</p>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">WAEC / JAMB Mocks</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Institutional GPA</span>
          <p className="text-3xl font-black text-blue-600 mt-1">78.4%</p>
          <span className="text-xs font-bold text-slate-500 mt-1 block">+4.2% Growth</span>
        </div>
      </div>

      {/* Admin Action Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'academic_centre', label: 'Academic Records Centre', icon: 'school' },
          { id: 'directory', label: 'Digital Student Directory & Passports', icon: 'badge' },
          { id: 'users', label: 'User Directory (Students/Teachers)', icon: 'group' },
          { id: 'classes', label: 'Classes & Curriculum', icon: 'account_tree' },
          { id: 'exams', label: 'CBT Examination Schedules', icon: 'event' },
          { id: 'reports', label: 'School Performance Reports', icon: 'summarize' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#111B5E] text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB: ACADEMIC RECORDS CENTRE */}
      {activeTab === 'academic_centre' && (
        <AcademicRecordsCentreView currentRole="admin" />
      )}

      {/* TAB: STUDENT DIRECTORY & PASSPORT IDENTITIES */}
      {activeTab === 'directory' && (
        <StudentDirectory onNavigateToRegistration={() => setActiveTab('academic_centre')} />
      )}

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Institutional User Directory
              </h3>
              <p className="text-xs text-slate-500">Manage credentials, enrollments, and roles</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search user name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-48 sm:w-64"
              />
              <button
                onClick={() => alert('Add User Modal Opened')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer whitespace-nowrap"
              >
                + Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Full Name</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Class / Allocation</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-600">{u.id}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{u.class}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => alert(`Editing user: ${u.name}`)}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLASSES & CURRICULUM */}
      {activeTab === 'classes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            Departments & Class Arms
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Senior School 3 (SSS 3)', arms: '3 Arms (Gold, Silver, Bronze)', students: 124, lead: 'Dr. Kenneth Okon' },
              { name: 'Senior School 2 (SSS 2)', arms: '3 Arms (Gold, Silver, Bronze)', students: 148, lead: 'Mrs. Folashade Adeleke' },
              { name: 'Senior School 1 (SSS 1)', arms: '4 Arms (Alpha, Beta, Gamma, Delta)', students: 156, lead: 'Mr. David Adeyemi' }
            ].map((cls, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{cls.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{cls.arms}</p>
                <p className="text-xs font-mono font-bold text-blue-600 mt-2">{cls.students} Students</p>
                <p className="text-[11px] text-slate-400 mt-1">Lead Tutor: {cls.lead}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CBT EXAMS */}
      {activeTab === 'exams' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            Scheduled CBT Examination Engines
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {CBT_EXAMS_DATA.map((ex) => (
              <div key={ex.exam_id} className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                    {ex.examBody} • {ex.year}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-0.5">{ex.title}</h4>
                  <p className="text-[11px] text-slate-400">
                    {ex.totalQuestions} Questions • {ex.durationMinutes} Minutes
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                  Active in Lab
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            Institutional Audit & Accreditation Reports
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">WAEC / NECO Readiness Audit 2025</h4>
              <p className="text-slate-500 mt-1">
                98.4% of SSS 3 candidates projected to achieve minimum 5 credits including Mathematics & English Language.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">JAMB UTME Simulation Aggregate</h4>
              <p className="text-slate-500 mt-1">
                Average mock score: 284.2/400. Highest recorded score: 358/400.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
