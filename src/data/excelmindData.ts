import {
  StudentProfile,
  Course,
  Assignment,
  CbtExam,
  SubjectResult,
  PerformanceTrend,
  ChatMessage,
  TimetableSlot,
  ForumTopic
} from '../types/excelmind';

export const CURRENT_STUDENT: StudentProfile = {
  student_id: 'EXM-2025-0842',
  name: 'John Doe',
  email: 'john.doe@excelmind.edu.ng',
  class: 'SSS 3 Gold',
  department: 'Science & Technology',
  parent_id: 'PRT-9021',
  parentName: 'Engr. Michael Doe',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  academicSession: '2025/2026 Term 1',
  overallScore: 82,
  scoreImprovement: 8,
  attendanceRate: 94,
  assignmentsSubmitted: 45,
  assignmentsTotal: 50,
  cbtAverageScore: 78,
  rank: 3,
  totalInClass: 42,
  conduct: 'Exemplary discipline, high intellectual curiosity, and outstanding peer leadership.'
};

export const TIMETABLE_DATA: TimetableSlot[] = [
  // Monday
  { id: 'm1', day: 'Monday', period: 1, time: '08:00 - 08:50', subject: 'Further Mathematics', teacher: 'Mrs. Folashade Adeleke', room: 'Sci Lab 1', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'm2', day: 'Monday', period: 2, time: '08:50 - 09:40', subject: 'Physics', teacher: 'Dr. Kenneth Okon', room: 'Physics Lab', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 'm3', day: 'Monday', period: 3, time: '09:40 - 10:30', subject: 'English Language', teacher: 'Mr. David Adeyemi', room: 'Hall 3B', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'm4', day: 'Monday', period: 4, time: '11:00 - 11:50', subject: 'Chemistry', teacher: 'Mr. Babatunde Bakare', room: 'Chem Lab 2', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 'm5', day: 'Monday', period: 5, time: '11:50 - 12:40', subject: 'Biology', teacher: 'Mrs. Amina Bello', room: 'Bio Lab', color: 'bg-teal-50 border-teal-200 text-teal-800' },
  { id: 'm6', day: 'Monday', period: 6, time: '01:20 - 02:10', subject: 'Computer Studies', teacher: 'Engr. Emeka Nwosu', room: 'ICT Innovation Lab', color: 'bg-sky-50 border-sky-200 text-sky-800' },
  { id: 'm7', day: 'Monday', period: 7, time: '02:10 - 03:00', subject: 'Civic Education', teacher: 'Barr. Victoria Briggs', room: 'Room 12', color: 'bg-amber-50 border-amber-200 text-amber-800' },

  // Tuesday
  { id: 't1', day: 'Tuesday', period: 1, time: '08:00 - 08:50', subject: 'General Mathematics', teacher: 'Mrs. Folashade Adeleke', room: 'Room 14', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 't2', day: 'Tuesday', period: 2, time: '08:50 - 09:40', subject: 'Chemistry Practical', teacher: 'Mr. Babatunde Bakare', room: 'Chem Lab 1', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 't3', day: 'Tuesday', period: 3, time: '09:40 - 10:30', subject: 'Chemistry Practical', teacher: 'Mr. Babatunde Bakare', room: 'Chem Lab 1', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 't4', day: 'Tuesday', period: 4, time: '11:00 - 11:50', subject: 'Economics', teacher: 'Dr. Usman Sanusi', room: 'Hall 2', color: 'bg-rose-50 border-rose-200 text-rose-800' },
  { id: 't5', day: 'Tuesday', period: 5, time: '11:50 - 12:40', subject: 'English Oral/Speech', teacher: 'Mr. David Adeyemi', room: 'Language Studio', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 't6', day: 'Tuesday', period: 6, time: '01:20 - 02:10', subject: 'Physics Tutorial', teacher: 'Dr. Kenneth Okon', room: 'Sci Lab 1', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 't7', day: 'Tuesday', period: 7, time: '02:10 - 03:00', subject: 'AI & Robotics Club', teacher: 'Engr. Emeka Nwosu', room: 'ICT Innovation Lab', color: 'bg-cyan-50 border-cyan-200 text-cyan-800' },

  // Wednesday
  { id: 'w1', day: 'Wednesday', period: 1, time: '08:00 - 08:50', subject: 'Physics Practical', teacher: 'Dr. Kenneth Okon', room: 'Physics Lab', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 'w2', day: 'Wednesday', period: 2, time: '08:50 - 09:40', subject: 'Physics Practical', teacher: 'Dr. Kenneth Okon', room: 'Physics Lab', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 'w3', day: 'Wednesday', period: 3, time: '09:40 - 10:30', subject: 'Further Mathematics', teacher: 'Mrs. Folashade Adeleke', room: 'Room 14', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'w4', day: 'Wednesday', period: 4, time: '11:00 - 11:50', subject: 'Biology Genetics', teacher: 'Mrs. Amina Bello', room: 'Bio Lab', color: 'bg-teal-50 border-teal-200 text-teal-800' },
  { id: 'w5', day: 'Wednesday', period: 5, time: '11:50 - 12:40', subject: 'Technical Drawing', teacher: 'Arch. Samuel Alabi', room: 'CAD Studio', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { id: 'w6', day: 'Wednesday', period: 6, time: '01:20 - 02:10', subject: 'English Essay Writing', teacher: 'Mr. David Adeyemi', room: 'Hall 3B', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'w7', day: 'Wednesday', period: 7, time: '02:10 - 03:00', subject: 'CBT Practice Session', teacher: 'CBT Admin Center', room: 'CBT Center A', color: 'bg-violet-50 border-violet-200 text-violet-800' },

  // Thursday
  { id: 'th1', day: 'Thursday', period: 1, time: '08:00 - 08:50', subject: 'General Mathematics', teacher: 'Mrs. Folashade Adeleke', room: 'Room 14', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'th2', day: 'Thursday', period: 2, time: '08:50 - 09:40', subject: 'Chemistry', teacher: 'Mr. Babatunde Bakare', room: 'Chem Lab 2', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 'th3', day: 'Thursday', period: 3, time: '09:40 - 10:30', subject: 'Biology Practical', teacher: 'Mrs. Amina Bello', room: 'Bio Lab', color: 'bg-teal-50 border-teal-200 text-teal-800' },
  { id: 'th4', day: 'Thursday', period: 4, time: '11:00 - 11:50', subject: 'Computer Programming', teacher: 'Engr. Emeka Nwosu', room: 'ICT Innovation Lab', color: 'bg-sky-50 border-sky-200 text-sky-800' },
  { id: 'th5', day: 'Thursday', period: 5, time: '11:50 - 12:40', subject: 'Economics', teacher: 'Dr. Usman Sanusi', room: 'Hall 2', color: 'bg-rose-50 border-rose-200 text-rose-800' },
  { id: 'th6', day: 'Thursday', period: 6, time: '01:20 - 02:10', subject: 'Civic Education', teacher: 'Barr. Victoria Briggs', room: 'Room 12', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { id: 'th7', day: 'Thursday', period: 7, time: '02:10 - 03:00', subject: 'Mentorship & Career Clinic', teacher: 'Vice Principal Academic', room: 'Auditorium', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },

  // Friday
  { id: 'f1', day: 'Friday', period: 1, time: '08:00 - 08:50', subject: 'Further Mathematics', teacher: 'Mrs. Folashade Adeleke', room: 'Room 14', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'f2', day: 'Friday', period: 2, time: '08:50 - 09:40', subject: 'Physics Electromagnetism', teacher: 'Dr. Kenneth Okon', room: 'Physics Lab', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 'f3', day: 'Friday', period: 3, time: '09:40 - 10:30', subject: 'English Comprehension', teacher: 'Mr. David Adeyemi', room: 'Hall 3B', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'f4', day: 'Friday', period: 4, time: '11:00 - 11:50', subject: 'Chemistry Organic Reactions', teacher: 'Mr. Babatunde Bakare', room: 'Chem Lab 2', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 'f5', day: 'Friday', period: 5, time: '11:50 - 12:40', subject: 'Library & Research Hour', teacher: 'Chief Librarian', room: 'E-Library', color: 'bg-slate-100 border-slate-300 text-slate-800' }
];

export const COURSES_DATA: Course[] = [
  {
    course_id: 'CRS-MTH-301',
    title: 'General Mathematics & Further Maths',
    code: 'MTH 301',
    category: 'Core STEM',
    teacher: 'Mrs. Folashade Adeleke',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    progress: 75,
    materialsCount: { videos: 24, pdfs: 18, audios: 10, quizzes: 14 },
    nextLesson: 'Definite Integration & Area Under Curves',
    bannerColor: 'from-[#111B5E] to-blue-700',
    description: 'Master WAEC & JAMB core mathematics, advanced calculus, coordinate geometry, matrices, probability distributions, and mechanics vectors.',
    lessons: [
      { id: 'l1', title: 'Quadratic Equations & Roots Analysis', type: 'video', durationOrPages: '28 mins', completed: true, description: 'Sum and product of roots, nature of discriminant, graphical roots.' },
      { id: 'l2', title: 'Calculus: Differentiation from First Principles', type: 'video', durationOrPages: '34 mins', completed: true, description: 'Limits, rate of change, tangents, and normals.' },
      { id: 'l3', title: 'Integration: Substitution and By Parts', type: 'pdf', durationOrPages: '14 pages', completed: true, description: 'Comprehensive formulas, worked solutions, and WAEC past questions.' },
      { id: 'l4', title: 'Definite Integration & Area Under Curves', type: 'video', durationOrPages: '42 mins', completed: false, description: 'Geometric applications, volume of revolution.' },
      { id: 'l5', title: 'Trigonometric Identities & Equations', type: 'audio', durationOrPages: '22 mins', completed: false, description: 'Audio walk-through of compound angles and double-angle formulas.' },
      { id: 'l6', title: 'Mastery Quiz: Vectors & Matrices', type: 'quiz', durationOrPages: '15 questions', completed: false, description: 'Timed assessment evaluating vector dot products and matrix inverses.' }
    ]
  },
  {
    course_id: 'CRS-PHY-302',
    title: 'Physics & Applied Mechanics',
    code: 'PHY 302',
    category: 'Science',
    teacher: 'Dr. Kenneth Okon',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    progress: 70,
    materialsCount: { videos: 20, pdfs: 15, audios: 8, quizzes: 12 },
    nextLesson: 'Electromagnetic Induction & Faraday Laws',
    bannerColor: 'from-indigo-900 to-indigo-600',
    description: 'Explore Newtonian mechanics, wave motion, electromagnetic induction, atomic physics, semiconductors, and experimental laboratory error analysis.',
    lessons: [
      { id: 'lp1', title: 'Simple Harmonic Motion (SHM) & Pendulums', type: 'video', durationOrPages: '31 mins', completed: true, description: 'Equations of SHM, resonance, damped oscillations.' },
      { id: 'lp2', title: 'Wave Optics: Interference & Diffraction', type: 'pdf', durationOrPages: '18 pages', completed: true, description: 'Young double-slit experiment, diffraction grating formulas.' },
      { id: 'lp3', title: 'Electromagnetic Induction & Faraday Laws', type: 'video', durationOrPages: '38 mins', completed: false, description: 'Lenz law, mutual inductance, electric generators, and transformers.' },
      { id: 'lp4', title: 'Nuclear Physics: Radioactivity & Half-life', type: 'audio', durationOrPages: '25 mins', completed: false, description: 'Alpha, beta, gamma emissions, nuclear fission and fusion.' }
    ]
  },
  {
    course_id: 'CRS-CHM-303',
    title: 'Chemistry: Organic & Physical',
    code: 'CHM 303',
    category: 'Science',
    teacher: 'Mr. Babatunde Bakare',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    progress: 65,
    materialsCount: { videos: 18, pdfs: 16, audios: 6, quizzes: 10 },
    nextLesson: 'Hydrocarbons: Alkanols & Esterification',
    bannerColor: 'from-emerald-900 to-teal-600',
    description: 'Chemical equilibrium, thermodynamics, reaction kinetics, IUPAC nomenclature, alkanes, alkenes, alkynes, benzene derivatives, and qualitative test for ions.',
    lessons: [
      { id: 'lc1', title: 'Chemical Equilibrium & Le Chatelier Principle', type: 'video', durationOrPages: '30 mins', completed: true, description: 'Equilibrium constants Kc, Kp, effect of pressure, temperature, and catalysts.' },
      { id: 'lc2', title: 'Volumetric Analysis & Acid-Base Titration Guide', type: 'pdf', durationOrPages: '22 pages', completed: true, description: 'Practical indicator selection, titration calculations, percentage purity.' },
      { id: 'lc3', title: 'Hydrocarbons: Alkanols & Esterification', type: 'video', durationOrPages: '35 mins', completed: false, description: 'Preparation of ethanol, primary/secondary/tertiary alcohols, oxidation reactions.' }
    ]
  },
  {
    course_id: 'CRS-ENG-304',
    title: 'English Language & Oral Communication',
    code: 'ENG 304',
    category: 'Core General',
    teacher: 'Mr. David Adeyemi',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    progress: 80,
    materialsCount: { videos: 16, pdfs: 20, audios: 14, quizzes: 16 },
    nextLesson: 'Complex Sentence Synthesis & Lexis',
    bannerColor: 'from-purple-900 to-violet-600',
    description: 'Master formal essay composition, summary techniques, comprehension passage analysis, grammatical functions of clauses, and test of orals (stress & intonation).',
    lessons: [
      { id: 'le1', title: 'Summary Writing: WAEC Rules & Paraphrasing', type: 'video', durationOrPages: '26 mins', completed: true, description: 'How to extract 6 marks per point without extraneous lifting.' },
      { id: 'le2', title: 'Test of Orals: Vowel Contrasts & Consonant Clusters', type: 'audio', durationOrPages: '30 mins', completed: true, description: 'Pure vowels, diphthongs, emphatic stress, and rhyme patterns.' },
      { id: 'le3', title: 'Complex Sentence Synthesis & Lexis', type: 'pdf', durationOrPages: '16 pages', completed: false, description: 'Subordinate conjunctions, nominal clauses, idiomatic collocations.' }
    ]
  },
  {
    course_id: 'CRS-BIO-305',
    title: 'Biology & Heredity Genetics',
    code: 'BIO 305',
    category: 'Science',
    teacher: 'Mrs. Amina Bello',
    teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    progress: 85,
    materialsCount: { videos: 22, pdfs: 14, audios: 8, quizzes: 11 },
    nextLesson: 'Mendelian Genetics & Dihybrid Crosses',
    bannerColor: 'from-teal-900 to-emerald-700',
    description: 'Cell physiology, genetics, natural selection, ecology, nutrient cycles, nervous coordination, hormones, and plant reproduction mechanisms.',
    lessons: [
      { id: 'lb1', title: 'DNA Replication & Protein Synthesis', type: 'video', durationOrPages: '33 mins', completed: true, description: 'Transcription, translation, mRNA, tRNA, and triplet codons.' },
      { id: 'lb2', title: 'Mendelian Genetics & Dihybrid Crosses', type: 'pdf', durationOrPages: '20 pages', completed: false, description: 'Punnett squares, dominant/recessive alleles, sickle-cell inheritance.' }
    ]
  },
  {
    course_id: 'CRS-CSC-306',
    title: 'Computer Studies & Software Innovation',
    code: 'CSC 306',
    category: 'Technology',
    teacher: 'Engr. Emeka Nwosu',
    teacherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    progress: 90,
    materialsCount: { videos: 26, pdfs: 12, audios: 4, quizzes: 15 },
    nextLesson: 'Relational Database SQL & Normalization',
    bannerColor: 'from-sky-900 to-blue-600',
    description: 'Data representation, algorithms, Python programming, database normalization, computer networking topologies, cybersecurity, and cloud fundamentals.',
    lessons: [
      { id: 'lcs1', title: 'Python Object-Oriented Programming (OOP)', type: 'video', durationOrPages: '40 mins', completed: true, description: 'Classes, methods, inheritance, encapsulation with live code.' },
      { id: 'lcs2', title: 'Relational Database SQL & Normalization', type: 'pdf', durationOrPages: '15 pages', completed: false, description: '1NF, 2NF, 3NF schemas, foreign keys, and SQL queries.' }
    ]
  }
];

export const ASSIGNMENTS_DATA: Assignment[] = [
  {
    assignment_id: 'ASN-MTH-01',
    subject: 'General Mathematics',
    title: 'Quadratic Curves & Tangent Gradient Calculation',
    description: 'Solve problems 1-15 on page 142 of New General Mathematics for SSS 3. Plot the curve y = 2x² - 5x + 3 and determine roots, turning point, and axis of symmetry.',
    deadline: 'Friday, 10:00 AM',
    submission_status: 'pending',
    maxScore: 100,
    attachedFile: 'Quadratic_Curvature_Problem_Set.pdf'
  },
  {
    assignment_id: 'ASN-PHY-02',
    subject: 'Physics',
    title: 'Electromagnetic Field Calculations & Transformer Efficiency',
    description: 'Calculate step-up and step-down transformer primary/secondary turns ratio, eddy current power loss minimization, and flux linkage in AC circuits.',
    deadline: 'Tomorrow, 04:00 PM',
    submission_status: 'submitted',
    submittedDate: 'Yesterday at 08:30 PM',
    maxScore: 50,
    attachedFile: 'JohnDoe_Physics_Transformer_Solutions.pdf',
    studentSubmissionNote: 'Completed all 5 multi-part problems including vector phasors.'
  },
  {
    assignment_id: 'ASN-CHM-03',
    subject: 'Chemistry',
    title: 'IUPAC Nomenclature of Isomers and Esters',
    description: 'Draw structural formulas for all constitutional isomers of C₅H₁₂ and C₄H₈O₂. Name each using standard 2024 IUPAC conventions.',
    deadline: '3 days ago',
    submission_status: 'graded',
    submittedDate: '4 days ago',
    grade: 'A1',
    score: 95,
    maxScore: 100,
    teacherFeedback: 'Outstanding work John! Your isomer stereochemistry diagrams and systematic IUPAC nomenclature were flawless.'
  },
  {
    assignment_id: 'ASN-ENG-04',
    subject: 'English Language',
    title: 'Argumentative Essay: Artificial Intelligence in West African Healthcare',
    description: 'Write an argumentative essay of not less than 450 words on whether AI diagnostic tools should be mandatory in Nigerian rural hospitals.',
    deadline: 'Next Monday, 11:59 PM',
    submission_status: 'pending',
    maxScore: 50
  },
  {
    assignment_id: 'ASN-BIO-05',
    subject: 'Biology',
    title: 'Pedigree Chart Analysis for Sickle Cell Trait',
    description: 'Construct a 3-generation pedigree diagram tracking HbA and HbS alleles. Calculate probabilities of homozygous and heterozygous genotypes.',
    deadline: 'Last week',
    submission_status: 'graded',
    submittedDate: 'Last week',
    grade: 'A1',
    score: 48,
    maxScore: 50,
    teacherFeedback: 'Precise Mendelian ratios and clear graphical symbols. Excellent genetics understanding.'
  },
  {
    assignment_id: 'ASN-CSC-06',
    subject: 'Computer Studies',
    title: 'SQL Schema Design for School Clinic Management',
    description: 'Provide DDL statements creating Tables for Patients, Doctors, Prescriptions, and Appointments with primary and foreign key constraints.',
    deadline: 'In 5 days',
    submission_status: 'pending',
    maxScore: 100
  }
];

export const CBT_EXAMS_DATA: CbtExam[] = [
  {
    exam_id: 'CBT-WAEC-MTH-2025',
    subject: 'Mathematics',
    examBody: 'WAEC',
    title: 'WAEC SSSCE Mathematics National Standard Mock 2025',
    year: '2025 Mock Edition',
    durationMinutes: 45,
    totalQuestions: 15,
    difficulty: 'Standard',
    questions: [
      {
        id: 1,
        question: 'Solve for x if 3^(2x - 1) = 81.',
        options: [
          { key: 'A', text: 'x = 2' },
          { key: 'B', text: 'x = 2.5' },
          { key: 'C', text: 'x = 3' },
          { key: 'D', text: 'x = 4' }
        ],
        correctAnswer: 'B',
        explanation: '81 = 3⁴. Equating exponents: 2x - 1 = 4 => 2x = 5 => x = 2.5 (or 5/2).',
        subject: 'Mathematics',
        topic: 'Indices and Logarithms'
      },
      {
        id: 2,
        question: 'If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, find the value of log₁₀ 72.',
        options: [
          { key: 'A', text: '1.8572' },
          { key: 'B', text: '1.7581' },
          { key: 'C', text: '1.9214' },
          { key: 'D', text: '1.6980' }
        ],
        correctAnswer: 'A',
        explanation: '72 = 2³ × 3². log₁₀ 72 = 3 log₁₀ 2 + 2 log₁₀ 3 = 3(0.3010) + 2(0.4771) = 0.9030 + 0.9542 = 1.8572.',
        subject: 'Mathematics',
        topic: 'Logarithms'
      },
      {
        id: 3,
        question: 'The roots of the equation 2x² - 7x + 3 = 0 are α and β. Find the value of α² + β².',
        options: [
          { key: 'A', text: '37/4' },
          { key: 'B', text: '49/4' },
          { key: 'C', text: '25/4' },
          { key: 'D', text: '13/2' }
        ],
        correctAnswer: 'A',
        explanation: 'α + β = 7/2, αβ = 3/2. α² + β² = (α + β)² - 2αβ = (7/2)² - 2(3/2) = 49/4 - 6 = 49/4 - 24/4 = 25/4... Wait: 49/4 - 12/4 = 37/4.',
        subject: 'Mathematics',
        topic: 'Quadratic Equations'
      },
      {
        id: 4,
        question: 'Find the derivative dy/dx of y = (3x² - 2)⁴ with respect to x.',
        options: [
          { key: 'A', text: '12x(3x² - 2)³' },
          { key: 'B', text: '24x(3x² - 2)³' },
          { key: 'C', text: '8(3x² - 2)³' },
          { key: 'D', text: '6x(3x² - 2)⁴' }
        ],
        correctAnswer: 'B',
        explanation: 'By chain rule: dy/dx = 4(3x² - 2)³ × d/dx(3x² - 2) = 4(3x² - 2)³ × 6x = 24x(3x² - 2)³.',
        subject: 'Mathematics',
        topic: 'Calculus'
      },
      {
        id: 5,
        question: 'Evaluate the integral ∫ (4x³ - 6x + 5) dx from x = 0 to x = 2.',
        options: [
          { key: 'A', text: '12' },
          { key: 'B', text: '14' },
          { key: 'C', text: '16' },
          { key: 'D', text: '18' }
        ],
        correctAnswer: 'B',
        explanation: 'Indefinite integral is [x⁴ - 3x² + 5x]. At x = 2: (16 - 3(4) + 5(2)) = 16 - 12 + 10 = 14. At x = 0: 0. Result = 14.',
        subject: 'Mathematics',
        topic: 'Integration'
      },
      {
        id: 6,
        question: 'The 4th term of an arithmetic progression (A.P.) is 15 and the 9th term is 35. Find the first term (a) and common difference (d).',
        options: [
          { key: 'A', text: 'a = 3, d = 4' },
          { key: 'B', text: 'a = 5, d = 3' },
          { key: 'C', text: 'a = 2, d = 5' },
          { key: 'D', text: 'a = 4, d = 4' }
        ],
        correctAnswer: 'A',
        explanation: 'T₄ = a + 3d = 15; T₉ = a + 8d = 35. Subtracting: 5d = 20 => d = 4. a + 3(4) = 15 => a = 3.',
        subject: 'Mathematics',
        topic: 'Sequence and Series'
      },
      {
        id: 7,
        question: 'A bag contains 5 red, 4 blue, and 3 green marbles. If two marbles are drawn at random without replacement, find the probability that both are red.',
        options: [
          { key: 'A', text: '5/33' },
          { key: 'B', text: '25/144' },
          { key: 'C', text: '5/66' },
          { key: 'D', text: '1/6' }
        ],
        correctAnswer: 'A',
        explanation: 'Total marbles = 12. P(First Red) = 5/12. P(Second Red) = 4/11. Combined P = (5/12) × (4/11) = 20/132 = 5/33.',
        subject: 'Mathematics',
        topic: 'Probability'
      },
      {
        id: 8,
        question: 'The angle of elevation of the top of a cellular mast from a point 40m away on horizontal ground is 30°. Find the height of the mast (Take tan 30° = 1/√3).',
        options: [
          { key: 'A', text: '40√3 m' },
          { key: 'B', text: '(40√3)/3 m' },
          { key: 'C', text: '20 m' },
          { key: 'D', text: '20√3 m' }
        ],
        correctAnswer: 'B',
        explanation: 'tan 30° = Height / 40. Height = 40 × (1/√3) = 40/√3 = (40√3)/3 ≈ 23.09m.',
        subject: 'Mathematics',
        topic: 'Trigonometry'
      },
      {
        id: 9,
        question: 'Two vectors are given as P = 3i - 4j and Q = 4i + 3j. What is the angle between P and Q?',
        options: [
          { key: 'A', text: '0°' },
          { key: 'B', text: '45°' },
          { key: 'C', text: '90°' },
          { key: 'D', text: '180°' }
        ],
        correctAnswer: 'C',
        explanation: 'Scalar product P · Q = (3)(4) + (-4)(3) = 12 - 12 = 0. Since the dot product is zero, the vectors are perpendicular (90°).',
        subject: 'Mathematics',
        topic: 'Vectors'
      },
      {
        id: 10,
        question: 'Find the mean deviation of the set of numbers: 2, 4, 6, 8, 10.',
        options: [
          { key: 'A', text: '2.0' },
          { key: 'B', text: '2.4' },
          { key: 'C', text: '3.0' },
          { key: 'D', text: '1.8' }
        ],
        correctAnswer: 'B',
        explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6. Deviations |x - mean|: |2-6|=4, |4-6|=2, |6-6|=0, |8-6|=2, |10-6|=4. Sum = 12. Mean deviation = 12/5 = 2.4.',
        subject: 'Mathematics',
        topic: 'Statistics'
      },
      {
        id: 11,
        question: 'If the matrix A = [[2, 3], [1, 4]], find the determinant of A (det A).',
        options: [
          { key: 'A', text: '5' },
          { key: 'B', text: '8' },
          { key: 'C', text: '-1' },
          { key: 'D', text: '11' }
        ],
        correctAnswer: 'A',
        explanation: 'det A = (2 × 4) - (3 × 1) = 8 - 3 = 5.',
        subject: 'Mathematics',
        topic: 'Matrices'
      },
      {
        id: 12,
        question: 'What is photosynthesis fundamentally from a biochemical perspective?',
        options: [
          { key: 'A', text: 'The oxidation of glucose into ATP in mitochondria' },
          { key: 'B', text: 'The conversion of light energy into chemical energy stored in glucose molecules' },
          { key: 'C', text: 'The breakdown of proteins into amino acids' },
          { key: 'D', text: 'The absorption of atmospheric nitrogen by legume nodules' }
        ],
        correctAnswer: 'B',
        explanation: 'Photosynthesis uses chlorophyll to capture photon energy, reducing CO₂ and H₂O into chemical energy stored in glucose bonds.',
        subject: 'Biology / Interdisciplinary',
        topic: 'Bioenergetics'
      },
      {
        id: 13,
        question: 'A binary operation * is defined on real numbers by a * b = a + b - 2ab. Find the identity element e.',
        options: [
          { key: 'A', text: '0' },
          { key: 'B', text: '1' },
          { key: 'C', text: '1/2' },
          { key: 'D', text: '-1' }
        ],
        correctAnswer: 'A',
        explanation: 'a * e = a => a + e - 2ae = a => e(1 - 2a) = 0 => e = 0 for all a ≠ 1/2.',
        subject: 'Mathematics',
        topic: 'Abstract Algebra'
      },
      {
        id: 14,
        question: 'Find the standard deviation of 3, 3, 3, 3, 3.',
        options: [
          { key: 'A', text: '3' },
          { key: 'B', text: '0' },
          { key: 'C', text: '1' },
          { key: 'D', text: '9' }
        ],
        correctAnswer: 'B',
        explanation: 'When all data values are identical, there is no variance from the mean. Standard deviation is 0.',
        subject: 'Mathematics',
        topic: 'Statistics'
      },
      {
        id: 15,
        question: 'In how many ways can the letters of the word "EXCELMIND" be arranged?',
        options: [
          { key: 'A', text: '362,880' },
          { key: 'B', text: '181,440' },
          { key: 'C', text: '90,720' },
          { key: 'D', text: '40,320' }
        ],
        correctAnswer: 'B',
        explanation: 'Total letters = 9 (E, X, C, E, L, M, I, N, D). The letter E appears twice. Total arrangements = 9! / 2! = 362,880 / 2 = 181,440.',
        subject: 'Mathematics',
        topic: 'Permutations and Combinations'
      }
    ]
  },
  {
    exam_id: 'CBT-JAMB-PHY-2025',
    subject: 'Physics',
    examBody: 'JAMB',
    title: 'JAMB UTME Comprehensive Physics CBT Simulation',
    year: '2025 UTME Series',
    durationMinutes: 30,
    totalQuestions: 10,
    difficulty: 'Advanced',
    questions: [
      {
        id: 1,
        question: 'A body starts from rest and accelerates uniformly at 4 m/s² for 5 seconds. Calculate the total distance covered.',
        options: [
          { key: 'A', text: '20 m' },
          { key: 'B', text: '50 m' },
          { key: 'C', text: '100 m' },
          { key: 'D', text: '40 m' }
        ],
        correctAnswer: 'B',
        explanation: 's = ut + 0.5at². Since u = 0: s = 0.5 × 4 × (5)² = 2 × 25 = 50 meters.',
        subject: 'Physics'
      },
      {
        id: 2,
        question: 'The refractive index of glass with respect to air is 1.5. Calculate the critical angle for a ray travelling from glass to air.',
        options: [
          { key: 'A', text: '41.8°' },
          { key: 'B', text: '48.6°' },
          { key: 'C', text: '30.0°' },
          { key: 'D', text: '60.0°' }
        ],
        correctAnswer: 'A',
        explanation: 'sin C = 1/n = 1/1.5 = 0.6667. C = arcsin(0.6667) ≈ 41.8°.',
        subject: 'Physics'
      },
      {
        id: 3,
        question: 'Which of the following electromagnetic waves has the highest frequency?',
        options: [
          { key: 'A', text: 'Ultraviolet rays' },
          { key: 'B', text: 'Microwaves' },
          { key: 'C', text: 'Gamma rays' },
          { key: 'D', text: 'X-rays' }
        ],
        correctAnswer: 'C',
        explanation: 'In the EM spectrum, gamma rays have the shortest wavelength and therefore the highest frequency and photon energy.',
        subject: 'Physics'
      },
      {
        id: 4,
        question: 'An electric kettle rated 2 kW, 240V is used for 3 hours. Calculate the electrical energy consumed in kilowatt-hours (kWh).',
        options: [
          { key: 'A', text: '6 kWh' },
          { key: 'B', text: '12 kWh' },
          { key: 'C', text: '0.67 kWh' },
          { key: 'D', text: '720 kWh' }
        ],
        correctAnswer: 'A',
        explanation: 'Energy = Power (kW) × Time (hours) = 2 kW × 3 h = 6 kWh.',
        subject: 'Physics'
      },
      {
        id: 5,
        question: 'A wire of length 2m and cross-sectional area 1 × 10⁻⁶ m² has a resistance of 4 Ω. Find its resistivity.',
        options: [
          { key: 'A', text: '2 × 10⁻⁶ Ω·m' },
          { key: 'B', text: '8 × 10⁻⁶ Ω·m' },
          { key: 'C', text: '0.5 × 10⁻⁶ Ω·m' },
          { key: 'D', text: '1 × 10⁻⁶ Ω·m' }
        ],
        correctAnswer: 'A',
        explanation: 'R = ρL/A => ρ = RA/L = (4 × 1 × 10⁻⁶) / 2 = 2 × 10⁻⁶ Ω·m.',
        subject: 'Physics'
      },
      {
        id: 6,
        question: 'Lenz’s law of electromagnetic induction is a direct consequence of the law of conservation of:',
        options: [
          { key: 'A', text: 'Electric Charge' },
          { key: 'B', text: 'Linear Momentum' },
          { key: 'C', text: 'Energy' },
          { key: 'D', text: 'Mass' }
        ],
        correctAnswer: 'C',
        explanation: 'Lenz’s law ensures that mechanical work done against the opposing induced EMF equals the electrical energy generated, conserving energy.',
        subject: 'Physics'
      },
      {
        id: 7,
        question: 'A simple pendulum has a period of 2.0s on Earth. What will happen to its period if the mass of the bob is doubled?',
        options: [
          { key: 'A', text: 'It will double to 4.0s' },
          { key: 'B', text: 'It will halve to 1.0s' },
          { key: 'C', text: 'It will remain 2.0s' },
          { key: 'D', text: 'It will increase by √2' }
        ],
        correctAnswer: 'C',
        explanation: 'The period of a simple pendulum T = 2π√(L/g) is completely independent of the mass of the pendulum bob.',
        subject: 'Physics'
      },
      {
        id: 8,
        question: 'The unit of magnetic flux density in SI units is:',
        options: [
          { key: 'A', text: 'Weber (Wb)' },
          { key: 'B', text: 'Tesla (T)' },
          { key: 'C', text: 'Henry (H)' },
          { key: 'D', text: 'Farad (F)' }
        ],
        correctAnswer: 'B',
        explanation: 'Magnetic flux is measured in Webers (Wb), whereas magnetic flux density (B) is measured in Tesla (T = Wb/m²).',
        subject: 'Physics'
      },
      {
        id: 9,
        question: 'If the half-life of a radioactive isotope is 10 days, what fraction of the original substance remains after 30 days?',
        options: [
          { key: 'A', text: '1/3' },
          { key: 'B', text: '1/6' },
          { key: 'C', text: '1/8' },
          { key: 'D', text: '1/16' }
        ],
        correctAnswer: 'C',
        explanation: '30 days = 3 half-lives. Fraction remaining = (1/2)³ = 1/8.',
        subject: 'Physics'
      },
      {
        id: 10,
        question: 'Which device is used to convert alternating current (AC) into direct current (DC)?',
        options: [
          { key: 'A', text: 'Transformer' },
          { key: 'B', text: 'Rectifier (Diode)' },
          { key: 'C', text: 'Inductor' },
          { key: 'D', text: 'Capacitor' }
        ],
        correctAnswer: 'B',
        explanation: 'A rectifier, commonly constructed using semiconductor p-n junction diodes, allows current to pass in only one direction, converting AC to DC.',
        subject: 'Physics'
      }
    ]
  },
  {
    exam_id: 'CBT-NECO-CHM-2025',
    subject: 'Chemistry',
    examBody: 'NECO',
    title: 'NECO SSCE Chemistry Standard CBT Appraisal',
    year: '2025 Mock',
    durationMinutes: 35,
    totalQuestions: 5,
    difficulty: 'Standard',
    questions: [
      {
        id: 1,
        question: 'What is the oxidation number of chromium in K₂Cr₂O₇?',
        options: [
          { key: 'A', text: '+3' },
          { key: 'B', text: '+6' },
          { key: 'C', text: '+7' },
          { key: 'D', text: '+12' }
        ],
        correctAnswer: 'B',
        explanation: '2(+1) + 2(Cr) + 7(-2) = 0 => 2 + 2Cr - 14 = 0 => 2Cr = 12 => Cr = +6.',
        subject: 'Chemistry'
      },
      {
        id: 2,
        question: 'Which gas is evolved when dilute hydrochloric acid reacts with calcium trioxocarbonate(IV)?',
        options: [
          { key: 'A', text: 'Hydrogen gas (H₂)' },
          { key: 'B', text: 'Carbon dioxide gas (CO₂)' },
          { key: 'C', text: 'Chlorine gas (Cl₂)' },
          { key: 'D', text: 'Sulfur dioxide gas (SO₂)' }
        ],
        correctAnswer: 'B',
        explanation: 'CaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂↑. The gas turns lime water milky.',
        subject: 'Chemistry'
      },
      {
        id: 3,
        question: 'The catalyst used in the industrial Haber Process for ammonia synthesis is:',
        options: [
          { key: 'A', text: 'Finely divided iron' },
          { key: 'B', text: 'Vanadium(V) oxide' },
          { key: 'C', text: 'Platinum mesh' },
          { key: 'D', text: 'Nickel' }
        ],
        correctAnswer: 'A',
        explanation: 'Finely divided iron with aluminum oxide/potassium promoter is used in Haber process. (V₂O₅ is used in Contact process).',
        subject: 'Chemistry'
      },
      {
        id: 4,
        question: 'Which of the following organic compounds will decolorize acidified KMnO₄ solution rapidly?',
        options: [
          { key: 'A', text: 'Ethane' },
          { key: 'B', text: 'Ethene' },
          { key: 'C', text: 'Methane' },
          { key: 'D', text: 'Propane' }
        ],
        correctAnswer: 'B',
        explanation: 'Ethene contains a carbon-carbon double bond (unsaturated) which readily undergoes oxidation with acidified KMnO₄.',
        subject: 'Chemistry'
      },
      {
        id: 5,
        question: 'What is the pH of a 0.001 M solution of hydrochloric acid (HCl)?',
        options: [
          { key: 'A', text: '1' },
          { key: 'B', text: '2' },
          { key: 'C', text: '3' },
          { key: 'D', text: '4' }
        ],
        correctAnswer: 'C',
        explanation: 'pH = -log₁₀[H⁺] = -log₁₀(10⁻³) = 3.',
        subject: 'Chemistry'
      }
    ]
  }
];

export const SUBJECT_RESULTS_DATA: SubjectResult[] = [
  { subject: 'General Mathematics', caScore: 28, examScore: 61, totalScore: 89, previousScore: 78, grade: 'A1', rank: '1st in Class', teacher: 'Mrs. Folashade Adeleke', teacher_comment: 'Brilliant mathematical thinking and mastery of calculus proofs.', category: 'Core' },
  { subject: 'Further Mathematics', caScore: 26, examScore: 59, totalScore: 85, previousScore: 72, grade: 'A1', rank: '2nd in Class', teacher: 'Mrs. Folashade Adeleke', teacher_comment: 'Superb abstract reasoning. Shows exceptional aptitude for engineering math.', category: 'Science' },
  { subject: 'Physics', caScore: 25, examScore: 57, totalScore: 82, previousScore: 75, grade: 'A1', rank: '3rd in Class', teacher: 'Dr. Kenneth Okon', teacher_comment: 'Consistent practical laboratory acumen and strong theoretical grasp.', category: 'Science' },
  { subject: 'Chemistry', caScore: 24, examScore: 54, totalScore: 78, previousScore: 71, grade: 'B2', rank: '4th in Class', teacher: 'Mr. Babatunde Bakare', teacher_comment: 'Great progress in organic reactions. Keep consolidating physical thermodynamics.', category: 'Science' },
  { subject: 'Biology', caScore: 27, examScore: 58, totalScore: 85, previousScore: 80, grade: 'A1', rank: '2nd in Class', teacher: 'Mrs. Amina Bello', teacher_comment: 'Outstanding diagrams and flawless genetics explanations.', category: 'Science' },
  { subject: 'English Language', caScore: 23, examScore: 53, totalScore: 76, previousScore: 68, grade: 'B2', rank: '5th in Class', teacher: 'Mr. David Adeyemi', teacher_comment: 'Strong essay structure. Further polish oral phonetic stress placement.', category: 'Core' },
  { subject: 'Computer Studies', caScore: 29, examScore: 65, totalScore: 94, previousScore: 88, grade: 'A1', rank: '1st in Class', teacher: 'Engr. Emeka Nwosu', teacher_comment: 'Premier student in Python algorithm design and relational databases.', category: 'Vocational' },
  { subject: 'Economics', caScore: 22, examScore: 50, totalScore: 72, previousScore: 65, grade: 'B3', rank: '6th in Class', teacher: 'Dr. Usman Sanusi', teacher_comment: 'Good understanding of national macroeconomic aggregates and fiscal policies.', category: 'Core' },
  { subject: 'Civic Education', caScore: 26, examScore: 55, totalScore: 81, previousScore: 76, grade: 'A1', rank: '3rd in Class', teacher: 'Barr. Victoria Briggs', teacher_comment: 'Demonstrates deep ethical principles, civic rights, and constitutional literacy.', category: 'Core' }
];

export const PERFORMANCE_TRENDS_DATA: PerformanceTrend[] = [
  { term: 'SSS 1 Term 1', score: 68, classAverage: 62 },
  { term: 'SSS 1 Term 2', score: 71, classAverage: 64 },
  { term: 'SSS 1 Term 3', score: 74, classAverage: 65 },
  { term: 'SSS 2 Term 1', score: 75, classAverage: 67 },
  { term: 'SSS 2 Term 2', score: 77, classAverage: 68 },
  { term: 'SSS 2 Term 3', score: 74, classAverage: 69 },
  { term: 'SSS 3 Term 1 (Current)', score: 82, classAverage: 71 }
];

export const CHAT_MESSAGES_DATA: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'TCH-001',
    senderName: 'Dr. Kenneth Okon',
    senderRole: 'teacher',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    recipientId: 'EXM-2025-0842',
    recipientName: 'John Doe',
    text: 'Hello John! I reviewed your transformer eddy currents assignment. Your phasor diagram solution was exceptional. Keep that focus for the upcoming WAEC mock.',
    timestamp: 'Today at 09:15 AM',
    isRead: true,
    channel: 'teacher',
    subject: 'Physics'
  },
  {
    id: 'msg-2',
    senderId: 'EXM-2025-0842',
    senderName: 'John Doe',
    senderRole: 'student',
    recipientId: 'TCH-001',
    recipientName: 'Dr. Kenneth Okon',
    text: 'Thank you very much Dr. Okon! In problem 4, could we also use Lenz law directly to explain the reverse flux damping in the secondary core?',
    timestamp: 'Today at 09:22 AM',
    isRead: true,
    channel: 'teacher',
    subject: 'Physics'
  },
  {
    id: 'msg-3',
    senderId: 'TCH-001',
    senderName: 'Dr. Kenneth Okon',
    senderRole: 'teacher',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    recipientId: 'EXM-2025-0842',
    recipientName: 'John Doe',
    text: 'Precisely! In fact, mentioning Lenz law explicitly is worth 2 bonus method marks in WAEC marking schemes.',
    timestamp: 'Today at 09:25 AM',
    isRead: true,
    channel: 'teacher',
    subject: 'Physics'
  },
  {
    id: 'msg-4',
    senderId: 'ADM-OFFICE',
    senderName: 'Principal Office & Academic Board',
    senderRole: 'admin',
    recipientId: 'ALL',
    recipientName: 'All Senior Students',
    text: '📢 OFFICIAL ANNOUNCEMENT: National WAEC / JAMB CBT Mock Examinations begin on Wednesday at CBT Innovation Hub 1. Please ensure your biometric ID cards are validated.',
    timestamp: 'Yesterday at 04:00 PM',
    isRead: true,
    channel: 'announcement'
  },
  {
    id: 'msg-5',
    senderId: 'TCH-002',
    senderName: 'Mrs. Folashade Adeleke',
    senderRole: 'teacher',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    recipientId: 'EXM-2025-0842',
    recipientName: 'John Doe',
    text: 'John, please remind your study group that the Further Maths practice on Vector Products is uploaded in the Learning Hub notes tab.',
    timestamp: '2 days ago',
    isRead: true,
    channel: 'teacher',
    subject: 'Mathematics'
  }
];

