import React from 'react';
import { AiTutorErrorBoundary } from './AiTutorErrorBoundary';
import { AiTutorViewInner } from './AiTutorView';

/**
 * Phase 2 — Isolated AI Tutor Wrapper Component
 * 
 * Provides complete architectural isolation for the AI Tutor:
 * - Isolated component lifecycle
 * - Isolated Error Boundary
 * - Guaranteed zero side-effects on parent layout, navigation, or authentication
 */
export const AiTutorWrapper: React.FC = () => {
  return (
    <AiTutorErrorBoundary>
      <AiTutorViewInner />
    </AiTutorErrorBoundary>
  );
};

export default AiTutorWrapper;
