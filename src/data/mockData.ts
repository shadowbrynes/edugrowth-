import { Student, CriticalAlert, SystemActivity, ClassSession, ScheduleItem, Assignment, StudentSubmission, ChildRecord, TranscriptData } from '../types';

export const ASSETS = {
  adminHeaderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMqsg-b54b9wm0X1SxFzhc0tnmozeAMMXWGOaLNYlsX5K1p3nLAXLdrBhEjYo2xmGV_cW7vkHb0xUJ5aeUhdJCEM4R46VpTyh4kAtdIrxqvfNilpEdO_Wzui2fmSXHWSRyEhnzaPgzbkWH2POcddBdMXQm7Cp3z5D4d6PAQfkvm8RhGnpJzQY8RvD1t-hsd4n515TNDSCxiQWkOtyq5XNbay_Tgj39pHj-AktQDB0k2bDyZq-6DZNj0A",
  adminSidebarAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASntvJYSohR-r9QV39trl_CXOHFBd7SaxOEkL6iPfu5NJv0IWNHuUT5KjGiw85fxXTZYPB_1nHwBVm8irImoL_RVTogIl3D1Mc4EdHcdDScChkz_m18zc8m514UP35gzmjxLmwCTIqnZUiBI0n8GxLUkZuwgtxyip0UOB1YDiFV9XhawTve3ANO5JALt7Qtfl_Z21zrCX-iId13uhmurRlzpE5z2FJnJd2gmCuRXXiOXBtjmFshvITRA",
  parentHeaderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJdwEUEOmGmHu4-B32qa9IM0yVp-RYR3AjXkh9lt6agSXfTjrI1IRyulweT88KQIcmIEXrw5ox_YHdRmBG7Zp2sAlDHAxonG8gPf55kVjwXxYENMe0eRD2_rFA5Mzo7rYGkVWICOP2KJDLhj3IALigaoCqEEbrK116_bGKveCzfjFNgULaPFFwXIU8fHa9ui6j2QQnukGJDAiN7Pc0cZuMmfYd8fCtpIea_vtQoi4ZUfAPl_HRh_CCNg",
  parentSidebarAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9hETpSKb8zgxpcJzsnazMqtA4-Ar-LOgdDhc_x0LrC4-fou8h5e1vUD5AwUMpn8IP1olTfRr82XVQBU0TJk6V__QxHYgdavIPQ3kHQvZHTnreYulrzD5Z2lOjn8HqQrMvXWnstEEERO-C_EVrAmqTD0rhGTgz1Vy0LhL7pq9xuxfofop5seq4KpOCUnmoO41w9L1qHekHjaeGHpAbwqTcIYiCkMIvoJPDF6OfO54MS_KYcuzG7IBjjQ",
  transcriptSidebarAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzCZPGkaVWA5vcfWz4OXQ8SCgBTd_qmHS7_6PYUDyhlpWnJra3gUhVcrLC1xkAy4EVUL7OVFMRlDG2_7p2PBWZoq1ZEDsgFiCz1pS4Hve_gOCu8DvXEP1lpJKcYzXlj5702tzxgWFG-dYi_SgrYYyHXfLC4jiGLlgeZQb4QaknfkxClB-OAZ__J2g1QfPGxqCKv2x6-aWLbc9NvgmZiOMFTz0cRpBLZ6J3riPsiF5408601j0zaemqFw",
  studentAlexanderPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs5usQKYMY1_ZYxh6_HR2woLUabA5ZN-SMtnodie7GFY7tBJg1dioKibEtpS9dxZqXCIbv_vFhqiB9QLrlT6qG6MNdGGK23lujZrmqdx7MRGEyLENKnVBQe69XokP4R00eAWQaTVegi3Hn36eu8J27GOUmG5J9LNBRtJR2OFXLYRm0dqkLh_ZvObJOLCcPWh7--S3_yKSy5aiAl9a_Wni-j32Oe0wG4lopSTAQFGcugj2ZJBePJzEc2g",
  teacherSignature: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNvBYyLwUjvPKPVDsPY0SoXxCdjYdbYnJBTrs9Q3E8s97bCK8H0eCCROdQwizCZkvcg5nm48GsDxicYRzvgzdPpQixdRTlkZ0dD4lT-cN5RB6MiEFMsOia_v9sYDBFgMGCcK45RVX7Tt2v71CcIbe4askZoM6ODNxDRXfxTAawUApgEs8LJncWCCTsZbPiONMKCwyij2m-VY0u3vYm_uneomhHGh7Ti-thyNyA1sDvWgZr8T2qESCJyA",
  principalSignature: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8_Z7Z5YiDjH19EzkFttH3xYtMhcdMTkG9xsPD14svp1t31eLwICY1NkVeZDZ0TBlvWJrRfEze9nDO9AfqNq7R7-Y96n8TSEBSHbjO0YDrwk9PHOiAIo0sCuJnzG9bX4sr3RNpBx5o7EFr5dwBBmH4XwaQHilFS7O-TnbHDGg-l33cJ68RbbNG9BP7Bq41nAVQ3l2PiU2kDqu5UxbGN1ezkEuqWz3xXoRdWZJBVEmNfuFV5ApbjND3yQ",
  qrCode: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUueNAfA6EoLsEQfDfiIIS2yHvvV_tLFmTyfA_9ShAOeDzyBFzkkktxrsSIinNuGigkL1e-O-cFr3RvEcQzUlfSD2fB7OZKrrD6RP3R6Op_V5HHRZP0D0P2WW8h0cy6suvraZ0gBq4-f_JbDjYTRp52Wwn8GBI3ZjY4xwS5i11HLSUvB3_WF-yoWbSbG-FJNoDAW8ihjgtlu20LwTWxOiMZtyuugNWaHzCfVnvddGYZJGUUqZg2sAU0A"
};

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Cooper', initials: 'AC', gpa: 4.00, status: 'High Honor', rank: 1, totalStudents: 1240, attendance: 99, gradeLevel: 'Grade 11 - Alpha' },
  { id: '2', name: 'Brian Tams', initials: 'BT', gpa: 3.98, status: 'High Honor', rank: 2, totalStudents: 1240, attendance: 98, gradeLevel: 'Grade 11 - Alpha' },
  { id: '3', name: 'Chloe Huang', initials: 'CH', gpa: 3.95, status: 'Honor Roll', rank: 3, totalStudents: 1240, attendance: 96, gradeLevel: 'Grade 10 - Alpha' },
  { id: '4', name: 'David Rossi', initials: 'DR', gpa: 3.92, status: 'Honor Roll', rank: 4, totalStudents: 1240, attendance: 97, gradeLevel: 'Grade 11 - Beta' },
  { id: '5', name: 'Emma Knight', initials: 'EK', gpa: 3.88, status: 'Honor Roll', rank: 5, totalStudents: 1240, attendance: 95, gradeLevel: 'Grade 10 - Beta' },
  { id: '6', name: 'Alexander J. Sterling', initials: 'AS', gpa: 3.86, status: 'High Honor', rank: 6, totalStudents: 1240, attendance: 98, gradeLevel: 'Grade 11 - Science A' },
  { id: '7', name: 'Leo Vance', initials: 'LV', gpa: 3.85, status: 'Honor Roll', rank: 12, totalStudents: 140, attendance: 97, gradeLevel: 'Grade 10 - Alpha' },
  { id: '8', name: 'Maya Vance', initials: 'MV', gpa: 3.98, status: 'High Honor', rank: 3, totalStudents: 140, attendance: 99, gradeLevel: 'Grade 8 - STEM' },
];

