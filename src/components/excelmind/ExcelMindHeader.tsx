import React, { useState } from 'react';
import { UserRole } from '../../types/excelmind';

interface ExcelMindHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedSession: string;
  onSessionChange: (session: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  unreadCount?: number;
  onSignOut?: () => void;
}

export const ExcelMindHeader: React.FC<ExcelMindHeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedSession,
  onSessionChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  unreadCount = 3,
  onSignOut
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return { label: 'Student', icon: 'school', color: 'bg-blue-600 text-white' };
      case 'teacher':
        return { label: 'Teacher', icon: 'psychology', color: 'bg-emerald-600 text-white' };
      case 'parent':
        return { label: 'Parent', icon: 'family_restroom', color: 'bg-purple-600 text-white' };
      case 'admin':
        return { label: 'Administrator', icon: 'admin_panel_settings', color: 'bg-amber-600 text-white' };
    }
  };

  const getSpaceInfo = (role: UserRole) => {
    switch (role) {
      case 'student':
        return { spaceName: 'My Learning Space', icon: 'school', color: 'text-blue-200 bg-blue-500/20 border-blue-400/40' };
      case 'teacher':
        return { spaceName: 'My Teaching Space', icon: 'psychology', color: 'text-emerald-200 bg-emerald-500/20 border-emerald-400/40' };
      case 'parent':
        return { spaceName: 'My Child Monitoring Space', icon: 'family_restroom', color: 'text-purple-200 bg-purple-500/20 border-purple-400/40' };
      case 'admin':
        return { spaceName: 'School Management Space', icon: 'admin_panel_settings', color: 'text-amber-200 bg-amber-500/20 border-amber-400/40' };
    }
  };

  const getRoleUser = (role: UserRole) => {
    const savedUserStr = localStorage.getItem('excelmind_user');
    let dbName = '';
    if (savedUserStr) {
      try {
        const u = JSON.parse(savedUserStr);
        if (u.first_name && u.last_name) dbName = `${u.first_name} ${u.last_name}`;
      } catch (e) {}
    }

    switch (role) {
      case 'student':
        return { name: dbName || 'John Doe', meta: 'SSS 3 Gold • Sci & Tech' };
      case 'teacher':
        return { name: dbName || 'Dr. Kenneth Okon', meta: 'HOD Physics & Senior Tutor' };
      case 'parent':
        return { name: dbName || 'Engr. Michael Doe', meta: 'Guardian (John Doe)' };
      case 'admin':
        return { name: dbName || 'Vice Principal Academic', meta: 'Institutional Registry' };
    }
  };

  const currentRoleUser = getRoleUser(currentRole);
  const currentSpace = getSpaceInfo(currentRole);

  const notifications = [
    { id: 1, title: 'CBT Exam Scheduled', desc: 'WAEC Mathematics Mock scheduled for Thursday 10:00 AM.', time: '15m ago', unread: true },
    { id: 2, title: 'Assignment Graded', desc: 'Chemistry IUPAC Isomers scored 95/100 (A1).', time: '2h ago', unread: true },
    { id: 3, title: 'New Teacher Message', desc: 'Dr. Kenneth Okon replied to your Physics query.', time: '5h ago', unread: true },
    { id: 4, title: 'Fee Clearance Verified', desc: 'Term 1 tuition and CBT portal clearance confirmed.', time: '1d ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#111B5E] text-white shadow-lg border-b border-indigo-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left Brand & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Open Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <span className="material-symbols-outlined text-2xl font-bold">school</span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white leading-none">
                    Excel<span className="text-blue-400">Mind</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Academic Companion
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/70 font-medium leading-none mt-1">
                  Premier EdTech Student Evaluation Platform
                </p>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher (Multi-Role Support) */}
          <div className="hidden md:flex items-center bg-indigo-950/60 p-1 rounded-xl border border-indigo-800/60 shadow-inner">
            <span className="text-[11px] font-bold text-indigo-300 px-2.5 uppercase tracking-wider font-mono">
              View As:
            </span>
            {(['student', 'teacher', 'parent', 'admin'] as UserRole[]).map((role) => {
              const active = currentRole === role;
              const badge = getRoleBadge(role);
              return (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? `${badge.color} shadow-md`
                      : 'text-indigo-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{badge.icon}</span>
                  <span className="capitalize">{role}</span>
                </button>
              );
            })}
          </div>

          {/* Current Isolated Persona Space Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold border border-white/10 bg-white/5 shadow-inner">
            <span className="material-symbols-outlined text-sm text-blue-300">{currentSpace.icon}</span>
            <span className="text-white font-extrabold">{currentSpace.spaceName}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Isolated
            </span>
          </div>

          {/* Right Tools: Session, Dark Mode, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Session Selector */}
            <div className="hidden xl:flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/15 text-xs text-indigo-100">
              <span className="material-symbols-outlined text-sm text-blue-400">calendar_month</span>
              <select
                value={selectedSession}
                onChange={(e) => onSessionChange(e.target.value)}
                className="bg-transparent border-none text-white font-semibold text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="2025/2026 Term 1" className="bg-[#111B5E] text-white">2025/2026 Term 1</option>
                <option value="2024/2025 Term 3" className="bg-[#111B5E] text-white">2024/2025 Term 3</option>
                <option value="2024/2025 Term 2" className="bg-[#111B5E] text-white">2024/2025 Term 2</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-xl">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition relative cursor-pointer"
                aria-label="View notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3.5 bg-gradient-to-r from-[#111B5E] to-blue-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">notifications_active</span>
                      <span className="font-bold text-sm">Notifications & Alerts</span>
                    </div>
                    <span className="text-[10px] bg-blue-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      {unreadCount} Unread
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer ${
                          n.unread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark All as Read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Role Switcher Button */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="p-1.5 bg-indigo-900 rounded-lg text-white text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">{getRoleBadge(currentRole).icon}</span>
                <span className="capitalize text-[11px]">{currentRole}</span>
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50">
                  <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 font-bold">Switch Persona</div>
                  {(['student', 'teacher', 'parent', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                        currentRole === r ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">{getRoleBadge(r).icon}</span>
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Summary */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-indigo-900">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 shadow-sm"
              />
              <div className="text-left">
                <div className="text-xs font-extrabold text-white leading-tight">
                  {currentRoleUser.name}
                </div>
                <div className="text-[10px] text-blue-300/80 font-medium leading-tight">
                  {currentRoleUser.meta}
                </div>
              </div>
            </div>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-2.5 py-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Sign Out / Switch Account"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="hidden xl:inline text-[11px]">Sign Out</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
