/**
 * ExcelMind Academic Companion
 * Student Education Evaluation & Academic Companion Platform
 */

import React, { useState, useEffect } from 'react';
import { UserRole, ActiveModule } from './types/excelmind';
import { CURRENT_STUDENT } from './data/excelmindData';

// Header & Navigation
import { ExcelMindHeader } from './components/excelmind/ExcelMindHeader';
import { ExcelMindSidebar } from './components/excelmind/ExcelMindSidebar';

// Student Core Modules
import { StudentDashboardView } from './components/excelmind/StudentDashboardView';
import { AcademicPlannerView } from './components/excelmind/AcademicPlannerView';
import { LearningHubView } from './components/excelmind/LearningHubView';
import { CbtExamView } from './components/excelmind/CbtExamView';
import { PerformanceAnalyticsView } from './components/excelmind/PerformanceAnalyticsView';
import { AcademicCommunicationView } from './components/excelmind/AcademicCommunicationView';
import { AiTutorView } from './components/excelmind/AiTutorView';
import { CurriculumAutomationView } from './components/excelmind/CurriculumAutomationView';
import { AiLearningCoachView } from './components/excelmind/AiLearningCoachView';

// Faculty, Parent & Admin Role Portals
import { TeacherPortalView } from './components/excelmind/TeacherPortalView';
import { ParentPortalView } from './components/excelmind/ParentPortalView';
import { AdminPortalView } from './components/excelmind/AdminPortalView';
import { ProfileSettingsView } from './components/excelmind/ProfileSettingsView';

// Authentication Pages
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { clearAuthToken } from './services/api';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [authScreen, setAuthScreen] = useState<'login' | 'forgot_password' | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('2025/2026 Term 1');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('excelmind_theme') === 'dark';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Selected course and exam IDs for cross-module jumping
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(undefined);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('excelmind_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('excelmind_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // When switching role, default back to relevant dashboard
    setActiveModule('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1229] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* 1. Global Header Bar */}
      <ExcelMindHeader
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedSession={selectedSession}
        onSessionChange={setSelectedSession}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onSignOut={() => {
          clearAuthToken();
          setAuthScreen('login');
        }}
      />

      {/* 2. Main Layout Container: Sidebar + Content Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Responsive Navigation Sidebar (Hidden during Auth Screens) */}
        {!authScreen && (
          <ExcelMindSidebar
            activeModule={activeModule}
            onSelectModule={(mod) => {
              setActiveModule(mod);
              setIsMobileMenuOpen(false);
            }}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            currentRole={currentRole}
          />
        )}

        {/* Center Main Stage Content Canvas */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-6">
          
          {/* AUTHENTICATION SCREENS */}
          {authScreen === 'login' && (
            <Login
              onLoginSuccess={(user, role) => {
                setCurrentRole(role);
                setAuthScreen(null);
              }}
              onNavigateForgotPassword={() => setAuthScreen('forgot_password')}
            />
          )}

          {authScreen === 'forgot_password' && (
            <ForgotPassword onBackToLogin={() => setAuthScreen('login')} />
          )}

          {/* MAIN PLATFORM WORKSPACES */}
          {!authScreen && (
            <>
              {/* TEACHER ROLE VIEW */}
              {currentRole === 'teacher' && <TeacherPortalView />}

              {/* PARENT ROLE VIEW */}
              {currentRole === 'parent' && (
            <ParentPortalView
              student={CURRENT_STUDENT}
              onNavigateToMessages={() => {
                setCurrentRole('student');
                setActiveModule('messages');
              }}
              onNavigateToResults={() => {
                setCurrentRole('student');
                setActiveModule('results');
              }}
            />
          )}

          {/* ADMINISTRATOR ROLE VIEW */}
          {currentRole === 'admin' && <AdminPortalView />}

          {/* STUDENT ROLE VIEWS (11 modules) */}
          {currentRole === 'student' && (
            <>
              {activeModule === 'dashboard' && (
                <StudentDashboardView
                  student={CURRENT_STUDENT}
                  onNavigate={setActiveModule}
                  onSelectCourse={setSelectedCourseId}
                  onSelectExam={setSelectedExamId}
                />
              )}

              {(activeModule === 'courses' || activeModule === 'learning_hub') && (
                <LearningHubView initialCourseId={selectedCourseId} />
              )}

              {(activeModule === 'timetable' || activeModule === 'assignments') && (
                <AcademicPlannerView />
              )}

              {activeModule === 'cbt' && (
                <CbtExamView initialExamId={selectedExamId} />
              )}

              {activeModule === 'results' && (
                <PerformanceAnalyticsView student={CURRENT_STUDENT} />
              )}

              {activeModule === 'messages' && (
                <AcademicCommunicationView />
              )}

              {activeModule === 'ai_tutor' && (
                <AiTutorView />
              )}

              {activeModule === 'curriculum' && (
                <CurriculumAutomationView />
              )}

              {activeModule === 'coach' && (
                <AiLearningCoachView />
              )}

              {(activeModule === 'profile' || activeModule === 'settings') && (
                <ProfileSettingsView
                  student={CURRENT_STUDENT}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              )}
            </>
          )}
          </>
          )}

        </main>

      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              Excel<span className="text-blue-600">Mind</span> Academic Companion
            </span>
            <span>•</span>
            <span>Accredited Secondary & Higher Ed CBT Evaluation System</span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            Empowering WAEC • NECO • JAMB • Cambridge Standards
          </p>
        </div>
      </footer>

    </div>
  );
}
