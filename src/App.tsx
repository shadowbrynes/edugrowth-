/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewMode, Student, CriticalAlert, SystemActivity, ChildRecord, SchoolProfile } from './types';
import { INITIAL_STUDENTS, INITIAL_CRITICAL_ALERTS, INITIAL_ACTIVITIES, PARENT_CHILDREN, TRANSCRIPTS, INITIAL_TRANSCRIPT_ACCESSES } from './data/mockData';
import { RoleNavigation } from './components/RoleNavigation';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentPortal } from './components/ParentPortal';
import { TranscriptView } from './components/TranscriptView';
import { StudentPortal } from './components/StudentPortal';
import { ShareAchievementModal } from './components/modals/ShareAchievementModal';
import { TranscriptVerificationPortal } from './components/TranscriptVerificationPortal';

// Firebase Integrations
import { doc, setDoc, onSnapshot, collection, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, signInWithGoogle, logOut, handleFirestoreError, OperationType, testConnection, getUserProfile, createUserProfileIfNotExist, syncStudentPerformance } from './firebase';
import { AuthScreen } from './components/AuthScreen';

const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  id: 'default',
  name: "EDUGROWTH ACADEMY",
  logoUrl: '',
  coverBannerUrl: '',
  motto: 'Empowering Minds, Inspiring Growth',
  vision: 'To cultivate academic excellence, character, and lifelong learning through innovative instruction.',
  mission: 'To provide a secure, tech-enabled, high-performance academic environment for the future leaders of tomorrow.',
  coreValues: ['Integrity', 'Excellence', 'Innovation', 'Discipline', 'Leadership'],
  description: 'EduGrowth Academy is a premier secondary and higher educational institution focused on preparing students for global leadership and scientific innovation.',
  address: '12 Science Park Avenue, Yaba',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  postalCode: '101212',
  email: 'admissions@edugrowth.edu.ng',
  phone: '+234 1 555 0192',
  website: 'https://edugrowth-tawny.vercel.app',
  socialLinks: {
    facebook: 'https://facebook.com/edugrowth',
    twitter: 'https://twitter.com/edugrowth',
    linkedin: 'https://linkedin.com/company/edugrowth',
    instagram: 'https://instagram.com/edugrowth'
  },
  primaryColor: '#ff3e00',
  secondaryColor: '#00d2ff',
  faviconUrl: '',
  reportCardHeader: "EDUGROWTH ACADEMY OFFICIAL PROGRESS REPORT",
  certificateHeader: "EDUGROWTH ACADEMY CERTIFICATE OF GRADUATION",
  digitalStampUrl: '',
  principalSignatureUrl: '',
  watermarkUrl: '',
  principal: 'Professor Alexander Sterling',
  vicePrincipal: 'Dr. Evelyn Carter',
  registrar: 'Chief Registrar Marcus Sterling',
  bursar: 'Bursar Robert Vance',
  schoolType: 'Secondary',
  academicSession: '2023/2024',
  academicCalendar: 'Semester System',
  timezone: 'GMT+1 (Africa/Lagos)',
  language: 'English (UK)',
  gradingSystem: 'West African WAEC Scale / US 4.0 GPA',
  attendanceMethod: 'RFID Daily Badge Scan',
  currency: 'NGN (₦)',
  smsEmailSettings: 'Instant Parent Alerts Enabled'
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('admin');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('alexander');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [institutionType, setInstitutionType] = useState<'Schools' | 'HigherEd'>(() => {
    return (localStorage.getItem('eduGrowthEdition') as 'Schools' | 'HigherEd') || 'Schools';
  });
  const [selectedSession, setSelectedSession] = useState<string>(() => {
    return localStorage.getItem('eduGrowthSession') || '2023/2024 Fall';
  });
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(DEFAULT_SCHOOL_PROFILE);

  const handleInstitutionTypeChange = (type: 'Schools' | 'HigherEd') => {
    setInstitutionType(type);
    localStorage.setItem('eduGrowthEdition', type);
  };

  const handleSessionChange = (session: string) => {
    setSelectedSession(session);
    localStorage.setItem('eduGrowthSession', session);
  };

  // Parse QR verification query parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verify = urlParams.get('verify');
    if (verify && (verify === 'alexander' || verify === 'alice' || verify === 'leo')) {
      setVerificationId(verify);
    }
  }, []);
  
  // Real-time Database state with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('eduGrowth_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading students from localStorage:", e);
    }
    return INITIAL_STUDENTS;
  });
  const [alerts, setAlerts] = useState<CriticalAlert[]>(INITIAL_CRITICAL_ALERTS);
  const [activities, setActivities] = useState<SystemActivity[]>(INITIAL_ACTIVITIES);
  const [childrenRecords, setChildrenRecords] = useState<ChildRecord[]>(PARENT_CHILDREN);
  const [transcriptAccesses, setTranscriptAccesses] = useState<any[]>(INITIAL_TRANSCRIPT_ACCESSES);

  // Automatically sync students array to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('eduGrowth_students', JSON.stringify(students));
    } catch (e) {
      console.error("Error saving students to localStorage:", e);
    }
  }, [students]);

  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | 'parent' | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [dbSeeding, setDbSeeding] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareStudentName, setShareStudentName] = useState<string>('Alexander J. Sterling');
  const [shareTranscriptId, setShareTranscriptId] = useState<string>('TX-2023-00451');
  const [shareRankText, setShareRankText] = useState<string>('Ranked #3 of 45 (Top 5% Cohort)');

  // 0. Listen and synchronize School Profile (runs unconditionally for login page)
  useEffect(() => {
    const docRef = doc(db, 'school_profile', 'default');
    const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.name === "Saint Jude's Academy of Sciences" || !data.logoUrl) {
          // If database still contains default Saint Jude's profile, override locally with new EDUGROWTH ACADEMY defaults
          setSchoolProfile({
            ...DEFAULT_SCHOOL_PROFILE,
            ...data,
            name: "EDUGROWTH ACADEMY",
            logoUrl: DEFAULT_SCHOOL_PROFILE.logoUrl,
            reportCardHeader: "EDUGROWTH ACADEMY OFFICIAL PROGRESS REPORT",
            certificateHeader: "EDUGROWTH ACADEMY CERTIFICATE OF GRADUATION",
            description: "EduGrowth Academy is a premier secondary and higher educational institution focused on preparing students for global leadership and scientific innovation."
          } as SchoolProfile);
        } else {
          setSchoolProfile({ ...DEFAULT_SCHOOL_PROFILE, ...data } as SchoolProfile);
        }
      } else {
        // If it doesn't exist, seed it to Firestore so the document is created initially
        setDoc(docRef, DEFAULT_SCHOOL_PROFILE).catch((err) => {
          console.error('Failed to auto-seed default school profile:', err);
        });
      }
    }, (error) => {
      console.error('Error loading school profile from Firestore:', error);
    });

    return () => unsubscribeProfile();
  }, []);

  // 1. Connection check and Auth subscription
  useEffect(() => {
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      const resolveStudentIdAndNavigate = (profile: any) => {
        setUserRole(profile.role);
        if (profile.role === 'student') {
          if (profile.studentId) {
            const idMap: Record<string, string> = {
              'ST-882-901': 'alexander',
              'ST-701-442': 'alice',
              'ST-905-118': 'leo'
            };
            const cleanId = profile.studentId.toUpperCase();
            const localMatch = idMap[cleanId];
            if (localMatch) {
              setSelectedStudentId(localMatch);
              setCurrentView('student');
            } else {
              const q = query(collection(db, 'transcripts'), where('studentId', '==', cleanId));
              getDocs(q).then((snap) => {
                let matchedDocId = '';
                snap.forEach((d) => {
                  matchedDocId = d.id;
                });
                setSelectedStudentId(matchedDocId || 'alexander');
                setCurrentView('student');
              }).catch(() => {
                setSelectedStudentId('alexander');
                setCurrentView('student');
              });
            }
          } else {
            setSelectedStudentId('alexander');
            setCurrentView('student');
          }
        } else {
          setCurrentView(profile.role);
        }
      };

      if (firebaseUser) {
        getUserProfile(firebaseUser.uid).then((profile) => {
          if (profile) {
            resolveStudentIdAndNavigate(profile);
          } else {
            // New user signed in via Google or first time login
            createUserProfileIfNotExist(
              firebaseUser.uid,
              firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google User',
              firebaseUser.email || '',
              'admin'
            ).then((newProfile) => {
              resolveStudentIdAndNavigate(newProfile);
            });
          }
          setUser(firebaseUser);
          setAuthChecking(false);
        }).catch((err) => {
          console.error('Error fetching profile, defaulting to student:', err);
          setUser(firebaseUser);
          setUserRole('student');
          setSelectedStudentId('alexander');
          setCurrentView('student');
          setAuthChecking(false);
        });
      } else {
        setUser(null);
        setUserRole(null);
        setAuthChecking(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore Synchronizations
  useEffect(() => {
    if (!user || isOfflineMode) return;

    // A. Listen and synchronize students
    const unsubscribeStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      if (snapshot.empty) {
        handleSeed();
      } else {
        const list: Student[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Student);
        });
        setStudents(prev => {
          const localNew = prev.filter(p => p.isNew && !list.some(l => l.id === p.id));
          const merged = [...localNew, ...list];
          return merged.sort((a, b) => {
            if (a.isNew) return -1;
            if (b.isNew) return 1;
            return a.rank - b.rank;
          });
        });
      }
    }, (err) => {
      console.warn("Firestore students listener offline/fallback:", err);
    });

    // B. Listen and synchronize alerts
    const unsubscribeAlerts = onSnapshot(collection(db, 'alerts'), (snapshot) => {
      const list: CriticalAlert[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as CriticalAlert);
      });
      setAlerts(list.sort((a, b) => b.date.localeCompare(a.date)));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'alerts');
    });

    // C. Listen and synchronize activities
    const unsubscribeActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
      const list: SystemActivity[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as SystemActivity);
      });
      setActivities(list.sort((a, b) => b.id.localeCompare(a.id)));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'activities');
    });

    // D. Listen and synchronize parent child records
    const unsubscribeChildren = onSnapshot(collection(db, 'children'), (snapshot) => {
      const list: ChildRecord[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as ChildRecord);
      });
      setChildrenRecords(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'children');
    });

    // E. Listen and synchronize transcript accesses
    const unsubscribeAccesses = onSnapshot(collection(db, 'transcript_accesses'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setTranscriptAccesses(list.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'transcript_accesses');
    });

    return () => {
      unsubscribeStudents();
      unsubscribeAlerts();
      unsubscribeActivities();
      unsubscribeChildren();
      unsubscribeAccesses();
    };
  }, [user]);

  // Seeding Default Data to Cloud Firestore (Phase 4 guidelines)
  const handleSeed = async () => {
    if (dbSeeding) return;
    setDbSeeding(true);
    try {
      console.log('Seeding initial defaults to Firestore...');
      
      // Students
      for (const item of INITIAL_STUDENTS) {
        await setDoc(doc(db, 'students', item.id), item);
      }
      // Alerts
      for (const item of INITIAL_CRITICAL_ALERTS) {
        await setDoc(doc(db, 'alerts', item.id), item);
      }
      // Activities
      for (const item of INITIAL_ACTIVITIES) {
        await setDoc(doc(db, 'activities', item.id), item);
      }
      // Children (Parent portal)
      for (const item of PARENT_CHILDREN) {
        await setDoc(doc(db, 'children', item.id), item);
      }
      // Transcripts
      for (const item of Object.values(TRANSCRIPTS)) {
        await setDoc(doc(db, 'transcripts', item.id), item);
      }
      // Transcript Access Logs
      for (const item of INITIAL_TRANSCRIPT_ACCESSES) {
        await setDoc(doc(db, 'transcript_accesses', item.id), item);
      }

      console.log('Database successfully seeded with academic defaults.');
    } catch (err) {
      console.error('Seeding defaulted:', err);
    } finally {
      setDbSeeding(false);
    }
  };

  const handleNavigate = (view: ViewMode, studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddActivity = async (act: SystemActivity) => {
    try {
      const actWithSession = { ...act, session: selectedSession };
      await setDoc(doc(db, 'activities', act.id), actWithSession);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `activities/${act.id}`);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'alerts', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `alerts/${id}`);
    }

    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      type: 'alert',
      user: user?.displayName || user?.email || 'Admin Workspace',
      action: 'Resolved Critical Alert:',
      target: `Alert #${id}`,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: 'check_circle',
      colorClass: 'bg-green-600 text-white'
    };
    await handleAddActivity(newAct);
  };

  const handleAddRecord = async (type: string, name: string, detail: string) => {
    if (type === 'student') {
      const match = detail.match(/Avg:\s*([\d.]+)/i);
      let parsedGpa = 3.80;
      if (match && match[1]) {
        const val = parseFloat(match[1]);
        parsedGpa = val > 5 ? Number((val / 20).toFixed(2)) : val;
      }

      const newStudent: Student = {
        id: `st-${Date.now()}`,
        name: name,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        gpa: parsedGpa,
        status: parsedGpa >= 3.8 ? 'High Honor' : 'Good Standing',
        rank: 1,
        totalStudents: students.length + 1,
        attendance: 98,
        gradeLevel: 'Grade 10 - Alpha',
        isNew: true
      };

      // Immediately update local state placing new student at index 0 so UI displays it at the top
      setStudents(prev => [newStudent, ...prev.filter(s => s.id !== newStudent.id)]);

      try {
        const { isNew, ...studentPayload } = newStudent;
        await setDoc(doc(db, 'students', newStudent.id), studentPayload);

        // Also generate transcript document so student has an immediate digital report card
        const transcriptDocId = name.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
        const newTranscript = {
          id: transcriptDocId,
          transcriptId: `TX-2023-${Math.floor(10000 + Math.random() * 90000)}`,
          issueDate: new Date().toISOString().split('T')[0],
          fullName: name,
          studentId: `ST-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
          academicClass: 'Grade 10 - Alpha',
          currentTerm: 'Second Term (Fall 2023)',
          dob: '2008-04-12',
          gender: 'Unspecified',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          subjects: [
            { subject: 'Mathematics', caScore: 28, examScore: 65, totalScore: 93, grade: 'A+', remarks: 'Excellent performance', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
            { subject: 'Physics', caScore: 25, examScore: 60, totalScore: 85, grade: 'A', remarks: 'Strong analytical skills', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
            { subject: 'English Language', caScore: 26, examScore: 62, totalScore: 88, grade: 'A', remarks: 'Good written expression', badgeClass: 'bg-secondary text-white' }
          ],
          finalGpa: parsedGpa,
          gpaScale: 4.0,
          ranking: `Ranked #1 of ${students.length + 1}`,
          totalClassSize: students.length + 1,
          attendancePercent: 98,
          status: 'GOOD STANDING',
          statusSub: 'Maintained required GPA thresholds.',
          classTeacherRemarks: `${name} has shown commendable dedication to studies.`,
          classTeacherName: 'Mrs. Sarah Jenkins',
          classTeacherSignUrl: '',
          principalRemarks: 'Promoted with academic honors.',
          principalName: 'Professor Alexander Sterling',
          principalSignUrl: '',
          qrCodeUrl: '',
          promotionBannerText: 'PROMOTED TO NEXT ACADEMIC TIER'
        };
        await setDoc(doc(db, 'transcripts', transcriptDocId), newTranscript);
        await syncStudentPerformance(transcriptDocId);
      } catch (err) {
        console.error("Firestore write failed, using local state:", err);
      }
    }
    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      type: 'user_add',
      user: user?.displayName || user?.email || 'Admin Workspace',
      action: `Created new ${type}:`,
      target: name,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: 'add_circle',
      colorClass: 'bg-secondary text-white'
    };
    await handleAddActivity(newAct);
  };

  const handleAddRemarkLog = async (studentName: string, subject: string, comment: string) => {
    // Find child record for that student name
    const child = childrenRecords.find(c => c.name.toLowerCase() === studentName.toLowerCase()) || childrenRecords[0];
    if (child) {
      const newRemark = {
        id: `rem-${Date.now()}`,
        teacher: user?.displayName || 'Faculty Professor',
        subject: subject.toUpperCase(),
        timeAgo: 'Just now',
        comment: comment
      };
      const updatedChild = {
        ...child,
        remarks: [newRemark, ...child.remarks]
      };
      try {
        await setDoc(doc(db, 'children', child.id), updatedChild);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `children/${child.id}`);
      }
    }

    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      type: 'upload',
      user: user?.displayName || 'Faculty Professor',
      action: `Logged academic remark for ${studentName} (${subject}):`,
      target: `${comment.slice(0, 30)}...`,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: 'rate_review',
      colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed'
    };
    await handleAddActivity(newAct);
  };

  const handleAddActivityLog = async (type: string, actor: string, action: string, target: string) => {
    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      type: (type as SystemActivity['type']) || 'upload',
      user: actor,
      action: action,
      target: target,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: 'history',
      colorClass: 'bg-secondary text-white'
    };
    await handleAddActivity(newAct);
  };

  const handleSendMessage = async (teacherName: string, message: string) => {
    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      type: 'meeting',
      user: 'Guardian Portal',
      action: `Sent direct message to ${teacherName}:`,
      target: `${message.slice(0, 35)}...`,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: 'mail',
      colorClass: 'bg-secondary text-white'
    };
    await handleAddActivity(newAct);
  };

  const handleOpenShareModal = (studentName: string) => {
    const transcript = Object.values(TRANSCRIPTS).find(t => t.fullName === studentName) || TRANSCRIPTS['alexander'];
    setShareStudentName(transcript.fullName);
    setShareTranscriptId(transcript.transcriptId);
    setShareRankText(`Ranked ${transcript.ranking} of ${transcript.totalClassSize} (${transcript.status})`);
    setIsShareModalOpen(true);
  };

  // Checking Authentication States Loader
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff3e00] border-t-transparent animate-spin rounded-full" />
          <div className="text-xs uppercase font-bold tracking-[0.3em] text-[#ff3e00]">
            EduGrowth Workspace
          </div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-white/40">
            Initializing Encrypted Ledger...
          </div>
        </div>
      </div>
    );
  }

  // If the user scanned a QR code or loaded a verification link
  if (verificationId) {
    return (
      <TranscriptVerificationPortal
        studentId={verificationId}
        onEnterPortal={() => {
          // Clear query parameter in browser URL gracefully without reloading the page
          const url = new URL(window.location.href);
          url.searchParams.delete('verify');
          window.history.replaceState({}, '', url.toString());
          setVerificationId(null);
        }}
      />
    );
  }

  // Authentication Gate Screen
  if (!user) {
    return (
      <AuthScreen
        schoolProfile={schoolProfile}
        onAuthSuccess={async (firebaseUser, selectedRole, isOffline) => {
          if (isOffline) {
            setIsOfflineMode(true);
            setUser(firebaseUser);
            setUserRole(selectedRole || 'admin');
            setCurrentView(selectedRole === 'student' ? 'transcript' : (selectedRole || 'admin'));
            return;
          }
          if (selectedRole) {
            setUserRole(selectedRole);
            setCurrentView(selectedRole === 'student' ? 'transcript' : selectedRole);
          } else {
            try {
              const profile = await getUserProfile(firebaseUser.uid);
              if (profile) {
                setUserRole(profile.role);
                setCurrentView(profile.role === 'student' ? 'transcript' : profile.role);
              } else {
                const newProfile = await createUserProfileIfNotExist(
                  firebaseUser.uid,
                  firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google User',
                  firebaseUser.email || '',
                  'admin'
                );
                setUserRole(newProfile.role);
                setCurrentView(newProfile.role === 'student' ? 'transcript' : newProfile.role);
              }
            } catch (err) {
              console.error('Error fetching user profile:', err);
              setUserRole('student');
              setCurrentView('transcript');
            }
          }
          setUser(firebaseUser);
        }}
      />
    );
  }

  // Filter students based on selectedSession
  const filteredStudents = students.filter(student => {
    if (student.sessions && student.sessions.length > 0) {
      return student.sessions.includes(selectedSession);
    }
    // Fallback deterministic assignment if sessions is not present on document yet
    if (student.id === '1' || student.id === '6') {
      return true; // Alice Cooper & Alexander Sterling are in all sessions
    }
    if (student.id === '2' || student.id === '7') {
      return selectedSession.includes('Fall'); // Brian Tams & Leo Vance only in Fall semesters
    }
    if (student.id === '3' || student.id === '4') {
      return selectedSession.includes('Spring'); // Chloe Huang & David Rossi only in Spring semesters
    }
    if (student.id === '5' || student.id === '8') {
      return selectedSession.includes('2023/2024') || selectedSession === '2024/2025 Spring'; // Emma Knight & Maya Vance
    }
    return true;
  });

  // Filter alerts based on selectedSession
  const filteredAlerts = alerts.filter(alert => {
    if ((alert as any).session) {
      return (alert as any).session === selectedSession;
    }
    // Fallback deterministic assignment for defaults
    if (alert.id === 'alt-1') return selectedSession === '2023/2024 Fall';
    if (alert.id === 'alt-2') return selectedSession === '2023/2024 Fall';
    if (alert.id === 'alt-3') return selectedSession === '2023/2024 Spring';
    if (alert.id === 'alt-4') return selectedSession === '2024/2025 Fall';
    return true;
  });

  // Filter activities based on selectedSession
  const filteredActivities = activities.filter(act => {
    if ((act as any).session) {
      return (act as any).session === selectedSession;
    }
    // Fallback deterministic assignment for defaults
    if (act.id === 'act-1' || act.id === 'act-2') return selectedSession === '2023/2024 Fall';
    if (act.id === 'act-3') return selectedSession === '2023/2024 Spring';
    if (act.id === 'act-4') return selectedSession === '2024/2025 Fall';
    if (act.id === 'act-5') return selectedSession === '2024/2025 Spring';
    return true;
  });

  // Filter transcriptAccesses based on selectedSession
  const filteredTranscriptAccesses = transcriptAccesses.filter(log => {
    if (log.session) {
      return log.session === selectedSession;
    }
    // Fallback deterministic assignment for defaults
    if (log.id === 'audit-1' || log.id === 'audit-2') return selectedSession === '2023/2024 Fall';
    if (log.id === 'audit-3') return selectedSession === '2023/2024 Spring';
    if (log.id === 'audit-4') return selectedSession === '2024/2025 Fall';
    if (log.id === 'audit-5') return selectedSession === '2024/2025 Spring';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-sans selection:bg-[#ff3e00] selection:text-black">
      {/* Top Workspace Role Navigation Bar */}
      <RoleNavigation
        currentView={currentView}
        onViewChange={(view) => handleNavigate(view)}
        activeAlertsCount={filteredAlerts.length}
        user={user}
        userRole={userRole || 'admin'}
        onSignOut={async () => {
          try {
            await logOut();
          } catch (e) {
            console.error('Logout error:', e);
          }
          setUser(null);
          setUserRole(null);
          setIsOfflineMode(false);
        }}
        institutionType={institutionType}
        onInstitutionTypeChange={handleInstitutionTypeChange}
        selectedSession={selectedSession}
        onSessionChange={handleSessionChange}
        schoolProfile={schoolProfile}
      />

      {/* Main Content View Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'admin' && (
          <AdminDashboard
            students={filteredStudents}
            alerts={filteredAlerts}
            activities={filteredActivities}
            transcriptAccesses={filteredTranscriptAccesses}
            onAddActivity={handleAddActivity}
            onResolveAlert={handleResolveAlert}
            onAddRecord={handleAddRecord}
            onNavigate={handleNavigate}
            institutionType={institutionType}
            onInstitutionTypeChange={handleInstitutionTypeChange}
            schoolProfile={schoolProfile}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            onNavigate={handleNavigate}
            onAddRemarkLog={handleAddRemarkLog}
            onAddActivityLog={handleAddActivityLog}
          />
        )}

        {currentView === 'parent' && (
          <ParentPortal
            childrenRecords={childrenRecords}
            onNavigate={handleNavigate}
            onSendMessage={handleSendMessage}
            schoolProfile={schoolProfile}
          />
        )}

        {currentView === 'student' && (
          <StudentPortal
            studentId={selectedStudentId}
            selectedSession={selectedSession}
            schoolProfile={schoolProfile}
            onNavigate={handleNavigate}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {currentView === 'transcript' && (
          <TranscriptView
            initialStudentId={selectedStudentId}
            onBackToDashboard={() => handleNavigate('admin')}
            onOpenShareModal={handleOpenShareModal}
            selectedSession={selectedSession}
            schoolProfile={schoolProfile}
          />
        )}
      </main>

      {/* Share Achievement Modal */}
      <ShareAchievementModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        studentName={shareStudentName}
        transcriptId={shareTranscriptId}
        rankText={shareRankText}
      />
    </div>
  );
}
