import React from 'react';

export type PortalRole = 'teacher' | 'parent' | 'student' | 'admin';

interface RoleSelectorProps {
  selectedRole: PortalRole;
  onSelectRole: (role: PortalRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  const roles: { id: PortalRole; label: string; icon: string; desc: string }[] = [
    { id: 'teacher', label: 'Teacher', icon: 'school', desc: 'Faculty & Assessment' },
    { id: 'parent', label: 'Parent', icon: 'escalator_warning', desc: 'Ward Monitoring' },
    { id: 'student', label: 'Student', icon: 'person', desc: 'Learning & CBT' },
    { id: 'admin', label: 'Administrator', icon: 'admin_panel_settings', desc: 'School Management' }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Select Login Role:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {roles.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-xl text-blue-600 dark:text-blue-400">
                  {r.icon}
                </span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-black block leading-tight">{r.label}</span>
                <span className="text-[10px] text-slate-400 block font-normal">{r.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