export const FORUM_TOPICS_DATA: ForumTopic[] = [
  {
    id: 'ft-1',
    subject: 'General Mathematics',
    title: 'Shortcuts for finding inverse of 3x3 Matrices without row reduction',
    author: 'John Doe (You)',
    authorRole: 'SSS 3 Student',
    repliesCount: 8,
    upvotes: 24,
    timeAgo: '3 hours ago',
    content: 'Has anyone experimented with Sarrus rule for the adjugate matrix? It seems to cut calculation time by 50% for standard WAEC questions.'
  },
  {
    id: 'ft-2',
    subject: 'Physics',
    title: 'Why do electromagnetic waves travel at the speed of light in vacuum?',
    author: 'Chidinma Eze',
    authorRole: 'SSS 3 Student',
    repliesCount: 14,
    upvotes: 31,
    timeAgo: '1 day ago',
    content: 'Maxwell calculated c = 1/√(μ₀ε₀). Let us discuss how permeability and permittivity of free space establish this universal constant.'
  },
  {
    id: 'ft-3',
    subject: 'Chemistry',
    title: 'Common pitfalls in IUPAC ester naming vs ether naming',
    author: 'Mr. Babatunde Bakare',
    authorRole: 'Chemistry Teacher',
    repliesCount: 19,
    upvotes: 42,
    timeAgo: '2 days ago',
    content: 'Remember: the alkyl group attached to oxygen comes first (e.g. ethyl), followed by the alkanoate chain derived from the carboxylic acid parent.'
  }
];
