import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';

interface ParentGuardianData {
  father?: {
    name: string;
    photo?: string;
    phone?: string;
    occupation?: string;
    email?: string;
  };
  mother?: {
    name: string;
    photo?: string;
    phone?: string;
    occupation?: string;
    email?: string;
  };
  guardian?: {
    name: string;
    photo?: string;
    phone?: string;
    relationship?: string;
  };
}

interface ParentPassportCardProps {
  studentId: number;
  parentId?: number;
  parentsData?: ParentGuardianData;
  canEdit?: boolean;
}

export const ParentPassportCard: React.FC<ParentPassportCardProps> = ({
  studentId,
  parentId,
  parentsData,
  canEdit = true
}) => {
  const [fatherPhoto, setFatherPhoto] = useState(
    parentsData?.father?.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
  );
  const [motherPhoto, setMotherPhoto] = useState(
    parentsData?.mother?.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  );
  const [guardianPhoto, setGuardianPhoto] = useState(
    parentsData?.guardian?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600">
            <span className="material-symbols-outlined text-2xl">family_restroom</span>
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Parent & Guardian Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified legal sponsor photographs and primary contact telephone lines
            </p>
          </div>
        </div>
      </div>

      {/* Grid for Father, Mother, Guardian */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. FATHER PROFILE */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60">
            Primary Father / Sponsor
          </span>

          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700">
            <img
              src={fatherPhoto}
              alt="Father Passport"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400';
              }}
            />
          </div>

          <div className="space-y-1 w-full text-left bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {parentsData?.father?.name || 'Mr. John Smith'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Phone:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {parentsData?.father?.phone || '+2348023456789'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Occupation:</span>
              <span className="text-slate-600 dark:text-slate-400">
                {parentsData?.father?.occupation || 'Senior Civil Engineer'}
              </span>
            </div>
          </div>

          {canEdit && (
            <ImageUploader
              label="Upload Father Passport"
              imageType="father_passport"
              studentId={studentId}
              parentId={parentId}
              currentImage={fatherPhoto}
              onUploadSuccess={(url) => setFatherPhoto(url)}
            />
          )}
        </div>

        {/* 2. MOTHER PROFILE */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60">
            Mother / Co-Guardian
          </span>

          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700">
            <img
              src={motherPhoto}
              alt="Mother Passport"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400';
              }}
            />
          </div>

          <div className="space-y-1 w-full text-left bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {parentsData?.mother?.name || 'Mrs. Mary Smith'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Phone:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {parentsData?.mother?.phone || '+2348034567890'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Occupation:</span>
              <span className="text-slate-600 dark:text-slate-400">
                {parentsData?.mother?.occupation || 'Senior Consultant Pharmacist'}
              </span>
            </div>
          </div>

          {canEdit && (
            <ImageUploader
              label="Upload Mother Passport"
              imageType="mother_passport"
              studentId={studentId}
              parentId={parentId}
              currentImage={motherPhoto}
              onUploadSuccess={(url) => setMotherPhoto(url)}
            />
          )}
        </div>

        {/* 3. GUARDIAN / EMERGENCY CONTACT */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60">
            Designated Guardian
          </span>

          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700">
            <img
              src={guardianPhoto}
              alt="Guardian Passport"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
              }}
            />
          </div>

          <div className="space-y-1 w-full text-left bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {parentsData?.guardian?.name || 'Dr. Babatunde Alabi'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Phone:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {parentsData?.guardian?.phone || '+2348098765432'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Relationship:</span>
              <span className="text-slate-600 dark:text-slate-400">
                {parentsData?.guardian?.relationship || 'Uncle / Legal Representative'}
              </span>
            </div>
          </div>

          {canEdit && (
            <ImageUploader
              label="Upload Guardian Passport"
              imageType="guardian_passport"
              studentId={studentId}
              parentId={parentId}
              currentImage={guardianPhoto}
              onUploadSuccess={(url) => setGuardianPhoto(url)}
            />
          )}
        </div>

      </div>

    </div>
  );
};
