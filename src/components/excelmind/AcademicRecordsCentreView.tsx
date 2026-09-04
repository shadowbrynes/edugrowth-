import React, { useState } from 'react';
import { CURRENT_STUDENT } from '../../data/excelmindData';
import { UserRole } from '../../types/excelmind';

interface AcademicRecordsCentreViewProps {
  currentRole?: UserRole;
}

export const AcademicRecordsCentreView: React.FC<AcademicRecordsCentreViewProps> = ({ currentRole = 'admin' }) => {
  const [activeTab, setActiveTab] = useState<'student_reg' | 'assignment_scores' | 'exam_results' | 'report_card' | 'analytics'>('student_reg');

  // ==========================================
  // 1. ADD NEW STUDENT FORM STATE
  // ==========================================
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('2009-04-12');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const [phone, setPhone] = useState('+2348012345678');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('15 Admiralty Way, Lekki Phase 1, Lagos');

  const [admissionNo, setAdmissionNo] = useState(`EXM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [schoolName] = useState('ExcelMind International College');
  const [session, setSession] = useState('2026/2027');
  const [classLevel, setClassLevel] = useState('SS2 Science');
  const [department, setDepartment] = useState('Science');

  const [parentName, setParentName] = useState('Dr. Adeleke Adebayo');
  const [parentPhone, setParentPhone] = useState('+2348098765432');
  const [parentEmail, setParentEmail] = useState('adebayo.parent@excelmind.edu.ng');
  const [relationship, setRelationship] = useState('Father');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Password@123');

  const [registeredStudents, setRegisteredStudents] = useState([
    { id: 1, name: 'John Doe', admNo: 'EXM-2025-0842', class: 'SS3 Science', dept: 'Science', email: 'john.doe@excelmind.edu.ng', phone: '+2348044556677' },
    { id: 2, name: 'Mary James', admNo: 'EXM-2025-0843', class: 'SS3 Science', dept: 'Science', email: 'mary.james@excelmind.edu.ng', phone: '+2348055667788' },
    { id: 3, name: 'Peter Smith', admNo: 'EXM-2025-0844', class: 'SS3 Science', dept: 'Science', email: 'peter.smith@excelmind.edu.ng', phone: '+2348066778899' },
    { id: 4, name: 'Chidinma Eze', admNo: 'EXM-2025-0845', class: 'SS2 Science', dept: 'Science', email: 'c.eze@excelmind.edu.ng', phone: '+2348077889900' }
  ]);
  const [regSuccessBanner, setRegSuccessBanner] = useState<string | null>(null);

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const newStudent = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      admNo: admissionNo,
      class: classLevel,
      dept: department,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@excelmind.edu.ng`,
      phone: phone
    };

    setRegisteredStudents([newStudent, ...registeredStudents]);
    setRegSuccessBanner(`✓ Student ${newStudent.name} registered successfully! Admission No: ${newStudent.admNo}. Credentials created for MySQL users table.`);
    setTimeout(() => setRegSuccessBanner(null), 5000);

    // Reset Form
    setFirstName('');
    setLastName('');
    setEmail('');
    setUsername('');
    setAdmissionNo(`EXM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  // ==========================================
  // 2. ASSIGNMENT SCORES STATE
  // ==========================================
  const [assignClass, setAssignClass] = useState('SS2 Science');
  const [assignSubject, setAssignSubject] = useState('Physics');
  const [assignName, setAssignName] = useState('Assignment 1: Uniformly Accelerated Motion');
  const [assignmentScores, setAssignmentScores] = useState([
    { id: 1, name: 'John Doe', score: 18, total: 20, comment: 'Excellent velocity-time derivations' },
    { id: 2, name: 'Mary James', score: 16, total: 20, comment: 'Good mathematical calculation' },
    { id: 3, name: 'Peter Smith', score: 20, total: 20, comment: 'Flawless step-by-step proofs' },
    { id: 4, name: 'Chidinma Eze', score: 17, total: 20, comment: 'Accurate SI units and equations' }
  ]);
  const [assignSavedNotice, setAssignSavedNotice] = useState<string | null>(null);

  const handleScoreChange = (id: number, val: number) => {
    setAssignmentScores(
      assignmentScores.map((s) => (s.id === id ? { ...s, score: Math.min(20, Math.max(0, val)) } : s))
    );
  };

  const handleCommentChange = (id: number, comment: string) => {
    setAssignmentScores(
      assignmentScores.map((s) => (s.id === id ? { ...s, comment } : s))
    );
  };

  const handleSaveAssignmentScores = () => {
    setAssignSavedNotice(`✓ Assignment continuous assessment scores successfully committed to MySQL assignment_submissions table!`);
    setTimeout(() => setAssignSavedNotice(null), 4000);
  };

  // ==========================================
  // 3. EXAMINATION RESULTS ENTRY STATE
  // ==========================================
  const [examSession, setExamSession] = useState('2026/2027');
  const [examTerm, setExamTerm] = useState('First Term');
  const [examClass, setExamClass] = useState('SS3 Science');
  const [examSubject, setExamSubject] = useState('Chemistry');

  const calculateGradeInfo = (total: number) => {
    if (total >= 90) return { grade: 'A1', remark: 'Excellent' };
    if (total >= 75) return { grade: 'B2', remark: 'Very Good' };
    if (total >= 60) return { grade: 'B3', remark: 'Good' };
    if (total >= 50) return { grade: 'C4', remark: 'Credit' };
    if (total >= 40) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
  };

  const [examScoresList, setExamScoresList] = useState([
    { id: 1, name: 'John Doe', ca: 25, exam: 65, comment: 'Consistently demonstrates superior cognitive mastery' },
    { id: 2, name: 'Mary James', ca: 20, exam: 60, comment: 'Strong performance on chemical equilibrium' },
    { id: 3, name: 'Peter Smith', ca: 15, exam: 55, comment: 'Fair understanding of periodic properties' },
    { id: 4, name: 'Chidinma Eze', ca: 28, exam: 64, comment: 'Superb laboratory acumen' }
  ]);
  const [examSavedNotice, setExamSavedNotice] = useState<string | null>(null);

  const handleCaChange = (id: number, val: number) => {
    setExamScoresList(
      examScoresList.map((s) => (s.id === id ? { ...s, ca: Math.min(30, Math.max(0, val)) } : s))
    );
  };

  const handleExamChange = (id: number, val: number) => {
    setExamScoresList(
      examScoresList.map((s) => (s.id === id ? { ...s, exam: Math.min(70, Math.max(0, val)) } : s))
    );
  };

  const handleSaveExamResults = () => {
    setExamSavedNotice(`✓ Final examination results and WAEC grades successfully committed to MySQL results table!`);
    setTimeout(() => setExamSavedNotice(null), 4000);
  };

  // ==========================================
  // 4. REPORT CARD DATA
  // ==========================================
  const [selectedStudentForReport, setSelectedStudentForReport] = useState('John Doe');

  const reportSubjects = [
    { name: 'General Mathematics', code: 'MTH 301', ca: 28, exam: 61, total: 89, grade: 'A1', pos: '1st', remark: 'Excellent' },
    { name: 'Physics', code: 'PHY 302', ca: 25, exam: 57, total: 82, grade: 'A1', pos: '2nd', remark: 'Excellent' },
    { name: 'Chemistry', code: 'CHM 303', ca: 22, exam: 53, total: 75, grade: 'B2', pos: '4th', remark: 'Very Good' },
    { name: 'English Language', code: 'ENG 304', ca: 24, exam: 52, total: 76, grade: 'B2', pos: '3rd', remark: 'Very Good' },
    { name: 'Biology', code: 'BIO 305', ca: 23, exam: 55, total: 78, grade: 'B2', pos: '3rd', remark: 'Very Good' },
    { name: 'Computer Studies', code: 'CSC 306', ca: 27, exam: 63, total: 90, grade: 'A1', pos: '1st', remark: 'Distinction' }
  ];

  const overallAvg = (reportSubjects.reduce((a, b) => a + b.total, 0) / reportSubjects.length).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-blue-300">
                <span className="material-symbols-outlined text-2xl">school</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Institutional Academic Control & MySQL Records Centre
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Academic Records Management Centre
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
              Register students, record Continuous Assessment (CA) assignment scores, enter examination results with automatic WAEC grading, and generate certified broadsheets.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-white uppercase">
              Database: excelmind_academic
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACADEMIC MANAGEMENT QUICK ACTIONS (LARGE INTERACTIVE CARDS)              */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
          Academic Management Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'student_reg', label: '+ Add New Student', icon: 'person_add', color: 'from-blue-600 to-indigo-700 text-white' },
            { id: 'assignment_scores', label: '📝 Assignment Scores', icon: 'edit_note', color: 'from-purple-600 to-indigo-700 text-white' },
            { id: 'exam_results', label: '📊 Enter Exam Results', icon: 'grade', color: 'from-emerald-600 to-teal-700 text-white' },
            { id: 'report_card', label: '📄 Generate Report Card', icon: 'description', color: 'from-amber-600 to-orange-700 text-white' },
            { id: 'analytics', label: '📈 Performance Analysis', icon: 'trending_up', color: 'from-rose-600 to-pink-700 text-white' }
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => setActiveTab(act.id as any)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 cursor-pointer shadow-sm ${
                activeTab === act.id
                  ? 'bg-gradient-to-br ' + act.color + ' border-transparent ring-2 ring-blue-500 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {act.icon}
              </span>
              <span className="text-xs font-black tracking-tight leading-snug">
                {act.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ADD NEW STUDENT REGISTRATION FORM                                  */}
      {/* ========================================================================= */}
      {activeTab === 'student_reg' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Student Registration & MySQL Credential Provisioning
            </h3>
            <p className="text-xs text-slate-500">
              Creates records across `users`, `students`, and `parent_student_relationship` tables in `excelmind_academic`.
            </p>
          </div>

          {regSuccessBanner && (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{regSuccessBanner}</span>
            </div>
          )}

          <form onSubmit={handleRegisterStudent} className="space-y-6 text-xs">
            
            {/* Section A: Student Information */}
            <div className="space-y-4">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono text-[11px]">
                1. Personal Student Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Oluwaseun"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Adeyemi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@excelmind.edu.ng"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Home Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>
            </div>

            {/* Section B: Academic Information */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono text-[11px]">
                2. Institutional & Academic Placement
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Academic Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Class Level</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="SS3 Science">SS3 Science</option>
                    <option value="SS2 Science">SS2 Science</option>
                    <option value="SS1 Science">SS1 Science</option>
                    <option value="SS3 Commercial">SS3 Commercial</option>
                    <option value="SS3 Arts">SS3 Arts</option>
                    <option value="JSS 1 Ruby">JSS 1 Ruby</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="Science">Science & Technology</option>
                    <option value="Commercial">Commercial & Accounting</option>
                    <option value="Arts">Arts & Humanities</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section C: Parent Information */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono text-[11px]">
                3. Parent / Guardian Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Parent Email</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section D: Login Credentials */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono text-[11px]">
                4. Student Portal Login Account
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Create Username</label>
                  <input
                    type="text"
                    value={username || (firstName ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}` : '')}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. john.doe"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Password</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-[#111B5E] hover:bg-blue-900 text-white font-black rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Submit & Create Student Record</span>
            </button>
          </form>

          {/* Directory of Registered Students */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase">
              Current Student Directory ({registeredStudents.length} Students Active)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class Level</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {registeredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">{st.admNo}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{st.name}</td>
                      <td className="py-3 px-3">{st.class}</td>
                      <td className="py-3 px-3">{st.dept}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{st.email}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ASSIGNMENT SCORES (CONTINUOUS ASSESSMENT)                          */}
      {/* ========================================================================= */}
      {activeTab === 'assignment_scores' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Continuous Assessment (CA) Assignment Score Entry
            </h3>
            <p className="text-xs text-slate-500">
              Select class, subject, and assignment task to record individual student marks directly into MySQL `assignment_submissions`.
            </p>
          </div>

          {assignSavedNotice && (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{assignSavedNotice}</span>
            </div>
          )}

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Class:</label>
              <select
                value={assignClass}
                onChange={(e) => setAssignClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="SS2 Science">SS2 Science</option>
                <option value="SS3 Science">SS3 Science</option>
                <option value="SS1 Commercial">SS1 Commercial</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Subject:</label>
              <select
                value={assignSubject}
                onChange={(e) => setAssignSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="Physics">Physics (PHY 302)</option>
                <option value="General Mathematics">General Mathematics (MTH 301)</option>
                <option value="Chemistry">Chemistry (CHM 303)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Assignment:</label>
              <select
                value={assignName}
                onChange={(e) => setAssignName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="Assignment 1: Uniformly Accelerated Motion">Assignment 1: Uniformly Accelerated Motion</option>
                <option value="Assignment 2: Projectile Trajectories">Assignment 2: Projectile Trajectories</option>
                <option value="Assignment 3: Faradays Induction">Assignment 3: Faradays Induction</option>
              </select>
            </div>
          </div>

          {/* Student Scores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Score (out of 20)</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Teacher Comment & Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignmentScores.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {st.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={st.score}
                          onChange={(e) => handleScoreChange(st.id, Number(e.target.value))}
                          className="w-16 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-blue-600 text-center"
                        />
                        <span className="text-slate-400 font-mono">/ 20</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {Math.round((st.score / st.total) * 100)}%
                    </td>
                    <td className="py-3.5 px-3">
                      <input
                        type="text"
                        value={st.comment}
                        onChange={(e) => handleCommentChange(st.id, e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSaveAssignmentScores}
            className="px-6 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white font-black rounded-xl shadow transition cursor-pointer flex items-center gap-2 text-xs"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>Save Assignment Scores to Database</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ENTER EXAMINATION RESULTS (WITH AUTOMATIC CALCULATION & GRADING)   */}
      {/* ========================================================================= */}
      {activeTab === 'exam_results' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Terminal Examination & WAEC Standard Result Entry
            </h3>
            <p className="text-xs text-slate-500">
              Live automated formula: <span className="font-bold text-blue-600">Total Score = Continuous Assessment (CA 30) + Examination Score (70)</span>. Automatically assigns WAEC Grade (A1 to F9).
            </p>
          </div>

          {examSavedNotice && (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{examSavedNotice}</span>
            </div>
          )}

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Academic Session:</label>
              <select
                value={examSession}
                onChange={(e) => setExamSession(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2025/2026">2025/2026</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Term:</label>
              <select
                value={examTerm}
                onChange={(e) => setExamTerm(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Class Level:</label>
              <select
                value={examClass}
                onChange={(e) => setExamClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="SS3 Science">SS3 Science</option>
                <option value="SS2 Science">SS2 Science</option>
                <option value="SS1 Commercial">SS1 Commercial</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject:</label>
              <select
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="Chemistry">Chemistry (CHM 303)</option>
                <option value="Physics">Physics (PHY 302)</option>
                <option value="General Mathematics">General Mathematics (MTH 301)</option>
              </select>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">CA (out of 30)</th>
                  <th className="py-3 px-3">Exam (out of 70)</th>
                  <th className="py-3 px-3">Total (100%)</th>
                  <th className="py-3 px-3">WAEC Grade</th>
                  <th className="py-3 px-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examScoresList.map((st) => {
                  const total = st.ca + st.exam;
                  const gradeInfo = calculateGradeInfo(total);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {st.name}
                      </td>
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={st.ca}
                          onChange={(e) => handleCaChange(st.id, Number(e.target.value))}
                          className="w-14 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-center"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min={0}
                          max={70}
                          value={st.exam}
                          onChange={(e) => handleExamChange(st.id, Number(e.target.value))}
                          className="w-14 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-center"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                        {total}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-mono font-black text-xs ${
                          gradeInfo.grade.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : gradeInfo.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : gradeInfo.grade.startsWith('C')
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 font-semibold">
                        {gradeInfo.remark}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSaveExamResults}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow transition cursor-pointer flex items-center gap-2 text-xs"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Commit & Publish Results to MySQL</span>
            </button>

            <span className="text-[11px] font-mono text-slate-400 font-bold">
              Grading Scheme: 90-100 A1 • 75-89 B2 • 60-74 B3 • 50-59 C4 • 40-49 D • 0-39 F
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GENERATE REPORT CARD                                               */}
      {/* ========================================================================= */}
      {activeTab === 'report_card' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Official Student Academic Broadsheet & Report Card
              </h3>
              <p className="text-xs text-slate-500">
                Terminal certificate of educational achievement and character assessment.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print</span>
              </button>

              <button
                onClick={() => alert('Downloading official encrypted PDF Report Card...')}
                className="px-4 py-2 rounded-xl bg-[#111B5E] hover:bg-blue-900 text-white font-black text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Report Card Container */}
          <div className="p-6 sm:p-8 border-2 border-indigo-900/40 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 space-y-6">
            
            {/* School Crest & Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-indigo-900/30">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111B5E] text-white flex items-center justify-center font-black text-2xl shadow">
                🎓
              </div>
              <h2 className="text-xl font-black text-[#111B5E] dark:text-blue-300 tracking-tight uppercase">
                ExcelMind International College
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Plot 14 Victoria Island, Lagos, Nigeria • info@excelmind.edu.ng • +234 801 122 3344
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[10px] font-mono font-bold uppercase mt-1">
                Official Continuous Assessment & Examination Broadsheet • 2025/2026 First Term
              </span>
            </div>

            {/* Student Biodata Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Student Name</span>
                <span className="font-black text-slate-900 dark:text-slate-100">{CURRENT_STUDENT.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Admission Number</span>
                <span className="font-mono text-blue-600 font-bold">{CURRENT_STUDENT.student_id}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Class & Arm</span>
                <span>{CURRENT_STUDENT.class}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Department</span>
                <span>{CURRENT_STUDENT.department}</span>
              </div>
            </div>

            {/* Subject Scores Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-indigo-900 text-white font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3 text-center">CA (30)</th>
                    <th className="py-2.5 px-3 text-center">Exam (70)</th>
                    <th className="py-2.5 px-3 text-center">Total (100)</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Position</th>
                    <th className="py-2.5 px-3">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                  {reportSubjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold">{sub.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{sub.code}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{sub.ca}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{sub.exam}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-blue-600">{sub.total}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-black">{sub.grade}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{sub.pos}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{sub.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center">
                <span className="text-[10px] font-mono text-blue-600 block uppercase font-bold">Overall Average</span>
                <span className="text-2xl font-black text-blue-900 dark:text-blue-200 font-mono">{overallAvg}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
                <span className="text-[10px] font-mono text-emerald-600 block uppercase font-bold">Class Position</span>
                <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200 font-mono">3rd of 42</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-center">
                <span className="text-[10px] font-mono text-purple-600 block uppercase font-bold">Certified Attendance</span>
                <span className="text-2xl font-black text-purple-900 dark:text-purple-200 font-mono">94%</span>
              </div>
            </div>

            {/* Teacher and Principal Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Form Teacher's Comment</span>
                <p className="italic text-slate-700 dark:text-slate-300">
                  "Exemplary dedication, intellectual curiosity, and superb mathematical logic. Highly recommended."
                </p>
                <span className="text-[10px] font-mono font-bold text-blue-600 block pt-1">
                  Dr. Kenneth Okon (Signed)
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Principal's Decision</span>
                <p className="italic text-slate-700 dark:text-slate-300">
                  "Promoted with distinction. On track for straight A1s in the upcoming national WAEC examination."
                </p>
                <span className="text-[10px] font-mono font-bold text-emerald-600 block pt-1">
                  Mrs. Folashade Adeleke, M.Ed (Certified Seal)
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STUDENT PERFORMANCE ANALYTICS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Student Performance Analytics & Diagnostic Signals
              </h3>
              <p className="text-xs text-slate-500">Student: John Doe • Class: SS3 Science • Target: WAEC / JAMB</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Grade Trend: +8% Growth
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Subject Mastery Bars */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase">
                Subject Mastery Scores
              </h4>
              {[
                { sub: 'General Mathematics', score: 85, color: 'bg-emerald-500' },
                { sub: 'Biology', score: 90, color: 'bg-emerald-600' },
                { sub: 'Physics', score: 70, color: 'bg-blue-500' },
                { sub: 'Chemistry', score: 65, color: 'bg-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{item.sub}</span>
                    <span className="font-mono">{item.score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths, Weaknesses & AI Recommendations */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1">
                <span className="font-black text-emerald-900 dark:text-emerald-200 uppercase font-mono text-[10px]">
                  🌟 Core Strength Subjects:
                </span>
                <p className="text-emerald-800 dark:text-emerald-300">
                  Biology (90%) and Mathematics (85%). Exceptional problem-solving speed and proof accuracy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1">
                <span className="font-black text-amber-900 dark:text-amber-200 uppercase font-mono text-[10px]">
                  ⚠️ Needs Reinforcement:
                </span>
                <p className="text-amber-800 dark:text-amber-300">
                  Chemistry (65%) on chemical bonding & stoichiometry calculations.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-1">
                <span className="font-black text-indigo-900 dark:text-indigo-200 uppercase font-mono text-[10px]">
                  🤖 AI Learning Coach Recommendation:
                </span>
                <p className="text-indigo-800 dark:text-indigo-300">
                  Allocate 30 minutes daily to Chemistry worked examples in Learning Hub to bring aggregate to straight A1s.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AcademicRecordsCentreView;
