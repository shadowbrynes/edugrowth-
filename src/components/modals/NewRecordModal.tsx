import React, { useState } from 'react';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (type: string, name: string, detail: string) => void;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({ isOpen, onClose, onAddRecord }) => {
  const [recordType, setRecordType] = useState<'student' | 'teacher' | 'attendance'>('student');
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [gradeOrDept, setGradeOrDept] = useState('Grade 10 - Alpha');
  const [gpaOrScore, setGpaOrScore] = useState('3.80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    onAddRecord(
      recordType,
      fullName,
      recordType === 'student' ? `ID: #${idNumber || 'ST-9999'} • ${gradeOrDept}` : `Dept: ${gradeOrDept}`
    );
    setFullName('');
    setIdNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 bg-primary-container text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed">add_circle</span>
            <div>
              <h3 className="text-lg font-bold">Create New Institutional Record</h3>
              <p className="text-xs text-on-primary-container">Academic Term 2023-2024</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Record Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRecordType('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${recordType === 'student' ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">school</span>
                Student
              </button>
              <button
                type="button"
                onClick={() => setRecordType('teacher')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${recordType === 'teacher' ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">badge</span>
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setRecordType('attendance')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${recordType === 'attendance' ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">event_available</span>
                Attendance Log
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              {recordType === 'student' ? 'Student Full Name' : recordType === 'teacher' ? 'Faculty Member Name' : 'Log Title'}
            </label>
            <input
              type="text"
              required
              placeholder={recordType === 'student' ? "e.g., Samantha Brooke" : recordType === 'teacher' ? "e.g., Prof. Robert Vance" : "e.g., Term Attendance Audit"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                {recordType === 'student' ? 'Student ID Number' : 'Employee ID'}
              </label>
              <input
                type="text"
                placeholder="ST-9104"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                {recordType === 'student' ? 'Assigned Class' : 'Department / Subject'}
              </label>
              <input
                type="text"
                value={gradeOrDept}
                onChange={(e) => setGradeOrDept(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
            </div>
          </div>

          {recordType === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Initial GPA (4.0 Scale)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5.0"
                value={gpaOrScore}
                onChange={(e) => setGpaOrScore(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
              />
            </div>
          )}

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              Commit Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
