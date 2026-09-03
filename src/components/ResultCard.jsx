import React from 'react';

export const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
      <div>
        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{result.subject}</h4>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
          <span>CA: {result.caScore}/30</span>
          <span>•</span>
          <span>Exam: {result.examScore}/70</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-black font-mono text-[#111B5E] dark:text-blue-400">
          {result.totalScore}%
        </span>
        <span className="block text-[10px] font-bold text-emerald-600 font-mono">
          {result.grade}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
