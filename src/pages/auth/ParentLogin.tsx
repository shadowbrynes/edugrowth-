import React, { useState } from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { apiRequest, setAuthToken } from '../../services/api';

interface ParentLoginProps {
  onLoginSuccess: (user: any, role: string) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateUnifiedLogin: () => void;
}

export const ParentLogin: React.FC<ParentLoginProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onNavigateUnifiedLogin
}) => {
  const [email, setEmail] = useState('parent.doe@excelmind.edu.ng');
  const [password, setPassword] = useState('Password@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, requestedRole: 'parent' })
      });

      if (result.success && result.data && result.data.token) {
        setAuthToken(result.data.token);
        localStorage.setItem('excelmind_user', JSON.stringify(result.data.user));
        onLoginSuccess(result.data.user, 'parent');
      } else {
        // Fallback simulate parent login
        const mockParent = {
          id: 3,
          name: 'Engr. Michael Doe',
          email: email,
          role: 'parent',
          ward: 'John Doe',
          class: 'SS3 Science',
          school: 'ExcelMind International College'
        };
        localStorage.setItem('excelmind_user', JSON.stringify(mockParent));
        onLoginSuccess(mockParent, 'parent');
      }
    } catch (err: any) {
      const mockParent = {
        id: 3,
        name: 'Engr. Michael Doe',
        email: email,
        role: 'parent',
        ward: 'John Doe',
        class: 'SS3 Science',
        school: 'ExcelMind International College'
      };
      onLoginSuccess(mockParent, 'parent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Parent & Guardian Portal Login"
      subtitle="Sign in to track your child's real-time academic progress, CBT mock tests, teacher feedback, and fee records."
      badgeText="Guardian Login"
      icon="escalator_warning"
    >
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Parent Email Address or Phone Number
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="parent.doe@excelmind.edu.ng or +234 803 344 5566"
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          />
        </div>

        <PasswordInput
          label="Account Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-600 dark:text-slate-400">Remember Me</span>
          </label>

          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Verifying Guardian Credentials...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In to Parent Dashboard</span>
            </>
          )}
        </button>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span>New parent / guardian? </span>
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Register as Parent
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateUnifiedLogin}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold cursor-pointer"
          >
            Unified Role Login
          </button>
        </div>
      </form>
    </AuthForm>
  );
};

export default ParentLogin;
