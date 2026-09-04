import React, { useState, useEffect } from 'react';
import { CbtExam, CbtQuestion } from '../../types/excelmind';
import { CBT_EXAMS_DATA } from '../../data/excelmindData';
import { examApi } from '../../services/api';

interface CbtExamViewProps {
  initialExamId?: string;
  onNavigateToAiTutor?: (prompt: string) => void;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({ initialExamId, onNavigateToAiTutor }) => {
  // Navigation Tabs: 'cbt-engine' | 'analytics' | 'question-bank' | 'add-question'
  const [activeTab, setActiveTab] = useState<'cbt-engine' | 'analytics' | 'question-bank' | 'add-question'>('cbt-engine');

  // Student Profile Context
  const [studentContext] = useState({
    id: 1,
    name: 'John Doe',
    classLevel: 'SS3',
    department: 'Science',
    targetExams: ['WAEC', 'JAMB UTME', 'NECO']
  });

  // Filter & Generation States
  const [selectedExamBody, setSelectedExamBody] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Science');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<'simulation' | 'practice'>('simulation');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(20);
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Dynamic Data from Backend MySQL
  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: number; name: string; code: string; department_id: number; questionCount: number }>>([]);
  const [availableTopics, setAvailableTopics] = useState<Array<{ topic: string; question_count: number }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active CBT Session States
  const [isExamActive, setIsExamActive] = useState(false);
  const [currentExam, setCurrentExam] = useState<CbtExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Results & Analytics
  const [examResult, setExamResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    grade: string;
    jambScore: number;
    performanceRating?: string;
    timeTaken: string;
    weakTopics?: Array<{ topic: string; accuracy?: number }>;
    strongTopics?: Array<{ topic: string; accuracy?: number }>;
    aiRecommendation?: string;
    review?: any[];
  } | null>(null);

  const [studentAnalytics, setStudentAnalytics] = useState<{
    totalQuestionsAttempted: number;
    totalCorrectAnswers: number;
    overallAverage: number;
    weakTopics: string[];
    strongTopics: string[];
    recentResults: any[];
  } | null>(null);

  // Admin / Question Bank Browser States
  const [bankSearch, setBankSearch] = useState('');
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [bankTotal, setBankTotal] = useState(0);
  const [isBankLoading, setIsBankLoading] = useState(false);

  // New Question Form
  const [newQuestionForm, setNewQuestionForm] = useState({
    exam_body: 'WAEC',
    subject_name: 'Physics',
    class_level: 'SS3',
    department: 'Science',
    topic: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
    difficulty_level: 'Medium',
    year: 2024
  });
  const [addQuestionSuccess, setAddQuestionSuccess] = useState<string | null>(null);

