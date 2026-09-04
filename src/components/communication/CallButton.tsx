import React, { useState } from 'react';
import { apiRequest } from '../../services/api';

interface CallButtonProps {
  teacherName: string;
  phoneNumber: string;
  teacherId?: number;
  classNameCustom?: string;
}

export const CallButton: React.FC<CallButtonProps> = ({
  teacherName,
  phoneNumber,
  teacherId = 1,
  classNameCustom = ''
}) => {
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const handleCallClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Log call event
    try {
      await apiRequest('/communication/log', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: teacherId,
          communicationType: 'call'
        })
      });
    } catch (e) {
      // Ignore
    }

    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      setShowDesktopModal(true);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCallClick}
        className={`px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${classNameCustom}`}
        title={`Call ${teacherName}`}
      >
        <span className="material-symbols-outlined text-base">call</span>
        <span>Call</span>
      </button>

      {/* Desktop Modal for Phone Dialing */}
      {showDesktopModal && (
        <div
          onClick={() => setShowDesktopModal(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center animate-in fade-in zoom-in-95"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Call {teacherName}
              </h3>
              <p className="text-xs text-slate-500">
                Direct phone hotline verified by ExcelMind Academic Administration.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-black text-base text-blue-600 dark:text-blue-400">
              {phoneNumber}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyNumber}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Number'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDesktopModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>

            <span className="text-[10px] text-slate-400 block font-mono">
              Working Hours: Mon-Fri 8:00 AM - 5:00 PM
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CallButton;
