import React, { useState } from 'react';
import { registerWithEmailAndPassword, loginWithEmailAndPassword, signInWithGoogle, db } from '../firebase';
import { SchoolProfile } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface AuthScreenProps {
  onAuthSuccess: (firebaseUser: any, selectedRole?: 'admin' | 'teacher' | 'student' | 'parent', isOffline?: boolean) => void;
  schoolProfile?: SchoolProfile;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, schoolProfile }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student' | 'parent'>('admin');
  const [institutionalId, setInstitutionalId] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      let loginEmail = email.trim();
      
      // If it's an ID (does not contain '@')
      if (!loginEmail.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('studentId', '==', loginEmail.toUpperCase()));
        const querySnapshot = await getDocs(q);
        
        let foundEmail = '';
        querySnapshot.forEach((doc) => {
          foundEmail = doc.data().email;
        });

        if (!foundEmail) {
          const q2 = query(usersRef, where('employeeId', '==', loginEmail.toUpperCase()));
          const querySnapshot2 = await getDocs(q2);
          querySnapshot2.forEach((doc) => {
            foundEmail = doc.data().email;
          });
        }
        
        if (!foundEmail) {
          // If still not found, check local mock data for offline/developer preview
          const mockEmailMap: Record<string, { email: string; role: 'admin' | 'teacher' | 'student' | 'parent' }> = {
            'ST-882-901': { email: 'alexander@stjudesacademy.edu', role: 'student' },
            'ST-701-442': { email: 'alice@stjudesacademy.edu', role: 'student' },
            'ST-905-118': { email: 'leo@stjudesacademy.edu', role: 'student' },
            'TCH-1001': { email: 'teacher@edugrowth.com', role: 'teacher' },
            'ADM-1001': { email: 'admin@stjudesacademy.edu', role: 'admin' }
          };
          
          const mockMatch = mockEmailMap[loginEmail.toUpperCase()];
          if (mockMatch) {
            const mockUser = {
              uid: `mock-${mockMatch.role}-${Date.now()}`,
              displayName: loginEmail.toUpperCase(),
              email: mockMatch.email,
              photoURL: null,
            };
            onAuthSuccess(mockUser, mockMatch.role, true);
            setLoading(false);
            return;
          }
          
          throw new Error(`Institutional ID "${loginEmail}" was not found. Please register or use standard Email login.`);
        }
        loginEmail = foundEmail;
      }
      
      const firebaseUser = await loginWithEmailAndPassword(loginEmail, password);
      onAuthSuccess(firebaseUser);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const firebaseUser = await registerWithEmailAndPassword(email, password, fullName, role, institutionalId.trim());
      onAuthSuccess(firebaseUser, role);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. The email might be already in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const firebaseUser = await signInWithGoogle();
      onAuthSuccess(firebaseUser);
    } catch (err: any) {
      setError('Google Sign-In was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  // Developer Bypass - Registers or logs in using actual firebase auth for developer test accounts
  const handleDeveloperBypass = async () => {
    setError(null);
    setLoading(true);
    const devEmail = 'developer@edugrowth.com';
    const devPass = 'developer123';
    const devName = 'Naija Journal';
    try {
      // Attempt login first
      try {
        const firebaseUser = await loginWithEmailAndPassword(devEmail, devPass);
        onAuthSuccess(firebaseUser);
      } catch (loginErr) {
        // If login failed, register the dev account with Faculty Professor privileges
        const firebaseUser = await registerWithEmailAndPassword(devEmail, devPass, devName, 'teacher');
        onAuthSuccess(firebaseUser, 'teacher');
      }
    } catch (err: any) {
      setError('Developer Quick Access failed. Please try standard sign up/in.');
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineBypass = () => {
    setError(null);
    const mockUser = {
      uid: `mock-${role}-${Date.now()}`,
      displayName: fullName || (role === 'admin' ? 'Mock Administrator' : role === 'teacher' ? 'Mock Professor' : role === 'parent' ? 'Mock Guardian' : 'Mock Student'),
      email: email || `${role}@mock-edugrowth.com`,
      photoURL: null,
    };
    onAuthSuccess(mockUser, role, true);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-sans selection:bg-[#ff3e00] selection:text-black relative overflow-hidden">
      {/* Decorative Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3e00]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 p-8 md:p-10 flex flex-col gap-6 relative shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff3e00] to-transparent" />
          
          <div className="text-center">
            {schoolProfile?.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="School Logo"
                className="w-36 h-36 object-contain bg-white p-2.5 border border-white/20 mx-auto mb-4"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-36 h-36 bg-[#0c0c0c] border border-white/20 flex items-center justify-center font-black text-4xl text-[#ff3e00] tracking-tighter mx-auto mb-4">
                {schoolProfile?.name
                  ? schoolProfile.name.split(' ').filter(word => word.length > 0).map(word => word[0]).join('').slice(0, 3).toUpperCase()
                  : 'SJA'}
              </div>
            )}
            <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-[#ff3e00] mb-2 px-2 line-clamp-2">
              {schoolProfile?.name || "Saint Jude's Academy of Sciences"}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              EduGrowth <span className="text-[#ff3e00]">Portal</span>
            </h1>
            <p className="text-xs text-white/50 tracking-wide mt-2 px-4 italic line-clamp-2" title={schoolProfile?.motto}>
              {schoolProfile?.motto || "Unified Academic Management Security Gate"}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => { setTab('signin'); setError(null); }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${tab === 'signin' ? 'border-[#ff3e00] text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${tab === 'signup' ? 'border-[#ff3e00] text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-md flex items-start gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Email Address or Institutional ID</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@academy.edu or ST-882-901"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#ff3e00] hover:bg-[#ff3e00]/90 text-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In To Workspace'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Professor Alexander Sterling"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@academy.edu"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Institutional ID (Optional)</label>
                <input
                  type="text"
                  value={institutionalId}
                  onChange={(e) => setInstitutionalId(e.target.value)}
                  placeholder="e.g. ST-882-901 or TCH-1001"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                />
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Used for custom ID login (e.g. students or teachers sign in using their card ID instead of email).
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Min 6 chars)"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Workspace Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#0c0c0c] border border-white/15 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff3e00] transition-colors rounded-none"
                  disabled={loading}
                >
                  <option value="admin">🏛️ Institutional Admin</option>
                  <option value="teacher">👩‍🏫 Faculty Professor</option>
                  <option value="parent">👨‍👩‍👦 Guardian & Parent</option>
                  <option value="student">🎓 Enrolled Student</option>
                </select>
                <p className="text-[10px] text-white/40 leading-relaxed mt-1">
                  Your designated role strictly controls workspace routing and Firestore resource accessibility permissions.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#ff3e00] hover:bg-[#ff3e00]/90 text-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register Workspace Profile'}
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 text-white/20 my-1">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-mono tracking-widest uppercase">OR</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white text-black hover:bg-[#ff3e00] hover:text-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer border border-white"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437s2.882-6.437 6.437-6.437c1.556 0 2.978.557 4.093 1.482l3.078-3.078C19.3 1.54 15.985.514 12.24.514 5.866.514.714 5.666.714 12s5.152 11.486 11.526 11.486c6.643 0 11.049-4.671 11.049-11.246 0-.759-.08-1.32-.232-1.954H12.24z"/>
              </svg>
              Sign In With Google
            </button>

            {/* Developer Bypass Option with Real Auth Session */}
            <button
              onClick={handleDeveloperBypass}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-transparent hover:bg-white/5 border border-white/20 text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">developer_mode</span>
              Developer Quick Access (Authenticated)
            </button>

            {/* Offline Bypass Option */}
            <button
              onClick={handleOfflineBypass}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#ff3e00]/10 hover:bg-[#ff3e00]/20 border border-[#ff3e00]/30 text-[#ff3e00] text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">offline_pin</span>
              Enter Offline Demo Mode
            </button>
          </div>

          <div className="text-center text-[10px] font-mono tracking-widest text-white/30 border-t border-white/5 pt-6 flex flex-col gap-1">
            <div>Secure Encrypted Session • TLS 1.3</div>
            <div>Authorized Institutional Personnel Only</div>
          </div>
        </div>
      </div>

      <footer className="py-6 border-t border-white/5 text-center text-[9px] uppercase tracking-[0.4em] text-white/30 relative z-10">
        © 2026 EduGrowth Academic Workspace • Version 4.2.1-Prod
      </footer>
    </div>
  );
};
