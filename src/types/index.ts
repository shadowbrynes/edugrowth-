export type ViewMode = 'admin' | 'teacher' | 'parent' | 'student' | 'transcript';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  createdAt?: string;
}

export interface Student {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  gpa: number;
  status: 'High Honor' | 'Honor Roll' | 'Good Standing' | 'Academic Probation';
  rank: number;
  totalStudents: number;
  attendance: number;
  gradeLevel: string;
  sessions?: string[];
}

export interface CriticalAlert {
  id: string;
  studentId: string;
  studentName: string;
  initials: string;
  type: 'attendance' | 'grade_drop' | 'behavioral';
  value: string;
  details: string;
  date: string;
  assignedAdvisor: string;
}

export interface SystemActivity {
  id: string;
  type: 'upload' | 'user_add' | 'payroll' | 'alert' | 'meeting';
  user: string;
  action: string;
  target: string;
  timeAgo: string;
  timestamp: string;
  icon: string;
  colorClass: string;
}

export interface ClassSession {
  id: string;
  name: string;
  code: string;
  room: string;
  studentsCount: number;
  avgScore: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  location: string;
  isActive?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  submitted: number;
  total: number;
  percentage: number;
  colorClass: string;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  initials: string;
  assignment: string;
  date: string;
  grade: string | null;
  status: 'graded' | 'pending';
  scoreValue?: number;
}

export interface ChildRecord {
  id: string;
  name: string;
  grade: string;
  currentGpa: number;
  rank: string;
  targetGpa: number;
  gpaTrend: number[];
  months: string[];
  attendanceDays: { [day: number]: 'present' | 'absent' | 'late' };
  remarks: {
    id: string;
    teacher: string;
    subject: string;
    timeAgo: string;
    comment: string;
  }[];
}

export interface SubjectGrade {
  subject: string;
  caScore: number; // out of 30
  examScore: number; // out of 70
  totalScore: number;
  grade: string;
  remarks: string;
  badgeClass: string;
}

export interface TranscriptData {
  id: string;
  transcriptId: string;
  issueDate: string;
  fullName: string;
  studentId: string;
  academicClass: string;
  currentTerm: string;
  dob: string;
  gender: string;
  photoUrl: string;
  subjects: SubjectGrade[];
  finalGpa: number;
  gpaScale: number;
  ranking: string;
  totalClassSize: number;
  attendancePercent: number;
  status: string;
  statusSub: string;
  classTeacherRemarks: string;
  classTeacherName: string;
  classTeacherSignUrl: string;
  principalRemarks: string;
  principalName: string;
  principalSignUrl: string;
  qrCodeUrl: string;
  promotionBannerText: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  logoUrl: string;
  coverBannerUrl: string;
  motto: string;
  vision: string;
  mission: string;
  coreValues: string[];
  description: string;
  
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  website: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  primaryColor: string;
  secondaryColor: string;
  faviconUrl: string;
  reportCardHeader: string;
  certificateHeader: string;
  digitalStampUrl: string;
  principalSignatureUrl: string;
  watermarkUrl: string;

  principal: string;
  vicePrincipal: string;
  registrar: string;
  bursar: string;
  schoolType: string;
  academicSession: string;
  academicCalendar: string;

  timezone: string;
  language: string;
  gradingSystem: string;
  attendanceMethod: string;
  currency: string;
  smsEmailSettings: string;
}
