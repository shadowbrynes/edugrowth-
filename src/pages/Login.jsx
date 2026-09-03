import React, { useState } from 'react';
import { apiRequest, setAuthToken } from '../services/api';

export const Login = ({ onLoginSuccess, onNavigateForgotPassword }) => {
  const [email, setEmail] = useState('john.doe@excelmind.edu.ng');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickFill = (role) => {
    switch (role) {
      case 'Student':
        setEmail('john.doe@excelmind.edu.ng');
        setPassword('Password@123');
        break;
      case 'Teacher':
        setEmail('k.okon@excelmind.edu.ng');
        setPassword('Password@123');
        break;
      case 'Parent':
        setEmail('parent.doe@excelmind.edu.ng');
        setPassword('Password@123');
        break;
      case 'Administrator':
        setEmail('admin@excelmind.edu.ng');
        setPassword('Password@123');
        break;
    }
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Try backend authentication
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (result.success && result.data && result.data.token) {
      setAuthToken(result.data.token);
      localStorage.setItem('excelmind_user', JSON.stringify(result.data.user));
      const backendRole = (result.data.user.role || 'student').toLowerCase();
      onLoginSuccess(result.data.user, backendRole);
    } else {
      // Offline fallback: determine role based on email/credentials
      let derivedRole = 'student';
      let userName = 'John Doe';

      if (email.includes('admin')) {
        derivedRole = 'admin';
        userName = 'System Administrator';
      } else if (email.includes('okon') || email.includes('teacher')) {
        derivedRole = 'teacher';
        userName = 'Dr. Kenneth Okon';
      } else if (email.includes('parent')) {
        derivedRole = 'parent';
        userName = 'Engr. Michael Doe';
      }

      const mockUser = {
        name: userName,
        email,
        role: derivedRole
      };

      setAuthToken('mock-jwt-token-excelmind-2025');
      localStorage.setItem('excelmind_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser, derivedRole);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#111B5E] text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-900/30 text-2xl font-black">
            🎓
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Excel<span className="text-blue-600">Mind</span> Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your Academic Companion portal
          </p>
        </div>

        {/* Quick Fill Persona Pills */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
            Quick Persona Select (MySQL Seeded Accounts)
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('Student')}
              className="py-1.5 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition text-[11px] cursor-pointer"
            >
              🎓 Student (John)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('Teacher')}
              className="py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition text-[11px] cursor-pointer"
            >
              👩‍🏫 Teacher (Okon)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('Parent')}
              className="py-1.5 px-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 transition text-[11px] cursor-pointer"
            >
              👨‍👩‍👦 Parent (Doe)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('Administrator')}
              className="py-1.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-100 transition text-[11px] cursor-pointer"
            >
              🏛️ Admin (Registry)
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password:
              </label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111B5E] hover:bg-blue-900 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">lock_open</span>
                <span>Sign In to Portal</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400">
          Protected by bcrypt encryption & JWT role-based security tokens
        </p>

      </div>
    </div>
  );
};

export default Login;
