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
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'academic_centre', label: 'Academic Records', icon: 'school', badge: 'Action Centre', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'student_directory', label: 'Student Directory', icon: 'badge', badge: 'Passports', badgeColor: 'bg-blue-100 text-blue-700' },
    { id: 'curriculum', label: 'Curriculum Engine', icon: 'auto_stories', badge: 'NERDC', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'coach', label: 'AI Learning Coach', icon: 'neurology', badge: '🔥 14d', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'courses', label: 'My Courses', icon: 'menu_book', badge: '6' },
    { id: 'learning_hub', label: 'Learning Hub', icon: 'hub', badge: 'Interactive', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'timetable', label: 'Timetable', icon: 'calendar_today' },
    { id: 'assignments', label: 'Assignments', icon: 'task', badge: '3 Due', badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'cbt', label: 'CBT Examination', icon: 'timer', badge: 'Live CBT', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'results', label: 'Results', icon: 'analytics' },
    { id: 'messages', label: 'Messages', icon: 'chat', badge: '2', badgeColor: 'bg-blue-100 text-blue-700' },
    { id: 'ai_tutor', label: 'AI Tutor', icon: 'smart_toy', badge: 'Gemini AI', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

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
          <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#111B5E] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">John Doe</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {currentRole} • SSS 3
                </p>
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
