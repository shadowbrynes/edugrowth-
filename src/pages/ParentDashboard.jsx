import React from 'react';
import { ParentPortalView } from '../components/excelmind/ParentPortalView';
import { CURRENT_STUDENT } from '../data/excelmindData';

export const ParentDashboard = ({ onNavigateToMessages, onNavigateToResults }) => {
  return (
    <ParentPortalView
      student={CURRENT_STUDENT}
      onNavigateToMessages={onNavigateToMessages}
      onNavigateToResults={onNavigateToResults}
    />
  );
};

export default ParentDashboard;