export const INITIAL_CRITICAL_ALERTS: CriticalAlert[] = [
  {
    id: 'alt-1',
    studentId: 'st-101',
    studentName: 'Elena Martinez',
    initials: 'EM',
    type: 'attendance',
    value: '64% ATTND',
    details: 'Consecutive unexcused absences during morning math and lab sessions over the past 14 days.',
    date: 'Oct 23, 2023',
    assignedAdvisor: 'Prof. Marcus Brody'
  },
  {
    id: 'alt-2',
    studentId: 'st-102',
    studentName: 'James Wilson',
    initials: 'JW',
    type: 'grade_drop',
    value: 'Grade Drop',
    details: 'Sharp 22% drop in physics test scores following mid-term evaluation. Requires intervention tutoring.',
    date: 'Oct 24, 2023',
    assignedAdvisor: 'Dr. Sarah Jenkins'
  },
  {
    id: 'alt-3',
    studentId: 'st-103',
    studentName: 'Sofia Thorne',
    initials: 'ST',
    type: 'attendance',
    value: '68% ATTND',
    details: 'Frequent late arrivals and missed afternoon English seminars.',
    date: 'Oct 22, 2023',
    assignedAdvisor: 'Mr. David Roth'
  },
  {
    id: 'alt-4',
    studentId: 'st-104',
    studentName: 'Liam O\'Connor',
    initials: 'LO',
    type: 'grade_drop',
    value: 'Grade Drop',
    details: 'Failed submission of 3 major calculus homework assignments in Grade 11 Beta.',
    date: 'Oct 21, 2023',
    assignedAdvisor: 'Prof. Marcus Brody'
  }
];

