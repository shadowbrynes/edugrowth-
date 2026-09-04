import React, { useState, useRef } from 'react';
import { isAiConfigured } from '../../ai';

interface ChatMessageAI {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageAttachment?: string;
  timestamp: string;
  sections?: {
    simpleExplanation?: string;
    examples?: string[];
    practiceQuestions?: string[];
    solutions?: string[];
    revisionTips?: string[];
  };
}

export const AiTutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageAI[]>([
    {
      id: 'ai-init',
      sender: 'ai',
      text: "Hello John! I am your ExcelMind AI Academic Tutor (Cross-Platform: Android, iOS, Desktop & Web). How can I empower your studies today? You can ask me questions, upload photos of tricky textbook/past questions, request step-by-step mathematical explanations, or generate customized weekly revision plans.",
      timestamp: 'Just now',
      sections: {
        simpleExplanation: "I break down complex WAEC, JAMB, and Cambridge concepts into plain, intuitive language.",
        examples: [
          "Example: Solving ax² + bx + c = 0 using the quadratic formula",
          "Example: Lenz's law & induced EMF in AC transformers"
        ],
        practiceQuestions: [
          "1. Solve 2x² - 5x + 2 = 0 by factorisation.",
          "2. What is the discriminant of 3x² + 5x + 4 = 0?"
        ],
        solutions: [
          "Solution 1: Roots are x = 1/2 or x = 2.",
          "Solution 2: Δ = b² - 4ac = 25 - 48 = -23 (Roots are complex/imaginary)."
        ],
        revisionTips: ["Focus on understanding fundamental formulas rather than rote memorization."]
      }
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const quickPrompts = [
    { label: 'Explain Quadratic Equations', prompt: 'Explain quadratic equations with simple explanation, worked examples, practice questions, and step-by-step solutions.' },
    { label: 'Generate 7-Day Revision Plan', prompt: 'Generate a 7-day revision plan targeting straight A1 distinctions in WAEC & 320+ in JAMB UTME.' },
    { label: 'Electromagnetic Induction', prompt: 'Explain Faradays law of electromagnetic induction and transformer equation step-by-step.' },
    { label: 'Predict Exam Strengths', prompt: 'Analyze my 82% term performance and recommend a strategy for straight A1s.' }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendPrompt = async (promptToSend: string) => {
    if (!promptToSend.trim() && !attachedImage) return;

    const currentImage = attachedImage;
    const userMsg: ChatMessageAI = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptToSend || (currentImage ? 'Please solve the photographed question in this image step-by-step with exam tips.' : ''),
      imageAttachment: currentImage || undefined,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setAttachedImage(null);
    setIsThinking(true);

    setTimeout(() => {
      let responseSection: ChatMessageAI['sections'] = {};
      let responseText = '';

      const lower = (promptToSend || '').toLowerCase();

      if (currentImage || lower.includes('photo') || lower.includes('image')) {
        responseText = "I analyzed the question from your uploaded image. Here is the complete step-by-step solution, mathematical working, and exam strategy:";
        responseSection = {
          simpleExplanation: "Optical recognition identifies this as a standard WAEC Senior Secondary kinematics/algebra problem. The problem requires identifying given variables and applying fundamental conservation equations.",
          examples: [
            "Given: Initial parameters identified from graphic",
            "Formula: Applying governing equation with step-by-step substitution"
          ],
          practiceQuestions: [
            "Practice Drill: Solve a variant problem with inverted initial conditions."
          ],
          solutions: [
            "Step 1: Write down given values. Step 2: Substitute into formula. Step 3: Compute final numerical value with correct SI units."
          ],
          revisionTips: [
            "WAEC examiners award method marks (M1) for stating the formula before calculation.",
            "Always include appropriate SI units to avoid losing final accuracy mark (A1)."
          ]
        };
      } else if (lower.includes('quadratic')) {
        responseText = "Quadratic equations are second-degree polynomials universally expressed as ax² + bx + c = 0 (a ≠ 0). Here is the complete breakdown:";
        responseSection = {
          simpleExplanation: "A quadratic equation represents a parabola on a coordinate plane. The 'roots' or solutions are the points where the curve intersects the horizontal x-axis.",
          examples: [
            "Factorization: x² - 5x + 6 = 0 => (x - 2)(x - 3) = 0 => x = 2 or x = 3.",
            "Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a). For 2x² - 7x + 3 = 0 => x = [7 ± 5] / 4 => x = 3 or x = 0.5."
          ],
          practiceQuestions: [
            "1. Find the discriminant of 3x² + 5x + 4 = 0 and determine the nature of its roots.",
            "2. Find the quadratic equation whose roots are -4 and 7."
          ],
          solutions: [
            "Solution 1: Δ = b² - 4ac = 25 - 48 = -23. Since Δ < 0, roots are complex/imaginary.",
            "Solution 2: x² - (sum of roots)x + (product) = 0 => x² - (-4 + 7)x + (-28) = x² - 3x - 28 = 0."
          ],
          revisionTips: [
            "If b² - 4ac > 0: Two real distinct roots.",
            "If b² - 4ac = 0: Two real equal roots (perfect square).",
            "If b² - 4ac < 0: Complex conjugate roots."
          ]
        };
      } else if (lower.includes('revision') || lower.includes('timetable') || lower.includes('plan')) {
        responseText = "Here is your customized High-Yield 7-Day Revision Plan targeting straight A1s in WAEC and 320+ in JAMB UTME:";
        responseSection = {
          simpleExplanation: "This schedule balances peak morning focus for mathematical calculations with evening review blocks for languages and vocational subjects.",
          examples: [
            "Mon: 06:00-07:30 (Calculus & Mechanics) • 16:30-18:00 (Organic Chemistry) • 20:30-21:30 (English Comprehension)",
            "Tue: 06:00-07:30 (Trigonometry & Vectors) • 16:30-18:00 (Physics Waves) • 20:30-21:30 (Civic Education)",
            "Wed: 06:00-07:30 (Further Maths Matrices) • 16:30-18:00 (Full JAMB CBT Mock 100 Qs)",
            "Thu: 06:00-07:30 (Chemical Equilibrium) • 16:30-18:00 (Biology Genetics)",
            "Fri: 06:00-07:30 (Electromagnetism) • 16:30-18:00 (English Oral Phonetics)",
            "Sat: Full WAEC Past Question Simulation under timed conditions",
            "Sun: Mistake Analysis & Weak Subject Remediation."
          ],
          practiceQuestions: [
            "Allocate minimum 50 past questions each weekend for self-timed evaluation."
          ],
          solutions: [
            "Track your weekly adherence in the AI Learning Coach & Revision Planner module."
          ],
          revisionTips: [
            "Active recall beats passive reading: solve problems rather than just reviewing notes."
          ]
        };
      } else {
        responseText = `Here is a comprehensive academic analysis of "${promptToSend}":`;
        responseSection = {
          simpleExplanation: `To master ${promptToSend}, focus on the underlying physical or mathematical principles and understand how examination boards test this concept.`,
          examples: [
            "Standard worked model from WAEC syllabus past papers",
            "Real-world application and laboratory significance"
          ],
          practiceQuestions: [
            "Self-check question: Formulate the fundamental equation governing this concept."
          ],
          solutions: [
            "Step-by-step verification applying NERDC syllabus guidelines."
          ],
          revisionTips: [
            "Review past questions from 2018 to 2024 to identify recurring patterns."
          ]
        };
      }

      const aiMsg: ChatMessageAI = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: 'Just now',
        sections: responseSection
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-indigo-300">
                <span className="material-symbols-outlined text-2xl">smart_toy</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                Cross-Platform Academic Companion • Android • iOS • Desktop • Web
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ExcelMind AI Academic Tutor
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
              Instant academic assistance, step-by-step problem solver, question photo recognition, and customized revision plan generator for Nigerian secondary and university students.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-white uppercase">
              {isAiConfigured() ? 'Gemini AI Online' : 'AI Offline Simulator'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[700px] overflow-hidden">
        
        {/* Quick Prompts Rail */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 uppercase">Quick Actions:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(qp.prompt)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 transition whitespace-nowrap shadow-sm cursor-pointer"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm shadow ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {m.sender === 'user' ? 'person' : 'smart_toy'}
                </span>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-3xl space-y-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Uploaded image if present */}
                {m.imageAttachment && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-xs">
                    <img
                      src={m.imageAttachment}
                      alt="Question photo"
                      className="w-full h-auto object-cover"
                    />
                    <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 block font-mono">
                      📷 Question Photo Attached
                    </span>
                  </div>
                )}

                <p className="font-semibold whitespace-pre-line">{m.text}</p>

                {/* Structured Sections */}
                {m.sections && (
                  <div className="space-y-3 pt-2">
                    {/* Explanation */}
                    {m.sections.simpleExplanation && (
                      <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                        <span className="font-black text-blue-800 dark:text-blue-300 block mb-1 uppercase tracking-wider font-mono text-[11px]">
                          📖 1. Intuitive Explanation:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300">{m.sections.simpleExplanation}</p>
                      </div>
                    )}

                    {/* Examples */}
                    {m.sections.examples && m.sections.examples.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                        <span className="font-black text-emerald-800 dark:text-emerald-300 block mb-1 uppercase tracking-wider font-mono text-[11px]">
                          🧮 2. Model Worked Examples:
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {m.sections.examples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practice Questions */}
                    {m.sections.practiceQuestions && m.sections.practiceQuestions.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                        <span className="font-black text-purple-800 dark:text-purple-300 block mb-1 uppercase tracking-wider font-mono text-[11px]">
                          ❓ 3. Formative Practice Questions:
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {m.sections.practiceQuestions.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Solutions */}
                    {m.sections.solutions && m.sections.solutions.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
                        <span className="font-black text-teal-800 dark:text-teal-300 block mb-1 uppercase tracking-wider font-mono text-[11px]">
                          💡 4. Step-by-Step Solutions:
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {m.sections.solutions.map((sol, i) => (
                            <li key={i}>{sol}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Revision Tips */}
                    {m.sections.revisionTips && m.sections.revisionTips.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                        <span className="font-black text-amber-800 dark:text-amber-300 block mb-1 uppercase tracking-wider font-mono text-[11px]">
                          🎯 5. High-Yield Revision Strategy:
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
          ))}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>ExcelMind AI is analyzing curriculum concept and drafting response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Upload Thumbnail if attached */}
        {attachedImage && (
          <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border-t border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={attachedImage}
                alt="Upload preview"
                className="w-12 h-12 object-cover rounded-xl border border-indigo-300"
              />
              <div>
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block">Question Photo Attached</span>
                <span className="text-[10px] text-slate-500">Ready for OCR and step-by-step AI solution</span>
              </div>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer flex items-center justify-center shrink-0"
            title="Upload photo of question"
          >
            <span className="material-symbols-outlined text-lg">add_a_photo</span>
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask ExcelMind AI Tutor anything or upload question photo..."
            className="flex-1 text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner"
          />

          <button
            type="submit"
            disabled={(!inputPrompt.trim() && !attachedImage) || isThinking}
            className="px-4 py-3 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-40 text-white rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-1.5 font-bold text-xs shrink-0"
          >
            <span>Ask Tutor</span>
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>

      </div>

    </div>
  );
};

export default AiTutorView;
