import React from 'react';
import { ImageUploader } from './ImageUploader';

interface TeacherItem {
  id?: number;
  name: string;
  role?: string;
  subject?: string;
  department?: string;
  photo?: string;
  phone?: string;
  whatsapp?: string;
}

interface TeacherPassportCardProps {
  classTeacher?: TeacherItem;
  subjectTeachers?: TeacherItem[];
  canEdit?: boolean;
}

export const TeacherPassportCard: React.FC<TeacherPassportCardProps> = ({
  classTeacher,
  subjectTeachers = [],
  canEdit = true
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600">
            <span className="material-symbols-outlined text-2xl">school</span>
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Teaching Staff Assigned
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned form master and certified subject specialist instructors
            </p>
          </div>
        </div>
      </div>

      {/* 1. CLASS TEACHER PROMINENT CARD */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-indigo-950/40 rounded-2xl p-5 border border-blue-200/60 dark:border-blue-900/40 flex flex-col sm:flex-row items-center gap-5">
        
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700 flex-shrink-0">
          <img
            src={classTeacher?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
            alt="Class Teacher Passport"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
            }}
          />
          <div className="absolute bottom-1 right-1 p-1 bg-amber-500 text-slate-950 rounded-full" title="Form Master / Class Teacher">
            <span className="material-symbols-outlined text-xs block">star</span>
          </div>
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="inline-block px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] uppercase">
            Official Class Teacher / Form Master
          </div>
          <h4 className="text-base font-black text-slate-900 dark:text-white">
            {classTeacher?.name || 'Mr. David Okoro'}
          </h4>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {classTeacher?.role || 'Senior Mathematics Instructor & SS2 Form Head'}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-blue-600">call</span>
              {classTeacher?.phone || '+2348031122334'}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
              WhatsApp Available
            </span>
          </div>
        </div>

        {canEdit && (
          <div className="flex-shrink-0">
            <ImageUploader
              label="Update Passport"
              imageType="teacher_passport"
              teacherId={classTeacher?.id || 1}
              currentImage={classTeacher?.photo}
            />
          </div>
        )}

      </div>

      {/* 2. SUBJECT INSTRUCTORS GRID */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">menu_book</span>
          Specialized Subject Teachers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(subjectTeachers.length > 0 ? subjectTeachers : [
            { id: 1, name: 'Mrs. Grace Ade', subject: 'Physics', department: 'Physical Sciences', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', phone: '+2348022334455' },
            { id: 2, name: 'Dr. Chinedu Eze', subject: 'Chemistry', department: 'Chemical Sciences', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', phone: '+2348033445566' },
            { id: 3, name: 'Mrs. Funke Balogun', subject: 'English Language', department: 'Humanities & Languages', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', phone: '+2348044556677' },
            { id: 4, name: 'Mr. Emmanuel Bello', subject: 'Biology', department: 'Life Sciences', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', phone: '+2348055667788' },
            { id: 5, name: 'Mrs. Nkechi Okafor', subject: 'Financial Accounting', department: 'Commercial & Business', photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400', phone: '+2348066778899' },
            { id: 6, name: 'Mr. Paul Danjuma', subject: 'Data Processing', department: 'Computing & IT', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400', phone: '+2348077889900' }
          ]).map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3.5 hover:shadow-md transition"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                <img
                  src={t.photo || `https://images.unsplash.com/photo-${1500000000000 + idx * 50000}?w=400`}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  {t.subject}
                </span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {t.name}
                </h5>
                <p className="text-[10px] text-slate-500 truncate">
                  {t.department}
                </p>
                <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 pt-0.5">
                  {t.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
