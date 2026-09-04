import React from 'react';
import { ActiveModule, UserRole } from '../../types/excelmind';

interface ExcelMindSidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
}

interface NavItem {
  id: ActiveModule;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  roles?: UserRole[];
}

export const ExcelMindSidebar: React.FC<ExcelMindSidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpen,
  onClose,
  currentRole
}) => {
  const getSpaceMeta = (role: UserRole) => {
    switch (role) {
      case 'student':
        return {
          spaceTitle: 'My Learning Space',
          subTitle: 'Isolated Student Workspace',
          icon: 'school',
          color: 'from-blue-600 to-indigo-700',
          badgeText: 'SS3 Sci & Tech'
        };
      case 'parent':
        return {
          spaceTitle: 'Child Monitoring Space',
          subTitle: 'Verified Wards Oversight',
          icon: 'family_restroom',
          color: 'from-purple-600 to-indigo-800',
          badgeText: 'Verified Guardian'
        };
      case 'teacher':
        return {
          spaceTitle: 'My Teaching Space',
          subTitle: 'Faculty & Class Control',
          icon: 'psychology',
          color: 'from-emerald-600 to-teal-800',
          badgeText: 'Assigned Instructor'
        };
      case 'admin':
        return {
          spaceTitle: 'School Management',
          subTitle: 'Institutional Registry',
          icon: 'admin_panel_settings',
          color: 'from-amber-600 to-orange-700',
          badgeText: 'System Registry'
        };
    }
  };

  const getNavItems = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
          { id: 'courses', label: 'My Courses', icon: 'menu_book', badge: '6 Active' },
          { id: 'learning_hub', label: 'Learning Hub & Forum', icon: 'hub', badge: 'Community' },
          { id: 'cbt', label: 'CBT Practice', icon: 'timer', badge: 'WAEC/JAMB', badgeColor: 'bg-emerald-100 text-emerald-700' },
          { id: 'results', label: 'My Results', icon: 'analytics' },
          { id: 'assignments', label: 'Assignments', icon: 'task', badge: '3 Due', badgeColor: 'bg-rose-100 text-rose-700' },
          { id: 'timetable', label: 'Timetable', icon: 'calendar_today' },
          { id: 'ai_tutor', label: 'AI Tutor', icon: 'smart_toy', badge: 'Gemini AI', badgeColor: 'bg-indigo-100 text-indigo-700' },
          { id: 'coach', label: 'Revision Coach', icon: 'neurology', badge: '🔥 14d', badgeColor: 'bg-purple-100 text-purple-700' },
          { id: 'messages', label: 'Class Messages', icon: 'chat' },
          { id: 'student_directory', label: 'Class Directory', icon: 'badge' },
          { id: 'academic_centre', label: 'Academic Records', icon: 'school' },
          { id: 'curriculum', label: 'Curriculum Engine', icon: 'auto_stories' },
          { id: 'profile', label: 'Profile', icon: 'person' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Wards Overview', icon: 'family_restroom' },
          { id: 'results', label: 'Certified Results', icon: 'analytics', badge: 'Verified' },
          { id: 'timetable', label: 'Attendance & Routine', icon: 'fact_check' },
          { id: 'messages', label: 'Teacher Contacts', icon: 'call', badge: 'WhatsApp', badgeColor: 'bg-emerald-100 text-emerald-700' },
          { id: 'student_directory', label: 'Identity Directory', icon: 'badge' },
          { id: 'academic_centre', label: 'Report Cards', icon: 'school' },
          { id: 'profile', label: 'Parent Profile', icon: 'person' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teaching Space', icon: 'psychology' },
          { id: 'academic_centre', label: 'Academic Records Centre', icon: 'school', badge: 'Scores & CA', badgeColor: 'bg-indigo-100 text-indigo-700' },
          { id: 'assignments', label: 'Assignments Manager', icon: 'task' },
          { id: 'cbt', label: 'CBT Exam Creator', icon: 'timer' },
          { id: 'timetable', label: 'Teaching Schedule', icon: 'calendar_today' },
          { id: 'student_directory', label: 'Student Directory', icon: 'badge' },
          { id: 'curriculum', label: 'Curriculum Modules', icon: 'auto_stories' },
          { id: 'messages', label: 'Parent Messages', icon: 'chat' },
          { id: 'profile', label: 'Faculty Profile', icon: 'person' }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Registry Overview', icon: 'admin_panel_settings' },
          { id: 'academic_centre', label: 'Academic Action Centre', icon: 'school', badge: 'Full Access', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'student_directory', label: 'Digital Student Directory', icon: 'badge' },
          { id: 'curriculum', label: 'Curriculum Engine', icon: 'auto_stories', badge: 'NERDC' },
          { id: 'results', label: 'Institution Performance', icon: 'analytics' },
          { id: 'messages', label: 'Communication Hub', icon: 'hub' },
          { id: 'profile', label: 'System Admin', icon: 'person' },
          { id: 'settings', label: 'RBAC Security Audit', icon: 'security' }
        ];
    }
  };

  const navItems = getNavItems(currentRole);
  const spaceMeta = getSpaceMeta(currentRole);

  const getSavedUser = () => {
    try {
      const u = localStorage.getItem('excelmind_user');
      if (u) return JSON.parse(u);
    } catch (e) {}
    return null;
  };

  const user = getSavedUser();
  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : (
    currentRole === 'student' ? 'John Doe' :
    currentRole === 'teacher' ? 'Dr. Kenneth Okon' :
    currentRole === 'parent' ? 'Engr. Michael Doe' : 'Institution Registry'
  );
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'EM';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Mobile Header Inside Sidebar */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 lg:hidden bg-[#111B5E] text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-lg">school</span>
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight">ExcelMind</span>
                <p className="text-[10px] text-blue-200">Academic Companion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* User Persona Pill inside Sidebar */}
          <div className="p-3.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${spaceMeta.color} text-white flex items-center justify-center font-extrabold text-xs shadow-md shrink-0`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{displayName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {spaceMeta.badgeText}
                  </p>
                </div>
              </div>

              {/* Space Isolation Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">
                  <span className="material-symbols-outlined text-xs text-blue-500">{spaceMeta.icon}</span>
                  <span className="truncate">{spaceMeta.spaceTitle}</span>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-0.5 shrink-0">
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                  Isolated
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
              Main Menu
            </div>
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111B5E] text-white shadow-md shadow-indigo-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#111B5E] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isActive ? 'text-blue-300' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                          : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Card: Progress Tracker & Quick Hotline */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-3 bg-gradient-to-br from-[#111B5E] to-blue-900 text-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold tracking-tight">Term 1 Progress</span>
                <span className="text-[11px] font-black font-mono text-blue-300">82%</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <p className="text-[10px] text-indigo-200/90 leading-snug">
                Excellent! +8% improvement compared to last term.
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
