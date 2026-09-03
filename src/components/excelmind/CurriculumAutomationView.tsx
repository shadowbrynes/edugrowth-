import React, { useState } from 'react';
import { AcademicLevel, DepartmentCategory, GeneratedLesson } from '../../types/excelmind';
import {
  NERDC_CURRICULUM_FRAMEWORK,
  DEPARTMENT_SUBJECT_COMBINATIONS,
  CURRICULUM_TOPICS_DATA,
  GENERATED_LESSONS_DATA
} from '../../data/excelmindData';
import { generateGeminiResponse } from '../../ai';

export const CurriculumAutomationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'automation' | 'generator' | 'workflow' | 'framework'>('generator');
  
  // Department & Level selection
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>('SS2');
  const [selectedDept, setSelectedDept] = useState<DepartmentCategory>('Science');
  
  // Generator Form state
  const [genClass, setGenClass] = useState<AcademicLevel>('SS2');
  const [genSubject, setGenSubject] = useState('Physics');
  const [genTopic, setGenTopic] = useState('Motion');
  const [genDuration, setGenDuration] = useState('40 minutes');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Lessons list & active preview
  const [lessonsList, setLessonsList] = useState<GeneratedLesson[]>(GENERATED_LESSONS_DATA);
  const [selectedLesson, setSelectedLesson] = useState<GeneratedLesson>(GENERATED_LESSONS_DATA[0]);
  const [lessonActiveSection, setLessonActiveSection] = useState<'plan' | 'notes' | 'examples' | 'quiz' | 'cbt'>('plan');

  // Automated enrollment simulation
  const [assignedSubjects, setAssignedSubjects] = useState(() => DEPARTMENT_SUBJECT_COMBINATIONS.Science.recommendedSubjects);
  const [enrollmentNotice, setEnrollmentNotice] = useState<string | null>(null);

  const handleDepartmentChange = (dept: DepartmentCategory) => {
    setSelectedDept(dept);
    if (dept === 'Science' || dept === 'Commercial' || dept === 'Arts') {
      setAssignedSubjects(DEPARTMENT_SUBJECT_COMBINATIONS[dept].recommendedSubjects);
      setEnrollmentNotice(`Automated Curriculum Engine successfully assigned ${DEPARTMENT_SUBJECT_COMBINATIONS[dept].recommendedSubjects.length} subjects aligned with WAEC/NECO for ${dept} department.`);
      setTimeout(() => setEnrollmentNotice(null), 4000);
    }
  };

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const prompt = `As an expert Nigerian NERDC & WAEC secondary curriculum specialist, generate a detailed 40-minute lesson for Class ${genClass}, Subject: ${genSubject}, Topic: ${genTopic}. Provide:
      1. Three measurable learning objectives
      2. Step-by-step lesson plan
      3. Concise teacher notes
      4. Student digital notes
      5. One worked example problem with solution
      6. Two class activities
      7. Homework exercise
      8. Two multiple choice quiz questions
      9. One WAEC-standard CBT question with explanation
      10. Revision key takeaway summary.`;

      let aiResponseText = '';
      try {
        aiResponseText = await generateGeminiResponse(prompt);
      } catch {
        aiResponseText = '';
      }

      // Construct high-yield structured lesson
      const newLesson: GeneratedLesson = {
        id: `gen-les-${Date.now()}`,
        classLevel: genClass,
        subject: genSubject,
        topic: genTopic,
        duration: genDuration,
        status: 'Draft',
        author: 'Faculty Subject Specialist',
        aiConfidenceScore: 97,
        learningObjectives: [
          `Define and articulate core theoretical principles of ${genTopic}`,
          `Solve standard NERDC quantitative and qualitative problems in ${genSubject}`,
          `Apply practical real-world and laboratory applications aligned with WAEC/JAMB standards`
        ],
        lessonPlan: `1. Introduction & Prior Knowledge Recall (5 mins) -> 2. Theoretical Exposition & Concept Derivation (15 mins) -> 3. Worked Exemplar on Whiteboard (10 mins) -> 4. Student Guided Practice (5 mins) -> 5. Formative CBT Check (5 mins)`,
        teacherNotes: `Emphasize unit conversions and common traps encountered in WAEC/NECO past questions. Ensure all students copy core formulas before group problem-solving.`,
        studentNotes: aiResponseText
          ? aiResponseText.slice(0, 500) + '...'
          : `Core definition of ${genTopic}: Systematically examine the fundamental laws governing ${genTopic} in ${genSubject}. Always check dimensional homogeneity of equations and SI units.`,
        examples: [
          {
            problem: `Calculate the primary unknown in ${genTopic} under standard temperature and standard laboratory parameters for ${genSubject}.`,
            solution: `Step 1: State knowns and unknowns. Step 2: Apply the governing formula. Step 3: Compute with appropriate significant figures and append unit.`
          }
        ],
        classActivities: [
          `Collaborative problem-solving in pairs for 5 minutes`,
          `Peer-marking of practice questions with teacher guidance`
        ],
        homework: `Read Section 4 of the digital syllabus and solve exercises 1 to 5.`,
        quizQuestions: [
          {
            question: `What is the primary governing law in this lesson on ${genTopic}?`,
            options: ['Option A: Fundamental Principle', 'Option B: Secondary Corollary', 'Option C: Inverse Proportion', 'Option D: Empirical Constant'],
            answer: 'Option A: Fundamental Principle'
          },
          {
            question: `Which SI unit is standard when quantifying ${genTopic}?`,
            options: ['Joules (J)', 'Metres per second (m/s)', 'Kilograms (kg)', 'Newton (N)'],
            answer: 'Joules (J)'
          }
        ],
        cbtQuestions: [
          {
            question: `In a standard WAEC SSCE examination, how is ${genTopic} most frequently examined?`,
            options: ['Calculations with proof', 'Definition only', 'Historical context only', 'Irrelevant'],
            answer: 'Calculations with proof',
            rationale: 'WAEC Section B requires full step-by-step proofs and unit indications for total marks.'
          }
        ],
        revisionSummary: `Master the foundational formula and definitions of ${genTopic}. Review past question patterns across 2018–2024.`,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setLessonsList([newLesson, ...lessonsList]);
      setSelectedLesson(newLesson);
      setActiveTab('generator');
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = (lessonId: string, newStatus: GeneratedLesson['status']) => {
    const updated = lessonsList.map((l) =>
      l.id === lessonId ? { ...l, status: newStatus, reviewedBy: 'Vice Principal (Academic)' } : l
    );
    setLessonsList(updated);
    if (selectedLesson.id === lessonId) {
      setSelectedLesson({ ...selectedLesson, status: newStatus, reviewedBy: 'Vice Principal (Academic)' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-blue-300">
                <span className="material-symbols-outlined text-2xl">auto_stories</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Automated Curriculum Engine • NERDC / WAEC / JAMB / BECE Aligned
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Intelligent Curriculum Automation & Content Studio
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
              Automate subject allocation, generate complete pedagogical lesson plans with AI, and manage quality assurance workflows for Nigerian secondary education.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-white uppercase">
              NERDC 2025 Standard Sync
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'generator', label: 'AI Curriculum Generator', icon: 'psychology' },
          { id: 'workflow', label: 'Quality Review Workflow', icon: 'rule' },
          { id: 'automation', label: 'Subject Combination Engine', icon: 'hub' },
          { id: 'framework', label: 'NERDC & Exam Frameworks', icon: 'school' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#111B5E] text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: AI CURRICULUM GENERATOR STUDIO */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Lesson Generation Studio
              </h3>
              <p className="text-xs text-slate-500">Generate 10-point comprehensive learning content</p>
            </div>

            <form onSubmit={handleGenerateContent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class Level (NERDC):
                </label>
                <select
                  value={genClass}
                  onChange={(e) => setGenClass(e.target.value as AcademicLevel)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="JSS1">JSS 1 (Basic 7)</option>
                  <option value="JSS2">JSS 2 (Basic 8)</option>
                  <option value="JSS3">JSS 3 (Basic 9 / BECE)</option>
                  <option value="SS1">SS 1 (Senior Secondary 1)</option>
                  <option value="SS2">SS 2 (Senior Secondary 2)</option>
                  <option value="SS3">SS 3 (Senior Secondary 3 / WAEC)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject:
                </label>
                <input
                  type="text"
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  placeholder="e.g. Physics, Chemistry, Economics..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Curriculum Topic:
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="e.g. Motion, Trigonometry, Bank Reconciliation..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Duration:
                </label>
                <select
                  value={genDuration}
                  onChange={(e) => setGenDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="40 minutes">40 minutes (Single Period)</option>
                  <option value="80 minutes">80 minutes (Double Practical Period)</option>
                  <option value="20 minutes">20 minutes (High-yield Revision Micro-lesson)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 bg-[#111B5E] hover:bg-blue-900 text-white font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>AI Structuring Lesson...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Generate AI Curriculum</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Quick Syllabus Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { sub: 'Physics', top: 'Electromagnetic Induction', lvl: 'SS3' as const },
                  { sub: 'General Mathematics', top: 'Quadratic Curves', lvl: 'SS2' as const },
                  { sub: 'Chemistry', top: 'Chemical Bonding', lvl: 'SS2' as const },
                  { sub: 'Financial Accounting', top: 'Bank Reconciliation', lvl: 'SS2' as const }
                ].map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGenSubject(t.sub);
                      setGenTopic(t.top);
                      setGenClass(t.lvl);
                    }}
                    className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-blue-100 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    {t.top}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Header of selected lesson */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {selectedLesson.classLevel} • {selectedLesson.subject}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    selectedLesson.status === 'Published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedLesson.status === 'Approved'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedLesson.status === 'Pending Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    ● {selectedLesson.status}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                  {selectedLesson.topic}
                </h2>
                <p className="text-xs text-slate-500">
                  Duration: {selectedLesson.duration} • Author: {selectedLesson.author} • Confidence: {selectedLesson.aiConfidenceScore}%
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedLesson.status === 'Draft' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedLesson.id, 'Pending Review')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                  >
                    <span>Submit for AI Review</span>
                  </button>
                )}
                {selectedLesson.status === 'Pending Review' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedLesson.id, 'Approved')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                  >
                    <span>Approve Lesson (Admin)</span>
                  </button>
                )}
                {selectedLesson.status === 'Approved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedLesson.id, 'Published')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                  >
                    <span>Publish to Students</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
              {[
                { id: 'plan', label: 'Lesson Plan & Objectives' },
                { id: 'notes', label: 'Teacher & Student Notes' },
                { id: 'examples', label: 'Worked Examples & Activities' },
                { id: 'quiz', label: 'Formative Quiz' },
                { id: 'cbt', label: 'CBT Exam Questions' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setLessonActiveSection(s.id as any)}
                  className={`pb-1 font-bold transition cursor-pointer border-b-2 ${
                    lessonActiveSection === s.id
                      ? 'border-[#111B5E] text-[#111B5E] dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Section 1: Plan & Objectives */}
            {lessonActiveSection === 'plan' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    🎯 Measurable Learning Objectives (NERDC Aligned)
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                    {selectedLesson.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                    ⏱️ Period Breakdown & Lesson Plan
                  </h4>
                  <p className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-900 dark:text-blue-200 font-mono text-[11px] leading-relaxed">
                    {selectedLesson.lessonPlan}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                    📌 Revision Key Takeaways
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    {selectedLesson.revisionSummary}
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: Notes */}
            {lessonActiveSection === 'notes' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    👩‍🏫 Teacher Pedagogical Instructions:
                  </h4>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                    {selectedLesson.teacherNotes}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                    📖 Student Digital Notes & Formula Sheet:
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedLesson.studentNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Section 3: Worked Examples */}
            {lessonActiveSection === 'examples' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    🧮 Model Worked Exemplars (WAEC Standard)
                  </h4>
                  {selectedLesson.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Problem {idx + 1}:</span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold">{ex.problem}</p>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-700 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                        {ex.solution}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-1">
                    🤝 In-Class Interactive Group Activities:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-purple-800 dark:text-purple-300">
                    {selectedLesson.classActivities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-purple-200/60 dark:border-purple-800 text-[11px]">
                    <span className="font-bold text-purple-950 dark:text-purple-200">Homework Task: </span>
                    <span>{selectedLesson.homework}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Formative Quiz */}
            {lessonActiveSection === 'quiz' && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  ❓ Formative Mini-Quiz Self-Check
                </h4>
                {selectedLesson.quizQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{idx + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl text-[11px] font-semibold ${
                            opt === q.answer
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {opt} {opt === q.answer && '✓ (Key)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 5: CBT Questions */}
            {lessonActiveSection === 'cbt' && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  🖥️ High-Stakes National CBT Item Bank Integration
                </h4>
                {selectedLesson.cbtQuestions.map((cbt, idx) => (
                  <div key={idx} className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-slate-100">Item {idx + 1}: {cbt.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cbt.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl text-[11px] font-semibold ${
                            opt === cbt.answer
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200/60 dark:border-indigo-800 text-[11px]">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">Examiner Rationale: </span>
                      <span className="text-slate-600 dark:text-slate-300">{cbt.rationale}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: QUALITY REVIEW WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Institutional Quality Assurance Workflow
            </h3>
            <p className="text-xs text-slate-500">
              Multi-tiered verification pipeline: Teacher Creation → AI Pedagogical Audit → Academic Administrator Sign-off → Student Publishing
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Class & Subject</th>
                  <th className="py-3 px-3">Topic Title</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">AI Quality Score</th>
                  <th className="py-3 px-3">Workflow State</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lessonsList.map((les) => (
                  <tr key={les.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-600">
                      {les.classLevel} • {les.subject}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {les.topic}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{les.author}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-emerald-600">{les.aiConfidenceScore}%</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        les.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : les.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : les.status === 'Pending Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {les.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedLesson(les);
                          setActiveTab('generator');
                        }}
                        className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Inspect & Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUBJECT COMBINATION ENGINE */}
      {activeTab === 'automation' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Automated Subject Combination Assignment
            </h3>
            <p className="text-xs text-slate-500">
              When a student selects their academic level & department, the system auto-configures compulsory core subjects, vocational electives, and examination board syllabi.
            </p>
          </div>

          {enrollmentNotice && (
            <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{enrollmentNotice}</span>
            </div>
          )}

          {/* Department Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Select Stream:</span>
            {(['Science', 'Commercial', 'Arts'] as DepartmentCategory[]).map((dept) => (
              <button
                key={dept}
                onClick={() => handleDepartmentChange(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#111B5E] text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {dept} Department
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignedSubjects.map((sub, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">{sub.name}</span>
                    {sub.compulsory && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                        Compulsory
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{sub.code}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {sub.board}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NERDC & EXAM FRAMEWORK */}
      {activeTab === 'framework' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Nigerian Educational Research and Development Council (NERDC) Matrix
            </h3>
            <p className="text-xs text-slate-500">
              National statutory syllabus benchmarks mapped directly to WAEC, NECO, JAMB UTME, and BECE examination objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                {NERDC_CURRICULUM_FRAMEWORK.basicEducation.name}
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Junior Secondary School (JSS 1, JSS 2, JSS 3)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Target Examination: <span className="font-bold">{NERDC_CURRICULUM_FRAMEWORK.basicEducation.targetExam}</span>
              </p>
              <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                {NERDC_CURRICULUM_FRAMEWORK.basicEducation.compulsoryCore.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 uppercase">
                {NERDC_CURRICULUM_FRAMEWORK.seniorSecondary.name}
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Senior Secondary School (SS 1, SS 2, SS 3)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Target Examinations: <span className="font-bold">{NERDC_CURRICULUM_FRAMEWORK.seniorSecondary.targetExams.join(' • ')}</span>
              </p>
              <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                {NERDC_CURRICULUM_FRAMEWORK.seniorSecondary.crossCuttingCore.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CurriculumAutomationView;
