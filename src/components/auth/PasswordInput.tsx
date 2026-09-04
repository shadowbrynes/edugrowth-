import React, { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showStrength?: boolean;
  id?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  label = 'Password',
  placeholder = '••••••••',
  required = true,
  showStrength = false,
  id = 'password'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Security requirements: min 8 chars, uppercase, number, special char
  const hasMinLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  const passedCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthColor =
    passedCount <= 1 ? 'bg-rose-500' : passedCount <= 3 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthLabel =
    passedCount <= 1 ? 'Weak' : passedCount <= 3 ? 'Moderate' : 'Strong';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {showStrength && value.length > 0 && (
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
            Strength: <span className={passedCount === 4 ? 'text-emerald-600 font-bold' : ''}>{strengthLabel}</span>
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          <span className="material-symbols-outlined text-lg">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {showStrength && (
        <div className="space-y-1 pt-1">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
            <div className={`h-full rounded-full transition-all ${passedCount >= 1 ? strengthColor : 'bg-transparent'}`} style={{ width: '25%' }}></div>
            <div className={`h-full rounded-full transition-all ${passedCount >= 2 ? strengthColor : 'bg-transparent'}`} style={{ width: '25%' }}></div>
            <div className={`h-full rounded-full transition-all ${passedCount >= 3 ? strengthColor : 'bg-transparent'}`} style={{ width: '25%' }}></div>
            <div className={`h-full rounded-full transition-all ${passedCount >= 4 ? strengthColor : 'bg-transparent'}`} style={{ width: '25%' }}></div>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
            <span className={hasMinLength ? 'text-emerald-600 font-bold' : ''}>• Min 8 characters</span>
            <span className={hasUppercase ? 'text-emerald-600 font-bold' : ''}>• Uppercase letter</span>
            <span className={hasNumber ? 'text-emerald-600 font-bold' : ''}>• Number (0-9)</span>
            <span className={hasSpecial ? 'text-emerald-600 font-bold' : ''}>• Special symbol (!@#)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
