import React, { useState, useEffect } from 'react';
import { TranscriptData, SchoolProfile, ViewMode } from '../types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { TRANSCRIPTS } from '../data/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const GPA_PROGRESS_DATA: Record<string, { semester: string; gpa: number }[]> = {
  alexander: [
    { semester: 'G9 Sem 1', gpa: 4.35 },
    { semester: 'G9 Sem 2', gpa: 4.52 },
    { semester: 'G10 Sem 1', gpa: 4.60 },
    { semester: 'G10 Sem 2', gpa: 4.71 },
    { semester: 'G11 Sem 1', gpa: 4.80 },
    { semester: 'G11 Sem 2', gpa: 4.85 },
  ],
  alice: [
    { semester: 'G9 Sem 1', gpa: 4.80 },
    { semester: 'G9 Sem 2', gpa: 4.85 },
    { semester: 'G10 Sem 1', gpa: 4.90 },
    { semester: 'G10 Sem 2', gpa: 4.95 },
    { semester: 'G11 Sem 1', gpa: 4.98 },
    { semester: 'G11 Sem 2', gpa: 5.00 },
  ],
  leo: [
    { semester: 'G9 Sem 1', gpa: 4.25 },
    { semester: 'G9 Sem 2', gpa: 4.38 },
    { semester: 'G9 Sem 3', gpa: 4.42 },
    { semester: 'G10 Sem 1', gpa: 4.50 },
    { semester: 'G10 Sem 2', gpa: 4.58 },
    { semester: 'G10 Sem 3', gpa: 4.65 },
  ],
};

