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
import { EducationalBackground } from './components/excelmind/EducationalBackground';

// Student Core Modules
import { StudentDashboardView } from './components/excelmind/StudentDashboardView';
import { AcademicPlannerView } from './components/excelmind/AcademicPlannerView';
import { LearningHubView } from './components/excelmind/LearningHubView';
import { CbtExamView } from './components/excelmind/CbtExamView';
import { PerformanceAnalyticsView } from './components/excelmind/PerformanceAnalyticsView';
import { AcademicCommunicationView } from './components/excelmind/AcademicCommunicationView';
import { AiTutorWrapper as AiTutorView } from './components/excelmind/AiTutorWrapper';
import { CurriculumAutomationView } from './components/excelmind/CurriculumAutomationView';
import { AiLearningCoachView } from './components/excelmind/AiLearningCoachView';
import { AcademicRecordsCentreView } from './components/excelmind/AcademicRecordsCentreView';
import { StudentDirectory } from './components/directory/StudentDirectory';

// Faculty, Parent & Admin Role Portals
import { TeacherPortalView } from './components/excelmind/TeacherPortalView';
import { ParentPortalView } from './components/excelmind/ParentPortalView';
import { AdminPortalView } from './components/excelmind/AdminPortalView';
import { ProfileSettingsView } from './components/excelmind/ProfileSettingsView';

