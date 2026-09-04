import React, { useState } from 'react';
import { Course, Assignment, CbtQuestion } from '../../types/excelmind';
import { COURSES_DATA, ASSIGNMENTS_DATA } from '../../data/excelmindData';
import { AcademicRecordsCentreView } from './AcademicRecordsCentreView';

export const TeacherPortalView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS_DATA);
  const [activeTab, setActiveTab] = useState<'academic_centre' | 'materials' | 'assignments' | 'cbt_setter' | 'grading'>('academic_centre');

  // New Material State
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'video' | 'pdf' | 'audio' | 'quiz'>('video');
  const [materialDuration, setMaterialDuration] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');

  // New Assignment State
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [asnSubject, setAsnSubject] = useState('Physics');
  const [asnTitle, setAsnTitle] = useState('');
  const [asnDesc, setAsnDesc] = useState('');
  const [asnDeadline, setAsnDeadline] = useState('');
  const [asnMaxScore, setAsnMaxScore] = useState(100);

  // CBT Question Setter State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [questionSubject, setQuestionSubject] = useState('Physics');
  const [cbtSuccess, setCbtSuccess] = useState(false);

  // Grading State
  const [selectedSub, setSelectedSub] = useState<Assignment | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;

    const newLesson = {
      id: `l-${Date.now()}`,
      title: materialTitle,
      type: materialType,
      durationOrPages: materialDuration || '30 mins',
      completed: false,
      description: materialDesc || 'Uploaded by course instructor'
    };

    const updated = courses.map((c, i) => {
      if (i === 1) { // Physics course
        return {
          ...c,
          lessons: [newLesson, ...c.lessons]
        };
      }
      return c;
    });

    setCourses(updated);
    setMaterialTitle('');
    setMaterialDuration('');
    setMaterialDesc('');
    setShowAddMaterialModal(false);
    alert('Learning material successfully uploaded to the Learning Hub!');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asnTitle.trim()) return;

    const newAsn: Assignment = {
      assignment_id: `ASN-${Date.now()}`,
      subject: asnSubject,
      title: asnTitle,
      description: asnDesc,
      deadline: asnDeadline || 'Next Friday 10:00 AM',
      submission_status: 'pending',
      maxScore: Number(asnMaxScore)
    };

    setAssignments([newAsn, ...assignments]);
    setAsnTitle('');
    setAsnDesc('');
    setShowAddAssignmentModal(false);
    alert('New Assignment published to student portals!');
  };

  const handleCreateCbtQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    setCbtSuccess(true);
    setTimeout(() => {
      setCbtSuccess(false);
      setNewQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setExplanation('');
    }, 2500);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const updated = assignments.map((a) => {
      if (a.assignment_id === selectedSub.assignment_id) {
        return {
          ...a,
          submission_status: 'graded' as const,
          grade: gradeInput || 'A1',
          score: Number(scoreInput),
          teacherFeedback: feedbackInput || 'Well solved with thorough mathematical steps.'
        };
      }
      return a;
    });

    setAssignments(updated);
    setSelectedSub(null);
    alert('Student submission graded and feedback dispatched!');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#111B5E] to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-emerald-300">
                <span className="material-symbols-outlined text-2xl">school</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                Instructor & Faculty Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Teacher Review, Grading & Course Builder
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Upload instructional materials, author CBT examination questions, set assignments, and provide individualized feedback to students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-bold text-white block">Dr. Kenneth Okon</span>
              <span className="text-xs text-emerald-300 font-medium">HOD Physics & Senior Form Tutor</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Teacher"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'academic_centre', label: 'Academic Records Centre', icon: 'school' },
          { id: 'materials', label: 'Course Materials & Lessons', icon: 'auto_stories' },
          { id: 'assignments', label: 'Set Assignments', icon: 'assignment' },
          { id: 'cbt_setter', label: 'CBT Question Authoring', icon: 'quiz' },
          { id: 'grading', label: 'Grade Student Submissions', icon: 'rate_review' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#111B5E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB: ACADEMIC RECORDS CENTRE */}
      {activeTab === 'academic_centre' && (
        <AcademicRecordsCentreView currentRole="teacher" />
      )}

      {/* TAB 1: COURSE MATERIALS */}
      {activeTab === 'materials' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Instructional Modules (Physics & STEM)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage video lectures, revision handbooks, and laboratory guides
              </p>
            </div>

            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">upload_file</span>
              <span>Upload Learning Material</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses[1].lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-xl">
                      {lesson.type === 'video' ? 'smart_display' : 'description'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{lesson.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{lesson.description}</p>
                    <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                      Format: {lesson.type.toUpperCase()} • {lesson.durationOrPages}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Editing material: ${lesson.title}`)}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SET ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Manage & Set Homework Assignments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure submission deadlines, problem descriptions, and grading rubrics
              </p>
            </div>

            <button
              onClick={() => setShowAddAssignmentModal(true)}
              className="px-4 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_task</span>
              <span>Create New Assignment</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {assignments.map((asn) => (
              <div key={asn.assignment_id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                    {asn.subject} • Max {asn.maxScore} pts
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-0.5">{asn.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{asn.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-xl shrink-0">
                  {asn.deadline}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CBT QUESTION AUTHORING */}
      {activeTab === 'cbt_setter' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Author CBT Questions into Exam Bank
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set standard multiple-choice questions for WAEC, NECO, and JAMB mock simulations
            </p>
          </div>

          {cbtSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>Question successfully committed to the national standard CBT bank!</span>
            </div>
          )}

          <form onSubmit={handleCreateCbtQuestion} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject:</label>
                <select
                  value={questionSubject}
                  onChange={(e) => setQuestionSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">General Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correct Answer:</label>
                <select
                  value={correctKey}
                  onChange={(e) => setCorrectKey(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Question Statement / Problem Prompt:
              </label>
              <textarea
                rows={3}
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                required
                placeholder="e.g. Calculate the induced electromotive force in a coil of 200 turns when magnetic flux changes by 0.05 Wb in 0.1s..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Option A:</label>
                <input
                  type="text"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  required
                  placeholder="e.g. 50 Volts"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Option B:</label>
                <input
                  type="text"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  required
                  placeholder="e.g. 100 Volts"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Option C:</label>
                <input
                  type="text"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  required
                  placeholder="e.g. 150 Volts"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Option D:</label>
                <input
                  type="text"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  required
                  placeholder="e.g. 200 Volts"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Solution Rationale & Derivation (for Auto-Marking Review):
              </label>
              <textarea
                rows={2}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="By Faraday's law: E = -N(ΔΦ/Δt) = 200 × (0.05 / 0.1) = 100V."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Add Question to Bank
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: GRADING SUBMISSIONS */}
      {activeTab === 'grading' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Student Submissions Awaiting Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Examine student solutions, award marks, and enter constructive qualitative feedback
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {assignments.map((sub) => (
              <div key={sub.assignment_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">John Doe (SSS 3)</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {sub.subject}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">{sub.title}</h4>
                  {sub.studentSubmissionNote && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      Student Note: "{sub.studentSubmissionNote}"
                    </p>
                  )}
                  {sub.grade && (
                    <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                      Current Grade: {sub.grade} ({sub.score}/{sub.maxScore} pts)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedSub(sub);
                    setScoreInput(sub.score || 88);
                    setGradeInput(sub.grade || 'A1');
                    setFeedbackInput(sub.teacherFeedback || '');
                  }}
                  className="px-4 py-2 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
                >
                  Grade & Feedback
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Grade Submission: {selectedSub.title}
            </h3>
            <p className="text-xs text-slate-500">Student: John Doe • Subject: {selectedSub.subject}</p>

            <form onSubmit={handleSaveGrade} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Score (out of {selectedSub.maxScore}):</label>
                  <input
                    type="number"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    max={selectedSub.maxScore}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grade Letter:</label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="A1">A1 (Distinction)</option>
                    <option value="B2">B2 (Very Good)</option>
                    <option value="B3">B3 (Good)</option>
                    <option value="C4">C4 (Credit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher Qualitative Feedback:</label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Enter constructive remarks for the student..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save & Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Learning Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Upload New Course Material
            </h3>
            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lesson / Material Title:</label>
                <input
                  type="text"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  required
                  placeholder="e.g. Electromagnetic Resonance & RLC Circuits"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Format Type:</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="video">Video Masterclass</option>
                    <option value="pdf">PDF Lecture Notes</option>
                    <option value="audio">Audio Podcast</option>
                    <option value="quiz">Interactive Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duration / Pages:</label>
                  <input
                    type="text"
                    value={materialDuration}
                    onChange={(e) => setMaterialDuration(e.target.value)}
                    placeholder="e.g. 35 mins or 20 pages"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Curriculum Description:</label>
                <textarea
                  rows={2}
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  placeholder="Key concepts covered in this module..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Upload & Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Set New Academic Assignment
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assignment Title:</label>
                <input
                  type="text"
                  value={asnTitle}
                  onChange={(e) => setAsnTitle(e.target.value)}
                  required
                  placeholder="e.g. Wave Optics & Double Slit Interference"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={asnSubject}
                    onChange={(e) => setAsnSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deadline:</label>
                  <input
                    type="text"
                    value={asnDeadline}
                    onChange={(e) => setAsnDeadline(e.target.value)}
                    placeholder="e.g. Next Monday 10:00 AM"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instructions & Page References:</label>
                <textarea
                  rows={3}
                  value={asnDesc}
                  onChange={(e) => setAsnDesc(e.target.value)}
                  placeholder="Instructions for students..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