export const INITIAL_ACTIVITIES: SystemActivity[] = [
  {
    id: 'act-1',
    type: 'upload',
    user: 'Teacher Sarah',
    action: 'uploaded',
    target: 'Math scores for Grade 10-B',
    timeAgo: '12 minutes ago',
    timestamp: 'Oct 24, 2023 - 10:48 AM',
    icon: 'upload_file',
    colorClass: 'bg-secondary text-white'
  },
  {
    id: 'act-2',
    type: 'user_add',
    user: 'System Admin',
    action: 'New student registration:',
    target: 'John Doe (ID: #ST-9022)',
    timeAgo: '45 minutes ago',
    timestamp: 'Oct 24, 2023 - 10:15 AM',
    icon: 'person_add',
    colorClass: 'bg-primary-container text-white'
  },
  {
    id: 'act-3',
    type: 'payroll',
    user: 'Finance Controller',
    action: 'Payroll processing',
    target: 'completed for August staff cycles',
    timeAgo: '2 hours ago',
    timestamp: 'Oct 24, 2023 - 09:00 AM',
    icon: 'task_alt',
    colorClass: 'bg-tertiary-container text-tertiary-fixed'
  },
  {
    id: 'act-4',
    type: 'alert',
    user: 'System Monitor',
    action: 'System Alert:',
    target: 'High server load detected during batch grading',
    timeAgo: '4 hours ago',
    timestamp: 'Oct 24, 2023 - 07:00 AM',
    icon: 'notification_important',
    colorClass: 'bg-error text-white'
  },
  {
    id: 'act-5',
    type: 'meeting',
    user: 'Executive Admin',
    action: 'Meeting scheduled:',
    target: 'Board of Directors room 402',
    timeAgo: 'Yesterday',
    timestamp: 'Oct 23, 2023 - 03:30 PM',
    icon: 'schedule',
    colorClass: 'bg-outline text-white'
  }
];

export const TEACHER_CLASSES: ClassSession[] = [
  { id: 'c1', name: 'Grade 10 - Alpha', code: 'GR10-A', room: 'Room 402', studentsCount: 40, avgScore: '86.4%' },
  { id: 'c2', name: 'Grade 11 - Beta', code: 'GR11-B', room: 'Lab B', studentsCount: 38, avgScore: '82.1%' },
  { id: 'c3', name: 'Grade 12 - Advanced', code: 'GR12-ADV', room: 'Room 501', studentsCount: 35, avgScore: '91.0%' }
];

export const TEACHER_SCHEDULE: ScheduleItem[] = [
  { id: 's1', time: '08:00', subject: 'Mathematics', location: 'Room 402 • Gr 10 Alpha', isActive: true },
  { id: 's2', time: '10:30', subject: 'Physics Lab', location: 'Lab B • Gr 11 Beta', isActive: false },
  { id: 's3', time: '13:00', subject: 'Faculty Meeting', location: 'Conference Hall', isActive: false }
];

