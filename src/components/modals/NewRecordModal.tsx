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
  const [gradeOrDept, setGradeOrDept] = useState('SS 2 - Science Alpha');
  const [avgScore, setAvgScore] = useState('85.5');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [gender, setGender] = useState('Male');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    onAddRecord(
      recordType,
      fullName,
      recordType === 'student'
        ? `ID: #${idNumber || 'ST-2023-01'} • ${gradeOrDept} • Avg: ${avgScore}% • Parent: ${parentName || 'N/A'} (${parentPhone || 'No contact'})`
        : `Dept: ${gradeOrDept}`
    );
    setFullName('');
    setIdNumber('');
    setParentName('');
    setParentPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 bg-secondary text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl font-bold">how_to_reg</span>
            <div>
              <h3 className="text-lg font-bold">Secondary School Student & Staff Registration Form</h3>
              <p className="text-xs text-secondary-fixed">Academic Session 2023/2024</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-full border-none bg-transparent cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Registration Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRecordType('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${recordType === 'student' ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">school</span>
                Student
              </button>
              <button
                type="button"
                onClick={() => setRecordType('teacher')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${recordType === 'teacher' ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">badge</span>
                Subject Teacher
              </button>
              <button
                type="button"
                onClick={() => setRecordType('attendance')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${recordType === 'attendance' ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-sm">event_available</span>
                Attendance Log
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              {recordType === 'student' ? 'Student Full Name (Surname First)' : recordType === 'teacher' ? 'Teacher Full Name' : 'Log Title'}
            </label>
            <input
              type="text"
              required
              placeholder={recordType === 'student' ? "e.g., Sterling, Alexander J." : recordType === 'teacher' ? "e.g., Mrs. Sarah Jenkins" : "e.g., Term Attendance Audit"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                {recordType === 'student' ? 'Admission / Reg Number' : 'Staff Staff ID'}
              </label>
              <input
                type="text"
                placeholder="ST-2023-089"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                {recordType === 'student' ? 'Class & Arm' : 'Subject Department'}
              </label>
              <input
                type="text"
                value={gradeOrDept}
                onChange={(e) => setGradeOrDept(e.target.value)}
                placeholder="e.g. SS 2 Science A / JSS 1 Gold"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
            </div>
          </div>

          {recordType === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Overall Average Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={avgScore}
                    onChange={(e) => setAvgScore(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Chief Marcus Sterling"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Parent WhatsApp Phone</label>
                  <input
                    type="text"
                    placeholder="+2348012345678"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
                  />
                </div>
              </div>
            </>
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
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 transition-all flex items-center gap-1.5 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Document & Save Student Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