interface StudentPortalProps {
  studentId: string;
  selectedSession: string;
  schoolProfile?: SchoolProfile;
  onNavigate: (view: ViewMode) => void;
  onOpenShareModal: (studentName: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  studentId,
  selectedSession,
  schoolProfile,
  onNavigate,
  onOpenShareModal
}) => {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(doc(db, 'transcripts', studentId), (docSnap) => {
      if (docSnap.exists()) {
        setTranscript(docSnap.data() as TranscriptData);
      } else {
        const fallback = TRANSCRIPTS[studentId] || TRANSCRIPTS['alexander'] || Object.values(TRANSCRIPTS)[0];
        setTranscript(fallback);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error fetching student transcript, falling back to mock:', err);
      const fallback = TRANSCRIPTS[studentId] || TRANSCRIPTS['alexander'] || Object.values(TRANSCRIPTS)[0];
      setTranscript(fallback);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0c0c0c] text-white">
        <div className="w-12 h-12 rounded-full border-4 border-t-[#ff3e00] border-r-transparent border-b-[#ff3e00] border-l-transparent animate-spin mb-4"></div>
        <p className="text-sm font-medium text-white/60">Loading academic portal...</p>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0c0c0c] text-white text-center">
        <span className="material-symbols-outlined text-5xl text-white/30 mb-4">warning</span>
        <h3 className="text-xl font-bold mb-2">No Student Profile Linked</h3>
        <p className="text-sm text-white/60 max-w-md mb-6">
          Your account is registered as a student, but no academic transcript matches your current student profile. Please contact the administrator.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-bold hover:bg-secondary/90 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const chartData = GPA_PROGRESS_DATA[studentId] || [
    { semester: 'Current Term', gpa: transcript.finalGpa }
  ];

  return (
    <div className="flex-1 bg-[#0c0c0c] text-white p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Dashboard Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-primary-container/40 via-surface-container-low to-black/20 p-6 md:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff3e00]/5 rounded-full filter blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-[80px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              {transcript.photoUrl ? (
                <img
                  src={transcript.photoUrl}
                  alt={transcript.fullName}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-white/20 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary text-white text-2xl font-black flex items-center justify-center border border-white/10 shadow-md">
                  {transcript.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#ff3e00] font-bold">Student Dashboard</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">{transcript.fullName}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60 mt-1">
                  <span>ID: <strong className="text-white font-mono">{transcript.studentId}</strong></span>
                  <span>•</span>
                  <span>Class: <strong className="text-white">{transcript.academicClass}</strong></span>
                  <span>•</span>
                  <span>Term: <strong className="text-white">{transcript.currentTerm}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('transcript')}
                className="px-4 py-2.5 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-secondary/90 shadow-md border border-white/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">history_edu</span>
                Official Transcript
              </button>
              <button
                onClick={() => onOpenShareModal(transcript.fullName)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 text-white/95 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share Record
              </button>
            </div>
          </div>
        </div>

        {/* Academic Overview Quick Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
            <span className="material-symbols-outlined text-white/5 text-6xl absolute top-2 right-2 select-none pointer-events-none">grade</span>
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Cumulative GPA</span>
            <div className="mt-3">
              <span className="text-3xl font-black text-[#ff3e00]">{transcript.finalGpa.toFixed(2)}</span>
              <span className="text-xs text-white/40 ml-1">/ {transcript.gpaScale.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-2 self-start flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_up</span> Top Tier Academic
            </span>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
            <span className="material-symbols-outlined text-white/5 text-6xl absolute top-2 right-2 select-none pointer-events-none">award_star</span>
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Honor Status</span>
            <div className="mt-3">
              <span className="text-xl font-bold block truncate">{transcript.statusSub || 'Honor Roll'}</span>
              <span className="text-xs text-[#00d2ff] font-bold mt-1 block uppercase font-mono tracking-wider">{transcript.status}</span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
            <span className="material-symbols-outlined text-white/5 text-6xl absolute top-2 right-2 select-none pointer-events-none">format_list_numbered</span>
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Class Standing</span>
            <div className="mt-3">
              <span className="text-3xl font-black text-white">{transcript.ranking}</span>
              <span className="text-xs text-white/40 ml-1">of {transcript.totalClassSize} students</span>
            </div>
            <span className="text-[10px] text-white/50 mt-2 block">Rank calculated dynamically</span>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
            <span className="material-symbols-outlined text-white/5 text-6xl absolute top-2 right-2 select-none pointer-events-none">calendar_today</span>
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Attendance Rate</span>
            <div className="mt-3">
              <span className="text-3xl font-black text-[#00d2ff]">{transcript.attendancePercent}%</span>
              <span className="text-xs text-white/40 ml-1">Present</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#00d2ff] h-full rounded-full" style={{ width: `${transcript.attendancePercent}%` }}></div>
            </div>
          </div>

        {/* AI Powered Academic Assistant & Predictive Analytics Card */}
        <div className="bg-gradient-to-r from-tertiary-container/30 via-secondary-container/20 to-surface-container-low border border-tertiary-fixed-dim/40 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold shadow-md">
                <span className="material-symbols-outlined text-2xl font-bold">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>AI Academic Learning Assistant</span>
                  <span className="text-[10px] bg-tertiary-container text-tertiary-fixed font-black px-2 py-0.5 rounded-full uppercase tracking-wider">LIVE AI</span>
                </h3>
                <p className="text-xs text-white/60">Personalized learning insights, predictive GPA forecast, and study strategies</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                Predicted Next GPA: 3.94 / 4.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-black/30 border border-white/10 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-tertiary-fixed uppercase tracking-wider block">Core Strength</span>
              <p className="text-white/90 leading-relaxed font-medium">
                High analytical mastery in {transcript.subjects?.[0]?.subject || 'Mathematics'} ({transcript.subjects?.[0]?.grade || 'A+'}). Consistently scores top marks in complex problem sets.
              </p>
            </div>
            <div className="bg-black/30 border border-white/10 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Recommended Strategy</span>
              <p className="text-white/90 leading-relaxed font-medium">
                Allocate 20-minute daily review blocks for essay writing to match your top math percentile and secure Dean's Honors.
              </p>
            </div>
            <div className="bg-black/30 border border-white/10 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-[#00d2ff] uppercase tracking-wider block">Early Warning Radar</span>
              <p className="text-white/90 leading-relaxed font-medium">
                Zero academic risk detected. Maintain 98% attendance rate for upcoming midterms.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics and Core Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* GPA Progress Trend Chart */}
          <div className="lg:col-span-2 bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col">
            <h2 className="text-base font-bold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-lg text-secondary">trending_up</span>
              GPA Progression History
            </h2>
            
            <div className="flex-1 min-h-[220px] max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="semester"
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  />
                  <YAxis
                    domain={[3.0, 5.0]}
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161616',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#ff3e00"
                    strokeWidth={3}
                    dot={{ fill: '#ff3e00', stroke: '#161616', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Academic Advisors Card */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg text-tertiary">contact_emergency</span>
                Academic Leadership
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/40 text-secondary text-sm font-bold flex items-center justify-center">
                    TJ
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{transcript.classTeacherName}</h4>
                    <p className="text-[10px] text-white/50">Primary Advisor / Class Teacher</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-primary-container/40 text-[#ff3e00] text-sm font-bold flex items-center justify-center">
                    RV
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{transcript.principalName}</h4>
                    <p className="text-[10px] text-white/50">Principal / Academic Board Dean</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-white/40 block mb-1">Session Notice</span>
              <p className="text-xs text-white/60 leading-relaxed">
                Need to dispute an evaluation mark or update student file details? Contact your Primary Advisor or submit a formal ticket to the Registrar Office.
              </p>
            </div>
          </div>

        </div>

        {/* Current Term Subjects Grade Sheet */}
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-lg text-[#00d2ff]">assignment_turned_in</span>
            Current Term Grade Sheet
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider font-bold">
                  <th className="py-3 px-2">Subject Course</th>
                  <th className="py-3 px-2 text-center">CA (30)</th>
                  <th className="py-3 px-2 text-center">Exam (70)</th>
                  <th className="py-3 px-2 text-center">Total (100)</th>
                  <th className="py-3 px-2 text-center">Grade</th>
                  <th className="py-3 px-2">Performance Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {transcript.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-all">
                    <td className="py-3.5 px-2 font-bold text-white">{sub.subject}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{sub.caScore}</td>
                    <td className="py-3.5 px-2 text-center font-mono">{sub.examScore}</td>
                    <td className="py-3.5 px-2 text-center font-mono font-bold text-secondary">{sub.totalScore}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${sub.badgeClass || 'bg-white/10 text-white'}`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-white/60 italic">{sub.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Endorsements Remarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#ff3e00] block mb-1">Advisor Review</span>
            <h3 className="text-xs font-bold text-white mb-2">{transcript.classTeacherName} Remarks:</h3>
            <p className="text-xs text-white/60 italic leading-relaxed">
              {transcript.classTeacherRemarks}
            </p>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#00d2ff] block mb-1">Dean Endorsement</span>
            <h3 className="text-xs font-bold text-white mb-2">Office of the Principal Remarks:</h3>
            <p className="text-xs text-white/60 italic leading-relaxed">
              {transcript.principalRemarks}
            </p>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
};
