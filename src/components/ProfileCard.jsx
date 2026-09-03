import React from 'react';

export const ProfileCard = ({ user, student }) => {
  const displayUser = user || {
    name: student?.name || 'John Doe',
    email: student?.email || 'john.doe@excelmind.edu.ng',
    role: 'Student'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <img
        src={student?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120'}
        alt={displayUser.name}
        className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
      />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">{displayUser.name}</h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            {displayUser.role}
          </span>
        </div>
        <p className="text-xs text-slate-500">{displayUser.email}</p>
        {student?.class && (
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            {student.class} • {student.department}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
