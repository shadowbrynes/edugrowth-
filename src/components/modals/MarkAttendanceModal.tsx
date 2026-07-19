import React, { useState } from 'react';

interface StudentAttendance {
  id: string;
  name: string;
  initials: string;
  status: 'present' | 'absent' | 'late';
}

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  onSaveAttendance: (presentCount: number, total: number) => void;
}

const SAMPLE_STUDENTS: StudentAttendance[] = [
  { id: '1', name: 'Alice Lundberg', initials: 'AL', status: 'present' },
  { id: '2', name: 'Marcus Brown', initials: 'MB', status: 'present' },
  { id: '3', name: 'Kevin Chen', initials: 'KC', status: 'present' },
  { id: '4', name: 'Sophia Patel', initials: 'SP', status: 'present' },
  { id: '5', name: 'Elena Martinez', initials: 'EM', status: 'absent' },
  { id: '6', name: 'James Wilson', initials: 'JW', status: 'late' },
  { id: '7', name: 'Alexander Sterling', initials: 'AS', status: 'present' },
  { id: '8', name: 'David Rossi', initials: 'DR', status: 'present' },
];

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({ isOpen, onClose, classNameTitle, onSaveAttendance }) => {
  const [students, setStudents] = useState<StudentAttendance[]>(SAMPLE_STUDENTS);

  if (!isOpen) return null;

  const toggleStatus = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const presentCount = students.filter(s => s.status === 'present' || s.status === 'late').length;

  const handleSave = () => {
    onSaveAttendance(presentCount, students.length);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-6 bg-secondary text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
            <div>
              <h3 className="text-lg font-bold">Mark Daily Attendance</h3>
              <p className="text-xs text-secondary-fixed">{classNameTitle} • Oct 24, 2023</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Bulk Action Bar */}
        <div className="p-4 bg-surface border-b border-outline-variant flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span>Quick Mark All:</span>
            <button onClick={() => markAll('present')} className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg hover:opacity-90 font-bold">
              Present
            </button>
            <button onClick={() => markAll('late')} className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-lg hover:opacity-90 font-bold">
              Late
            </button>
            <button onClick={() => markAll('absent')} className="px-3 py-1 bg-error-container text-on-error-container rounded-lg hover:opacity-90 font-bold">
              Absent
            </button>
          </div>
          <div className="font-mono bg-surface-container px-3 py-1 rounded-lg">
            Present: <strong className="text-secondary">{presentCount}</strong> / {students.length}
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 custom-scrollbar bg-background">
          {students.map(st => (
            <div key={st.id} className="bg-white p-3.5 rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                  {st.initials}
                </div>
                <span className="text-sm font-bold text-on-surface">{st.name}</span>
              </div>

              <div className="flex gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/50">
                <button
                  onClick={() => toggleStatus(st.id, 'present')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${st.status === 'present' ? 'bg-tertiary-container text-tertiary-fixed shadow-sm' : 'text-on-surface-variant hover:bg-white'}`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                  Present
                </button>
                <button
                  onClick={() => toggleStatus(st.id, 'late')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${st.status === 'late' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-white'}`}
                >
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  Late
                </button>
                <button
                  onClick={() => toggleStatus(st.id, 'absent')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${st.status === 'absent' ? 'bg-error text-white shadow-sm' : 'text-on-surface-variant hover:bg-white'}`}
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-surface-container border-t border-outline-variant flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            Submit Class Attendance
          </button>
        </div>
      </div>
    </div>
  );
};
