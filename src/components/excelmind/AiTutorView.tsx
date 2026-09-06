import React, { useState, useRef, useEffect } from 'react';
import { aiApi } from '../../services/api';
import { AiTutorErrorBoundary } from './AiTutorErrorBoundary';
import { aiTutorService, NormalizedAiResponse } from '../../services/aiTutorService';

interface ChatMessageAI {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageAttachment?: string;
  timestamp: string;
  subject?: string;
  level?: string;
}

/**
 * Natural Educational Response Renderer
 * Renders educational explanations naturally with headings, structured bullets,
 * formulas, quotes, and paragraphs without forcing into rigid template cards.
 */
const EducationalTextRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const blocks = text.split(/\n\s*\n/);

  return (
    <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Formula / Equation block
        if (trimmed.startsWith('Formula:') || trimmed.startsWith('Chemical Equation:')) {
          return (
            <div key={idx} className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-mono text-xs text-indigo-950 dark:text-indigo-200 font-semibold whitespace-pre-wrap shadow-xs">
              {trimmed}
            </div>
          );
        }

        // Scripture quote
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 font-serif italic text-xs sm:text-sm shadow-xs">
              {trimmed}
            </div>
          );
        }

        // Bulleted or numbered lines
        const lines = trimmed.split('\n');
        const hasBullets = lines.some((l) => /^(\s*[-•*]|\s*\d+\.)\s+/.test(l));

        if (hasBullets) {
          return (
            <div key={idx} className="space-y-1.5 pt-0.5">
              {lines.map((line, lIdx) => {
                const lineTrimmed = line.trim();
                const isBullet = /^(\s*[-•*]|\s*\d+\.)\s+/.test(line);
                const isSubHeader = lineTrimmed.endsWith(':') && !isBullet;

                if (isSubHeader) {
                  return (
                    <h4 key={lIdx} className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm pt-1.5 pb-0.5 font-mono">
                      {lineTrimmed}
                    </h4>
                  );
                }

                if (isBullet) {
                  const bulletMatch = lineTrimmed.match(/^(\s*[-•*]|\s*\d+\.)\s+/);
                  const marker = bulletMatch ? bulletMatch[0].trim() : '•';
                  const bulletContent = lineTrimmed.replace(/^(\s*[-•*]|\s*\d+\.)\s+/, '');
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-1 sm:pl-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 text-xs mt-0.5">
                        {marker === '-' || marker === '*' ? '•' : marker}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap">{bulletContent}</span>
                    </div>
                  );
                }

                return (
                  <p key={lIdx} className="whitespace-pre-wrap">
                    {lineTrimmed}
                  </p>
                );
              })}
            </div>
          );
        }

        // Section header
        if (trimmed.endsWith(':') && trimmed.length < 80) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm pt-1 font-mono">
              {trimmed}
            </h4>
          );
        }

        // Regular educational paragraph
        return (
          <p key={idx} className="whitespace-pre-wrap leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

export const AiTutorViewInner: React.FC = () => {
  const [studentContext, setStudentContext] = useState<any>({
    id: 1,
    name: 'Student',
    classLevel: 'SS3',
    department: 'Science',
    school: 'ExcelMind Academy'
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('Auto-Detect');
  const initialWelcomeMessage: ChatMessageAI = {
    id: 'ai-init',
    sender: 'ai',
    text: "Hello! I am your ExcelMind AI Tutor.\n\nI answer your questions directly like an experienced teacher—whether you need a scientific explanation (\"What is Faraday's law of electricity?\", \"What is Newton's Law?\", \"What is Physics?\"), a social definition (\"Who is a parent?\"), a biological process (\"Explain photosynthesis\"), a civic question (\"What is a constitution?\"), a step-by-step mathematical solution (\"Solve 2x + 5 = 15\"), or a scripture lookup (\"What is Genesis chapter 10 verse 6?\").\n\nAsk me anything!",
    timestamp: 'Just now',
    subject: 'Academic Tutor'
  };

  const [messages, setMessages] = useState<ChatMessageAI[]>([initialWelcomeMessage]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authSessionNotice, setAuthSessionNotice] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function loadContext() {
      try {
        const res = await aiApi.tutorContext(studentContext?.id || 1);
        if (res?.status === 401) {
          setAuthSessionNotice('Your session needs refreshing.');
        } else if (res?.success && res.data?.context) {
          setStudentContext((prev: any) => ({
            ...prev,
            ...res.data.context,
            id: res.data.context.id || prev?.id || 1
          }));
        }
      } catch (err) {
        console.warn('AI context notice:', err);
      }
    }
    loadContext();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const subjectOptions = [
    'Auto-Detect',
    'Physics',
    'Biology',
    'Mathematics',
    'Civic Education',
    'Social Studies',
    'Religious Studies',
    'Chemistry',
    'History'
  ];

  // Benchmark prompts requested by user
  const benchmarkPrompts = [
    { label: "What is Physics?", prompt: "What is Physics?" },
    { label: "What is Newton's law?", prompt: "What is Newton's law?" },
    { label: "What is Faraday's law?", prompt: "What is Faraday's law?" },
    { label: "What is speed in physics?", prompt: "What is speed in physics?" },
    { label: "What is a constitution?", prompt: "What is a constitution?" },
    { label: "Who is a parent?", prompt: "Who is a parent?" },
    { label: "Genesis 10:6", prompt: "What is Genesis chapter 10 verse 6?" },
    { label: "Solve 2x + 5 = 15", prompt: "Solve 2x + 5 = 15." }
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

  const handleClearSession = async () => {
    try {
      await aiApi.clearSession(studentContext?.id || 1);
    } catch (e) {
      console.warn('Clear session notice:', e);
    }
    setMessages([initialWelcomeMessage]);
    setSelectedSubject('Auto-Detect');
    setInputPrompt('');
    setAttachedImage(null);
    setErrorMessage(null);
    setAuthSessionNotice(null);
    setLastPrompt('');
  };

  const displayResponse = (rawResp: any, question: string, sub?: string) => {
    try {
      const answerText = String(
        rawResp?.answer ||
        rawResp?.response?.text ||
        rawResp?.response?.answer ||
        (typeof rawResp?.response === 'string' ? rawResp.response : '') ||
        'Educational explanation provided.'
      );

      const detectedSub = String(rawResp?.subject || rawResp?.response?.subject || sub || 'Academic Studies');
      const detectedLevel = rawResp?.level || rawResp?.response?.level || 'Secondary';
      const resolvedText = answerText.trim() || 'Educational explanation provided.';

      const aiMsg: ChatMessageAI = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'ai',
        text: resolvedText,
        timestamp: 'Just now',
        subject: detectedSub,
        level: String(detectedLevel)
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('[AI Tutor displayResponse Safe Catch]:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'AI Tutor is temporarily unavailable. Please try again.',
          timestamp: 'Just now',
          subject: sub || 'Academic Studies'
        }
      ]);
    }
  };

  const handleSendPrompt = async (promptToSend: string, customSubject?: string) => {
    try {
      const textQuery = String(promptToSend ?? '').trim();
      if (!textQuery && !attachedImage) return;

      const currentImage = attachedImage;
      const sub = customSubject || (selectedSubject === 'Auto-Detect' ? undefined : selectedSubject);

      setLastPrompt(textQuery);
      setErrorMessage(null);

      const userMsg: ChatMessageAI = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'user',
        text: textQuery || (currentImage ? 'Please solve the photographed question in this image.' : ''),
        imageAttachment: currentImage || undefined,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputPrompt('');
      setAttachedImage(null);
      setIsThinking(true);

      // Dedicated Fault-Tolerant AI Service Call
      const res = await aiTutorService.askTutor(textQuery, {
        studentId: studentContext?.id || 1,
        subject: sub,
        imageAttachment: currentImage
      });

      if (res && res.data) {
        displayResponse(res.data, textQuery, res.data.subject);
      } else {
        setErrorMessage('AI Tutor is temporarily unavailable. Please try again.');
      }
    } catch (globalErr) {
      console.error('[AI Tutor Safe Wrapper Catch]:', globalErr);
      setErrorMessage('AI Tutor is temporarily unavailable. Please try again.');
    } finally {
      setIsThinking(false);
    }
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
                Adaptive AI Educational Assistant • Teacher-Level Explanations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ExcelMind AI Academic Tutor
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
              Natural language understanding that teaches like an experienced educator. Dynamic answers for definitions, scientific laws, calculations, biographies, and scripture without circular template filler.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={handleClearSession}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 shadow-md transition flex items-center gap-2 cursor-pointer"
              title="Reset conversation context"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span>New Chat / Clear Context</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[750px] overflow-hidden">
        {/* Subject Mode Filter Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0 uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Subject:</span>
          </span>
          {subjectOptions.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSelectedSubject(subj)}
              className={`text-xs font-bold px-3 py-1 rounded-xl transition whitespace-nowrap cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Benchmark Test Prompts Rail */}
        <div className="p-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0 uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            <span>Test Queries:</span>
          </span>
          {benchmarkPrompts.map((bp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendPrompt(bp.prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 transition whitespace-nowrap shadow-xs cursor-pointer"
            >
              {bp.label}
            </button>
          ))}
        </div>

        {/* Auth Session Warning if 401 */}
        {authSessionNotice && (
          <div className="p-3 mx-4 my-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-600">lock_clock</span>
              <span className="font-semibold">{authSessionNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Refresh Session</span>
            </button>
          </div>
        )}

        {/* In-Chat Error Banner */}
        {errorMessage && (
          <div className="p-3 mx-4 my-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-600">info</span>
              <span className="font-semibold">{errorMessage}</span>
            </div>
            {lastPrompt && (
              <button
                type="button"
                onClick={() => handleSendPrompt(lastPrompt)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">replay</span>
                <span>Retry Question</span>
              </button>
            )}
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm shadow ${
                  m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {m.sender === 'user' ? 'person' : 'smart_toy'}
                </span>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-3xl space-y-3 text-xs leading-relaxed max-w-full break-words ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {/* AI Subject Tag Header (NO Confidence: 99% badge) */}
                {m.sender === 'ai' && (
                  <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700 gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">school</span>
                      <span>{String(m.subject || 'Academic Studies')}</span>
                    </span>

                    {m.level && (
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {String(m.level)}
                      </span>
                    )}
                  </div>
                )}

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

                {/* Natural Educational Response Renderer */}
                {m.sender === 'ai' ? (
                  <EducationalTextRenderer text={m.text} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                )}

                <span className="text-[10px] text-slate-400 block text-right font-mono">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Loading state indicator */}
          {isThinking && (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center animate-pulse shadow">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                <span className="font-semibold">ExcelMind AI Tutor is thinking...</span>
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
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block">
                  Question Photo Attached
                </span>
                <span className="text-[10px] text-slate-500">Ready for OCR and solution</span>
              </div>
            </div>
            <button
              type="button"
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendPrompt(inputPrompt);
              }
            }}
            placeholder={`Ask any question (e.g. "What is Faraday's law of electricity?", "What is Physics?", "Who is a parent?")...`}
            className="flex-1 text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSendPrompt(inputPrompt);
            }}
            disabled={(!inputPrompt.trim() && !attachedImage) || isThinking}
            className="px-5 py-3 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-40 text-white rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-1.5 font-bold text-xs shrink-0"
          >
            <span>Ask Tutor</span>
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const AiTutorView: React.FC = () => (
  <AiTutorErrorBoundary>
    <AiTutorViewInner />
  </AiTutorErrorBoundary>
);

export default AiTutorView;
