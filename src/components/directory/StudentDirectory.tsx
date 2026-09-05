import React, { useState, useEffect } from 'react';
import { imageApi, resolveImageUrl } from '../../services/api';
import { ProfileViewer } from './ProfileViewer';
import { ImageUploader } from './ImageUploader';

export interface DirectoryStudent {
  id: number | string;
  user_id?: number;
  full_name: string;
  admission_number: string;
  student_passport: string;
  class: string;
  department: string;
  parent_name: string;
  parent_phone: string;
  parent_photo?: string;
  status: string;
}

interface StudentDirectoryProps {
  onNavigateToRegistration?: () => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({ onNavigateToRegistration }) => {
  const [students, setStudents] = useState<DirectoryStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Selected student for ProfileViewer modal
  const [selectedStudentId, setSelectedStudentId] = useState<number | string | null>(null);

  // Selected student for quick Passport Photo upload modal
  const [uploadStudentTarget, setUploadStudentTarget] = useState<{ id: number; name: string } | null>(null);

  // Database Connection Tracking
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [dbErrorMessage, setDbErrorMessage] = useState<string | null>(null);

  // Fallback demo dataset if offline / connecting
  const fallbackDirectory: DirectoryStudent[] = [
    {
      id: 1,
      full_name: 'John Doe',
      admission_number: 'EXM-2025-0842',
      student_passport: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      class: 'SS3 Science',
      department: 'Sciences',
      parent_name: 'Engr. Michael Doe',
      parent_phone: '+2348023456789',
      parent_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      status: 'active'
    },
    {
      id: 2,
      full_name: 'Mary James',
      admission_number: 'EXM-2025-0843',
      student_passport: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      class: 'SS3 Science',
      department: 'Sciences',
      parent_name: 'Dr. (Mrs.) James',
      parent_phone: '+2348034567890',
      parent_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      status: 'active'
    },
    {
      id: 3,
      full_name: 'Peter Smith',
      admission_number: 'EXM-2025-0844',
      student_passport: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      class: 'SS3 Commercial',
      department: 'Commercial',
      parent_name: 'Alhaji Bello Smith',
      parent_phone: '+2348045678901',
      parent_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      status: 'active'
    }
  ];

  const fetchDirectory = async () => {
    setLoading(true);
    setDbErrorMessage(null);
    try {
      const res = await imageApi.getDirectory({
        search: search.trim() || undefined,
        classLevel: classFilter !== 'All' ? classFilter : undefined,
        department: deptFilter !== 'All' ? deptFilter : undefined
      });

      if (res.success && res.data?.directory) {
        setStudents(res.data.directory);
        setDbStatus('connected');
      } else {
        setDbStatus('disconnected');
        setDbErrorMessage(res.error || 'Failed to query MySQL student directory. Verify node server.js is running.');
        setStudents(fallbackDirectory);
      }
    } catch (err: any) {
      console.warn('Student directory fetch notice:', err);
      setDbStatus('disconnected');
      setDbErrorMessage(err.message || 'MySQL database unreachable');
      setStudents(fallbackDirectory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDirectory();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, classFilter, deptFilter]);

  const passportCount = students.filter(s => s.student_passport && !s.student_passport.includes('default')).length;
  const coveragePercent = students.length > 0 ? Math.round((passportCount / students.length) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1544] via-[#111B5E] to-[#1e2f97] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-blue-300">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                MySQL Digital Identity Registry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Directory & Passport Profiles
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
              Comprehensive institutional directory linking student biometric passport photographs with registered parents/guardians, form masters, subject specialists, and emergency responders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToRegistration && (
              <button
                onClick={onNavigateToRegistration}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#111B5E] font-bold text-xs shadow hover:bg-blue-50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                <span>Register Student</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Directory</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-blue-200 block">Total Students</span>
            <span className="text-xl sm:text-2xl font-black text-white">{students.length}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-blue-200 block">Passports Verified</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{coveragePercent}%</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-blue-200 block">Active Classes</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">SS1 - SS3</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-blue-200 block">Database Status</span>
            <span className={`text-sm sm:text-base font-black flex items-center gap-1.5 mt-1 ${dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {dbStatus === 'connected' ? 'MySQL Connected' : 'Offline Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Database Error Banner (Step 12) */}
      {dbErrorMessage && (
        <div className="p-4 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 rounded-2xl border border-rose-300 dark:border-rose-800 text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">database</span>
          <span>Database Connection Notice: {dbErrorMessage}. Showing offline snapshot.</span>
        </div>
      )}

      {/* 2. Search, Filter & View Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search student name, admission number (e.g. EXM-2025)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filters and View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 px-2">Class:</span>
            {['All', 'SS1', 'SS2', 'SS3'].map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  classFilter === cls
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 px-2">Dept:</span>
            {['All', 'Sciences', 'Commercial', 'Arts'].map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deptFilter === dept
                    ? 'bg-[#111B5E] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <span className="material-symbols-outlined text-lg">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Students Display Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Querying MySQL Digital Student Directory...
          </p>
          <p className="text-xs text-slate-400">Loading verified passport photographs & profile records</p>
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-3">
            person_search
          </span>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Students Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No student profile matched your search query or selected class/department filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setClassFilter('All');
              setDeptFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold hover:bg-blue-100"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: Rich Card Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Header with School ID Badge style */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Square 1:1 Passport Photo Frame */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800">
                      <img
                        key={student.student_passport}
                        src={resolveImageUrl(student.student_passport)}
                        alt={student.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('unsplash')) {
                            target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                          }
                        }}
                      />
                      <button
                        onClick={() => setUploadStudentTarget({ id: Number(student.id), name: student.full_name })}
                        title="Upload/Replace Passport"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                      </button>
                    </div>

                    {/* Student Identity Basics */}
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                        {student.full_name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {student.admission_number}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {student.class}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {student.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 capitalize shrink-0">
                    {student.status || 'Active'}
                  </span>
                </div>

                {/* Parent / Guardian Link Section */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        student.parent_photo ||
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
                      }
                      alt={student.parent_name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Parent / Guardian</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {student.parent_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {student.parent_phone && (
                      <a
                        href={`tel:${student.parent_phone}`}
                        title={`Call ${student.parent_phone}`}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 border border-slate-200 dark:border-slate-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                      </a>
                    )}
                    {student.parent_phone && (
                      <a
                        href={`https://wa.me/${student.parent_phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Chat on WhatsApp"
                        className="p-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setUploadStudentTarget({ id: Number(student.id), name: student.full_name })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_a_photo</span>
                  <span>Passport</span>
                </button>

                <button
                  onClick={() => setSelectedStudentId(student.id)}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#111B5E] text-white text-xs font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>View Digital Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-mono font-bold">
                <tr>
                  <th className="py-3.5 px-4">Passport & Student</th>
                  <th className="py-3.5 px-4">Admission No</th>
                  <th className="py-3.5 px-4">Class & Dept</th>
                  <th className="py-3.5 px-4">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Parent Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          key={student.student_passport}
                          src={resolveImageUrl(student.student_passport)}
                          alt={student.full_name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('unsplash')) {
                              target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                            }
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {student.full_name}
                          </span>
                          <span className="text-[11px] text-slate-400">ExcelMind Scholar</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {student.admission_number}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{student.class}</span>
                      <span className="text-[11px] text-slate-400 block">{student.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            student.parent_photo ||
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
                          }
                          alt={student.parent_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{student.parent_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {student.parent_phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setUploadStudentTarget({ id: Number(student.id), name: student.full_name })}
                          title="Upload Passport"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">photo_camera</span>
                        </button>
                        <button
                          onClick={() => setSelectedStudentId(student.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#111B5E] text-white font-bold hover:bg-blue-900 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">badge</span>
                          <span>Profile</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL: Full Digital Identity Profile Viewer */}
      {selectedStudentId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl my-auto">
            <ProfileViewer
              studentId={selectedStudentId}
              canEdit={true}
              onClose={() => {
                setSelectedStudentId(null);
                fetchDirectory();
              }}
            />
          </div>
        </div>
      )}

      {/* 5. MODAL: Quick Passport Upload & Crop Tool */}
      {uploadStudentTarget && (
        <ImageUploader
          targetType="student_passport"
          studentId={uploadStudentTarget.id}
          title={`Upload Passport for ${uploadStudentTarget.name}`}
          currentImage={students.find(s => Number(s.id) === uploadStudentTarget.id)?.student_passport}
          onSuccess={(url) => {
            setStudents(prev =>
              prev.map(s => (Number(s.id) === uploadStudentTarget.id ? { ...s, student_passport: url } : s))
            );
            setUploadStudentTarget(null);
          }}
          onClose={() => setUploadStudentTarget(null)}
        />
      )}
    </div>
  );
};