// Authentication Pages
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { TeacherRegister } from './pages/auth/TeacherRegister';
import { TeacherLogin } from './pages/auth/TeacherLogin';
import { ParentRegister } from './pages/auth/ParentRegister';
import { ParentLogin } from './pages/auth/ParentLogin';
import { clearAuthToken, getAuthToken, authApi } from './services/api';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('excelmind_role');
    if (savedRole) return savedRole as UserRole;
    const savedUser = localStorage.getItem('excelmind_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role) return u.role.toLowerCase() as UserRole;
      } catch (e) {}
    }
    return 'student';
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('excelmind_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {}
    }
    return null;
  });

  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    const saved = localStorage.getItem('excelmind_active_module');
    if (saved) return saved as ActiveModule;
    return 'dashboard';
  });
  const [authScreen, setAuthScreen] = useState<'login' | 'forgot_password' | 'teacher_register' | 'parent_register' | 'teacher_login' | 'parent_login' | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('2025/2026 Term 1');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('excelmind_theme') === 'dark';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Selected course and exam IDs for cross-module jumping
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(undefined);

  const handleSelectModule = (mod: ActiveModule) => {
    setActiveModule(mod);
    localStorage.setItem('excelmind_active_module', mod);
    setIsMobileMenuOpen(false);
  };

  // Step 8: Validate user session against MySQL on startup
  useEffect(() => {
    async function restoreSession() {
      const token = getAuthToken();
      if (!token) return;

      try {
        const res = await authApi.getMe();
        if (res.success && res.data?.user) {
          const u = res.data.user;
          const role = (u.role || 'student').toLowerCase() as UserRole;
          setCurrentUser(u);
          setCurrentRole(role);
          localStorage.setItem('excelmind_role', role);
          localStorage.setItem('excelmind_user', JSON.stringify(u));
        }
      } catch (err) {
        console.warn('Session verification notice:', err);
      }
    }
    restoreSession();
  }, []);

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
    localStorage.setItem('excelmind_role', role);
    // When switching role, default back to relevant dashboard
    setActiveModule('dashboard');
    localStorage.setItem('excelmind_active_module', 'dashboard');
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Visual Educational Learning Atmosphere Background */}
      <EducationalBackground />
      
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
          localStorage.removeItem('excelmind_role');
          localStorage.removeItem('excelmind_user');
          localStorage.removeItem('excelmind_active_module');
          setCurrentUser(null);
          setAuthScreen('login');
        }}
      />

      {/* 2. Main Layout Container: Sidebar + Content Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto items-start">
        
        {/* Left Responsive Navigation Sidebar (Hidden during Auth Screens) */}
        {!authScreen && (
          <ExcelMindSidebar
            activeModule={activeModule}
            onSelectModule={handleSelectModule}
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
                const verifiedRole = (role || user.role || 'student').toLowerCase() as UserRole;
                setCurrentUser(user);
                setCurrentRole(verifiedRole);
                localStorage.setItem('excelmind_role', verifiedRole);
                localStorage.setItem('excelmind_user', JSON.stringify(user));
                setAuthScreen(null);
              }}
              onNavigateForgotPassword={() => setAuthScreen('forgot_password')}
              onNavigateTeacherRegister={() => setAuthScreen('teacher_register')}
              onNavigateParentRegister={() => setAuthScreen('parent_register')}
              onNavigateTeacherLogin={() => setAuthScreen('teacher_login')}
              onNavigateParentLogin={() => setAuthScreen('parent_login')}
            />
          )}

          {authScreen === 'teacher_register' && (
            <TeacherRegister
              onNavigateLogin={() => setAuthScreen('teacher_login')}
              onRegistrationComplete={() => setAuthScreen('teacher_login')}
            />
          )}

          {authScreen === 'teacher_login' && (
            <TeacherLogin
              onLoginSuccess={(user, role) => {
                setCurrentUser(user);
                setCurrentRole('teacher');
                localStorage.setItem('excelmind_role', 'teacher');
                localStorage.setItem('excelmind_user', JSON.stringify(user));
                setAuthScreen(null);
              }}
              onNavigateRegister={() => setAuthScreen('teacher_register')}
              onNavigateForgotPassword={() => setAuthScreen('forgot_password')}
              onNavigateUnifiedLogin={() => setAuthScreen('login')}
            />
          )}

          {authScreen === 'parent_register' && (
            <ParentRegister
              onNavigateLogin={() => setAuthScreen('parent_login')}
              onRegistrationComplete={() => setAuthScreen('parent_login')}
            />
          )}

          {authScreen === 'parent_login' && (
            <ParentLogin
              onLoginSuccess={(user, role) => {
                setCurrentUser(user);
                setCurrentRole('parent');
                localStorage.setItem('excelmind_role', 'parent');
                localStorage.setItem('excelmind_user', JSON.stringify(user));
                setAuthScreen(null);
              }}
              onNavigateRegister={() => setAuthScreen('parent_register')}
              onNavigateForgotPassword={() => setAuthScreen('forgot_password')}
              onNavigateUnifiedLogin={() => setAuthScreen('login')}
            />
          )}

          {authScreen === 'forgot_password' && (
            <ForgotPassword onBackToLogin={() => setAuthScreen('login')} />
          )}

          {/* MAIN PLATFORM WORKSPACES */}
          {!authScreen && (
            <ErrorBoundary
              fallbackTitle="ExcelMind Workspace Safe Mode"
              fallbackMessage="A temporary error occurred in the workspace. Your login session is active and data is preserved."
              onReset={() => handleSelectModule('dashboard')}
            >
              {/* ACADEMIC RECORDS MANAGEMENT ACTION CENTRE (All Roles) */}
              {activeModule === 'academic_centre' && (
                <AcademicRecordsCentreView currentRole={currentRole} />
              )}

              {/* STUDENT DIGITAL DIRECTORY & PASSPORT IDENTITIES (All Roles) */}
              {activeModule === 'student_directory' && (
                <StudentDirectory onNavigateToRegistration={() => setActiveModule('academic_centre')} />
              )}

              {/* TEACHER ROLE VIEW */}
              {activeModule !== 'academic_centre' && activeModule !== 'student_directory' && currentRole === 'teacher' && <TeacherPortalView />}

              {/* PARENT ROLE VIEW */}
              {activeModule !== 'academic_centre' && activeModule !== 'student_directory' && currentRole === 'parent' && (
                <ParentPortalView
                  student={CURRENT_STUDENT}
                  onNavigateToMessages={() => {
                    setActiveModule('messages');
                  }}
                  onNavigateToResults={() => {
                    setActiveModule('results');
                  }}
                />
              )}

              {/* ADMINISTRATOR ROLE VIEW */}
              {activeModule !== 'academic_centre' && activeModule !== 'student_directory' && currentRole === 'admin' && (
                activeModule === 'curriculum' ? (
                  <CurriculumAutomationView />
                ) : activeModule === 'results' ? (
                  <PerformanceAnalyticsView student={CURRENT_STUDENT} />
                ) : activeModule === 'messages' ? (
                  <AcademicCommunicationView />
                ) : activeModule === 'profile' || activeModule === 'settings' ? (
                  <ProfileSettingsView
                    student={CURRENT_STUDENT}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                  />
                ) : (
                  <AdminPortalView />
                )
              )}

          {/* STUDENT ROLE VIEWS (11 modules) */}
          {activeModule !== 'academic_centre' && activeModule !== 'student_directory' && currentRole === 'student' && (
            <>
              {activeModule === 'dashboard' && (
                <StudentDashboardView
                  student={CURRENT_STUDENT}
                  onNavigate={handleSelectModule}
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
            </ErrorBoundary>
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
