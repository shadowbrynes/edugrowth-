/**
 * ExcelMind Academic Companion - Core Type Definitions
 */

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type ActiveModule =
  | 'dashboard'
  | 'courses'
  | 'learning_hub'
  | 'timetable'
  | 'assignments'
  | 'cbt'
  | 'results'
  | 'messages'
  | 'ai_tutor'
  | 'profile'
  | 'settings';

export interface StudentProfile {
  student_id: string;
  name: string;
  email: string;
  class: string;
  department: string;
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
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio' | 'quiz';
  durationOrPages: string;
  completed: boolean;
  contentUrl?: string;
  description: string;
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
}

export interface CbtExam {
  exam_id: string;
  subject: string;
  examBody: 'WAEC' | 'NECO' | 'JAMB' | 'School';
  title: string;
  year: string;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: 'Standard' | 'Advanced' | 'Mock';
  questions: CbtQuestion[];
}

export interface SubjectResult {
  subject: string;
  caScore: number; // Continuous Assessment out of 30
  examScore: number; // Examination out of 70
  totalScore: number; // Total out of 100
  previousScore: number;
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  rank: string;
  teacher_comment: string;
  teacher: string;
  category: 'Science' | 'Core' | 'Vocational';
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
