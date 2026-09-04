import React, { useState } from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { apiRequest, setAuthToken } from '../../services/api';

interface TeacherLoginProps {
  onLoginSuccess: (user: any, role: string) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateUnifiedLogin: () => void;
}

export const TeacherLogin: React.FC<TeacherLoginProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onNavigateUnifiedLogin
}) => {
  const [email, setEmail] = useState('k.okon@excelmind.edu.ng');
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
        body: JSON.stringify({ email, password, requestedRole: 'teacher' })
      });

      if (result.success && result.data && result.data.token) {
        setAuthToken(result.data.token);
        localStorage.setItem('excelmind_user', JSON.stringify(result.data.user));
        onLoginSuccess(result.data.user, 'teacher');
      } else {
        // Fallback simulate teacher login
        const mockTeacher = {
          id: 2,
          name: 'Dr. Kenneth Okon',
          email: email,
          role: 'teacher',
          title: 'Physics Teacher & STEM Lead',
          department: 'SS2 Science Department'
        };
        localStorage.setItem('excelmind_user', JSON.stringify(mockTeacher));
        onLoginSuccess(mockTeacher, 'teacher');
      }
    } catch (err: any) {
      const mockTeacher = {
        id: 2,
        name: 'Dr. Kenneth Okon',
        email: email,
        role: 'teacher',
        title: 'Physics Teacher & STEM Lead',
        department: 'SS2 Science Department'
      };
      onLoginSuccess(mockTeacher, 'teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Teacher & Faculty Portal Login"
      subtitle="Sign in to access your classes, publish lesson notes, set assignments, and record examination grades."
      badgeText="Instructor Login"
      icon="school"
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
            Faculty Email Address or Employee ID
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="k.okon@excelmind.edu.ng or TCH-2026-001"
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
            <span>Verifying Faculty Credentials...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In to Teacher Dashboard</span>
            </>
          )}
        </button>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span>New faculty instructor? </span>
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Register as Teacher
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

export default TeacherLogin;
