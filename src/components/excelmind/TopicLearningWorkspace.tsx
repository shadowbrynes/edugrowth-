import React, { useState } from 'react';
import { generateGeminiResponse } from '../../ai';

interface TopicLearningWorkspaceProps {
  onClose?: () => void;
}

export const TopicLearningWorkspace: React.FC<TopicLearningWorkspaceProps> = ({ onClose }) => {
  // Mobile active tab for Android view
  const [mobileTab, setMobileTab] = useState<'video' | 'notes' | 'quiz' | 'tutor'>('video');

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [activeChapter, setActiveChapter] = useState(0);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // AI Tutor state
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: 'user' | 'tutor'; text: string }>>([
    {
      role: 'tutor',
      text: 'Hello! I am your ExcelMind AI Physics Tutor for this Motion lesson. Ask me any question about velocity-time graphs, equations of uniformly accelerated motion, or WAEC past questions!'
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const chapters = [
    { title: 'Introduction & Scalar vs Vector', time: '00:00' },
    { title: 'Velocity-Time Graph Derivation', time: '05:30' },
    { title: 'The 3 Equations of Motion', time: '14:20' },
    { title: 'Projectiles & Worked WAEC Problems', time: '24:45' }
  ];

  const quizQuestions = [
    {
      question: 'What physical quantity is represented by the area under a velocity-time graph?',
      options: ['Acceleration', 'Displacement (Distance)', 'Velocity', 'Force'],
      correct: 1,
      explanation: 'Displacement = Velocity × Time. On a graph of v vs t, integration (area under the curve) yields the total displacement s.'
    },
    {
      question: 'A car travelling at 20 m/s comes to rest uniformly in 4 seconds. What is its acceleration?',
      options: ['-5 m/s²', '5 m/s²', '-80 m/s²', '0 m/s²'],
      correct: 0,
      explanation: 'Using v = u + at => 0 = 20 + a(4) => 4a = -20 => a = -5 m/s² (deceleration).'
    }
  ];

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers({
      ...selectedQuizAnswers,
      [qIdx]: oIdx
    });
  };

  const handleAskTutor = async (queryText?: string) => {
    const textToSend = queryText || tutorQuery;
    if (!textToSend.trim()) return;

    const newMessages = [...tutorMessages, { role: 'user' as const, text: textToSend }];
    setTutorMessages(newMessages);
    setTutorQuery('');
    setIsAiLoading(true);

    try {
      const systemContext = `You are an expert Nigerian secondary school Physics Tutor for Class SS2 teaching the topic "Motion & Kinematics" aligned with NERDC and WAEC.
Student question: ${textToSend}
Provide a clear, encouraging, step-by-step pedagogical explanation with formulas where needed (max 150 words).`;

      const response = await generateGeminiResponse(
        systemContext,
        `In uniformly accelerated motion, remember the 3 core equations: (1) v = u + at, (2) s = ut + 0.5at², (3) v² = u² + 2as. In WAEC questions, always list knowns (u, v, a, s, t) to select the correct equation without ambiguity!`
      );

      setTutorMessages([...newMessages, { role: 'tutor' as const, text: response }]);
    } catch {
      setTutorMessages([
        ...newMessages,
        {
          role: 'tutor' as const,
          text: 'Remember: Acceleration a = (v - u) / t. The area under the velocity-time graph gives the displacement s, while the gradient equals acceleration.'
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const scoreCount = Object.entries(selectedQuizAnswers).filter(
    ([qIdx, aIdx]) => quizQuestions[Number(qIdx)].correct === aIdx
  ).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Navigation & Performance Analytics Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Subjects</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Physics SS2</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">Motion Lesson</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Physics Dashboard: Kinematics & Rectilinear Motion
          </h1>
        </div>

        {/* Performance Analytics Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center">
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold block uppercase">Time Spent</span>
            <span className="text-xs font-black text-blue-900 dark:text-blue-200 font-mono">18m 40s</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block uppercase">Topic Mastery</span>
            <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 font-mono">92% High</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-center">
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold block uppercase">Quiz Score</span>
            <span className="text-xs font-black text-purple-900 dark:text-purple-200 font-mono">
              {quizSubmitted ? `${scoreCount}/${quizQuestions.length} (100%)` : 'Ready'}
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close Workspace"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE / ANDROID NAVIGATION BAR (Visible on screens < lg) */}
      <div className="lg:hidden flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
        {[
          { id: 'video', label: 'Watch Video', icon: 'play_circle' },
          { id: 'notes', label: 'Lesson Notes', icon: 'description' },
          { id: 'quiz', label: 'Take Quiz', icon: 'quiz' },
          { id: 'tutor', label: 'AI Tutor', icon: 'smart_toy' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMobileTab(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP 4-PANEL LAYOUT (lg:grid) vs MOBILE TABBED LAYOUT                  */}
      {/* ========================================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 Cols): Video Panel & Quiz Panel */}
        <div className={`space-y-6 lg:col-span-7 ${mobileTab !== 'video' && mobileTab !== 'quiz' ? 'hidden lg:block' : ''}`}>
          
          {/* PANEL 1: VIDEO PANEL */}
          <div className={`${mobileTab === 'quiz' ? 'hidden lg:block' : ''} bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Video Panel • Motion Lesson (NERDC SS2)
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {['1x', '1.25x', '1.5x'].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-[#111B5E] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden flex flex-col justify-between p-4 shadow-xl border border-slate-800 group">
              <div className="flex items-center justify-between text-white/80 text-xs">
                <span className="font-mono font-bold bg-blue-600/90 px-2 py-0.5 rounded text-[10px]">
                  Dr. Kenneth Okon • 1080p
                </span>
                <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded">
                  {chapters[activeChapter].time} / 32:15
                </span>
              </div>

              {/* Center Play/Pause button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition transform group-hover:scale-110 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-4xl">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              {/* Bottom Scrubber & Chapter title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-white text-xs font-bold">
                  <span>{chapters[activeChapter].title}</span>
                  <span className="font-mono text-[11px] text-blue-300">WAEC High Frequency</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                  <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Video Chapters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapter(idx)}
                  className={`p-2 rounded-xl text-left border text-[11px] transition cursor-pointer ${
                    activeChapter === idx
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="font-mono block text-[10px] text-slate-400">{ch.time}</span>
                  <span className="line-clamp-1">{ch.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PANEL 3: QUIZ PANEL */}
          <div className={`${mobileTab === 'video' ? 'hidden lg:block' : ''} bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">quiz</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Quiz Panel • Instant Formative Check
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-600">
                2 Questions (WAEC Aligned)
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[qIdx] === oIdx;
                      const isCorrect = q.correct === oIdx;
                      let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 text-rose-900 border-rose-400';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-100 text-blue-900 border-blue-400 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(qIdx, oIdx)}
                          className={`p-2.5 rounded-xl border text-left font-medium transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <span className="material-symbols-outlined text-emerald-600 text-sm">check</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-[11px] text-indigo-900 dark:text-indigo-200">
                      <span className="font-bold">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedQuizAnswers).length < quizQuestions.length || quizSubmitted}
                  className="px-5 py-2.5 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl shadow cursor-pointer transition"
                >
                  {quizSubmitted ? 'Quiz Scored (100%)' : 'Submit & Check Answers'}
                </button>

                {quizSubmitted && (
                  <button
                    onClick={() => {
                      setSelectedQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): Notes Panel & AI Tutor Panel */}
        <div className={`space-y-6 lg:col-span-5 ${mobileTab !== 'notes' && mobileTab !== 'tutor' ? 'hidden lg:block' : ''}`}>
          
          {/* PANEL 2: NOTES PANEL */}
          <div className={`${mobileTab === 'tutor' ? 'hidden lg:block' : ''} bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">menu_book</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Notes Panel • Key Formulas
                </h3>
              </div>
              <button
                onClick={() => alert('Downloading Motion & Kinematics PDF Summary Handbook...')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>PDF</span>
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-200 uppercase font-mono text-[10px]">
                  Equations of Uniform Acceleration:
                </span>
                <div className="font-mono text-xs font-bold text-blue-950 dark:text-blue-100 space-y-1 pt-1">
                  <div>1. v = u + at</div>
                  <div>2. s = ut + ½at²</div>
                  <div>3. v² = u² + 2as</div>
                  <div>4. s = ((u + v) / 2) × t</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Graphical Interpretation Rules:
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Slope of Displacement-Time:</span> Velocity ($v = \Delta s / \Delta t$).</li>
                  <li><span className="font-bold">Slope of Velocity-Time:</span> Acceleration ($a = \Delta v / \Delta t$).</li>
                  <li><span className="font-bold">Area under Velocity-Time:</span> Displacement ($s$).</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200">
                <span className="font-bold">💡 WAEC Tip:</span> Under vertical motion in free fall, replace a with +g (9.8 m/s² or 10 m/s²) when falling downwards, and -g when projected vertically upwards.
              </div>
            </div>
          </div>

          {/* PANEL 4: AI TUTOR INTEGRATION */}
          <div className={`${mobileTab === 'notes' ? 'hidden lg:block' : ''} bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">smart_toy</span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    AI Tutor • Physics Doubts Solver
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  Gemini Flash
                </span>
              </div>

              {/* Messages display */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mt-3">
                {tutorMessages.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'tutor'
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200'
                        : 'bg-blue-600 text-white ml-6 font-medium'
                    }`}
                  >
                    <span className="text-[10px] font-bold block mb-1 opacity-75">
                      {msg.role === 'tutor' ? '🤖 ExcelMind AI Tutor' : '👤 You'}
                    </span>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-xs text-indigo-600 flex items-center gap-2 font-bold animate-pulse">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>AI Tutor is formulating explanation...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 mt-3">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  Suggested Questions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Derive v² = u² + 2as',
                    'Explain velocity-time slope',
                    'WAEC projectile question'
                  ].map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleAskTutor(p)}
                      className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-3">
              <input
                type="text"
                value={tutorQuery}
                onChange={(e) => setTutorQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                placeholder="Ask AI Tutor about motion..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleAskTutor()}
                disabled={isAiLoading || !tutorQuery.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow cursor-pointer transition flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TopicLearningWorkspace;
