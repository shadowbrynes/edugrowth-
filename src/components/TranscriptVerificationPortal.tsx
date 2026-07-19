import React from 'react';
import { TRANSCRIPTS } from '../data/mockData';
import { TranscriptData } from '../types';

interface TranscriptVerificationPortalProps {
  studentId: string;
  onEnterPortal: () => void;
}

export const TranscriptVerificationPortal: React.FC<TranscriptVerificationPortalProps> = ({
  studentId,
  onEnterPortal,
}) => {
  const currentTranscript: TranscriptData = TRANSCRIPTS[studentId] || TRANSCRIPTS['alexander'];

  // Cryptographic details to show extreme technical craft and authenticity
  const mockTransactionHash = `0x${studentId === 'alice' ? 'fa92e811c' : studentId === 'leo' ? '2b09ff82a' : '7d3ea2b19'}cf050be6281e7d9961a8b301c23a7e48b81db8271e624c96a75f128`;
  const blockHeight = studentId === 'alice' ? '18,442,091' : studentId === 'leo' ? '18,442,154' : '18,442,109';
  const timestamp = new Date(currentTranscript.issueDate).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-[#ff3e00] selection:text-black relative overflow-x-hidden">
      {/* Decorative background grid and ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff3e00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#1a1a1a] border-2 border-[#ff3e00]/30 shadow-2xl rounded-sm p-6 md:p-10 z-10 flex flex-col gap-8 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#ff3e00]/10 to-transparent pointer-events-none" />
        
        {/* Verification Success Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0c0c0c] border border-[#ff3e00]/50 flex items-center justify-center font-black text-2xl text-[#ff3e00] tracking-tighter shrink-0">
              SJA
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Saint Jude&apos;s Academy Registry</div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight m-0 text-white flex items-center gap-2">
                Digital Record Verification
                <span className="material-symbols-outlined text-green-400 text-xl font-bold">verified</span>
              </h1>
              <div className="text-[10px] text-green-400 font-mono mt-0.5 tracking-wider uppercase font-semibold">
                Status: Authentic cryptographic signature verified
              </div>
            </div>
          </div>
          <button
            onClick={onEnterPortal}
            className="px-4 py-2 bg-[#ff3e00] text-black hover:bg-[#ff3e00]/90 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 self-stretch md:self-auto justify-center"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            Enter EduGrowth Portal
          </button>
        </div>

        {/* Ledger Stamp / Blockchain Details */}
        <div className="bg-[#0c0c0c] border border-green-500/30 p-5 rounded-sm">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-3">
            <span className="material-symbols-outlined text-green-400 animate-pulse">lock</span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Cryptographic Certificate Information</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <div className="text-white/40 uppercase tracking-wider text-[9px] font-bold">Registry Transaction Hash:</div>
              <div className="text-green-400 break-all select-all font-mono bg-white/[0.02] p-1.5 border border-white/5">{mockTransactionHash}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/40 uppercase tracking-wider text-[9px] font-bold block">Signature Block:</span>
                <span className="text-white font-bold block mt-0.5">#{blockHeight}</span>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider text-[9px] font-bold block">Security Status:</span>
                <span className="text-green-400 font-black block mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping" />
                  SECURED
                </span>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider text-[9px] font-bold block">Validator Node:</span>
                <span className="text-white/80 block mt-0.5">SJA-NODE-01</span>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider text-[9px] font-bold block">Signed On:</span>
                <span className="text-white/80 block mt-0.5">{currentTranscript.issueDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Student Snapshot Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0c0c0c] border border-white/10 p-6">
          <div className="col-span-1 md:col-span-3 flex justify-center">
            <div className="w-28 h-28 border border-white/20 relative overflow-hidden bg-[#1a1a1a]">
              <img
                src={currentTranscript.photoUrl}
                alt={currentTranscript.fullName}
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute bottom-0 inset-x-0 bg-green-500 text-black text-[9px] font-black uppercase tracking-widest text-center py-0.5">
                Authentic
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Student Name</span>
              <span className="text-base font-bold text-white uppercase tracking-wide block mt-1">{currentTranscript.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Student ID Number</span>
              <span className="text-base font-mono text-[#ff3e00] block mt-1">{currentTranscript.studentId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Academic Class</span>
              <span className="text-base font-bold text-white uppercase tracking-wide block mt-1">{currentTranscript.academicClass}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Cumulative GPA</span>
              <span className="text-base font-black text-[#ff3e00] tracking-tighter block mt-1">
                {currentTranscript.finalGpa.toFixed(2)} / {currentTranscript.gpaScale.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Class Rank Standing</span>
              <span className="text-base font-bold text-white block mt-1">
                {currentTranscript.ranking} of {currentTranscript.totalClassSize}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Transcript Status</span>
              <span className="text-base font-bold text-green-400 uppercase block mt-1">{currentTranscript.status}</span>
            </div>
          </div>
        </div>

        {/* Graded Course Records Table */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#ff3e00] mb-4 border-l-2 border-[#ff3e00] pl-3">
            Verified Academic Records & Grade Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-white/10 text-xs">
              <thead>
                <tr className="bg-[#0c0c0c] text-[9px] uppercase tracking-[0.2em] text-white/60 font-bold border-b border-white/10">
                  <th className="p-3 border-r border-white/10">Subject Course Title</th>
                  <th className="p-3 border-r border-white/10 text-center">CA Score (30)</th>
                  <th className="p-3 border-r border-white/10 text-center">Exam Score (70)</th>
                  <th className="p-3 border-r border-white/10 text-center">Total Score</th>
                  <th className="p-3 text-center">Official Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-mono text-white/80">
                {currentTranscript.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01]">
                    <td className="p-3 border-r border-white/10 font-bold text-white uppercase font-sans tracking-wide">
                      {sub.subject}
                    </td>
                    <td className="p-3 border-r border-white/10 text-center text-white/60">
                      {sub.caScore} / 30
                    </td>
                    <td className="p-3 border-r border-white/10 text-center text-white/60">
                      {sub.examScore} / 70
                    </td>
                    <td className="p-3 border-r border-white/10 text-center font-bold text-white">
                      {sub.totalScore}%
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 bg-[#0c0c0c] border border-green-500/50 text-green-400 font-bold text-xs">
                        {sub.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seal stamp and footer notices */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="text-center sm:text-left text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
            <div>Document Ref: {currentTranscript.transcriptId}</div>
            <div>Decentralized SHA-256 Ledger System Verified</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-400 text-3xl">verified_user</span>
            <div className="text-right">
              <div className="text-[10px] uppercase font-black text-white">Saint Jude&apos;s Academy</div>
              <div className="text-[8px] uppercase tracking-widest text-white/50 font-mono">Registry Authority Seal</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-[9px] uppercase tracking-[0.3em] opacity-40 text-center max-w-md leading-relaxed">
        This is an official verification site. Any modifications to this record are strictly logged. Unauthorized spoofing of verification is a prosecutable offense under Academic Security Guidelines.
      </footer>
    </div>
  );
};
