import React from 'react';

interface InstitutionTypeSwitcherProps {
  institutionType: 'Schools' | 'HigherEd';
  onChange: (type: 'Schools' | 'HigherEd') => void;
}

export const InstitutionTypeSwitcher: React.FC<InstitutionTypeSwitcherProps> = ({
  institutionType,
  onChange,
}) => {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-2xl p-4 shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              dns
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface">
              SaaS Edition Switcher
            </span>
          </div>
          <span className="text-[10px] bg-secondary/15 text-secondary border border-secondary/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
            Active: {institutionType === 'Schools' ? 'Schools' : 'Higher Ed'}
          </span>
        </div>

        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Switch between the specialized edtech editions to reconfigure sidebars, navigation channels, and feature modules in real-time.
        </p>

        <div className="grid grid-cols-2 gap-2 bg-surface p-1 rounded-xl border border-outline-variant/60">
          <button
            onClick={() => onChange('Schools')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all gap-1 border cursor-pointer ${
              institutionType === 'Schools'
                ? 'bg-secondary text-white border-secondary shadow-md font-bold'
                : 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={institutionType === 'Schools' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              child_care
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold">Schools</span>
            <span className="text-[8px] opacity-75 hidden sm:inline">Primary & Sec</span>
          </button>

          <button
            onClick={() => onChange('HigherEd')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all gap-1 border cursor-pointer ${
              institutionType === 'HigherEd'
                ? 'bg-secondary text-white border-secondary shadow-md font-bold'
                : 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={institutionType === 'HigherEd' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              account_balance
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold">Higher Ed</span>
            <span className="text-[8px] opacity-75 hidden sm:inline">Uni & College</span>
          </button>
        </div>
      </div>
    </div>
  );
};