export const TEACHER_ASSIGNMENTS: { [classId: string]: Assignment[] } = {
  'c1': [
    { id: 'as-1', title: 'Calculus Quiz 4', submitted: 32, total: 40, percentage: 80, colorClass: 'bg-secondary' },
    { id: 'as-2', title: 'Newtonian Mechanics Essay', submitted: 15, total: 40, percentage: 37, colorClass: 'bg-secondary-container' },
    { id: 'as-3', title: 'Geometry Midterm Prep', submitted: 39, total: 40, percentage: 98, colorClass: 'bg-tertiary-fixed-dim' }
  ],
  'c2': [
    { id: 'as-4', title: 'Thermodynamics Lab Report', submitted: 34, total: 38, percentage: 89, colorClass: 'bg-secondary' },
    { id: 'as-5', title: 'Wave Equation Homework', submitted: 28, total: 38, percentage: 74, colorClass: 'bg-secondary-container' }
  ],
  'c3': [
    { id: 'as-6', title: 'Quantum Mechanics Problem Set 2', submitted: 35, total: 35, percentage: 100, colorClass: 'bg-tertiary-fixed-dim' },
    { id: 'as-7', title: 'Final Research Paper Outline', submitted: 31, total: 35, percentage: 88, colorClass: 'bg-secondary' }
  ]
};

export const TEACHER_SUBMISSIONS: { [classId: string]: StudentSubmission[] } = {
  'c1': [
    { id: 'sub-1', studentName: 'Alice Lundberg', initials: 'AL', assignment: 'Calculus Quiz 4', date: 'Oct 23, 14:20', grade: '94/100', status: 'graded', scoreValue: 94 },
    { id: 'sub-2', studentName: 'Marcus Brown', initials: 'MB', assignment: 'Calculus Quiz 4', date: 'Oct 23, 15:05', grade: '78/100', status: 'graded', scoreValue: 78 },
    { id: 'sub-3', studentName: 'Kevin Chen', initials: 'KC', assignment: 'Physics Lab Report', date: 'Oct 22, 09:12', grade: null, status: 'pending' },
    { id: 'sub-4', studentName: 'Sophia Patel', initials: 'SP', assignment: 'Geometry Midterm Prep', date: 'Oct 22, 11:30', grade: '91/100', status: 'graded', scoreValue: 91 }
  ],
  'c2': [
    { id: 'sub-5', studentName: 'David Rossi', initials: 'DR', assignment: 'Thermodynamics Lab Report', date: 'Oct 23, 16:10', grade: '96/100', status: 'graded', scoreValue: 96 },
    { id: 'sub-6', studentName: 'Elena Martinez', initials: 'EM', assignment: 'Wave Equation Homework', date: 'Oct 23, 18:45', grade: null, status: 'pending' }
  ],
  'c3': [
    { id: 'sub-7', studentName: 'Alexander J. Sterling', initials: 'AS', assignment: 'Quantum Mechanics Problem Set 2', date: 'Oct 24, 08:15', grade: '98/100', status: 'graded', scoreValue: 98 },
    { id: 'sub-8', studentName: 'Chloe Huang', initials: 'CH', assignment: 'Final Research Paper Outline', date: 'Oct 23, 21:00', grade: '95/100', status: 'graded', scoreValue: 95 }
  ]
};

export const PARENT_CHILDREN: ChildRecord[] = [
  {
    id: 'child-1',
    name: 'Leo Vance',
    grade: 'Grade 10 - Alpha',
    currentGpa: 3.85,
    rank: '#12 / 140',
    targetGpa: 3.90,
    gpaTrend: [3.65, 3.72, 3.78, 3.85],
    months: ['Sep', 'Oct', 'Nov', 'Dec'],
    attendanceDays: {
      1: 'present', 2: 'present', 3: 'absent', 4: 'present', 5: 'present',
      8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present',
      15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'present',
      22: 'present', 23: 'present', 24: 'present'
    },
    remarks: [
      {
        id: 'rem-1',
        teacher: 'Ms. Sarah Jenkins',
        subject: 'MATHEMATICS',
        timeAgo: '2h ago',
        comment: 'Leo showed exceptional understanding of polynomial functions today. He helped two peers during the lab session.'
      },
      {
        id: 'rem-2',
        teacher: 'Mr. David Roth',
        subject: 'PHYSICAL EDUCATION',
        timeAgo: 'Yesterday',
        comment: 'Great leadership during the varsity basketball trials. Performance was consistent with elite-tier athletes.'
      }
    ]
  },
  {
    id: 'child-2',
    name: 'Maya Vance',
    grade: 'Grade 8 - STEM Honors',
    currentGpa: 3.98,
    rank: '#3 / 140',
    targetGpa: 4.00,
    gpaTrend: [3.92, 3.95, 3.96, 3.98],
    months: ['Sep', 'Oct', 'Nov', 'Dec'],
    attendanceDays: {
      1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present',
      8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present',
      15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'present',
      22: 'present', 23: 'present', 24: 'present'
    },
    remarks: [
      {
        id: 'rem-3',
        teacher: 'Dr. Elena Rostova',
        subject: 'ROBOTICS & SCIENCE',
        timeAgo: '4h ago',
        comment: 'Maya\'s autonomous rover algorithm won 1st place in today\'s science simulation! Her coding clarity is exemplary.'
      },
      {
        id: 'rem-4',
        teacher: 'Prof. Arthur Pendelton',
        subject: 'WORLD LITERATURE',
        timeAgo: '3 days ago',
        comment: 'An insightful literary analysis on Shakespearean sonnets. Maya\'s essay writing continues to impress the department.'
      }
    ]
  }
];

