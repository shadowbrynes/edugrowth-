import React, { useState, useEffect } from 'react';
import { CbtExam, CbtQuestion } from '../../types/excelmind';
import { CBT_EXAMS_DATA } from '../../data/excelmindData';

interface CbtExamViewProps {
  initialExamId?: string;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({ initialExamId }) => {
  const [exams, setExams] = useState<CbtExam[]>(CBT_EXAMS_DATA);
  const [selectedExamId, setSelectedExamId] = useState<string>(
    initialExamId || CBT_EXAMS_DATA[0].exam_id
  );
  const [selectedBodyFilter, setSelectedBodyFilter] = useState<'All' | 'WAEC' | 'JAMB' | 'NECO' | 'School'>('All');
  
  // Active Exam Session States
  const [isExamActive, setIsExamActive] = useState(false);
  const [currentExam, setCurrentExam] = useState<CbtExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Result metrics
  const [examResult, setExamResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    grade: string;
    jambScore: number;
    timeTaken: string;
  } | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExamActive && !isSubmitted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamActive, isSubmitted, secondsRemaining]);

  const handleStartExam = (exam: CbtExam) => {
    setCurrentExam(exam);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setSecondsRemaining(exam.durationMinutes * 60);
    setIsExamActive(true);
    setIsSubmitted(false);
    setExamResult(null);
  };

  const handleSelectAnswer = (questionId: number, key: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: key
    }));
  };

  const handleClearAnswer = (questionId: number) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const copy = new Set(prev);
      if (copy.has(questionId)) {
        copy.delete(questionId);
      } else {
        copy.add(questionId);
      }
      return copy;
    });
  };

  const calculateGrade = (pct: number) => {
    if (pct >= 80) return 'A1 (Distinction)';
    if (pct >= 75) return 'B2 (Very Good)';
    if (pct >= 70) return 'B3 (Good)';
    if (pct >= 65) return 'C4 (Credit)';
    if (pct >= 60) return 'C5 (Credit)';
    if (pct >= 50) return 'C6 (Credit)';
    if (pct >= 45) return 'D7 (Pass)';
    if (pct >= 40) return 'E8 (Pass)';
    return 'F9 (Fail)';
  };

  const handleAutoSubmit = () => {
    if (!currentExam) return;

    let correctCount = 0;
    currentExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = currentExam.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const timeSpentSeconds = currentExam.durationMinutes * 60 - secondsRemaining;
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;

    setExamResult({
      score: correctCount,
      total,
      percentage,
      grade: calculateGrade(percentage),
      jambScore: Math.round((percentage / 100) * 400),
      timeTaken: `${mins}m ${secs}s`
    });

    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExams = exams.filter((e) => {
    if (selectedBodyFilter === 'All') return true;
    return e.examBody === selectedBodyFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. EXAM SELECTION / DASHBOARD (When not actively testing) */}
      {!isExamActive && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#111B5E] via-indigo-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-emerald-300">
                    <span className="material-symbols-outlined text-2xl">timer</span>
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Standard Computer-Based Testing Engine
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  CBT Examination & Mock Testing Center
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
                  Simulate high-stakes examinations featuring question bank randomization, real-time countdown timers, instantaneous marking, and detailed solutions.
                </p>
              </div>

              {/* Supported Exam Bodies Pill */}
              <div className="flex flex-wrap gap-2">
                {['WAEC', 'NECO', 'JAMB', 'School Term'].map((body) => (
                  <span
                    key={body}
                    className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-black text-emerald-300"
                  >
                    {body}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mr-2">
              Exam Body:
            </span>
            {(['All', 'WAEC', 'JAMB', 'NECO', 'School'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedBodyFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedBodyFilter === filter
                    ? 'bg-[#111B5E] text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Available CBT Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => (
              <div
                key={exam.exam_id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {exam.examBody} Exam
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {exam.year}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Subject: <span className="font-bold text-slate-700 dark:text-slate-300">{exam.subject}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-blue-500">help</span>
                      <span>{exam.totalQuestions} Questions</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-amber-500">hourglass_top</span>
                      <span>{exam.durationMinutes} Minutes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full py-3 bg-[#111B5E] hover:bg-blue-900 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Start CBT Test Engine</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. ACTIVE CBT EXAM HUD (Full Testing Environment) */}
      {isExamActive && currentExam && !isSubmitted && (
        <div className="space-y-6">
          
          {/* Exam Header HUD Bar */}
          <div className="bg-[#111B5E] text-white rounded-3xl p-5 shadow-xl border border-indigo-900 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
                  {currentExam.examBody} Active Test
                </span>
                <span className="text-xs text-indigo-200">{currentExam.subject}</span>
              </div>
              <h2 className="text-base font-black text-white mt-1">{currentExam.title}</h2>
            </div>

            {/* Countdown Timer (Prominent display) */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-black text-sm shadow-inner ${
                  secondsRemaining < 300
                    ? 'bg-rose-900/60 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-indigo-950/80 border-indigo-700 text-emerald-300'
                }`}
              >
                <span className="material-symbols-outlined text-lg">timer</span>
                <span>Time Remaining: {formatTimer(secondsRemaining)}</span>
              </div>

              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                Finish & Submit
              </button>
            </div>
          </div>

          {/* Question Body + Question Grid Palette */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Question Stage (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[460px]">
              
              {/* Question Meta & Number */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-mono text-[#111B5E] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl">
                      Question {currentQuestionIndex + 1} of {currentExam.questions.length}
                    </span>
                    {currentExam.questions[currentQuestionIndex].topic && (
                      <span className="text-xs text-slate-400 font-medium">
                        Topic: {currentExam.questions[currentQuestionIndex].topic}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleFlag(currentExam.questions[currentQuestionIndex].id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      flaggedQuestions.has(currentExam.questions[currentQuestionIndex].id)
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">flag</span>
                    <span>
                      {flaggedQuestions.has(currentExam.questions[currentQuestionIndex].id)
                        ? 'Flagged for Review'
                        : 'Flag for Review'}
                    </span>
                  </button>
                </div>

                {/* Question Prompt */}
                <div className="py-6">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-relaxed">
                    {currentExam.questions[currentQuestionIndex].question}
                  </h3>
                </div>

                {/* Options A, B, C, D */}
                <div className="space-y-3 pt-2">
                  {currentExam.questions[currentQuestionIndex].options.map((opt) => {
                    const currentQId = currentExam.questions[currentQuestionIndex].id;
                    const isSelected = userAnswers[currentQId] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectAnswer(currentQId, opt.key)}
                        className={`w-full p-4 rounded-2xl text-left transition flex items-center gap-4 border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-sm'
                            : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl font-mono font-black flex items-center justify-center text-xs shrink-0 transition ${
                            isSelected
                              ? 'bg-[#111B5E] text-white shadow-md'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {opt.key}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Controls */}
              <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => handleClearAnswer(currentExam.questions[currentQuestionIndex].id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Clear Choice
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex < currentExam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-[#111B5E] hover:bg-blue-900 text-white text-xs font-black shadow transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Submit Examination</span>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Question Navigation Grid (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
                  Question Palette ({currentExam.questions.length})
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Click any number to jump directly</p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span> Flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span> Unanswered
                </span>
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {currentExam.questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions.has(q.id);
                  const isCurrent = currentQuestionIndex === idx;

                  let btnBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                  if (isAnswered) {
                    btnBg = 'bg-emerald-500 text-white font-black';
                  } else if (isFlagged) {
                    btnBg = 'bg-amber-400 text-slate-950 font-black';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${btnBg} ${
                        isCurrent ? 'ring-2 ring-[#111B5E] dark:ring-blue-400 scale-105 shadow-md' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold text-emerald-600">{Object.keys(userAnswers).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered:</span>
                  <span className="font-bold text-slate-400">
                    {currentExam.questions.length - Object.keys(userAnswers).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Flagged:</span>
                  <span className="font-bold text-amber-500">{flaggedQuestions.size}</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Submit CBT Paper
              </button>
            </div>

          </div>

          {/* Confirm Submission Modal */}
          {showConfirmSubmit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <span className="material-symbols-outlined text-3xl">warning</span>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Confirm CBT Submission?
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You have answered <b className="text-emerald-600">{Object.keys(userAnswers).length}</b> of{' '}
                  <b>{currentExam.questions.length}</b> questions. Once submitted, your examination will be instantly evaluated by the ExcelMind grading engine.
                </p>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                  >
                    Return to Test
                  </button>
                  <button
                    onClick={handleAutoSubmit}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                  >
                    Yes, Submit Now
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. CBT EXAMINATION RESULT & PERFORMANCE REPORT */}
      {isSubmitted && currentExam && examResult && (
        <div className="space-y-6">
          
          {/* Result Score Card Banner */}
          <div className="bg-gradient-to-r from-[#111B5E] via-indigo-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-900 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CBT Appraisal Complete
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Examination Result & Performance Breakdown
                </h1>
                <p className="text-xs text-indigo-200">
                  {currentExam.title} • Time Taken: {examResult.timeTaken}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsExamActive(false);
                  setIsSubmitted(false);
                  setCurrentExam(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
              >
                Return to CBT Catalog
              </button>
            </div>

            {/* Score Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-300">Raw Score</span>
                <p className="text-2xl font-black font-mono text-white mt-1">
                  {examResult.score} / {examResult.total}
                </p>
                <span className="text-[10px] text-emerald-300 font-bold">{examResult.percentage}% Accuracy</span>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-300">WAEC / NECO Grade</span>
                <p className="text-2xl font-black text-amber-300 mt-1">
                  {examResult.grade.split(' ')[0]}
                </p>
                <span className="text-[10px] text-indigo-200">{examResult.grade}</span>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-300">JAMB UTME Sim</span>
                <p className="text-2xl font-black font-mono text-blue-300 mt-1">
                  {examResult.jambScore} / 400
                </p>
                <span className="text-[10px] text-indigo-200">Competitive Cut-Off</span>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-300">Duration</span>
                <p className="text-2xl font-black font-mono text-emerald-300 mt-1">
                  {examResult.timeTaken}
                </p>
                <span className="text-[10px] text-indigo-200">Pacing: Optimum</span>
              </div>
            </div>
          </div>

          {/* Detailed Question-by-Question Solution Review */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Question-by-Question Solution Review & Marking Scheme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review your answers alongside official examiner rationales and textbook derivations
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {currentExam.questions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/10'
                        : 'border-rose-200 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        Question {idx + 1}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isCorrect ? '✓ Correct' : userChoice ? '✗ Incorrect' : '○ Not Attempted'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-3">
                      {q.question}
                    </h4>

                    {/* Options Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      {q.options.map((opt) => {
                        const isUserAnswer = userChoice === opt.key;
                        const isRightAnswer = q.correctAnswer === opt.key;

                        let optStyle = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                        if (isRightAnswer) {
                          optStyle = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-400 font-bold';
                        } else if (isUserAnswer && !isRightAnswer) {
                          optStyle = 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-400 font-bold';
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-black/10 dark:bg-white/10 flex items-center justify-center font-mono text-[11px]">
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                            {isRightAnswer && <span className="ml-auto text-emerald-600 font-bold">✓ (Correct)</span>}
                            {isUserAnswer && !isRightAnswer && <span className="ml-auto text-rose-600 font-bold">✗ (Your Choice)</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-bold text-[#111B5E] dark:text-blue-400 block mb-1">
                        Examiner Solution & Marking Rationale:
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => handleStartExam(currentExam)}
                className="px-5 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Retake Examination
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
