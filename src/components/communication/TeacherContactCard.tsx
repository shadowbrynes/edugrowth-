import React from 'react';
import { WhatsAppButton } from './WhatsAppButton';
import { CallButton } from './CallButton';

export interface TeacherContactInfo {
  id: number;
  name: string;
  roleTitle: string;
  department: string;
  subject: string;
  phone: string;
  whatsapp: string;
  status: 'available' | 'busy' | 'offline';
  avatar: string;
}

interface TeacherContactCardProps {
  teacher: TeacherContactInfo;
  studentName?: string;
  className?: string;
  onOpenInAppChat: (teacher: TeacherContactInfo) => void;
}

export const TeacherContactCard: React.FC<TeacherContactCardProps> = ({
  teacher,
  studentName = 'John Doe',
  className = 'SS3 Science',
  onOpenInAppChat
}) => {
  const statusColors = {
    available: 'bg-emerald-500 text-white',
    busy: 'bg-amber-500 text-white',
    offline: 'bg-slate-400 text-white'
  };

  const statusLabels = {
    available: 'Available Now',
    busy: 'In Class / Busy',
    offline: 'Offline'
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
      
      {/* Top Header */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-13 h-13 rounded-2xl object-cover border-2 border-indigo-100 dark:border-indigo-900 shadow"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
              teacher.status === 'available'
                ? 'bg-emerald-500'
                : teacher.status === 'busy'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
            title={`Status: ${teacher.status}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
              {teacher.name}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${statusColors[teacher.status]}`}>
              {statusLabels[teacher.status]}
            </span>
          </div>

          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {teacher.roleTitle} • {teacher.subject}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
            {teacher.department}
          </p>
        </div>
      </div>

      {/* 3 Interactive Communication Actions */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <CallButton
          teacherName={teacher.name}
          phoneNumber={teacher.phone}
          teacherId={teacher.id}
          classNameCustom="w-full justify-center"
        />

        <WhatsAppButton
          teacherName={teacher.name}
          whatsappNumber={teacher.whatsapp}
          studentName={studentName}
          className={className}
          teacherId={teacher.id}
          classNameCustom="w-full justify-center"
        />

        <button
          type="button"
          onClick={() => onOpenInAppChat(teacher)}
          className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          title={`Send in-app message to ${teacher.name}`}
        >
          <span className="material-symbols-outlined text-base">mail</span>
          <span>Message</span>
        </button>
      </div>

    </div>
  );
};

export default TeacherContactCard;