export const TRANSCRIPTS: { [id: string]: TranscriptData } = {
  'alexander': {
    id: 'alexander',
    transcriptId: 'TX-2023-00451',
    issueDate: 'Oct 24, 2023',
    fullName: 'Alexander J. Sterling',
    studentId: 'ST-882-901',
    academicClass: 'Grade 11 - Science A',
    currentTerm: 'Third Semester 2023',
    dob: 'May 14, 2007',
    gender: 'Male',
    photoUrl: ASSETS.studentAlexanderPhoto,
    subjects: [
      { subject: 'Mathematics', caScore: 28, examScore: 65, totalScore: 93, grade: 'A+', remarks: 'Excellent', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
      { subject: 'Physics', caScore: 25, examScore: 60, totalScore: 85, grade: 'A', remarks: 'Outstanding', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
      { subject: 'Chemistry', caScore: 27, examScore: 58, totalScore: 85, grade: 'A', remarks: 'Consistent', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
      { subject: 'English Language', caScore: 22, examScore: 54, totalScore: 76, grade: 'B+', remarks: 'Very Good', badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
      { subject: 'Computer Science', caScore: 30, examScore: 68, totalScore: 98, grade: 'A+', remarks: 'Brilliant', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    ],
    finalGpa: 4.85,
    gpaScale: 5.0,
    ranking: '3rd',
    totalClassSize: 45,
    attendancePercent: 98,
    status: 'PROMOTED',
    statusSub: 'To Grade 12',
    classTeacherRemarks: '"Alexander has shown exceptional growth this term, particularly in quantitative subjects. His participation in the coding club has been noteworthy. Maintain this focus."',
    classTeacherName: 'Mrs. Sarah Jenkins',
    classTeacherSignUrl: ASSETS.teacherSignature,
    principalRemarks: '"An outstanding academic performance. Alexander is a model student of this institution. Approved for merit scholarship consideration."',
    principalName: 'Dr. Richard Vance',
    principalSignUrl: ASSETS.principalSignature,
    qrCodeUrl: ASSETS.qrCode,
    promotionBannerText: 'Congratulations! You\'ve ranked in the Top 5 of your class.'
  },
  'alice': {
    id: 'alice',
    transcriptId: 'TX-2023-00101',
    issueDate: 'Oct 24, 2023',
    fullName: 'Alice Cooper',
    studentId: 'ST-701-442',
    academicClass: 'Grade 11 - Alpha',
    currentTerm: 'Third Semester 2023',
    dob: 'April 02, 2007',
    gender: 'Female',
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    subjects: [
      { subject: 'Advanced Calculus', caScore: 30, examScore: 69, totalScore: 99, grade: 'A+', remarks: 'Flawless', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
      { subject: 'Quantum Physics', caScore: 29, examScore: 67, totalScore: 96, grade: 'A+', remarks: 'Superior', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
      { subject: 'Organic Chemistry', caScore: 28, examScore: 66, totalScore: 94, grade: 'A+', remarks: 'Excellent', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
      { subject: 'European History', caScore: 27, examScore: 64, totalScore: 91, grade: 'A', remarks: 'Great Insight', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
      { subject: 'Computer Programming', caScore: 30, examScore: 70, totalScore: 100, grade: 'A+', remarks: 'Perfection', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    ],
    finalGpa: 5.00,
    gpaScale: 5.0,
    ranking: '1st',
    totalClassSize: 45,
    attendancePercent: 99,
    status: 'PROMOTED',
    statusSub: 'To Grade 12 (Valedictorian Track)',
    classTeacherRemarks: '"Alice is setting academic records across the science department. Her peer mentoring and laboratory precision are unparalleled."',
    classTeacherName: 'Mrs. Sarah Jenkins',
    classTeacherSignUrl: ASSETS.teacherSignature,
    principalRemarks: '"Highest commendations. Alice represents the pinnacle of Saint Jude\'s Academy scholarship. Awarded Dean\'s Excellence Medal."',
    principalName: 'Dr. Richard Vance',
    principalSignUrl: ASSETS.principalSignature,
    qrCodeUrl: ASSETS.qrCode,
    promotionBannerText: 'Congratulations! You are the #1 Ranked Student in the institution!'
  },
  'leo': {
    id: 'leo',
    transcriptId: 'TX-2023-00512',
    issueDate: 'Oct 24, 2023',
    fullName: 'Leo Vance',
    studentId: 'ST-905-118',
    academicClass: 'Grade 10 - Alpha',
    currentTerm: 'Fall Semester 2023',
    dob: 'August 19, 2008',
    gender: 'Male',
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    subjects: [
      { subject: 'Mathematics', caScore: 27, examScore: 62, totalScore: 89, grade: 'A', remarks: 'Very Strong', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
      { subject: 'Physical Education', caScore: 30, examScore: 68, totalScore: 98, grade: 'A+', remarks: 'Varsity Leader', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
      { subject: 'Biology', caScore: 26, examScore: 58, totalScore: 84, grade: 'A-', remarks: 'Good Effort', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
      { subject: 'English Literature', caScore: 25, examScore: 60, totalScore: 85, grade: 'A', remarks: 'Well Written', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
      { subject: 'World History', caScore: 26, examScore: 61, totalScore: 87, grade: 'A', remarks: 'Consistent', badgeClass: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' },
    ],
    finalGpa: 4.65,
    gpaScale: 5.0,
    ranking: '12th',
    totalClassSize: 140,
    attendancePercent: 97,
    status: 'PROMOTED',
    statusSub: 'To Grade 11 Honor Roll',
    classTeacherRemarks: '"Leo balances rigorous academic performance with elite athletic achievements. His leadership in group projects has been a key driver for class morale."',
    classTeacherName: 'Mrs. Sarah Jenkins',
    classTeacherSignUrl: ASSETS.teacherSignature,
    principalRemarks: '"An exemplary well-rounded student athlete. Approved for Varsity Leadership Honor and continuing scholarship status."',
    principalName: 'Dr. Richard Vance',
    principalSignUrl: ASSETS.principalSignature,
    qrCodeUrl: ASSETS.qrCode,
    promotionBannerText: 'Honor Roll Status Confirmed! Outstanding Semester performance.'
  }
};

export const INITIAL_TRANSCRIPT_ACCESSES = [
  {
    id: 'audit-1',
    userId: 'usr-101',
    userName: 'Mrs. Sarah Jenkins',
    userEmail: 'sarah.jenkins@stjudes.edu',
    userRole: 'teacher',
    studentId: 'alexander',
    studentName: 'Alexander J. Sterling',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    id: 'audit-2',
    userId: 'usr-102',
    userName: 'Admin Brody',
    userEmail: 'marcus.brody@stjudes.edu',
    userRole: 'admin',
    studentId: 'alice',
    studentName: 'Alice Cooper',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
  },
  {
    id: 'audit-3',
    userId: 'usr-parent-1',
    userName: 'David Vance',
    userEmail: 'david.vance@gmail.com',
    userRole: 'parent',
    studentId: 'leo',
    studentName: 'Leo Vance',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'audit-4',
    userId: 'usr-101',
    userName: 'Mrs. Sarah Jenkins',
    userEmail: 'sarah.jenkins@stjudes.edu',
    userRole: 'teacher',
    studentId: 'leo',
    studentName: 'Leo Vance',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'audit-5',
    userId: 'usr-103',
    userName: 'Admin Elizabeth',
    userEmail: 'elizabeth.sterling@stjudes.edu',
    userRole: 'admin',
    studentId: 'alexander',
    studentName: 'Alexander J. Sterling',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];
