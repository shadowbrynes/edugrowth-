import React, { useState } from 'react';

interface UploadScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  onUploadScore: (assignmentTitle: string, avgPercentage: number) => void;
}

export const UploadScoresModal: React.FC<UploadScoresModalProps> = ({ isOpen, onClose, classNameTitle, onUploadScore }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [maxPoints, setMaxPoints] = useState('100');
  const [avgScore, setAvgScore] = useState('88');
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentTitle) return;
    onUploadScore(assignmentTitle, Number(avgScore) || 85);
    setAssignmentTitle('');
    setFileUploaded(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 bg-primary-container text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
            <div>
              <h3 className="text-lg font-bold">Upload Assessment Scores</h3>
              <p className="text-xs text-on-primary-container">{classNameTitle} • Batch Processing</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Assessment / Quiz Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Calculus Quiz 5 - Definite Integrals"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Max Score Possible</label>
              <input
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Class Average (%)</label>
              <input
                type="number"
                value={avgScore}
                onChange={(e) => setAvgScore(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
              />
            </div>
          </div>

          {/* Drag & Drop File Upload */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Import CSV or Spreadsheet Spreadsheet</label>
            <div
              onClick={() => setFileUploaded(true)}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${fileUploaded ? 'border-tertiary-fixed bg-tertiary-container/10' : 'border-outline-variant hover:border-secondary bg-surface'}`}
            >
              <span className={`material-symbols-outlined text-3xl mb-1 ${fileUploaded ? 'text-tertiary-fixed-dim' : 'text-secondary'}`}>
                {fileUploaded ? 'check_circle' : 'table_view'}
              </span>
              <p className="text-xs font-bold text-on-surface">
                {fileUploaded ? 'scores_batch_oct24.csv Ready to Import' : 'Click to select or drag & drop grade sheet'}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Supports .CSV, .XLSX, and EduManage JSON formats</p>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              Publish Scores
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
