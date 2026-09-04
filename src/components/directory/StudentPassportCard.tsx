import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';

interface StudentPassportCardProps {
  student: {
    id: number;
    user_id?: number;
    full_name: string;
    admission_number: string;
    class_name?: string;
    department?: string;
    academic_session?: string;
    school?: string;
    student_passport?: string;
    photo?: string;
    gender?: string;
  };
  onPassportUpdated?: (newUrl: string) => void;
  canEdit?: boolean;
}

export const StudentPassportCard: React.FC<StudentPassportCardProps> = ({
  student,
  onPassportUpdated,
  canEdit = true
}) => {
  const [passportUrl, setPassportUrl] = useState<string>(
    student.student_passport || student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  );

  const handleUploadSuccess = (newUrl: string) => {
    setPassportUrl(newUrl);
    onPassportUpdated?.(newUrl);
  };

  return (
    <div className="relative bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-center max-w-sm mx-auto">
      
      {/* Institutional Top Crest Bar */}
      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500"></div>

      <div className="pt-2 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="material-symbols-outlined text-amber-500 text-xl">verified</span>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {student.school || 'ExcelMind Academy'}
          </h2>
        </div>
        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
          Official Digital Student Identity Card
        </p>
      </div>

      {/* Passport Photo Area */}
      <div className="py-6 flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 ring-4 ring-blue-500/20 bg-slate-200 dark:bg-slate-800">
            <img
              src={passportUrl}
              alt={student.full_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback on broken image
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
              }}
            />
          </div>

          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md border-2 border-white dark:border-slate-900" title="Identity Verified">
            <span className="material-symbols-outlined text-sm block">verified_user</span>
          </div>
        </div>

        {canEdit && (
          <div className="mt-4">
            <ImageUploader
              label="Upload Student Passport"
              imageType="student_passport"
              studentId={student.id}
              userId={student.user_id}
              currentImage={passportUrl}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        )}
      </div>

      {/* Structured Student Data Section */}
      <div className="space-y-2.5 text-left bg-slate-100/70 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            {student.full_name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission Number:</span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {student.admission_number}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class:</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {student.class_name || 'SS2 Science'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department:</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {student.department || 'Sciences'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Session:</span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              {student.academic_session || '2026/2027'}
            </span>
          </div>
        </div>
      </div>

      {/* Barcode / NFC Card Footer */}
      <div className="mt-5 pt-3 border-t border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-between text-slate-400 text-[10px] font-mono">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">barcode_scanner</span>
          ID-{student.admission_number}
        </span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
          Status: ACTIVE
        </span>
      </div>

    </div>
  );
};
