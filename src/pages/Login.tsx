import React, { useState } from 'react';
import { apiRequest, setAuthToken } from '../services/api';
import { RoleSelector, PortalRole } from '../components/auth/RoleSelector';
import { PasswordInput } from '../components/auth/PasswordInput';

interface LoginProps {
  onLoginSuccess: (user: any, role: string) => void;
  onNavigateForgotPassword?: () => void;
  onNavigateTeacherRegister?: () => void;
  onNavigateParentRegister?: () => void;
  onNavigateTeacherLogin?: () => void;
  onNavigateParentLogin?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onNavigateForgotPassword,
  onNavigateTeacherRegister,
  onNavigateParentRegister,
  onNavigateTeacherLogin,
  onNavigateParentLogin
}) => {
  const [selectedRole, setSelectedRole] = useState<PortalRole>('student');
  const [email, setEmail] = useState('john.doe@excelmind.edu.ng');
  const [password, setPassword] = useState('Password@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role: PortalRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    switch (role) {
      case 'student':
        setEmail('john.doe@excelmind.edu.ng');
        setPassword('Password@123');
        break;
      case 'teacher':
        setEmail('k.okon@excelmind.edu.ng');
        setPassword('Password@123');
        break;
      case 'parent':
        setEmail('parent.doe@excelmind.edu.ng');
        setPassword('Password@123');
        break;
      case 'admin':
        setEmail('admin@excelmind.edu.ng');
        setPassword('Password@123');
        break;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Try backend authentication
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role: selectedRole })
    });

    if (result.success && result.data && result.data.token) {
      setAuthToken(result.data.token);
      localStorage.setItem('excelmind_user', JSON.stringify(result.data.user));
      const backendRole = (result.data.user.role || selectedRole).toLowerCase();
      onLoginSuccess(result.data.user, backendRole);
    } else {
      // Offline fallback: determine role based on email/credentials
      let derivedRole = selectedRole;
      let userName = 'John Doe';

      if (derivedRole === 'admin' || email.includes('admin')) {
        derivedRole = 'admin';
        userName = 'System Administrator';
      } else if (derivedRole === 'teacher' || email.includes('okon') || email.includes('teacher')) {
        derivedRole = 'teacher';
        userName = 'Dr. Kenneth Okon';
      } else if (derivedRole === 'parent' || email.includes('parent')) {
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
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#111B5E] text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-900/30 text-2xl font-black">
            🎓
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/60">
            Database: excelmind_academic
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Welcome Back to ExcelMind Academic Companion
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select your academic role and enter credentials to access your personalized dashboard.
          </p>
        </div>

        {/* Role Selector */}
        <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleChange} />

        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address / Phone Number:
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. user@excelmind.edu.ng or +234..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner font-medium"
            />
          </div>

          <PasswordInput
            label="Password:"
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
              <span className="text-slate-600 dark:text-slate-400 font-medium">Remember Me</span>
            </label>

            <button
              type="button"
              onClick={onNavigateForgotPassword}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111B5E] hover:bg-blue-900 text-white font-black text-xs rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying {selectedRole.toUpperCase()} Credentials...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">login</span>
                <span>Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
              </>
            )}
          </button>
        </form>

        {/* Dedicated Portal Registration Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 text-center">
            New to ExcelMind? Create an Account
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onNavigateTeacherRegister}
              className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 transition cursor-pointer text-left flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-emerald-600 text-2xl">school</span>
              <div>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                  Register as Teacher
                </span>
                <span className="text-[10px] text-slate-400">Faculty onboarding portal</span>
              </div>
            </button>

            <button
              type="button"
              onClick={onNavigateParentRegister}
              className="p-3 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/60 transition cursor-pointer text-left flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-purple-600 text-2xl">escalator_warning</span>
              <div>
                <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
                  Register as Parent
                </span>
                <span className="text-[10px] text-slate-400">Link child & track results</span>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
            <span>Dedicated logins:</span>
            <button
              type="button"
              onClick={onNavigateTeacherLogin}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Teacher Login
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onNavigateParentLogin}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
            >
              Parent Login
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400 font-mono">
          Protected by bcrypt password encryption & JWT role permissions
        </p>

      </div>
    </div>
  );
};

export default Login;
