import React from 'react';
import { ViewMode, SchoolProfile } from '../types';

interface RoleNavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeAlertsCount: number;
  user: any;
  userRole?: 'admin' | 'teacher' | 'student' | 'parent';
  onSignOut: () => void;
  institutionType?: 'Schools' | 'HigherEd';
  onInstitutionTypeChange?: (type: 'Schools' | 'HigherEd') => void;
  selectedSession?: string;
  onSessionChange?: (session: string) => void;
  schoolProfile?: SchoolProfile;
}

export const RoleNavigation: React.FC<RoleNavigationProps> = ({
  currentView,
  onViewChange,
  activeAlertsCount,
  user,
  userRole = 'admin',
  onSignOut,
  institutionType = 'Schools',
  onInstitutionTypeChange,
  selectedSession = '2023/2024 Fall',
  onSessionChange,
  schoolProfile,
}) => {
  const displayRoleLabel = () => {
    switch(userRole) {
      case 'admin': return '🏛️ Institutional Admin';
      case 'teacher': return '👩‍🏫 Faculty Professor';
      case 'parent': return '👨‍👩‍👦 Guardian & Parent';
      case 'student': return '🎓 Registered Student';
      default: return '👤 System User';
    }
  };

  const schoolInitials = schoolProfile?.name
    ? schoolProfile.name.split(' ').filter(word => word.length > 0).map(word => word[0]).join('').slice(0, 3).toUpperCase()
    : 'SJA';

  return (
    <div className="bg-primary text-white border-b border-primary-container shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            {schoolProfile?.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="Logo"
                className="w-14 h-14 rounded-md object-contain bg-white p-1 border border-white/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-secondary text-white text-sm font-black uppercase tracking-wider">
                {schoolInitials}
              </span>
            )}
            <span className="text-xs font-black uppercase tracking-tight text-white max-w-[150px] truncate" title={schoolProfile?.name}>
              {schoolProfile?.name || "Saint Jude's Academy"}
            </span>
          </div>

          <span className="text-xs font-semibold text-primary-fixed ml-2 hidden sm:inline">
            | Workspace:
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-white/10 text-tertiary-fixed border border-white/15">
            {displayRoleLabel()}
          </span>

          {/* Quick SaaS Edition Badge inside the Header */}
          <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">tune</span>
            {institutionType === 'Schools' ? 'Schools Edition' : 'Higher Ed Edition'}
          </span>

          {/* Session / Semester Selector Dropdown */}
          {userRole === 'admin' ? (
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-0.5 text-xs text-white">
              <span className="material-symbols-outlined text-xs text-[#ff3e00]">calendar_month</span>
              <span className="font-mono font-bold text-[10px] uppercase text-white/60">Session:</span>
              <select
                value={selectedSession}
                onChange={(e) => onSessionChange?.(e.target.value)}
                className="bg-transparent text-white border-none font-bold focus:outline-none cursor-pointer pr-1 text-xs"
                id="header-session-select"
              >
                <option value="2023/2024 Fall" className="bg-[#0c0c0c] text-white">2023/2024 Fall</option>
                <option value="2023/2024 Spring" className="bg-[#0c0c0c] text-white">2023/2024 Spring</option>
                <option value="2024/2025 Fall" className="bg-[#0c0c0c] text-white">2024/2025 Fall</option>
                <option value="2024/2025 Spring" className="bg-[#0c0c0c] text-white">2024/2025 Spring</option>
              </select>
            </div>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-white/10 text-white/80 border border-white/15 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#ff3e00]">calendar_month</span>
              Session: {selectedSession}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          <div className="flex items-center gap-1.5 bg-primary-container/80 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            {(userRole === 'admin') && (
              <button
                onClick={() => onViewChange('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentView === 'admin' ? 'bg-secondary text-white shadow-md' : 'text-primary-fixed-dim hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-sm" style={currentView === 'admin' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
                Admin Overview
                {activeAlertsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-error text-white text-[10px] flex items-center justify-center font-bold font-mono">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            )}

            {(userRole === 'admin' || userRole === 'teacher') && (
              <button
                onClick={() => onViewChange('teacher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentView === 'teacher' ? 'bg-secondary text-white shadow-md' : 'text-primary-fixed-dim hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-sm" style={currentView === 'teacher' ? { fontVariationSettings: "'FILL' 1" } : {}}>school</span>
                Faculty Portal
              </button>
            )}

            {(userRole === 'admin' || userRole === 'parent') && (
              <button
                onClick={() => onViewChange('parent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentView === 'parent' ? 'bg-secondary text-white shadow-md' : 'text-primary-fixed-dim hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-sm" style={currentView === 'parent' ? { fontVariationSettings: "'FILL' 1" } : {}}>family_restroom</span>
                Parent Portal
              </button>
            )}

            {(userRole === 'admin' || userRole === 'student') && (
              <button
                onClick={() => onViewChange('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentView === 'student' ? 'bg-secondary text-white shadow-md' : 'text-primary-fixed-dim hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-sm" style={currentView === 'student' ? { fontVariationSettings: "'FILL' 1" } : {}}>school</span>
                Student Portal
              </button>
            )}

            {(userRole === 'admin' || userRole === 'student' || userRole === 'teacher') && (
              <button
                onClick={() => onViewChange('transcript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentView === 'transcript' ? 'bg-secondary text-white shadow-md' : 'text-primary-fixed-dim hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-sm" style={currentView === 'transcript' ? { fontVariationSettings: "'FILL' 1" } : {}}>history_edu</span>
                Digital Report Card
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-white/20 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#ff3e00] text-black text-xs font-black flex items-center justify-center">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-white max-w-[100px] truncate hidden lg:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
            )}
            
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 border border-white/20 text-white/80 hover:text-[#ff3e00] hover:border-[#ff3e00]/50 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer bg-black/20"
              title="Sign Out of Workspace"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
