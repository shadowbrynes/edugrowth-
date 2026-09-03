import React from 'react';
import { StudentDashboardView } from '../components/excelmind/StudentDashboardView';
import { CURRENT_STUDENT } from '../data/excelmindData';

export const StudentDashboard = ({ onNavigate, onSelectCourse, onSelectExam }) => {
  return (
    <StudentDashboardView
      student={CURRENT_STUDENT}
      onNavigate={onNavigate || (() => {})}
      onSelectCourse={onSelectCourse}
      onSelectExam={onSelectExam}
    />
  );
};

export default StudentDashboard;