  // Load Subjects on mount or department change
  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await examApi.getCbtSubjects(selectedDepartment !== 'All' ? selectedDepartment : undefined);
        if (res.success && res.subjects) {
          setAvailableSubjects(res.subjects);
          if (res.subjects.length > 0) {
            const hasCurrent = res.subjects.some((s: any) => s.name === selectedSubject);
            if (!hasCurrent) {
              setSelectedSubject(res.subjects[0].name);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch CBT subjects:', err);
      }
    }
    loadSubjects();
  }, [selectedDepartment]);

  // Load Topics when selectedSubject changes
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await examApi.getCbtTopics(selectedSubject);
        if (res.success && res.topics) {
          setAvailableTopics(res.topics);
          setSelectedTopic('All');
        }
      } catch (err) {
        console.warn('Could not fetch CBT topics:', err);
      }
    }
    if (selectedSubject) {
      loadTopics();
    }
  }, [selectedSubject]);

  // Load Lifetime Analytics on mount
  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await examApi.getCbtAnalytics(studentContext.id);
        if (res.success && res.analytics) {
          setStudentAnalytics(res.analytics);
        }
      } catch (err) {
        console.warn('Could not fetch CBT analytics:', err);
      }
    }
    loadAnalytics();
  }, [isSubmitted]);

  // Load Question Bank when question-bank tab is selected
  useEffect(() => {
    if (activeTab === 'question-bank') {
      loadQuestionBank();
    }
  }, [activeTab, selectedSubject, selectedExamBody, bankSearch]);

  const loadQuestionBank = async () => {
    setIsBankLoading(true);
    try {
      const res = await examApi.getQuestionBankAdmin({
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        exam_body: selectedExamBody !== 'All' ? selectedExamBody : undefined,
        search: bankSearch.trim() || undefined,
        limit: 30
      });
      if (res.success) {
        setBankQuestions(res.questions || []);
        setBankTotal(res.total || 0);
      }
    } catch (err) {
      console.warn('Could not fetch question bank:', err);
    } finally {
      setIsBankLoading(false);
    }
  };

  // Timer Countdown Effect
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

  // Dynamic Exam Generator from MySQL questions_bank
  const handleGenerateAndStart = async () => {
    setIsGenerating(true);
    try {
      const res = await examApi.generateCbtExam({
        exam_body: selectedExamBody,
        subject: selectedSubject,
        class_level: studentContext.classLevel,
        department: selectedDepartment,
        topic: selectedTopic !== 'All' ? selectedTopic : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        mode: selectedMode,
        count: selectedQuestionCount,
        year: selectedYear !== 'All' ? selectedYear : undefined
      });

      if (res.success && res.exam && res.exam.questions?.length > 0) {
        const generated = res.exam;
        setCurrentExam(generated);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setFlaggedQuestions(new Set());
        setSecondsRemaining(generated.durationMinutes * 60);
        setIsExamActive(true);
        setIsSubmitted(false);
        setExamResult(null);
      } else {
        // Fallback to local sample exams if backend fails
        fallbackStartExam();
      }
    } catch (err) {
      console.warn('Using local fallback examination:', err);
      fallbackStartExam();
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackStartExam = () => {
    const match = CBT_EXAMS_DATA.find(e => e.subject.toLowerCase() === selectedSubject.toLowerCase()) || CBT_EXAMS_DATA[0];
    setCurrentExam(match);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setSecondsRemaining(match.durationMinutes * 60);
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

  // Submit Exam & Auto-Marking with MySQL Persistence
  const handleAutoSubmit = async () => {
    if (!currentExam) return;

    const timeSpentSeconds = currentExam.durationMinutes * 60 - secondsRemaining;
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;

    // Call Backend Evaluation & Persistence API
    try {
      const res = await examApi.submitCbtExam({
        student_id: studentContext.id,
        exam_body: currentExam.examBody,
        subject_name: currentExam.subject,
        class_level: studentContext.classLevel,
        department: selectedDepartment,
        questions: currentExam.questions,
        answers: userAnswers,
        duration_taken_seconds: timeSpentSeconds
      });

      if (res.success && res.result) {
        const r = res.result;
        setExamResult({
          score: r.score,
          total: r.total,
          percentage: r.percentage,
          grade: r.grade,
          jambScore: r.jambScore,
          performanceRating: r.performanceRating,
          timeTaken: `${mins}m ${secs}s`,
          weakTopics: r.weakTopics,
          strongTopics: r.strongTopics,
          aiRecommendation: r.aiRecommendation,
          review: r.review
        });
        setIsSubmitted(true);
        setShowConfirmSubmit(false);
        return;
      }
    } catch (err) {
      console.warn('Backend submit notice, calculating locally:', err);
    }

    // Local evaluation fallback if backend is offline
    let correctCount = 0;
    currentExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = currentExam.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    setExamResult({
      score: correctCount,
      total,
      percentage,
      grade: calculateGrade(percentage),
      jambScore: Math.round((percentage / 100) * 400),
      performanceRating: percentage >= 75 ? 'Excellent' : percentage >= 50 ? 'Credit' : 'Needs Remediation',
      timeTaken: `${mins}m ${secs}s`,
      weakTopics: percentage < 60 ? [{ topic: currentExam.subject + ' Principles' }] : [],
      strongTopics: percentage >= 60 ? [{ topic: currentExam.subject + ' Fundamentals' }] : [],
      aiRecommendation: `Review your ${currentExam.subject} questions with the AI Academic Tutor for 7-pillar remediation.`
    });

    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  const handleCreateQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await examApi.createQuestionInBank(newQuestionForm);
      if (res.success) {
        setAddQuestionSuccess('Question successfully added to MySQL questions_bank!');
        setNewQuestionForm({
          exam_body: 'WAEC',
          subject_name: selectedSubject,
          class_level: 'SS3',
          department: selectedDepartment,
          topic: '',
          question_text: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_answer: 'A',
          explanation: '',
          difficulty_level: 'Medium',
          year: 2024
        });
        setTimeout(() => setAddQuestionSuccess(null), 4000);
      }
    } catch (err: any) {
      alert('Error creating question: ' + err.message);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. EXAM SELECTION / DASHBOARD (When not actively testing) */}
      {!isExamActive && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#111B5E] via-indigo-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-emerald-300">
                    <span className="material-symbols-outlined text-2xl">quiz</span>
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    WAEC • NECO • JAMB UTME • School Examination CBT Engine
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ExcelMind CBT Examination & Question Bank Engine
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
                  National examination simulator powered by dynamic MySQL question banking across 31+ Nigerian secondary school subjects. Practice by topic or simulate timed WAEC & JAMB examinations with auto-marking and AI tutor remediation.
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('cbt-engine')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'cbt-engine'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  <span>CBT Simulator</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'analytics'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('question-bank')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'question-bank'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  <span>Question Bank</span>
                </button>

                <button
                  onClick={() => setActiveTab('add-question')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'add-question'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>Add Question</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: CBT SIMULATOR & GENERATOR */}
          {activeTab === 'cbt-engine' && (
            <div className="space-y-6">
              
              {/* Dynamic Exam Configuration Console */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-600">tune</span>
                      <span>Configure Examination & Question Parameters</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Personalized for {studentContext.name} ({studentContext.classLevel} {studentContext.department})
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ MySQL Database: questions_bank
                  </span>
                </div>

                {/* Filter 1: Examination Body */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    1. Select Examination Body:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'WAEC', 'NECO', 'JAMB', 'School Exam'].map((body) => (
                      <button
                        key={body}
                        onClick={() => setSelectedExamBody(body)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                          selectedExamBody === body
                            ? 'bg-[#111B5E] text-white border-[#111B5E] shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {body === 'JAMB' ? 'JAMB UTME' : body}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 2: Department Selection */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    2. Select Department / Academic Stream:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'Science', label: '🔬 Science' },
                      { id: 'Commercial', label: '💼 Commercial' },
                      { id: 'Arts', label: '🎭 Arts & Humanities' },
                      { id: 'Junior', label: '🎒 Junior Secondary (JSS1-JSS3)' }
                    ].map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => setSelectedDepartment(dept.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                          selectedDepartment === dept.id
                            ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {dept.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 3: Subject Selection (Dynamic from MySQL) */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    3. Select Subject ({availableSubjects.length} available):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSubjects.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubject(sub.name)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer border flex flex-col justify-between ${
                          selectedSubject === sub.name
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <span className="truncate">{sub.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                          {sub.questionCount > 0 ? `${sub.questionCount} Banked` : 'Core Subject'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 4: Topic Selection (Dynamic) */}
                {availableTopics.length > 0 && (
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      4. Select Topic Focus ({selectedSubject}):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedTopic('All')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          selectedTopic === 'All'
                            ? 'bg-purple-900 text-white border-purple-900'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        All Syllabus Topics
                      </button>
                      {availableTopics.map((top) => (
                        <button
                          key={top.topic}
                          onClick={() => setSelectedTopic(top.topic)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            selectedTopic === top.topic
                              ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                          }`}
                        >
                          {top.topic} ({top.question_count})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter 5: Mode, Count & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      5. Testing Mode:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedMode('simulation')}
                        className={`p-2.5 rounded-xl font-bold transition cursor-pointer border text-center ${
                          selectedMode === 'simulation'
                            ? 'bg-[#111B5E] text-white border-[#111B5E]'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        ⏱ Exam Simulation
                      </button>
                      <button
                        onClick={() => setSelectedMode('practice')}
                        className={`p-2.5 rounded-xl font-bold transition cursor-pointer border text-center ${
                          selectedMode === 'practice'
                            ? 'bg-[#111B5E] text-white border-[#111B5E]'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        📖 Practice Drill
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      6. Number of Questions:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[10, 20, 50, 100].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSelectedQuestionCount(num)}
                          className={`py-2.5 rounded-xl font-mono font-black transition cursor-pointer border text-center ${
                            selectedQuestionCount === num
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      7. Past Question Year:
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                    >
                      <option value="All">All Years (1990 - 2025)</option>
                      <option value="2025">2025 Mock Examination</option>
                      <option value="2024">2024 Past Questions</option>
                      <option value="2023">2023 Past Questions</option>
                      <option value="2022">2022 Past Questions</option>
                      <option value="2020">2020 Past Questions</option>
                    </select>
                  </div>
                </div>

                {/* Launch Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Target: <b className="text-slate-900 dark:text-slate-100">{selectedExamBody === 'All' ? 'WAEC & JAMB' : selectedExamBody}</b> • Subject: <b className="text-slate-900 dark:text-slate-100">{selectedSubject}</b> • Questions: <b className="text-slate-900 dark:text-slate-100">{selectedQuestionCount}</b> • Mode: <b className="text-slate-900 dark:text-slate-100">{selectedMode === 'simulation' ? 'Timed Exam (Strict Auto-Submission)' : 'Self-Paced Practice'}</b>
                  </div>

                  <button
                    onClick={handleGenerateAndStart}
                    disabled={isGenerating}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        <span>Compiling Questions from MySQL...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                        <span>Start CBT Examination</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PERFORMANCE ANALYTICS */}
          {activeTab === 'analytics' && studentAnalytics && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    CBT Performance Analytics & Weak Topic Diagnosis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Diagnostic performance across WAEC, NECO, and JAMB practice tests
                  </p>
                </div>

                {/* High Level Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">Total Questions Attempted</span>
                    <p className="text-3xl font-black font-mono text-blue-950 dark:text-blue-200 mt-1">
                      {studentAnalytics.totalQuestionsAttempted}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">Banked across all subjects</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Overall Average Score</span>
                    <p className="text-3xl font-black font-mono text-emerald-950 dark:text-emerald-200 mt-1">
                      {studentAnalytics.overallAverage}%
                    </p>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Passing WAEC Distinction Band</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-400">Estimated JAMB Aggregate</span>
                    <p className="text-3xl font-black font-mono text-purple-950 dark:text-purple-200 mt-1">
                      {Math.round((studentAnalytics.overallAverage / 100) * 400)} / 400
                    </p>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">High University Cut-off Target</span>
                  </div>
                </div>

                {/* Strong & Weak Topics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-600">error</span>
                      <h4 className="font-black text-rose-950 dark:text-rose-200 text-sm">
                        Identified Weak Topics (&lt; 60% Accuracy)
                      </h4>
                    </div>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      Topics requiring targeted revision in the Learning Hub and AI Tutor:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {studentAnalytics.weakTopics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-bold text-xs shadow-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600">verified</span>
                      <h4 className="font-black text-emerald-950 dark:text-emerald-200 text-sm">
                        Syllabus Strengths (&ge; 70% Accuracy)
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Areas of demonstrated academic mastery:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {studentAnalytics.strongTopics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-xs shadow-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: QUESTION BANK BROWSER (Teacher / Admin View) */}
          {activeTab === 'question-bank' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                      National CBT Question Bank Repository ({bankTotal} Questions)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Directly queried from MySQL database table: <code className="font-mono text-emerald-600">questions_bank</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                      placeholder="Search questions by keyword..."
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                {isBankLoading ? (
                  <div className="p-12 text-center text-xs text-slate-400">Loading questions from MySQL...</div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {bankQuestions.map((q) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px]">
                              {q.exam_body} • {q.year}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {q.subject_name}
                            </span>
                            <span className="text-slate-400">({q.topic})</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">Correct: {q.correct_answer}</span>
                        </div>

                        <p className="font-medium text-slate-900 dark:text-slate-100">{q.question_text}</p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                          <span>A: {q.option_a}</span>
                          <span>B: {q.option_b}</span>
                          {q.option_c && <span>C: {q.option_c}</span>}
                          {q.option_d && <span>D: {q.option_d}</span>}
                        </div>

                        {q.explanation && (
                          <p className="text-[11px] text-indigo-900 dark:text-indigo-300 font-mono pt-1 bg-indigo-50/50 dark:bg-indigo-950/30 p-2 rounded-xl">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ADD CBT QUESTION (Teacher / Admin Contribution) */}
          {activeTab === 'add-question' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-3xl mx-auto space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Contribute Question to National Question Bank
                </h3>
                <p className="text-xs text-slate-500">
                  New questions are immediately verified and persisted in MySQL table <code className="font-mono text-emerald-600">questions_bank</code>.
                </p>
              </div>

              {addQuestionSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{addQuestionSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Exam Body</label>
                    <select
                      value={newQuestionForm.exam_body}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, exam_body: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="WAEC">WAEC SSCE</option>
                      <option value="NECO">NECO SSCE</option>
                      <option value="JAMB">JAMB UTME</option>
                      <option value="School Exam">School Internal</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Subject</label>
                    <input
                      type="text"
                      value={newQuestionForm.subject_name}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, subject_name: e.target.value })}
                      placeholder="e.g. Physics"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Class Level</label>
                    <select
                      value={newQuestionForm.class_level}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, class_level: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="SS3">SS3</option>
                      <option value="SS2">SS2</option>
                      <option value="SS1">SS1</option>
                      <option value="JSS3">JSS3</option>
                      <option value="JSS2">JSS2</option>
                      <option value="JSS1">JSS1</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Exam Year</label>
                    <input
                      type="number"
                      value={newQuestionForm.year}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, year: parseInt(e.target.value, 10) || 2024 })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Topic</label>
                  <input
                    type="text"
                    value={newQuestionForm.topic}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, topic: e.target.value })}
                    placeholder="e.g. Electromagnetic Induction"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Question Text</label>
                  <textarea
                    rows={3}
                    value={newQuestionForm.question_text}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question_text: e.target.value })}
                    placeholder="Enter the complete question prompt..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Option A</label>
                    <input
                      type="text"
                      value={newQuestionForm.option_a}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option_a: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Option B</label>
                    <input
                      type="text"
                      value={newQuestionForm.option_b}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option_b: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Option C</label>
                    <input
                      type="text"
                      value={newQuestionForm.option_c}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option_c: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Option D</label>
                    <input
                      type="text"
                      value={newQuestionForm.option_d}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option_d: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Correct Answer</label>
                    <select
                      value={newQuestionForm.correct_answer}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, correct_answer: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Difficulty Level</label>
                    <select
                      value={newQuestionForm.difficulty_level}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, difficulty_level: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Explanation & Marking Rationale</label>
                  <textarea
                    rows={2}
                    value={newQuestionForm.explanation}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                    placeholder="Provide the formula, derivation, or reasoning for the answer..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#111B5E] hover:bg-blue-900 text-white font-black rounded-2xl shadow transition cursor-pointer"
                >
                  Save to MySQL Question Bank
                </button>
              </form>
            </div>
          )}

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
                  {currentExam.examBody} Exam Engine
                </span>
                <span className="text-xs text-indigo-200">{currentExam.subject} • {selectedMode === 'simulation' ? 'Mock Mode' : 'Practice Drill'}</span>
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
                        : 'Review Later'}
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
                  <span>Flagged for Review:</span>
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
                  <b>{currentExam.questions.length}</b> questions. Once submitted, your examination will be instantly evaluated by the ExcelMind grading engine and recorded in MySQL.
                </p>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer"
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
                  CBT Appraisal Complete • MySQL Recorded
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
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-300">Performance</span>
                <p className="text-2xl font-black font-mono text-emerald-300 mt-1">
                  {examResult.performanceRating || 'Good'}
                </p>
                <span className="text-[10px] text-indigo-200">National Standard</span>
              </div>
            </div>
          </div>

          {/* AI CBT Recommendation Engine Card */}
          {examResult.aiRecommendation && (
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 to-indigo-950 text-white rounded-3xl border border-purple-800/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 max-w-2xl">
                <span className="p-2.5 rounded-2xl bg-purple-600 text-white shrink-0 mt-0.5 shadow">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 block">
                    ExcelMind AI Academic Coach Recommendation
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed mt-1">
                    {examResult.aiRecommendation}
                  </p>
                </div>
              </div>

              {onNavigateToAiTutor && examResult.weakTopics && examResult.weakTopics.length > 0 && (
                <button
                  onClick={() => onNavigateToAiTutor(`Explain ${examResult.weakTopics?.[0]?.topic || currentExam.subject} for my WAEC preparation`)}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs shadow transition cursor-pointer whitespace-nowrap"
                >
                  Remediate in AI Tutor
                </button>
              )}
            </div>
          )}

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
                const isCorrect = userChoice && userChoice.toUpperCase() === q.correctAnswer.toUpperCase();

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
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          Question {idx + 1}
                        </span>
                        {q.topic && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {q.topic}
                          </span>
                        )}
                      </div>
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

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsExamActive(false);
                  setIsSubmitted(false);
                  setCurrentExam(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Back to Configuration
              </button>

              <button
                onClick={() => handleGenerateAndStart()}
                className="px-5 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Retake Randomized Examination
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CbtExamView;
