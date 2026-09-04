import React, { useState } from 'react';
import { TeacherContactCard, TeacherContactInfo } from './TeacherContactCard';
import { MessageTeacher } from './MessageTeacher';
import { ChatWindow } from './ChatWindow';

interface ParentCommunicationProps {
  studentName?: string;
  className?: string;
  admissionNo?: string;
}

export const ParentCommunication: React.FC<ParentCommunicationProps> = ({
  studentName = 'John Doe',
  className = 'SS3 Science',
  admissionNo = 'EXM-2025-0842'
}) => {
  const [activeView, setActiveView] = useState<'cards' | 'chat'>('cards');
  const [selectedTeacherForChat, setSelectedTeacherForChat] = useState<TeacherContactInfo | null>(null);
  const [selectedTeacherForModal, setSelectedTeacherForModal] = useState<TeacherContactInfo | null>(null);
  const [filterSubject, setFilterSubject] = useState('All');

  const teachersList: TeacherContactInfo[] = [
    {
      id: 1,
      name: 'Dr. Kenneth Okon',
      roleTitle: 'Senior Form Class Teacher',
      department: 'SS3 Science Faculty Lead',
      subject: 'Physics (PHY 302)',
      phone: '+2348022334455',
      whatsapp: '2348022334455',
      status: 'available',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 2,
      name: 'Mrs. Folashade Adeleke',
      roleTitle: 'HOD Mathematics',
      department: 'Senior Secondary STEM',
      subject: 'General Mathematics (MTH 301)',
      phone: '+2348033112233',
      whatsapp: '2348033112233',
      status: 'available',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      id: 3,
      name: 'Mr. Babatunde Alabi',
      roleTitle: 'Senior Subject Instructor',
      department: 'Chemical Sciences',
      subject: 'Chemistry (CHM 303)',
      phone: '+2348044223344',
      whatsapp: '2348044223344',
      status: 'busy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 4,
      name: 'Dr. Aisha Bello',
      roleTitle: 'Laboratory Coordinator',
      department: 'Biological Sciences',
      subject: 'Biology (BIO 305)',
      phone: '+2348055334455',
      whatsapp: '2348055334455',
      status: 'available',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150'
    },
    {
      id: 5,
      name: 'Mrs. Ngozi Okonkwo',
      roleTitle: 'Languages & Humanities Lead',
      department: 'Arts & Literary Studies',
      subject: 'English Language (ENG 304)',
      phone: '+2348066445566',
      whatsapp: '2348066445566',
      status: 'offline',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'
    }
  ];

  const filteredTeachers = filterSubject === 'All'
    ? teachersList
    : teachersList.filter((t) => t.subject.toLowerCase().includes(filterSubject.toLowerCase()));

  const handleOpenChat = (t: TeacherContactInfo) => {
    setSelectedTeacherForChat(t);
    setActiveView('chat');
  };

  return (
    <div className="space-y-6">
      
      {/* Student Linkage Context Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#111B5E] text-white flex items-center justify-center font-black text-lg shadow">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                Linked Ward: {studentName}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {className}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Admission ID: <span className="font-mono font-bold">{admissionNo}</span> • ExcelMind International College
            </p>
          </div>
        </div>

        {/* Working Hours Badge */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
            Teacher Hours: Mon–Fri, 8:00 AM – 5:00 PM
          </span>
        </div>
      </div>

      {activeView === 'chat' && selectedTeacherForChat ? (
        <ChatWindow
          teacher={selectedTeacherForChat}
          studentName={studentName}
          className={className}
          onBack={() => setActiveView('cards')}
        />
      ) : (
        <div className="space-y-4">
          
          {/* Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Faculty & Subject Teacher Directory
              </h3>
              <p className="text-xs text-slate-500">
                Contact your child's assigned teachers directly through WhatsApp, phone, or secure portal messaging.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 text-[11px]">Filter Subject:</span>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
              >
                <option value="All">All Teachers ({teachersList.length})</option>
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((t) => (
              <TeacherContactCard
                key={t.id}
                teacher={t}
                studentName={studentName}
                className={className}
                onOpenInAppChat={handleOpenChat}
              />
            ))}
          </div>

        </div>
      )}

      {/* Message Modal if triggered */}
      {selectedTeacherForModal && (
        <MessageTeacher
          teacher={selectedTeacherForModal}
          studentName={studentName}
          className={className}
          onClose={() => setSelectedTeacherForModal(null)}
        />
      )}

    </div>
  );
};

export default ParentCommunication;
