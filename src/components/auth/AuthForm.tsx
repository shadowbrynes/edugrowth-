import React from 'react';

interface AuthFormProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  icon?: string;
  children: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  badgeText = 'ExcelMind Academic Portal',
  icon = 'school',
  children
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111B5E] text-white flex items-center justify-center font-black text-2xl shadow-lg border border-indigo-900/60">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/60">
            {badgeText}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Content Body */}
        {children}

      </div>
    </div>
  );
};

export default AuthForm;
