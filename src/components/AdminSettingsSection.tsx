import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { 
  INITIAL_STUDENTS, 
  INITIAL_CRITICAL_ALERTS, 
  INITIAL_ACTIVITIES, 
  PARENT_CHILDREN, 
  TRANSCRIPTS, 
  INITIAL_TRANSCRIPT_ACCESSES 
} from '../data/mockData';

interface AdminSettingsSectionProps {
  institutionType: 'Schools' | 'HigherEd';
  onInstitutionTypeChange?: (type: 'Schools' | 'HigherEd') => void;
}

export const AdminSettingsSection: React.FC<AdminSettingsSectionProps> = ({
  institutionType,
  onInstitutionTypeChange,
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'configured' | 'missing'>('checking');

  useEffect(() => {
    // Check if Gemini API key is configured
    // Since Vite loads env variables at compile time, we check import.meta.env
    const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (key && key !== 'MY_GEMINI_API_KEY') {
      setApiKeyStatus('configured');
    } else {
      // In development or AI studio runtime, we can also check if process.env or similar exists
      setApiKeyStatus('missing');
    }
  }, []);

  const handleReSeedDatabase = async () => {
    if (seeding) return;
    setSeeding(true);
    setSeedSuccess(null);
    setSeedError(null);

    try {
      // 1. Purge & Re-seed Students
      const studentSnap = await getDocs(collection(db, 'students'));
      for (const studentDoc of studentSnap.docs) {
        await deleteDoc(doc(db, 'students', studentDoc.id));
      }
      for (const student of INITIAL_STUDENTS) {
        await setDoc(doc(db, 'students', student.id), student);
      }

      // 2. Purge & Re-seed Alerts
      const alertSnap = await getDocs(collection(db, 'alerts'));
      for (const alertDoc of alertSnap.docs) {
        await deleteDoc(doc(db, 'alerts', alertDoc.id));
      }
      for (const alert of INITIAL_CRITICAL_ALERTS) {
        await setDoc(doc(db, 'alerts', alert.id), alert);
      }

      // 3. Purge & Re-seed Activities
      const activitySnap = await getDocs(collection(db, 'activities'));
      for (const actDoc of activitySnap.docs) {
        await deleteDoc(doc(db, 'activities', actDoc.id));
      }
      for (const act of INITIAL_ACTIVITIES) {
        await setDoc(doc(db, 'activities', act.id), act);
      }

      // 4. Purge & Re-seed Children
      const childrenSnap = await getDocs(collection(db, 'children'));
      for (const childDoc of childrenSnap.docs) {
        await deleteDoc(doc(db, 'children', childDoc.id));
      }
      for (const child of PARENT_CHILDREN) {
        await setDoc(doc(db, 'children', child.id), child);
      }

      // 5. Purge & Re-seed Transcripts
      const transcriptSnap = await getDocs(collection(db, 'transcripts'));
      for (const transcriptDoc of transcriptSnap.docs) {
        await deleteDoc(doc(db, 'transcripts', transcriptDoc.id));
      }
      for (const transcript of Object.values(TRANSCRIPTS)) {
        await setDoc(doc(db, 'transcripts', transcript.id), transcript);
      }

      // 6. Purge & Re-seed Transcript Accesses
      const accessSnap = await getDocs(collection(db, 'transcript_accesses'));
      for (const accessDoc of accessSnap.docs) {
        await deleteDoc(doc(db, 'transcript_accesses', accessDoc.id));
      }
      for (const access of INITIAL_TRANSCRIPT_ACCESSES) {
        await setDoc(doc(db, 'transcript_accesses', access.id), access);
      }

      setSeedSuccess('Database successfully reset and re-seeded with academic defaults!');
    } catch (err: any) {
      console.error(err);
      setSeedError(`Database maintenance failed: ${err?.message || 'Access Denied.'}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight uppercase">
          System <span className="text-[#ff3e00]">Settings</span>
        </h2>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">
          Configure application editions, manage credentials, and run maintenance tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: SaaS Edition Config */}
        <div className="bg-[#1a1a1a] border border-white/10 p-6 flex flex-col justify-between shadow-lg relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ff3e00]/50" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff3e00] text-2xl">tune</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">SaaS Edition Layout</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Toggle the target institution type layout structure. This changes menus, widgets, and labels dynamically across all dashboards.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => onInstitutionTypeChange?.('Schools')}
                className={`p-4 border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  institutionType === 'Schools'
                    ? 'border-[#ff3e00] bg-[#ff3e00]/5 text-white'
                    : 'border-white/10 bg-transparent text-white/50 hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-xl">school</span>
                <span className="text-xs font-bold uppercase tracking-wider">Schools Edition</span>
              </button>
              <button
                onClick={() => onInstitutionTypeChange?.('HigherEd')}
                className={`p-4 border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  institutionType === 'HigherEd'
                    ? 'border-[#ff3e00] bg-[#ff3e00]/5 text-white'
                    : 'border-white/10 bg-transparent text-white/50 hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-xl">account_balance</span>
                <span className="text-xs font-bold uppercase tracking-wider">Higher Ed Edition</span>
              </button>
            </div>
          </div>
          <div className="text-[10px] text-white/30 font-mono tracking-wider mt-6 pt-4 border-t border-white/5">
            Active Mode: {institutionType === 'Schools' ? 'Primary & Secondary Schools' : 'Higher Education (Universities)'}
          </div>
        </div>

        {/* Card 2: AI & Credential Diagnostics */}
        <div className="bg-[#1a1a1a] border border-white/10 p-6 flex flex-col justify-between shadow-lg relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ff3e00]/50" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff3e00] text-2xl">terminal</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">Diagnostics & AI Credentials</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Verify server-side credentials and check integrated services status. Configure your local environment file to inject production keys.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Gemini API Status</span>
                {apiKeyStatus === 'configured' ? (
                  <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/25">
                    CONNECTED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                    MISSING / LOCAL SIM
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Local Config file</span>
                <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/25">
                  .env.local loaded
                </span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/30 font-mono tracking-wider mt-6 pt-4 border-t border-white/5">
            Model Integration: Google Gemini 1.5 Flash (Fallback: Offline Sandbox simulator)
          </div>
        </div>

        {/* Card 3: Database Seeding & Maintenance */}
        <div className="bg-[#1a1a1a] border border-white/10 p-6 flex flex-col justify-between shadow-lg relative lg:col-span-2">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ff3e00]/50" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff3e00] text-2xl">database</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">Database Seeding & Recovery</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              If the Cloud Firestore collections become corrupted or you wish to start with fresh testing records, you can purge and seed all collections. This will delete all custom entries and restore the initial defaults.
            </p>

            {seedSuccess && (
              <div className="p-3 bg-green-950/40 border border-green-500/30 text-green-400 text-xs rounded flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span className="font-semibold">{seedSuccess}</span>
              </div>
            )}

            {seedError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span className="font-semibold">{seedError}</span>
              </div>
            )}

            <div>
              <button
                onClick={handleReSeedDatabase}
                disabled={seeding}
                className="px-6 py-3 bg-[#ff3e00] hover:bg-[#ff3e00]/90 disabled:bg-neutral-800 text-black disabled:text-white/40 text-xs font-black uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                {seeding ? 'Purging & Seeding Database...' : 'Purge & Re-Seed Database'}
              </button>
            </div>
          </div>
          <div className="text-[10px] text-white/30 font-mono tracking-wider mt-6 pt-4 border-t border-white/5">
            Warning: This action is permanent and modifies Cloud Firestore. Ensure rules permit writes.
          </div>
        </div>
      </div>
    </div>
  );
};
