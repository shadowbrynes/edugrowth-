import React, { useState } from 'react';
import { ChatMessage } from '../../types/excelmind';
import { CHAT_MESSAGES_DATA } from '../../data/excelmindData';

export const AcademicCommunicationView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES_DATA);
  const [selectedChannel, setSelectedChannel] = useState<string>('TCH-001'); // Dr. Kenneth Okon
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const channels = [
    {
      id: 'TCH-001',
      name: 'Dr. Kenneth Okon',
      role: 'Physics Master & Form Tutor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      status: 'online',
      unread: 1,
      subject: 'Physics'
    },
    {
      id: 'TCH-002',
      name: 'Mrs. Folashade Adeleke',
      role: 'HOD Mathematics',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      status: 'offline',
      unread: 0,
      subject: 'Mathematics'
    },
    {
      id: 'TCH-003',
      name: 'Mr. Babatunde Bakare',
      role: 'Chemistry Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      status: 'online',
      unread: 0,
      subject: 'Chemistry'
    },
    {
      id: 'ADM-OFFICE',
      name: 'Principal & Academic Registry',
      role: 'Official Announcements Feed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      status: 'announcement',
      unread: 0,
      subject: 'School Board'
    }
  ];

  const activeContact = channels.find((c) => c.id === selectedChannel) || channels[0];

  const currentChannelMessages = messages.filter(
    (m) =>
      (m.senderId === selectedChannel && m.recipientId === 'EXM-2025-0842') ||
      (m.senderId === 'EXM-2025-0842' && m.recipientId === selectedChannel) ||
      (selectedChannel === 'ADM-OFFICE' && m.channel === 'announcement')
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'EXM-2025-0842',
      senderName: 'John Doe',
      senderRole: 'student',
      recipientId: selectedChannel,
      recipientName: activeContact.name,
      text: inputText,
      timestamp: 'Just now',
      isRead: true,
      channel: selectedChannel === 'ADM-OFFICE' ? 'announcement' : 'teacher',
      subject: activeContact.subject
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Teacher simulated automated response if messaging an instructor
    if (selectedChannel.startsWith('TCH')) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderRole: 'teacher',
          senderAvatar: activeContact.avatar,
          recipientId: 'EXM-2025-0842',
          recipientName: 'John Doe',
          text: `Thank you for reaching out John! I have taken note of your question regarding ${activeContact.subject}. Keep working on the practice set and we will discuss this in tomorrow's tutorial period.`,
          timestamp: 'Just now',
          isRead: true,
          channel: 'teacher',
          subject: activeContact.subject
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-blue-300">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Academic Communication Centre
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Teacher & Peer Communication Hub
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              WhatsApp-style encrypted messaging with subject instructors, assignment feedback consultations, and school-wide official board notices.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-2 rounded-2xl border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Instructors Online</span>
          </div>
        </div>
      </div>

      {/* Modern WhatsApp-style Chat Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left List of Channels / Teachers (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">
              Academic Contacts ({channels.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {channels.map((contact) => {
              const isSelected = selectedChannel === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedChannel(contact.id)}
                  className={`w-full p-4 text-left transition flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                    {contact.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                        {contact.name}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {contact.role}
                    </p>

                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-1 inline-block">
                      {contact.subject}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Pane (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white dark:bg-slate-950">
          
          {/* Active Contact Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {activeContact.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeContact.role} • <span className="text-emerald-600 font-semibold">{activeContact.status}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Initiating secure voice consultation with ${activeContact.name}...`)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
              <span>Audio Call</span>
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F8FAFC] dark:bg-[#0B1229]">
            {currentChannelMessages.map((msg) => {
              const isMine = msg.senderId === 'EXM-2025-0842';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-[#111B5E] text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                        isMine ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && <span className="material-symbols-outlined text-xs">done_all</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                <span>{activeContact.name} is typing...</span>
              </div>
            )}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Attachment picker opened: Supports PDF solutions, diagram photos, worksheets.')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Attach File"
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeContact.name}...`}
              className="flex-1 text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              className="p-3 bg-[#111B5E] hover:bg-blue-900 text-white rounded-xl shadow transition cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
