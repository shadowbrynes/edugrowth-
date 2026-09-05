import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../../types/excelmind';
import { CURRENT_STUDENT } from '../../data/excelmindData';
import { ImageUploader } from '../directory/ImageUploader';
import { resolveImageUrl } from '../../services/api';

interface ProfileSettingsViewProps {
  student?: StudentProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  student = CURRENT_STUDENT,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    const savedUser = localStorage.getItem('excelmind_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.student_passport || u.photo || u.profile_image) {
          return resolveImageUrl(u.student_passport || u.photo || u.profile_image);
        }
      } catch (e) {}
    }
    return resolveImageUrl(student.avatar);
  });
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [cbtCountdownSounds, setCbtCountdownSounds] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-blue-300">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Student Identity & System Preferences
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Profile, ID Card & Security Settings
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Manage your biometric digital ID, guardian emergency contacts, notifications, and security credentials.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>Your profile preferences and notification settings have been updated.</span>
        </div>
      )}

      {/* Grid: Digital ID Card + Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Digital ID Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#111B5E] via-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center font-bold">
                  🎓
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight">EXCELMIND ACADEMY</h4>
                  <p className="text-[10px] text-blue-200">Official Student Identity Card</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                key={avatarUrl}
                src={avatarUrl}
                alt={student.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('unsplash')) {
                    target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                  }
                }}
              />
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">{student.name}</h3>
                <p className="text-xs text-blue-200">{student.class}</p>
                <p className="text-[11px] font-mono text-indigo-300 font-bold">ID: {student.student_id}</p>
                <p className="text-[10px] text-slate-300">{student.department}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between bg-white/5 rounded-2xl p-2.5 border border-white/10">
              <span className="text-[11px] text-indigo-200 font-medium">Update Passport Photograph:</span>
              <ImageUploader
                label="Change Photo"
                imageType="student_passport"
                studentId={1}
                currentImage={avatarUrl}
                onUploadSuccess={(newUrl) => {
                  setAvatarUrl(newUrl);
                }}
              />
            </div>

            <div className="pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-[11px] text-indigo-200">
              <div>
                <span className="text-[10px] text-indigo-300/70 block">Academic Session</span>
                <span className="font-bold text-white">{student.academicSession}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300/70 block">Guardian / Parent</span>
                <span className="font-bold text-white">{student.parentName}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="w-full bg-white/10 rounded-xl py-2 px-3 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-400">fingerprint</span>
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest">
                  Biometric RFID Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Settings Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            System Preferences & Alerts
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            
            {/* Toggles */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Dark Mode Interface</h4>
                  <p className="text-slate-500">Toggle dark / light application theme</p>
                </div>
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className={`w-12 h-6 rounded-full transition p-1 cursor-pointer ${
                    isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Push & Email Notifications</h4>
                  <p className="text-slate-500">Receive alerts when assignments are graded or mock exams are posted</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">SMS Guardian Alerts</h4>
                  <p className="text-slate-500">Send instant terminal score summaries to parent phone</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Assignment Deadlines Reminder</h4>
                  <p className="text-slate-500">24-hour countdown reminders for pending homework</p>
                </div>
                <input
                  type="checkbox"
                  checked={assignmentReminders}
                  onChange={(e) => setAssignmentReminders(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">CBT Audio Chimes</h4>
                  <p className="text-slate-500">Play subtle bell at 5 minutes remaining in CBT exams</p>
                </div>
                <input
                  type="checkbox"
                  checked={cbtCountdownSounds}
                  onChange={(e) => setCbtCountdownSounds(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
