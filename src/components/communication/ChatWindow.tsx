import React, { useState } from 'react';
import { TeacherContactInfo } from './TeacherContactCard';
import { WhatsAppButton } from './WhatsAppButton';
import { CallButton } from './CallButton';

export interface ChatMessageItem {
  id: string;
  sender: 'parent' | 'teacher';
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  teacher: TeacherContactInfo;
  studentName?: string;
  className?: string;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  teacher,
  studentName = 'John Doe',
  className = 'SS3 Science',
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'm-1',
      sender: 'teacher',
      text: `Good day Engr. Doe. I wanted to commend John's performance in our recent electromagnetic induction lab. His derivations were exceptional.`,
      timestamp: 'Yesterday 14:30'
    },
    {
      id: 'm-2',
      sender: 'parent',
      text: `Thank you Dr. Okon! We noticed he has been putting extra hours into Physics and Maths. Is there any particular past question series you recommend for his WAEC revision?`,
      timestamp: 'Yesterday 16:15'
    },
    {
      id: 'm-3',
      sender: 'teacher',
      text: `Yes indeed! Please advise him to focus on WAEC 2018–2024 Theory Section B in the ExcelMind Learning Hub. All video solutions are published there.`,
      timestamp: 'Today 09:10'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessageItem = {
      id: `m-${Date.now()}`,
      sender: 'parent',
      text: inputMsg,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Teacher auto-reply simulation
    setTimeout(() => {
      const reply: ChatMessageItem = {
        id: `m-${Date.now() + 1}`,
        sender: 'teacher',
        text: `Thank you for following up. I will review this during tutorial hours and keep you updated!`,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
          )}

          <div className="relative shrink-0">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
              {teacher.name}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {teacher.roleTitle} • Re: Ward {studentName} ({className})
            </p>
          </div>
        </div>

        {/* Quick Hotline Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <CallButton
            teacherName={teacher.name}
            phoneNumber={teacher.phone}
            teacherId={teacher.id}
          />
          <WhatsAppButton
            teacherName={teacher.name}
            whatsappNumber={teacher.whatsapp}
            studentName={studentName}
            className={className}
            teacherId={teacher.id}
          />
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-md ${m.sender === 'parent' ? 'ml-auto items-end' : 'items-start'}`}
          >
            <div
              className={`p-3.5 sm:p-4 rounded-3xl text-xs leading-relaxed shadow-sm ${
                m.sender === 'parent'
                  ? 'bg-[#111B5E] text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              <p className="whitespace-pre-line font-medium">{m.text}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
              {m.sender === 'parent' ? 'You' : teacher.name} • {m.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Message ${teacher.name} regarding ${studentName}...`}
          className="flex-1 text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner font-medium"
        />

        <button
          type="submit"
          disabled={!inputMsg.trim()}
          className="px-4 py-3 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-40 text-white font-black text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>Send</span>
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>

    </div>
  );
};

export default ChatWindow;
