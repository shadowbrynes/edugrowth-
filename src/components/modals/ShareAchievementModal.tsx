import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  transcriptId: string;
  rankText: string;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({ isOpen, onClose, studentName, transcriptId, rankText }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window?.location?.origin 
    ? `${window.location.origin}/verify/${transcriptId}` 
    : `https://edugrowth-tawny.vercel.app/verify/${transcriptId}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-md overflow-hidden text-center">
        <div className="p-6 bg-tertiary-container text-tertiary-fixed flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary-fixed text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
            <div className="text-left">
              <h3 className="text-lg font-bold">Share Achievement</h3>
              <p className="text-xs text-white/80">{studentName} • Official Recognition</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-surface-container-low p-4 rounded-2xl border border-tertiary-fixed-dim/40 inline-block mx-auto shadow-inner">
            <img src={ASSETS.qrCode} alt="Verification QR Code" className="w-36 h-36 mx-auto rounded-lg" />
            <p className="text-[10px] font-mono font-bold text-on-surface-variant mt-2 uppercase tracking-widest">
              ID: {transcriptId}
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-on-surface">Verified Academic Achievement</h4>
            <p className="text-xs text-secondary font-bold mt-0.5">{rankText}</p>
            <p className="text-xs text-on-surface-variant mt-2 px-4">
              This digital QR verification link allows universities and institutional scholarship boards to instantly validate authenticity.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-left">Secure Public Verification Link</label>
            <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline-variant">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent border-none focus:outline-none text-xs font-mono text-on-surface px-2"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 ${copied ? 'bg-tertiary-container text-tertiary-fixed shadow' : 'bg-secondary text-white hover:bg-secondary/90'}`}
              >
                <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
          <button
            onClick={() => {
              const text = `Check out ${studentName}'s official academic achievement on EduGrowth! Rank: ${rankText} • ${shareUrl}`;
              if (navigator.share) {
                navigator.share({ title: 'EduGrowth Academic Achievement', text, url: shareUrl });
              } else {
                handleCopy();
              }
            }}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share via social or email
          </button>
        </div>
      </div>
    </div>
  );
};
