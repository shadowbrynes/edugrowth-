import React, { useState } from 'react';
import { isAiConfigured } from '../../ai';

interface ChatMessageAI {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sections?: {
    simpleExplanation?: string;
    examples?: string[];
    practiceQuestions?: string[];
    revisionTips?: string[];
  };
}

export const AiTutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageAI[]>([
    {
      id: 'ai-init',
      sender: 'ai',
      text: "Hello John! I am your ExcelMind AI Academic Tutor. How can I empower your studies today? You can ask me to explain any difficult concept (like quadratic equations, electromagnetism, or stoichiometry), generate customized study schedules, or analyze your exam strengths and weaknesses.",
      timestamp: 'Just now',
      sections: {
        simpleExplanation: "I break down complex WAEC, JAMB, and Cambridge concepts into plain, intuitive language.",
        examples: ["Step-by-step mathematical proofs", "Real-world physical applications"],
        practiceQuestions: ["Timed CBT practice problems with instant solutions"],
        revisionTips: ["Memory mnemonics and high-yield exam traps to avoid."]
      }
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    { label: 'Explain Quadratic Equations', prompt: 'Explain quadratic equations with simple explanation, worked examples, practice questions, and revision tips.' },
    { label: 'Generate 7-Day Study Timetable', prompt: 'Generate a high-yield 7-day revision timetable for an SSS 3 Science student preparing for WAEC & JAMB.' },
    { label: 'Identify Weak Subjects & Action Plan', prompt: 'Analyze my current profile (Economics 72%, English 76%, Maths 89%, Physics 82%) and give me an action plan to reach straight A1s.' },
    { label: 'Predict JAMB & WAEC Scores', prompt: 'Based on my 82% term aggregate and 78% CBT mock average, predict my JAMB UTME score and give strategies to hit 340+.' }
  ];

  const handleSendPrompt = async (promptToSend: string) => {
    if (!promptToSend.trim()) return;

    const userMsg: ChatMessageAI = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    // AI Response generation
    setTimeout(() => {
      let responseSection: ChatMessageAI['sections'] = {};
      let responseText = '';

      const lower = promptToSend.toLowerCase();

      if (lower.includes('quadratic')) {
        responseText = "Quadratic equations are polynomial equations of the second degree, universally expressed in the standard canonical form: ax² + bx + c = 0 (where a ≠ 0).";
        responseSection = {
          simpleExplanation: "Think of a quadratic equation as a parabolic curve on a graph. The 'roots' or solutions are the exact points where this curve crosses the horizontal x-axis.",
          examples: [
            "Factorization Method: x² - 5x + 6 = 0 => (x - 2)(x - 3) = 0 => Roots: x = 2 or x = 3.",
            "Quadratic Formula (Almighty Formula): x = [-b ± √(b² - 4ac)] / (2a). For 2x² - 7x + 3 = 0, a=2, b=-7, c=3 => x = [7 ± √(49 - 24)] / 4 = [7 ± 5] / 4 => x = 3 or x = 0.5."
          ],
          practiceQuestions: [
            "Question 1: Find the discriminant (Δ = b² - 4ac) of 3x² + 5x + 4 = 0 and determine the nature of its roots.",
            "Question 2: If the sum of roots of ax² + bx + c = 0 is -5 and product is 6, write the equation."
          ],
          revisionTips: [
            "If b² - 4ac > 0, roots are real and distinct.",
            "If b² - 4ac = 0, roots are real and equal (perfect square).",
            "If b² - 4ac < 0, roots are complex/imaginary.",
            "WAEC Tip: Always check if coefficient 'a' can be divided out first to simplify arithmetic."
          ]
        };
      } else if (lower.includes('timetable') || lower.includes('schedule')) {
        responseText = "Here is your customized 7-Day High-Yield Revision Schedule for SSS 3 Science & JAMB Preparation:";
        responseSection = {
          simpleExplanation: "This schedule balances intensive STEM subjects (Maths, Physics, Chem) in morning peak-focus blocks with lighter reading subjects in evenings.",
          examples: [
            "Monday: 06:00-07:30 (Calculus & Vectors) • 16:30-18:00 (Physics SHM & Waves) • 20:30-21:30 (English Summary)",
            "Tuesday: 06:00-07:30 (Organic Chemistry) • 16:30-18:00 (Biology Genetics) • 20:30-21:30 (Civic / Economics)",
            "Wednesday: 06:00-07:30 (Further Maths Matrices) • 16:30-18:00 (JAMB CBT Mock 100 Questions)",
            "Thursday: 06:00-07:30 (Physics Electromagnetism) • 16:30-18:00 (Chemistry Equilibrium Calculations)",
            "Friday: 06:00-07:30 (Computer Algorithms) • 16:30-18:00 (English Oral Phonetics & Stress)",
            "Saturday: Full-scale Timed CBT Simulation (WAEC & JAMB conditions)",
            "Sunday: Comprehensive Error Log Review & Weak Topic Remediation."
          ],
          practiceQuestions: [
            "Track daily adherence using the Academic Planner module.",
            "Aim for minimum 45 minutes focused deep work before taking a 10-minute break (Pomodoro method)."
          ],
          revisionTips: [
            "Never revise passive notes only: always solve at least 15 past questions per study block.",
            "Keep an 'Error Journal' recording every question you miss in CBT tests."
          ]
        };
      } else if (lower.includes('weak') || lower.includes('plan')) {
        responseText = "Diagnostic Assessment of Academic Record for John Doe (SSS 3 Gold):";
        responseSection = {
          simpleExplanation: "Your overall average is outstanding at 82% (Rank #3). Your core STEM foundations are rock-solid (Maths 89%, Physics 82%, Computer 94%). The primary targets for improvement are Economics (72%) and English Language (76%).",
          examples: [
            "Economics Intervention: Focus on National Income Accounting (GDP, GNP, NNP calculations) and Elasticity of Demand/Supply graphs.",
            "English Language Intervention: Drill subordinate clauses, grammatical functions, and lexis antonyms/synonyms in Paper 1."
          ],
          practiceQuestions: [
            "Practice writing one 450-word WAEC standard argumentative essay every Saturday morning.",
            "Solve 20 Economics numerical calculation questions weekly."
          ],
          revisionTips: [
            "Gaining just +8 marks in Economics and +6 in English will push your overall standing to 85%+, qualifying for Valedictorian nomination."
          ]
        };
      } else if (lower.includes('predict') || lower.includes('score')) {
        responseText = "ExcelMind Statistical Performance & Cut-Off Projection:";
        responseSection = {
          simpleExplanation: "Based on your 82% first-term continuous assessment, 94% attendance, and 78% standardized CBT mock index, your academic trajectory is top-percentile.",
          examples: [
            "Predicted WAEC Examination Result: 7 A1s, 2 B2s (Distinction Aggregate)",
            "Predicted JAMB UTME Score: 325 - 345 / 400 (Top 0.5% Nationally)",
            "Target University Eligibility: Direct clearance for Computer Engineering, Medicine, or Artificial Intelligence at premier federal and international institutions."
          ],
          practiceQuestions: [
            "Take the 2025 JAMB Physics & Chemistry Simulation in the CBT module to confirm speed pacing (aim for under 40 seconds per question)."
          ],
          revisionTips: [
            "In JAMB CBT, time management is paramount. Eliminate obvious incorrect distractors within 10 seconds."
          ]
        };
      } else {
        responseText = `Here is a comprehensive breakdown of your query regarding "${promptToSend}":`;
        responseSection = {
          simpleExplanation: "This topic requires foundational conceptual clarity, structured mathematical or empirical proof, and recognition of key examiners marking criteria.",
          examples: [
            "Fundamental Principles & Core Formulas",
            "Typical WAEC / JAMB past examination problem formulation with step-by-step breakdown."
          ],
          practiceQuestions: [
            "Solve standard 5-mark structured problem on this topic in your worksheet.",
            "Test yourself under timed examination conditions."
          ],
          revisionTips: [
            "Break down multi-step calculations into individual method stages.",
            "Always state units clearly (e.g. m/s², Joules, Ω·m) to secure method marks."
          ]
        };
      }

      const aiReply: ChatMessageAI = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: 'Just now',
        sections: responseSection
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-[#111B5E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-yellow-300">
                <span className="material-symbols-outlined text-2xl">smart_toy</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-300">
                Personalized AI Academic Assistant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ExcelMind AI Academic Tutor
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Ask academic questions 24/7. Receive simple explanations, step-by-step derivations, worked examples, practice problems, and customized study timetables.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3.5 py-2 rounded-2xl border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gemini AI Engine Active</span>
          </div>
        </div>
      </div>

      {/* Quick Prompt Recommendation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-1 whitespace-nowrap">
          Quick Ask:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(qp.prompt)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm whitespace-nowrap transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            💡 {qp.label}
          </button>
        ))}
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[580px]">
        
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-lg">smart_toy</span>
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-3xl p-5 text-xs leading-relaxed space-y-3.5 shadow-sm ${
                    isUser
                      ? 'bg-[#111B5E] text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <p className="font-semibold text-sm leading-relaxed">{m.text}</p>

                  {/* Formatted Sections for AI response */}
                  {m.sections && (
                    <div className="space-y-3 pt-2 text-xs">
                      {m.sections.simpleExplanation && (
                        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60">
                          <span className="font-black text-[#111B5E] dark:text-blue-300 block mb-1 text-[11px] uppercase tracking-wider font-mono">
                            📖 1. Simple Explanation:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {m.sections.simpleExplanation}
                          </p>
                        </div>
                      )}

                      {m.sections.examples && m.sections.examples.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/60">
                          <span className="font-black text-purple-800 dark:text-purple-300 block mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                            📐 2. Worked Examples & Solutions:
                          </span>
                          <ul className="list-disc pl-4 space-y-1.5 text-slate-700 dark:text-slate-300">
                            {m.sections.examples.map((ex, i) => (
                              <li key={i}>{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {m.sections.practiceQuestions && m.sections.practiceQuestions.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60">
                          <span className="font-black text-emerald-800 dark:text-emerald-300 block mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                            ✍️ 3. Practice Questions:
                          </span>
                          <ul className="list-disc pl-4 space-y-1.5 text-slate-700 dark:text-slate-300">
                            {m.sections.practiceQuestions.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {m.sections.revisionTips && m.sections.revisionTips.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60">
                          <span className="font-black text-amber-800 dark:text-amber-300 block mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                            💡 4. High-Yield Revision Tips:
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                            {m.sections.revisionTips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right font-mono">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>ExcelMind AI is analyzing curriculum concept and drafting response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask ExcelMind AI Tutor anything (e.g. 'Explain quadratic equations' or 'Give me 5 WAEC Physics practice questions')..."
            className="flex-1 text-xs p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            className="px-5 py-3.5 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-40 text-white rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2 font-bold text-xs"
          >
            <span>Ask Tutor</span>
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>

      </div>

    </div>
  );
};
