/**
 * ExcelMind Academic Companion - Core Type Definitions & Curriculum System
 */

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type ActiveModule =
  | 'dashboard'
  | 'academic_centre'
  | 'courses'
  | 'learning_hub'
  | 'timetable'
  | 'assignments'
  | 'cbt'
  | 'results'
  | 'messages'
  | 'ai_tutor'
  | 'curriculum'
  | 'coach'
  | 'profile'
  | 'settings';

export type AcademicLevel = 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
export type DepartmentCategory = 'Science' | 'Commercial' | 'Arts' | 'Basic Education';
export type ExamBoard = 'NERDC' | 'WAEC' | 'NECO' | 'JAMB' | 'BECE';

export interface StudentProfile {
  student_id: string;
  name: string;
  email: string;
  class: string;
  academicLevel: AcademicLevel;
  department: DepartmentCategory;
  parent_id: string;
  parentName: string;
  avatar: string;
  academicSession: string;
  overallScore: number;
  scoreImprovement: number;
  attendanceRate: number;
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  cbtAverageScore: number;
  rank: number;
  totalInClass: number;
  conduct: string;
  studyStreakDays: number;
  rewardPoints: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio' | 'quiz';
  durationOrPages: string;
  completed: boolean;
  contentUrl?: string;
  description: string;
  offlineAvailable?: boolean;
}

export interface Course {
  course_id: string;
  title: string;
  code: string;
  category: string;
  teacher: string;
  teacherAvatar: string;
  progress: number;
  materialsCount: {
    videos: number;
    pdfs: number;
    audios: number;
    quizzes: number;
  };
  nextLesson: string;
  bannerColor: string;
  description: string;
  lessons: Lesson[];
  curriculumStandard?: ExamBoard;
}

export interface Assignment {
  assignment_id: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  submission_status: 'pending' | 'submitted' | 'graded';
  submittedDate?: string;
  grade?: string;
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
  attachedFile?: string;
  studentSubmissionNote?: string;
}

export interface CbtQuestion {
  id: number;
  question: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  subject: string;
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface CbtExam {
  exam_id: string;
  subject: string;
  examBody: 'WAEC' | 'NECO' | 'JAMB' | 'BECE' | 'School';
  title: string;
  year: string;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: 'Standard' | 'Advanced' | 'Mock' | 'Adaptive';
  questions: CbtQuestion[];
}

export interface SubjectResult {
  subject: string;
  caScore: number;
  examScore: number;
  totalScore: number;
  previousScore: number;
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  rank: string;
  teacher_comment: string;
  teacher: string;
  category: 'Science' | 'Core' | 'Vocational' | 'Commercial' | 'Arts';
}

export interface PerformanceTrend {
  term: string;
  score: number;
  classAverage: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  channel: 'teacher' | 'announcement' | 'discussion';
  subject?: string;
  attachedUrl?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

export interface ForumTopic {
  id: string;
  subject: string;
  title: string;
  author: string;
  authorRole: string;
  repliesCount: number;
  upvotes: number;
  timeAgo: string;
  content: string;
}

// ---------------------------------------------------------------------------
// Advanced Curriculum Automation Engine Types
// ---------------------------------------------------------------------------

export interface StudentSubjectItem {
  id: string;
  subjectName: string;
  subjectCode: string;
  department: DepartmentCategory;
  isCompulsory: boolean;
  teacher: string;
  status: 'active' | 'elective' | 'pending';
  examBoard: ExamBoard;
}

export interface CurriculumTopic {
  id: string;
  subject: string;
  academicLevel: AcademicLevel;
  department: DepartmentCategory;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  week: number;
  title: string;
  nerdcCode: string;
  examWeight: 'High' | 'Medium' | 'Low';
  targetExam: ExamBoard;
  subtopics: string[];
}

export interface GeneratedLesson {
  id: string;
  classLevel: AcademicLevel;
  subject: string;
  topic: string;
  duration: string;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Archived';
  author: string;
  reviewedBy?: string;
  aiConfidenceScore: number;
  learningObjectives: string[];
  lessonPlan: string;
  teacherNotes: string;
  studentNotes: string;
  examples: { problem: string; solution: string }[];
  classActivities: string[];
  homework: string;
  quizQuestions: { question: string; options: string[]; answer: string }[];
  cbtQuestions: { question: string; options: string[]; answer: string; rationale: string }[];
  revisionSummary: string;
  createdAt: string;
}

export interface LearningCoachRecommendation {
  id: string;
  subject: string;
  topic: string;
  studentCompletion: number;
  diagnosis: string;
  actionPlan: string;
  priority: 'high' | 'medium' | 'normal';
  suggestedAction: string;
}

export interface RevisionPlan {
  examName: string;
  examDate: string;
  daysLeft: number;
  targetAggregate: string;
  weeks: {
    weekNumber: number;
    weekRange: string;
    focus: string;
    subjects: {
      name: string;
      topic: string;
      hours: number;
      completed: boolean;
    }[];
  }[];
}

export interface StudentReward {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'mastery' | 'streak' | 'cbt' | 'evaluation';
  points: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  currentProgress: number;
  targetProgress: number;
}

export interface ParentAiReport {
  studentName: string;
  month: string;
  academicScore: number;
  attendanceRate: number;
  strengths: string[];
  improvementAreas: string[];
  aiActionAdvice: string;
  pacingSummary: string;
}
