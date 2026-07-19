import React, { useState, useEffect } from 'react';
import { Student, CriticalAlert, SystemActivity, ViewMode, SchoolProfile } from '../types';
import { ASSETS } from '../data/mockData';
import { CriticalAlertsModal } from './modals/CriticalAlertsModal';
import { AuditTrailModal } from './modals/AuditTrailModal';
import { NewRecordModal } from './modals/NewRecordModal';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { jsPDF } from 'jspdf';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import { InstitutionTypeSwitcher } from './InstitutionTypeSwitcher';
import { SchoolProfileSection } from './SchoolProfileSection';
import { AdminSettingsSection } from './AdminSettingsSection';

interface AdminDashboardProps {
  students: Student[];
  alerts: CriticalAlert[];
  activities: SystemActivity[];
  transcriptAccesses?: any[];
  onAddActivity: (act: SystemActivity) => void;
  onResolveAlert: (id: string) => void;
  onAddRecord: (type: string, name: string, detail: string) => void;
  onNavigate: (view: ViewMode, studentId?: string) => void;
  institutionType?: 'Schools' | 'HigherEd';
  onInstitutionTypeChange?: (type: 'Schools' | 'HigherEd') => void;
  selectedSession?: string;
  onSessionChange?: (session: string) => void;
  schoolProfile?: SchoolProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  alerts,
  activities,
  transcriptAccesses = [],
  onAddActivity,
  onResolveAlert,
  onAddRecord,
  onNavigate,
  institutionType = 'Schools',
  onInstitutionTypeChange,
  selectedSession = '2023/2024 Fall',
  onSessionChange,
  schoolProfile,
}) => {
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'staff' | 'audit' | 'records' | 'logs' | 'settings' | 'profile'>('dashboard');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayTooltip, setSelectedDayTooltip] = useState<string | null>(null);
  const [gpaGradeFilter, setGpaGradeFilter] = useState<'all' | '10' | '11' | '12'>('all');
  const [highlightDips, setHighlightDips] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(true);

  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUpdateError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() });
      });
      setUsers(list);
    } catch (err: any) {
      console.error("Failed to fetch registered users:", err);
      setUpdateError("Failed to load user directory. Ensure you have Admin privileges.");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'staff') {
      fetchUsers();
    }
  }, [activeTab]);

  // --- Schools SaaS States ---
  const [schoolApplicants, setSchoolApplicants] = useState([
    { id: '1', name: 'Sophia Miller', grade: 'Grade 10', parentName: 'Robert Miller', status: 'Pending', date: '2026-07-10' },
    { id: '2', name: 'Liam Johnson', grade: 'Grade 11', parentName: 'Mary Johnson', status: 'Approved', date: '2026-07-09' },
    { id: '3', name: 'Olivia Williams', grade: 'Grade 12', parentName: 'Susan Williams', status: 'Interview Scheduled', date: '2026-07-08' },
    { id: '4', name: 'Noah Davis', grade: 'Grade 10', parentName: 'David Davis', status: 'Pending', date: '2026-07-07' }
  ]);
  const [newApplicant, setNewApplicant] = useState({ name: '', grade: 'Grade 10', parentName: '', status: 'Pending' });

  const [timetableClass, setTimetableClass] = useState('Grade 10-A');
  const [timetableData, setTimetableData] = useState<Record<string, Array<{ period: string, subject: string, teacher: string }>>>({
    'Grade 10-A': [
      { period: 'Period 1 (8:00 AM)', subject: 'Mathematics', teacher: 'Dr. Linda Ross' },
      { period: 'Period 2 (9:30 AM)', subject: 'Chemistry', teacher: 'Prof. James Green' },
      { period: 'Period 3 (11:00 AM)', subject: 'English Lit', teacher: 'Sarah Jenkins' },
      { period: 'Period 4 (1:00 PM)', subject: 'World History', teacher: 'Robert Vance' },
      { period: 'Period 5 (2:30 PM)', subject: 'Physical Ed', teacher: 'Coach Marcus' }
    ],
    'Grade 11-B': [
      { period: 'Period 1 (8:00 AM)', subject: 'Biology', teacher: 'Sarah Jenkins' },
      { period: 'Period 2 (9:30 AM)', subject: 'Algebra II', teacher: 'Dr. Linda Ross' },
      { period: 'Period 3 (11:00 AM)', subject: 'Physics', teacher: 'Prof. James Green' },
      { period: 'Period 4 (1:00 PM)', subject: 'Economics', teacher: 'Robert Vance' },
      { period: 'Period 5 (2:30 PM)', subject: 'Computer Lab', teacher: 'Elena Rostova' }
    ],
    'Grade 12-A': [
      { period: 'Period 1 (8:00 AM)', subject: 'Calculus', teacher: 'Dr. Linda Ross' },
      { period: 'Period 2 (9:30 AM)', subject: 'English Lit', teacher: 'Sarah Jenkins' },
      { period: 'Period 3 (11:00 AM)', subject: 'Physics II', teacher: 'Prof. James Green' },
      { period: 'Period 4 (1:00 PM)', subject: 'Creative Writing', teacher: 'Robert Vance' },
      { period: 'Period 5 (2:30 PM)', subject: 'Civic Studies', teacher: 'Coach Marcus' }
    ]
  });

  const [assessmentClass, setAssessmentClass] = useState('Grade 10');
  const [assessmentSubject, setAssessmentSubject] = useState('Mathematics');
  const [assessmentStudents, setAssessmentStudents] = useState([
    { id: '101', name: 'Alexander Carter', ca1: 18, ca2: 17, exam: 54, total: 89, grade: 'A' },
    { id: '102', name: 'Emily Thorne', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B' },
    { id: '103', name: 'Marcus Sterling', ca1: 12, ca2: 11, exam: 35, total: 58, grade: 'C' },
    { id: '104', name: 'Elena Rostova', ca1: 19, ca2: 20, exam: 58, total: 97, grade: 'A' }
  ]);

  const [schoolFeesList, setSchoolFeesList] = useState([
    { id: '1', name: 'Alexander Carter', grade: 'Grade 10', termFee: 1200, paidAmount: 1200, status: 'Paid' },
    { id: '2', name: 'Emily Thorne', grade: 'Grade 11', termFee: 1200, paidAmount: 800, status: 'Partial' },
    { id: '3', name: 'Marcus Sterling', grade: 'Grade 10', termFee: 1200, paidAmount: 0, status: 'Unpaid' },
    { id: '4', name: 'Elena Rostova', grade: 'Grade 12', termFee: 1200, paidAmount: 1200, status: 'Paid' }
  ]);
  const [recordPaymentData, setRecordPaymentData] = useState({ studentId: '2', amount: 400 });

  const [staffPayrollList, setStaffPayrollList] = useState([
    { id: '1', name: 'Dr. Linda Ross', role: 'Mathematics Lead', salary: 4500, status: 'Paid' },
    { id: '2', name: 'Prof. James Green', role: 'Science Dean', salary: 4800, status: 'Paid' },
    { id: '3', name: 'Sarah Jenkins', role: 'English Teacher', salary: 3800, status: 'Pending' },
    { id: '4', name: 'Robert Vance', role: 'History Instructor', salary: 3700, status: 'Pending' }
  ]);

  // --- Higher Ed SaaS States ---
  const [facultiesList, setFacultiesList] = useState([
    { id: 'f1', name: 'Faculty of Engineering', dean: 'Prof. William Vance', programmes: 4, departments: ['Civil', 'Mechanical', 'Electrical', 'Computer'] },
    { id: 'f2', name: 'Faculty of Science', dean: 'Dr. Linda Ross', programmes: 5, departments: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'] },
    { id: 'f3', name: 'Faculty of Art & Humanities', dean: 'Prof. Evelyn C.', programmes: 3, departments: ['English Literature', 'History', 'Philosophy'] }
  ]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>('f1');
  const [targetFacultyId, setTargetFacultyId] = useState('f1');
  const [newDeptName, setNewDeptName] = useState('');

  const [courseRegList, setCourseRegList] = useState([
    { studentId: 'alexander', name: 'Alexander Carter', dept: 'Computer Science', courses: ['CSC 301', 'CSC 303', 'MTH 311', 'PHY 301'], credits: 16, maxCredits: 24, status: 'Pending Approval' },
    { studentId: 'emily', name: 'Emily Thorne', dept: 'Electrical Engineering', courses: ['EEE 311', 'EEE 313', 'MTH 311', 'CSC 301'], credits: 18, maxCredits: 24, status: 'Approved' },
    { studentId: 'marcus', name: 'Marcus Sterling', dept: 'History', courses: ['HIS 301', 'HIS 305', 'ENG 302'], credits: 12, maxCredits: 24, status: 'Approved' }
  ]);

  const [cgpaRegistry, setCgpaRegistry] = useState([
    { studentId: 'alexander', name: 'Alexander Carter', dept: 'Computer Science', level: '300 Level', cgpa: 3.91, status: 'First Class', carryOvers: [] as string[] },
    { studentId: 'emily', name: 'Emily Thorne', dept: 'Electrical Engineering', level: '300 Level', cgpa: 3.65, status: 'Second Class Upper', carryOvers: [] as string[] },
    { studentId: 'marcus', name: 'Marcus Sterling', dept: 'History', level: '200 Level', cgpa: 2.15, status: 'Third Class', carryOvers: ['HIS 102'] },
    { studentId: 'elena', name: 'Elena Rostova', dept: 'Computer Science', level: '400 Level', cgpa: 3.98, status: 'First Class', carryOvers: [] as string[] }
  ]);

  const [graduationClearanceList, setGraduationClearanceList] = useState([
    { id: '1', name: 'Alexander Carter', dept: 'Computer Science', library: true, bursary: true, sports: true, faculty: true, hostels: true, overallStatus: 'Cleared' },
    { id: '2', name: 'Emily Thorne', dept: 'Electrical Engineering', library: true, bursary: false, sports: true, faculty: true, hostels: true, overallStatus: 'Pending Bursary' },
    { id: '3', name: 'Elena Rostova', dept: 'Computer Science', library: true, bursary: true, sports: true, faculty: true, hostels: true, overallStatus: 'Cleared' }
  ]);

  const handleUpdateRole = async (userId: string, newRole: string, userEmail: string) => {
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      // Update local state
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: newRole } : u));
      setUpdateSuccess(`Successfully updated role for ${userEmail} to ${newRole}.`);
      
      // Auto-clear success message after 4s
      setTimeout(() => setUpdateSuccess(null), 4000);
    } catch (err: any) {
      console.error("Failed to update user role:", err);
      setUpdateError(`Failed to update role: ${err.message || "Permission denied."}`);
    }
  };

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const drawWatermark = (pdfDoc: any) => {
      if (schoolProfile?.logoUrl) {
        try {
          pdfDoc.saveGraphicsState();
          pdfDoc.setGState(new pdfDoc.GState({ opacity: 0.04 }));
          const size = 90;
          const x = (210 - size) / 2;
          const y = (297 - size) / 2;
          pdfDoc.addImage(schoolProfile.logoUrl, 'JPEG', x, y, size, size);
          pdfDoc.restoreGraphicsState();
        } catch (e) {
          console.error("Watermark render failed:", e);
        }
      }
    };
    
    // Draw watermark on first page
    drawWatermark(doc);
    
    // Header styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // deep slate (#1e293b)
    doc.text("EduManage Academic Report", 14, 20);
    
    // Metadata/Timestamp info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // cool slate (#64748b)
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    doc.text(`Generated on: ${timestamp} (PST)`, 14, 27);
    
    if (searchQuery) {
      doc.text(`Active Search Filter: "${searchQuery}"`, 14, 32);
    } else {
      doc.text("Active Search Filter: None (Full Student Roster)", 14, 32);
    }
    
    // Header Separator Line
    doc.setDrawColor(226, 232, 240); // outline-variant color (#e2e8f0)
    doc.setLineWidth(0.5);
    doc.line(14, 36, 196, 36);
    
    // Summary KPI Container Cards
    doc.setFillColor(248, 250, 252); // light surface container (#f8fafc)
    doc.roundedRect(14, 40, 182, 22, 3, 3, "F");
    
    // Calculating stats for the filtered list
    const totalCount = filteredStudents.length;
    const avgGpa = totalCount > 0
      ? (filteredStudents.reduce((acc, curr) => acc + curr.gpa, 0) / totalCount).toFixed(2)
      : "0.00";
    const avgAttendance = totalCount > 0
      ? (filteredStudents.reduce((acc, curr) => acc + curr.attendance, 0) / totalCount).toFixed(1)
      : "0.0";
      
    // KPI labels
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("TOTAL ENROLLED STUDENTS", 22, 48);
    doc.text("AVERAGE GPA SCORE", 82, 48);
    doc.text("AVERAGE ATTENDANCE RATE", 142, 48);
    
    // KPI values
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // deep slate
    doc.text(`${totalCount}`, 22, 56);
    doc.text(`${avgGpa}`, 82, 56);
    doc.text(`${avgAttendance}%`, 142, 56);
    
    // Table Header
    const tableTop = 72;
    doc.setFillColor(30, 41, 59); // deep header
    doc.rect(14, tableTop, 182, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("ID", 18, tableTop + 5.5);
    doc.text("Student Name", 40, tableTop + 5.5);
    doc.text("Grade Level", 95, tableTop + 5.5);
    doc.text("GPA", 135, tableTop + 5.5);
    doc.text("Academic Status", 155, tableTop + 5.5);
    
    // Table Body rows
    let currentY = tableTop + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // text-slate-700
    
    if (filteredStudents.length === 0) {
      doc.setFillColor(255, 255, 255);
      doc.rect(14, currentY, 182, 20, "F");
      
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(14, currentY + 20, 196, currentY + 20);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("No student records matched the specified query.", 65, currentY + 11);
    } else {
      filteredStudents.forEach((st, index) => {
        // Alternate row colors for clean readability
        if (index % 2 === 0) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(248, 250, 252);
        }
        doc.rect(14, currentY, 182, 8, "F");
        
        // Horizontal row separator line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.2);
        doc.line(14, currentY + 8, 196, currentY + 8);
        
        // Draw Row Data
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(st.id, 18, currentY + 5.5);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        doc.text(st.name, 40, currentY + 5.5);
        doc.text(st.gradeLevel, 95, currentY + 5.5);
        doc.text(st.gpa.toFixed(2), 135, currentY + 5.5);
        
        // Custom text colors based on the status
        if (st.status === 'High Honor') {
          doc.setTextColor(5, 150, 105); // emerald green
        } else if (st.status === 'Honor Roll') {
          doc.setTextColor(37, 99, 235); // royal blue
        } else if (st.status === 'Academic Probation') {
          doc.setTextColor(220, 38, 38); // vivid red
        } else {
          doc.setTextColor(100, 116, 139); // neutral slate
        }
        doc.text(st.status, 155, currentY + 5.5);
        
        currentY += 8;
        
        // Multi-page layout support if table rows exceed A4 bounds
        if (currentY > 270 && index < filteredStudents.length - 1) {
          doc.addPage();
          drawWatermark(doc);
          currentY = 20;
          
          // Re-draw Table Header on the fresh page
          doc.setFillColor(30, 41, 59);
          doc.rect(14, currentY, 182, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.text("ID", 18, currentY + 5.5);
          doc.text("Student Name", 40, currentY + 5.5);
          doc.text("Grade Level", 95, currentY + 5.5);
          doc.text("GPA", 135, currentY + 5.5);
          doc.text("Academic Status", 155, currentY + 5.5);
          
          currentY += 8;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
        }
      });
    }
    
    // Add page numbers and confidentiality footer on every page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Page ${i} of ${pageCount}`, 14, 287);
      doc.text("EduManage Academic Systems • Confidential Document", 115, 287);
    }
    
    // Save report file
    doc.save(`Student_Academic_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    
    // Generate an Activity entry in Admin Log
    onAddActivity({
      id: `act-${Date.now()}`,
      type: 'upload',
      user: 'Admin User',
      action: 'Generated PDF Academic Report',
      target: searchQuery ? `Filtered: "${searchQuery}"` : 'All Students list',
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'picture_as_pdf',
      colorClass: 'bg-secondary/15 text-secondary'
    });
  };

  const exportToCSV = () => {
    // CSV Header row
    const headers = ['Student ID', 'Full Name', 'Grade Level', 'GPA', 'Rank', 'Attendance Rate', 'Academic Status'];
    
    // Create rows with clean escaping
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.gradeLevel.replace(/"/g, '""')}"`,
      s.gpa.toFixed(2),
      s.rank,
      `${s.attendance}%`,
      `"${s.status.replace(/"/g, '""')}"`
    ]);
    
    // Join headers and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EduManage_Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Generate an Activity entry in Admin Log for tracking
    onAddActivity({
      id: `act-${Date.now()}`,
      type: 'upload',
      user: 'Admin User',
      action: 'Exported Students to CSV',
      target: searchQuery ? `Filtered: "${searchQuery}" (${filteredStudents.length} entries)` : `All Students (${filteredStudents.length} entries)`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'table_view',
      colorClass: 'bg-primary/15 text-primary'
    });
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute average student GPA based on selected grade filter
  const filteredStudentsForGpa = students.filter(st => {
    if (gpaGradeFilter === 'all') return true;
    return st.gradeLevel.toLowerCase().includes(`grade ${gpaGradeFilter}`);
  });

  const currentAvgGpa = filteredStudentsForGpa.length > 0
    ? Number((filteredStudentsForGpa.reduce((acc, curr) => acc + curr.gpa, 0) / filteredStudentsForGpa.length).toFixed(2))
    : 3.65;

  // School-wide academic summary insights
  const schoolWideAvgGpa = students.length > 0
    ? (students.reduce((acc, curr) => acc + curr.gpa, 0) / students.length).toFixed(2)
    : "3.91";

  const honorRollCount = students.filter(s => s.status === 'Honor Roll' || s.status === 'High Honor').length;

  const currentYear = new Date().getFullYear();
  const currentAcademicYearDash = `${currentYear - 1}-${currentYear}`;
  const currentMonthYearName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const baseOffset = gpaGradeFilter === '10' ? 0.05 : gpaGradeFilter === '11' ? -0.05 : gpaGradeFilter === '12' ? 0.12 : 0;
  const gpaTrendData = [
    { month: 'Feb', gpa: Number((3.48 + baseOffset).toFixed(2)) },
    { month: 'Mar', gpa: Number((3.52 + baseOffset).toFixed(2)) },
    { month: 'Apr', gpa: Number((3.55 + baseOffset).toFixed(2)) },
    { month: 'May', gpa: Number((3.58 + baseOffset).toFixed(2)) },
    { month: 'Jun', gpa: Number((3.61 + baseOffset).toFixed(2)) },
    { month: 'Jul (Current)', gpa: currentAvgGpa }
  ];

  const monthlyAttendanceData = [
    { day: 'Jul 1', attendance: 94.2, label: 'Jul 1 (Wed)' },
    { day: 'Jul 2', attendance: 94.5, label: 'Jul 2 (Thu)' },
    { day: 'Jul 3', attendance: 89.8, label: 'Jul 3 (Fri) - Early Dismissal' },
    { day: 'Jul 6', attendance: 91.5, label: 'Jul 6 (Mon) - Monday Dip' },
    { day: 'Jul 7', attendance: 93.8, label: 'Jul 7 (Tue)' },
    { day: 'Jul 8', attendance: 94.2, label: 'Jul 8 (Wed)' },
    { day: 'Jul 9', attendance: 94.6, label: 'Jul 9 (Thu)' },
    { day: 'Jul 10', attendance: 88.5, label: 'Jul 10 (Fri) - Friday Dip' },
    { day: 'Jul 13', attendance: 92.1, label: 'Jul 13 (Mon) - Monday Dip' },
    { day: 'Jul 14', attendance: 94.0, label: 'Jul 14 (Tue)' },
    { day: 'Jul 15', attendance: 94.3, label: 'Jul 15 (Wed)' },
    { day: 'Jul 16', attendance: 94.9, label: 'Jul 16 (Thu)' },
    { day: 'Jul 17', attendance: 89.1, label: 'Jul 17 (Fri) - Friday Dip' },
    { day: 'Jul 20', attendance: 92.4, label: 'Jul 20 (Mon) - Monday Dip' },
    { day: 'Jul 21', attendance: 94.1, label: 'Jul 21 (Tue)' },
    { day: 'Jul 22', attendance: 94.5, label: 'Jul 22 (Wed)' },
    { day: 'Jul 23', attendance: 94.8, label: 'Jul 23 (Thu)' },
    { day: 'Jul 24', attendance: 88.2, label: 'Jul 24 (Fri) - Friday Dip' },
    { day: 'Jul 27', attendance: 92.7, label: 'Jul 27 (Mon) - Monday Dip' },
    { day: 'Jul 28', attendance: 94.4, label: 'Jul 28 (Tue)' },
    { day: 'Jul 29', attendance: 94.7, label: 'Jul 29 (Wed)' },
    { day: 'Jul 30', attendance: 95.2, label: 'Jul 30 (Thu)' },
    { day: 'Jul 31', attendance: 89.6, label: 'Jul 31 (Fri) - Friday Dip' },
  ];

  // --- Schools SaaS Action Handlers ---
  const handleApplicantStatus = (id: string, newStatus: string) => {
    setSchoolApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    // Log activity
    onAddActivity({
      id: `act-${Date.now()}`,
      type: 'status_change',
      user: 'Admin User',
      action: `Updated Admission status for ${schoolApplicants.find(a => a.id === id)?.name}`,
      target: `New Status: ${newStatus}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'gavel',
      colorClass: 'bg-amber-500/10 text-amber-500'
    });
  };

  const handleAddApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicant.name || !newApplicant.parentName) return;
    const app = {
      id: String(schoolApplicants.length + 1),
      name: newApplicant.name,
      grade: newApplicant.grade,
      parentName: newApplicant.parentName,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setSchoolApplicants([app, ...schoolApplicants]);
    setNewApplicant({ name: '', grade: 'Grade 10', parentName: '', status: 'Pending' });

    // Log activity
    onAddActivity({
      id: `act-${Date.now()}`,
      type: 'add',
      user: 'Admin User',
      action: `Created Student Admission record for ${app.name}`,
      target: app.grade,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'child_care',
      colorClass: 'bg-green-500/10 text-green-500'
    });
  };

  const handleUpdateTimetablePeriod = (dayClass: string, index: number, field: 'subject' | 'teacher', val: string) => {
    setTimetableData(prev => {
      const copy = { ...prev };
      const periods = [...copy[dayClass]];
      periods[index] = { ...periods[index], [field]: val };
      copy[dayClass] = periods;
      return copy;
    });
  };

  const handleUpdateScore = (studentId: string, field: 'ca1' | 'ca2' | 'exam', val: number) => {
    setAssessmentStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const ca1 = field === 'ca1' ? val : s.ca1;
        const ca2 = field === 'ca2' ? val : s.ca2;
        const exam = field === 'exam' ? val : s.exam;
        const total = ca1 + ca2 + exam;
        let grade = 'F';
        if (total >= 85) grade = 'A';
        else if (total >= 70) grade = 'B';
        else if (total >= 50) grade = 'C';
        return { ...s, ca1, ca2, exam, total, grade };
      }
      return s;
    }));
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(recordPaymentData.amount);
    setSchoolFeesList(prev => prev.map(f => {
      if (f.id === recordPaymentData.studentId) {
        const newPaid = Math.min(f.termFee, f.paidAmount + amt);
        const status = newPaid >= f.termFee ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';
        return { ...f, paidAmount: newPaid, status };
      }
      return f;
    }));

    // Log activity
    onAddActivity({
      id: `act-${Date.now()}`,
      type: 'financial',
      user: 'Admin User',
      action: `Recorded fees payment for ${schoolFeesList.find(f => f.id === recordPaymentData.studentId)?.name}`,
      target: `$${amt} received`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'payments',
      colorClass: 'bg-emerald-500/10 text-emerald-500'
    });
    alert("Payment successfully processed and digital receipt generated.");
  };

  const handleDisburseSalary = (id: string) => {
    setStaffPayrollList(prev => prev.map(s => s.id === id ? { ...s, status: 'Paid' } : s));
    alert("Salary disbursement initiated via secure automated clearing house.");
  };

  // --- Higher Ed SaaS Action Handlers ---
  const handleAddFaculty = () => {
    const name = prompt("Enter Faculty Name:");
    if (!name) return;
    const dean = prompt("Enter Dean Name:");
    if (!name) return;
    const f = {
      id: 'f' + (facultiesList.length + 1),
      name,
      dean: dean || 'TBD',
      programmes: 1,
      departments: ['General Studies']
    };
    setFacultiesList([...facultiesList, f]);
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    setFacultiesList(prev => prev.map(f => {
      if (f.id === targetFacultyId) {
        return {
          ...f,
          departments: [...f.departments, newDeptName.trim()],
          programmes: f.programmes + 1
        };
      }
      return f;
    }));

    const facName = facultiesList.find(f => f.id === targetFacultyId)?.name || 'Faculty';
    onAddActivity({
      id: `act-${Date.now()}`,
      type: 'add',
      user: 'Admin User',
      action: `Added Department/Program "${newDeptName.trim()}"`,
      target: facName,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'school',
      colorClass: 'bg-green-500/10 text-green-500'
    });

    setNewDeptName('');
    alert(`Successfully added department/program "${newDeptName.trim()}" to ${facName}.`);
  };

  const handleCourseRegApproval = (studentId: string, status: string) => {
    setCourseRegList(prev => prev.map(c => c.studentId === studentId ? { ...c, status } : c));
  };

  const handleToggleClearance = (id: string, field: 'library' | 'bursary' | 'sports' | 'faculty' | 'hostels') => {
    setGraduationClearanceList(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: !item[field] };
        const isCleared = updated.library && updated.bursary && updated.sports && updated.faculty && updated.hostels;
        updated.overallStatus = isCleared ? 'Cleared' : 'Pending Review';
        return updated;
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* TopAppBar */}
      <header className="fixed top-10 left-0 right-0 z-40 flex justify-between items-center w-full px-4 md:px-8 py-3 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-container flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight">EduManage</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant/60 focus-within:border-secondary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-base mr-2">search</span>
            <input
              type="text"
              placeholder="Search students or records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs w-44 md:w-60 text-on-surface"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAlertsModalOpen(true)}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-secondary relative"
            title="View Critical Alerts"
          >
            <span className="material-symbols-outlined">notifications</span>
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface animate-pulse"></span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="text-right">
              <p className="text-xs font-semibold text-on-surface">Admin User</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono">Institutional Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant shadow-sm ring-2 ring-secondary/20">
              <img
                src={ASSETS.adminHeaderAvatar}
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-10 w-[280px] bg-surface-container border-r border-outline-variant z-30 pt-20 shadow-sm overflow-y-auto">
        <div className="px-6 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md ring-2 ring-secondary/20">
              <img
                src={ASSETS.adminSidebarAvatar}
                alt="Admin User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Admin User</h3>
              <p className="text-[11px] font-mono text-on-surface-variant uppercase">v2.4.0 • Enterprise</p>
            </div>
          </div>
          
          {/* Global SaaS Switcher widget */}
          <InstitutionTypeSwitcher
            institutionType={institutionType}
            onChange={onInstitutionTypeChange || (() => {})}
          />
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-2 pb-12">
          <div className="px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Core Console</div>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'dashboard' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-lg" style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'staff' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-lg" style={activeTab === 'staff' ? { fontVariationSettings: "'FILL' 1" } : {}}>badge</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Staff & User Roles</span>
            <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-white">{users.length || '85'}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'audit' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-lg" style={activeTab === 'audit' ? { fontVariationSettings: "'FILL' 1" } : {}}>shield</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Security Audit</span>
            <span className="ml-auto text-[10px] bg-[#ff3e00] text-white px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">{transcriptAccesses.length}</span>
          </button>

          {/* SaaS Divider & Dynamic Edition Navigation Items */}
          <div className="border-t border-outline-variant/60 my-2 mx-4"></div>
          <div className="px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
            {institutionType === 'Schools' ? 'Schools Edition' : 'Higher Ed Edition'}
          </div>

          {institutionType === 'Schools' ? (
            <>
              <button
                onClick={() => setActiveTab('schools_admissions')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'schools_admissions' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">child_care</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Student Admissions</span>
              </button>

              <button
                onClick={() => setActiveTab('schools_classes')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'schools_classes' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Classes & Timetable</span>
              </button>

              <button
                onClick={() => setActiveTab('schools_assessment')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'schools_assessment' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">rate_review</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Continuous Assessment</span>
              </button>

              <button
                onClick={() => setActiveTab('schools_fees')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'schools_fees' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">payments</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Fees & Staff Payroll</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('highered_faculties')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'highered_faculties' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">account_balance</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Faculties & Depts</span>
              </button>

              <button
                onClick={() => setActiveTab('highered_courses')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'highered_courses' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">school</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Programmes & Courses</span>
              </button>

              <button
                onClick={() => setActiveTab('highered_gpa')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'highered_gpa' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">calculate</span>
                <span className="text-xs uppercase tracking-wider font-semibold">GPA & Transcripts</span>
              </button>

              <button
                onClick={() => setActiveTab('highered_graduation')}
                className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'highered_graduation' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Graduation & Clearance</span>
              </button>
            </>
          )}

          <div className="border-t border-outline-variant/60 my-2 mx-4"></div>
          <div className="px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Academic registry</div>

          <button
            onClick={() => {
              setActiveTab('records');
              onNavigate('transcript', 'alexander');
            }}
            className="text-on-surface-variant hover:bg-surface-container-high px-4 py-2 flex items-center gap-4 rounded-full transition-all w-full text-left font-bold"
          >
            <span className="material-symbols-outlined text-lg">description</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Academic Records</span>
          </button>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="text-on-surface-variant hover:bg-surface-container-high px-4 py-2 flex items-center gap-4 rounded-full transition-all w-full text-left font-bold"
          >
            <span className="material-symbols-outlined text-lg">terminal</span>
            <span className="text-xs uppercase tracking-wider font-semibold">System Logs</span>
            <span className="ml-auto text-[10px] bg-tertiary-container text-tertiary-fixed px-1.5 py-0.5 rounded font-mono">LIVE</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left ${activeTab === 'profile' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-lg" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>domain</span>
            <span className="text-xs uppercase tracking-wider font-semibold">School Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`font-bold rounded-full px-4 py-2 flex items-center gap-4 transition-all w-full text-left mt-2 ${activeTab === 'settings' ? 'bg-secondary-container text-on-secondary-container sidebar-active shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-lg" style={activeTab === 'settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Settings</span>
          </button>
        </nav>

        <div className="mt-auto p-6 border-t border-outline-variant/60 text-center">
          <div className="bg-surface p-3 rounded-xl border border-outline-variant/50 text-left">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Cloud Synchronized</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">All database records active on high-availability cluster.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="pt-28 pb-20 lg:pb-12 lg:pl-[280px] min-h-screen">
        <div className="px-4 md:px-8 max-w-7xl mx-auto space-y-6">
          
          {activeTab === 'dashboard' ? (
            <>
              {/* Export Success Notification */}
              {exportSuccess && (
                <div className="bg-tertiary-container text-tertiary-fixed p-4 rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div>
                      <h4 className="font-bold text-sm">Report Successfully Generated!</h4>
                      <p className="text-xs text-white/80">Term_Overview_{currentAcademicYearDash.replace('-', '_')}.xlsx has been downloaded and archived to institutional records.</p>
                    </div>
                  </div>
                  <button onClick={() => setExportSuccess(false)} className="text-white hover:opacity-80">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              )}

              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Institutional Overview</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Real-time performance and operational metrics for Academic Term {currentAcademicYearDash}.</p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-secondary/15 hover:bg-secondary/25 border border-secondary/20 text-secondary rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">picture_as_pdf</span>
                    Download PDF
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-surface-container-high border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-container-highest transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export Report
                  </button>
                  <button
                    onClick={() => setIsNewRecordModalOpen(true)}
                    className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Record
                  </button>
                </div>
              </div>

              {/* Global Real-time Search Bar */}
              <div className="bg-surface p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full flex-1">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                  <input
                    type="text"
                    id="dashboard-student-search"
                    placeholder="Search students by name or student ID (e.g. 'Alice', '1', '6')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-low pl-11 pr-10 py-2.5 rounded-xl border border-outline-variant/60 focus:border-secondary focus:outline-none text-xs text-on-surface transition-all placeholder:text-on-surface-variant/50"
                  />
                  {searchQuery && (
                    <button
                      id="clear-dashboard-search"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg border border-secondary/15 animate-fadeIn font-semibold shrink-0">
                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                    <span>{filteredStudents.length} matches found</span>
                  </div>
                )}
              </div>

              {/* Bento Grid: Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div
                  onClick={() => onNavigate('transcript')}
                  className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all cursor-pointer bento-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2.5 bg-primary-container text-white rounded-xl material-symbols-outlined group-hover:scale-110 transition-transform">groups</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total Students</p>
                  <h3 className="text-3xl font-bold text-primary mt-1 font-mono">—</h3>
                </div>

                <div
                  onClick={() => onNavigate('teacher')}
                  className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all cursor-pointer bento-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2.5 bg-secondary-container text-white rounded-xl material-symbols-outlined group-hover:scale-110 transition-transform">school</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total Teachers</p>
                  <h3 className="text-3xl font-bold text-primary mt-1 font-mono">—</h3>
                </div>

                <div
                  onClick={() => setIsAlertsModalOpen(true)}
                  className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all cursor-pointer bento-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2.5 bg-surface-container-highest text-secondary rounded-xl material-symbols-outlined group-hover:scale-110 transition-transform">event_available</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Attendance</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-bold text-primary font-mono">—</h3>
                    <span className="text-xs text-on-surface-variant">Avg.</span>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate('transcript')}
                  className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all cursor-pointer bento-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2.5 bg-tertiary-container text-tertiary-fixed rounded-xl material-symbols-outlined group-hover:scale-110 transition-transform">trending_up</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Pass Rate</p>
                  <h3 className="text-3xl font-bold text-primary mt-1 font-mono">—</h3>
                </div>

                <div
                  onClick={() => onNavigate('transcript')}
                  className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all cursor-pointer bento-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl material-symbols-outlined group-hover:scale-110 transition-transform">workspace_premium</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Academic Insights</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-bold text-primary font-mono">—</h3>
                    <span className="text-xs text-on-surface-variant">Avg GPA</span>
                  </div>
                  <div className="mt-2 text-[11px] text-on-surface-variant flex items-center justify-between border-t border-outline-variant/30 pt-1.5">
                    <span>Honor Roll:</span>
                    <span className="font-bold text-secondary font-mono">— Students</span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Layout: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Side: Analytics & Table (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Average student GPA trends over the last 6 months */}
                  <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm animate-fadeIn">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h4 className="text-base font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-xl">trending_up</span>
                          Average Student GPA Trends
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">Historical GPA performance progress over the last 6 months</p>
                      </div>

                      {/* Interactive Grade Filter */}
                      <div className="flex gap-1.5 bg-surface-container-high p-1 rounded-xl border border-outline-variant shrink-0">
                        {(['all', '10', '11', '12'] as const).map((grade) => (
                          <button
                            key={grade}
                            id={`gpa-filter-${grade}`}
                            onClick={() => setGpaGradeFilter(grade)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              gpaGradeFilter === grade
                                ? 'bg-secondary text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:text-white hover:bg-surface-container-highest'
                            }`}
                          >
                            {grade === 'all' ? 'All' : `Grade ${grade}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gpaTrendData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff3e00" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#ff3e00" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                          <XAxis
                            dataKey="month"
                            stroke="rgba(255, 255, 255, 0.3)"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis
                            domain={[3.2, 4.0]}
                            stroke="rgba(255, 255, 255, 0.3)"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dx={-5}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-surface-container-highest border border-outline-variant px-3.5 py-2.5 rounded-xl shadow-xl">
                                    <p className="text-[10px] font-semibold text-on-surface-variant font-mono uppercase tracking-wider">{label} 2026</p>
                                    <p className="text-base font-extrabold text-secondary font-mono mt-0.5">
                                      {Number(payload[0].value).toFixed(2)} <span className="text-[10px] text-on-surface-variant font-normal">GPA</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="gpa"
                            stroke="#ff3e00"
                            strokeWidth={3}
                            dot={{ r: 4, stroke: '#ff3e00', strokeWidth: 2, fill: '#0c0c0c' }}
                            activeDot={{ r: 6, stroke: '#ff3e00', strokeWidth: 2, fill: '#ffffff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Attendance Progress Chart */}
                  <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm animate-fadeIn">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h4 className="text-base font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-xl">calendar_month</span>
                          Global Monthly Attendance Analytics
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Daily overall attendance trajectory across current academic month ({currentMonthYearName})
                        </p>
                      </div>

                      {/* Pattern controls */}
                      <div className="flex gap-2.5 items-center">
                        <button
                          onClick={() => setHighlightDips(!highlightDips)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                            highlightDips
                              ? 'bg-error-container text-error border-error/30'
                              : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">trending_down</span>
                          Highlight Dips
                        </button>
                        <button
                          onClick={() => setShowBenchmark(!showBenchmark)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                            showBenchmark
                              ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
                              : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">rule</span>
                          Target (95%)
                        </button>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyAttendanceData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                          <XAxis
                            dataKey="day"
                            stroke="rgba(255, 255, 255, 0.3)"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis
                            domain={[85, 100]}
                            stroke="rgba(255, 255, 255, 0.3)"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dx={-5}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const currentDayData = payload[0].payload;
                                return (
                                  <div className="bg-surface-container-highest border border-outline-variant px-3.5 py-2.5 rounded-xl shadow-xl">
                                    <p className="text-[10px] font-semibold text-on-surface-variant font-mono uppercase tracking-wider">{currentDayData.label}</p>
                                    <p className="text-base font-extrabold text-secondary font-mono mt-0.5">
                                      {Number(payload[0].value).toFixed(1)}% <span className="text-[10px] text-on-surface-variant font-normal">Attendance</span>
                                    </p>
                                    {highlightDips && currentDayData.attendance < 92 && (
                                      <p className="text-[10px] text-error font-medium mt-1 uppercase tracking-wider flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-error inline-block animate-pulse" />
                                        Weekend Border Dip Identified
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {showBenchmark && (
                            <ReferenceLine
                              y={95}
                              stroke="#555"
                              strokeDasharray="4 4"
                              label={{ value: 'Target: 95%', fill: '#888', fontSize: 10, position: 'top', fontFamily: 'monospace' }}
                            />
                          )}
                          <Line
                            type="monotone"
                            dataKey="attendance"
                            stroke="#ff3e00"
                            strokeWidth={3}
                            dot={(props: any) => {
                              const { cx, cy, payload } = props;
                              if (highlightDips && payload.attendance < 91) {
                                return (
                                  <circle key={payload.day} cx={cx} cy={cy} r={6} fill="#dc2626" stroke="#fff" strokeWidth={2} />
                                );
                              }
                              return (
                                <circle key={payload.day} cx={cx} cy={cy} r={3} fill="#0c0c0c" stroke="#ff3e00" strokeWidth={1.5} />
                              );
                            }}
                            activeDot={{ r: 6, stroke: '#ff3e00', strokeWidth: 2, fill: '#ffffff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pattern Insights Box */}
                    <div className="mt-6 p-4 bg-surface-container-high rounded-xl border border-outline-variant flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-secondary/15 text-secondary rounded-lg material-symbols-outlined">analytics</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">Administrator Pattern Analysis</span>
                          <p className="text-xs text-on-surface-variant mt-0.5 max-w-xl">
                            Attendance follows a highly recurring cyclic weekly pattern. Minor drops are observed on <strong>Mondays</strong> (~91.5% - 92.5%) and sharp declines consistently occur on <strong>Fridays</strong> (~88.2% - 89.6%). Midweek days consistently meet or exceed the 94% threshold.
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#0c0c0c] border border-outline-variant px-3 py-2 rounded-lg text-center self-stretch md:self-auto shrink-0 flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant block tracking-wider">Pattern Severity</span>
                        <span className="text-xs font-extrabold text-error font-mono mt-0.5 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-error inline-block animate-ping" />
                          Moderate (Friday Dips)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics & Intervention Bento Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Weekly Attendance Bar Chart */}
                    <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-lg font-bold text-on-surface">Attendance Trends</h4>
                          <p className="text-xs text-on-surface-variant">Click bar to inspect day logs</p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg">Last 7 Days</span>
                      </div>

                      <div className="flex items-end justify-between h-44 gap-3 px-2 pt-6">
                        {[
                          { day: 'MON', val: 92 },
                          { day: 'TUE', val: 94 },
                          { day: 'WED', val: 91 },
                          { day: 'THU', val: 95 },
                          { day: 'FRI', val: 89 },
                        ].map((item) => (
                          <div
                            key={item.day}
                            onClick={() => setSelectedDayTooltip(`${item.day}: ${item.val}% average attendance across all students.`)}
                            className="w-full bg-surface-container-high rounded-t-lg relative group flex flex-col justify-end cursor-pointer transition-all hover:bg-surface-container-highest"
                            style={{ height: '160px' }}
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-primary text-white text-[10px] font-mono font-bold px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                              {item.val}%
                            </div>
                            <div
                              className="w-full bg-secondary-container rounded-t-lg transition-all duration-500 group-hover:bg-secondary"
                              style={{ height: `${item.val}%` }}
                            ></div>
                            <p className="text-[10px] text-center mt-2 font-semibold text-on-surface-variant">{item.day}</p>
                          </div>
                        ))}
                      </div>

                      {selectedDayTooltip && (
                        <div className="mt-4 p-2.5 bg-primary-container text-white rounded-xl text-xs flex items-center justify-between animate-fadeIn">
                          <span className="flex items-center gap-1.5 font-mono">
                            <span className="material-symbols-outlined text-tertiary-fixed text-sm">info</span>
                            {selectedDayTooltip}
                          </span>
                          <button onClick={() => setSelectedDayTooltip(null)} className="text-white/70 hover:text-white">
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Intervention Alert Section */}
                    <div className="bg-error-container p-6 rounded-xl border border-error/20 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                          <h4 className="text-lg font-bold text-on-error-container">Critical Alerts</h4>
                        </div>
                        <p className="text-xs md:text-sm text-on-error-container mb-4">
                          {alerts.length} students identified with attendance below 70% or rapid grade declines.
                        </p>
                        
                        <div className="space-y-2.5">
                          {alerts.slice(0, 2).map((alt) => (
                            <div
                              key={alt.id}
                              onClick={() => setIsAlertsModalOpen(true)}
                              className="bg-white/70 hover:bg-white p-3.5 rounded-xl flex items-center justify-between border border-error/15 cursor-pointer transition-all shadow-sm group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                  {alt.initials}
                                </div>
                                <div>
                                  <span className="text-xs md:text-sm font-bold text-on-error-container group-hover:text-error transition-colors">
                                    {alt.studentName}
                                  </span>
                                  <p className="text-[10px] text-on-error-container/80 line-clamp-1">{alt.details}</p>
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-error bg-error-container px-2 py-1 rounded">
                                {alt.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setIsAlertsModalOpen(true)}
                        className="mt-6 w-full py-2.5 bg-error text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>Review All {alerts.length} Cases</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Top Students Table */}
                  <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="text-lg font-bold text-on-surface">Top Academic Performers</h4>
                        <p className="text-xs text-on-surface-variant">Ranked by cumulative GPA for Academic Year {currentAcademicYearDash}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportToCSV}
                          className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 text-secondary hover:text-secondary-dark rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">table_view</span>
                          Export to CSV
                        </button>
                        <button
                          onClick={() => onNavigate('transcript')}
                          className="text-secondary text-xs font-bold hover:underline flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50"
                        >
                          <span>View Full Rankings</span>
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/60">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">GPA</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60">
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                                  <p className="text-sm font-semibold">No students found matching "{searchQuery}"</p>
                                  <p className="text-xs text-on-surface-variant/70">Try checking the spelling or searching for another student ID or name.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.slice(0, searchQuery ? undefined : 5).map((st) => (
                              <tr
                                key={st.id}
                                onClick={() => {
                                  if (st.name.includes('Alexander')) {
                                    onNavigate('transcript', 'alexander');
                                  } else if (st.name.includes('Alice')) {
                                    onNavigate('transcript', 'alice');
                                  } else if (st.name.includes('Leo')) {
                                    onNavigate('transcript', 'leo');
                                  } else {
                                    onNavigate('transcript', 'alice');
                                  }
                                }}
                                className="hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                              >
                                <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">
                                  #{st.rank < 10 ? `0${st.rank}` : st.rank}
                                </td>
                                <td className="px-6 py-4 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center font-bold text-xs ring-1 ring-secondary/20 group-hover:bg-secondary group-hover:text-white transition-colors">
                                    {st.initials}
                                  </div>
                                  <div>
                                    <span className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                                      {st.name}
                                    </span>
                                    <p className="text-[11px] text-on-surface-variant">{st.gradeLevel}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-sm text-on-surface">{st.gpa.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${st.status === 'High Honor' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-secondary-fixed text-on-secondary-fixed-variant'}`}>
                                    {st.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      if (st.name.includes('Alexander')) onNavigate('transcript', 'alexander');
                                      else if (st.name.includes('Alice')) onNavigate('transcript', 'alice');
                                      else onNavigate('transcript', 'alice');
                                    }}
                                    className="px-3 py-1 bg-surface-container hover:bg-secondary hover:text-white rounded-lg text-xs font-semibold text-secondary transition-colors"
                                  >
                                    Transcript
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Side: Activity & Logs (1/3) */}
                <div className="space-y-6">
                  
                  {/* Recent Activity Logs */}
                  <div className="bg-surface rounded-xl border border-outline-variant h-full flex flex-col shadow-sm">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                      <h4 className="text-lg font-bold text-on-surface">System Activities</h4>
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" title="Live streaming feed"></span>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                      {activities.map((act, idx) => (
                        <div key={act.id} className="flex gap-4 relative">
                          {idx !== activities.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-outline-variant/40"></div>
                          )}
                          <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${act.colorClass}`}>
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {act.icon}
                            </span>
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-xs md:text-sm">
                              <span className="font-bold text-on-surface">{act.user}</span> {act.action}{' '}
                              <span className="font-bold text-secondary">{act.target}</span>.
                            </p>
                            <p className="text-[11px] font-mono text-on-surface-variant uppercase mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">schedule</span>
                              {act.timeAgo}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-surface-container-low border-t border-outline-variant rounded-b-xl">
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="w-full text-center text-xs text-secondary font-bold uppercase tracking-wider hover:underline py-1"
                      >
                        See Full Audit Trail →
                      </button>
                    </div>
                  </div>

                  {/* Quick Institutional Tips Box */}
                  <div className="bg-primary-container text-white p-6 rounded-xl border border-white/10 shadow-md">
                    <div className="flex items-center gap-2 mb-2 text-tertiary-fixed">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                      <h5 className="text-sm font-bold uppercase tracking-wider">Administrative Tip</h5>
                    </div>
                    <p className="text-xs text-on-primary-container leading-relaxed">
                      You can jump directly to any student's digital report card by clicking their name in the Top Performers table, or switch to Faculty Portal to submit grades.
                    </p>
                  </div>

                </div>
              </div>
            </>
          ) : activeTab === 'schools_admissions' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Student Admission Portal</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Manage and approve primary and secondary student enrollment applications.</p>
                </div>
                <button 
                  onClick={() => alert("Configure automatic matching and parent SMS notifications.")}
                  className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold shadow-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">settings_input_component</span>
                  Admissions Settings
                </button>
              </div>

              {/* Admissions Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary-container text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">person_add</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Total Applications</p>
                    <p className="text-xl font-bold text-on-surface font-mono">{schoolApplicants.length + 120}</p>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">hourglass_empty</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Pending Review</p>
                    <p className="text-xl font-bold text-amber-500 font-mono">
                      {schoolApplicants.filter(a => a.status === 'Pending').length}
                    </p>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Approved Applications</p>
                    <p className="text-xl font-bold text-green-500 font-mono">
                      {schoolApplicants.filter(a => a.status === 'Approved').length + 85}
                    </p>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">how_to_reg</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Direct Enrolled</p>
                    <p className="text-xl font-bold text-blue-500 font-mono">92%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Form to submit application */}
                <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                    <span className="material-symbols-outlined text-secondary">add_circle</span>
                    Register New Applicant
                  </h3>
                  <form onSubmit={handleAddApplicant} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase">Student Full Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Liam Sterling"
                        value={newApplicant.name}
                        onChange={e => setNewApplicant({...newApplicant, name: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase">Parent / Guardian Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Richard Sterling"
                        value={newApplicant.parentName}
                        onChange={e => setNewApplicant({...newApplicant, parentName: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase">Intended Grade Level</label>
                      <select 
                        value={newApplicant.grade}
                        onChange={e => setNewApplicant({...newApplicant, grade: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                      >
                        <option value="Grade 10">Grade 10 (High School)</option>
                        <option value="Grade 11">Grade 11 (High School)</option>
                        <option value="Grade 12">Grade 12 (High School)</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-primary text-white hover:bg-secondary rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xs">add_card</span>
                      Submit Application
                    </button>
                  </form>
                </div>

                {/* Applications list */}
                <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Active Admission Pipeline</h3>
                  </div>
                  <div className="overflow-x-auto border-t border-outline-variant">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                          <th className="p-3">Applicant Student</th>
                          <th className="p-3">Grade</th>
                          <th className="p-3">Parent Name</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40">
                        {schoolApplicants.map(app => (
                          <tr key={app.id} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="p-3 font-bold text-on-surface">{app.name}</td>
                            <td className="p-3 text-on-surface-variant font-mono">{app.grade}</td>
                            <td className="p-3 text-on-surface-variant">{app.parentName}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                app.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                app.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              {app.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleApplicantStatus(app.id, 'Approved')}
                                    className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold hover:bg-green-500 hover:text-white transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleApplicantStatus(app.id, 'Interview Scheduled')}
                                    className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold hover:bg-blue-500 hover:text-white transition-colors"
                                  >
                                    Interview
                                  </button>
                                </>
                              )}
                              {app.status !== 'Pending' && (
                                <span className="text-[10px] text-on-surface-variant font-mono italic">Decision logged</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'schools_classes' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Class Management & Timetable</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Design schedules, assign teachers, and manage primary/secondary class lists.</p>
                </div>
                <div className="flex gap-2">
                  {Object.keys(timetableData).map(c => (
                    <button
                      key={c}
                      onClick={() => setTimetableClass(c)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                        timetableClass === c
                          ? 'bg-secondary text-white border-secondary'
                          : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Timetable Grid */}
              <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">calendar_today</span>
                    Weekly Master Timetable Schedule for <strong className="text-secondary">{timetableClass}</strong>
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active Term Schedule</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                        <th className="p-4">Period / Time Slot</th>
                        <th className="p-4">Subject Assigned</th>
                        <th className="p-4">Assigned Instructor</th>
                        <th className="p-4 text-right">Interactive Adjustments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-mono">
                      {timetableData[timetableClass].map((slot, index) => (
                        <tr key={slot.period} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="p-4 font-bold text-on-surface">{slot.period}</td>
                          <td className="p-4 text-xs font-sans text-secondary font-semibold">
                            <select
                              value={slot.subject}
                              onChange={e => handleUpdateTimetablePeriod(timetableClass, index, 'subject', e.target.value)}
                              className="bg-transparent border-none focus:outline-none font-bold text-secondary cursor-pointer"
                            >
                              <option value="Mathematics">Mathematics</option>
                              <option value="Chemistry">Chemistry</option>
                              <option value="English Lit">English Lit</option>
                              <option value="World History">World History</option>
                              <option value="Physical Ed">Physical Ed</option>
                              <option value="Biology">Biology</option>
                              <option value="Physics">Physics</option>
                              <option value="Algebra II">Algebra II</option>
                              <option value="Economics">Economics</option>
                              <option value="Computer Lab">Computer Lab</option>
                              <option value="Calculus">Calculus</option>
                            </select>
                          </td>
                          <td className="p-4 text-xs font-sans text-on-surface">
                            <select
                              value={slot.teacher}
                              onChange={e => handleUpdateTimetablePeriod(timetableClass, index, 'teacher', e.target.value)}
                              className="bg-transparent border-none focus:outline-none text-on-surface cursor-pointer"
                            >
                              <option value="Dr. Linda Ross">Dr. Linda Ross</option>
                              <option value="Prof. James Green">Prof. James Green</option>
                              <option value="Sarah Jenkins">Sarah Jenkins</option>
                              <option value="Robert Vance">Robert Vance</option>
                              <option value="Coach Marcus">Coach Marcus</option>
                              <option value="Elena Rostova">Elena Rostova</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 font-bold uppercase tracking-wider">
                              Live Sync Saved
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Class list info box */}
              <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">SaaS Automated Allocation Rule</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Saint Jude's Academy enforces a maximum class density rule of 25 students per classroom for Grade 10-12. Room assignments are managed dynamically to optimize heating, cooling, and visual board proximity.
                </p>
              </div>
            </div>
          ) : activeTab === 'schools_assessment' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Continuous Assessment Gradebook</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Enter scores for quizzes, homework, and midterms. Auto-calculates term grade averages.</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={assessmentClass}
                    onChange={e => setAssessmentClass(e.target.value)}
                    className="text-xs bg-surface border border-outline-variant rounded-xl px-3 py-1.5 text-on-surface font-bold focus:outline-none"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                  <select 
                    value={assessmentSubject}
                    onChange={e => setAssessmentSubject(e.target.value)}
                    className="text-xs bg-surface border border-outline-variant rounded-xl px-3 py-1.5 text-on-surface font-bold focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English Lit">English Lit</option>
                  </select>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Score Entries for {assessmentClass} • Subject: <strong className="text-secondary">{assessmentSubject}</strong>
                  </span>
                  <button 
                    onClick={() => alert("All Continuous Assessment grades successfully committed to school archives.")}
                    className="px-3 py-1 bg-primary text-white hover:bg-secondary rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Commit to Registry
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">CA Test 1 (20)</th>
                        <th className="p-4">CA Test 2 (20)</th>
                        <th className="p-4">Final Exam (60)</th>
                        <th className="p-4">Term Total (100)</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4 text-right">Integrity Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-mono">
                      {assessmentStudents.map(student => (
                        <tr key={student.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="p-4 font-sans font-bold text-on-surface">{student.name}</td>
                          <td className="p-4">
                            <input 
                              type="number"
                              min={0}
                              max={20}
                              value={student.ca1}
                              onChange={e => handleUpdateScore(student.id, 'ca1', Number(e.target.value))}
                              className="w-16 bg-surface-container-low border border-outline-variant rounded p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="number"
                              min={0}
                              max={20}
                              value={student.ca2}
                              onChange={e => handleUpdateScore(student.id, 'ca2', Number(e.target.value))}
                              className="w-16 bg-surface-container-low border border-outline-variant rounded p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="number"
                              min={0}
                              max={60}
                              value={student.exam}
                              onChange={e => handleUpdateScore(student.id, 'exam', Number(e.target.value))}
                              className="w-16 bg-surface-container-low border border-outline-variant rounded p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-4 font-bold text-secondary text-sm">{student.total}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              student.grade === 'A' ? 'bg-green-500/10 text-green-500' :
                              student.grade === 'B' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-amber-500/10 text-amber-500'
                            }`}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-wider">
                              Unsaved Buffers Live
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'schools_fees' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">School Fees & Faculty Payroll</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Collect student tuition fees and disburse payroll to teaching staff.</p>
                </div>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Collected Fees</p>
                    <p className="text-xl font-bold text-emerald-500 font-mono">$275,400</p>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">money_off</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Outstanding Balances</p>
                    <p className="text-xl font-bold text-amber-500 font-mono">$34,600</p>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary-container text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Active Monthly Payroll</p>
                    <p className="text-xl font-bold text-primary font-mono">$16,800</p>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">check_box</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Clearing Compliance</p>
                    <p className="text-xl font-bold text-blue-500 font-mono">88.8%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Collect Fees Form */}
                <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                    <span className="material-symbols-outlined text-secondary">point_of_sale</span>
                    Record Payment Receipt
                  </h3>
                  <form onSubmit={handleRecordPayment} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase">Select Student Ledger</label>
                      <select 
                        value={recordPaymentData.studentId}
                        onChange={e => setRecordPaymentData({...recordPaymentData, studentId: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                      >
                        {schoolFeesList.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.grade}) - Balance: ${item.termFee - item.paidAmount}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase">Amount Paid ($)</label>
                      <input 
                        type="number"
                        required
                        min={1}
                        value={recordPaymentData.amount}
                        onChange={e => setRecordPaymentData({...recordPaymentData, amount: Number(e.target.value)})}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface font-mono focus:outline-none focus:border-secondary"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-secondary text-white hover:bg-secondary-container hover:text-on-secondary-container rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xs">receipt_long</span>
                      Authorize Fees Payment
                    </button>
                  </form>
                </div>

                {/* Fees list */}
                <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-6 p-4">
                  <div>
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Student Fees Ledger</h3>
                    <div className="overflow-x-auto border border-outline-variant/55 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                            <th className="p-3">Student Ledger</th>
                            <th className="p-3">Grade</th>
                            <th className="p-3 font-mono">Term Fee</th>
                            <th className="p-3 font-mono">Paid</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/40">
                          {schoolFeesList.map(fee => (
                            <tr key={fee.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="p-3 font-bold text-on-surface">{fee.name}</td>
                              <td className="p-3 text-on-surface-variant font-mono">{fee.grade}</td>
                              <td className="p-3 font-mono text-on-surface">${fee.termFee}</td>
                              <td className="p-3 font-mono text-secondary font-bold">${fee.paidAmount}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  fee.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                  fee.status === 'Partial' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                  'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                  {fee.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Faculty & Instructor Payroll Ledger</h3>
                    <div className="overflow-x-auto border border-outline-variant/55 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                            <th className="p-3">Faculty Instructor</th>
                            <th className="p-3">Designation Role</th>
                            <th className="p-3 font-mono">Base Salary</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Disbursement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/40">
                          {staffPayrollList.map(staff => (
                            <tr key={staff.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="p-3 font-bold text-on-surface">{staff.name}</td>
                              <td className="p-3 text-on-surface-variant">{staff.role}</td>
                              <td className="p-3 font-mono text-on-surface">${staff.salary} / mo</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  staff.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                  'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                }`}>
                                  {staff.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {staff.status === 'Pending' ? (
                                  <button 
                                    onClick={() => handleDisburseSalary(staff.id)}
                                    className="px-2 py-1 bg-primary text-white rounded text-[10px] font-bold hover:bg-secondary transition-colors"
                                  >
                                    Disburse
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-green-500 font-mono italic">Cleared via ACH</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'highered_faculties' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Faculties & Academic Departments</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Organize colleges, research units, faculties, and coordinate respective deans.</p>
                </div>
                <button 
                  onClick={handleAddFaculty}
                  className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold shadow-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Create New Faculty
                </button>
              </div>

              {/* Faculty Grid and Expanded Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="space-y-4">
                  <div className="p-4 border border-outline-variant bg-surface-container-low rounded-xl">
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Select Active Faculty</h3>
                    <p className="text-[11px] text-on-surface-variant mb-4">Click any college division to view underlying departments and deans.</p>
                  </div>
                  {facultiesList.map(fac => (
                    <div 
                      key={fac.id}
                      onClick={() => {
                        setSelectedFacultyId(fac.id);
                        setTargetFacultyId(fac.id); // set target faculty form dropdown as well for better UX
                      }}
                      className={`p-5 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-between ${
                        selectedFacultyId === fac.id
                          ? 'bg-secondary-container border-secondary text-on-secondary-container scale-[1.01]'
                          : 'bg-surface border-outline-variant hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold">{fac.name}</h4>
                        <p className="text-xs opacity-80 mt-1">Dean: {fac.dean}</p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full">
                        {fac.departments.length} Depts
                      </span>
                    </div>
                  ))}

                  {/* Add Department / Program Form */}
                  <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-4 mt-6">
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                      <span className="material-symbols-outlined text-secondary">add_circle</span>
                      Add Department / Program
                    </h3>
                    <form onSubmit={handleAddDepartment} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-on-surface-variant uppercase">Target Faculty</label>
                        <select 
                          value={targetFacultyId}
                          onChange={e => setTargetFacultyId(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                        >
                          {facultiesList.map(fac => (
                            <option key={fac.id} value={fac.id}>
                              {fac.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-on-surface-variant uppercase">Department Name</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Aerospace Engineering"
                          value={newDeptName}
                          onChange={e => setNewDeptName(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-primary text-white hover:bg-secondary rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-xs">add_circle</span>
                        Add Department
                      </button>
                    </form>
                  </div>
                </div>

                {/* Faculty Departments details board */}
                <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
                  {(() => {
                    const selectedFaculty = facultiesList.find(f => f.id === selectedFacultyId) || facultiesList[0];
                    if (!selectedFaculty) return null;
                    return (
                      <div className="space-y-6">
                        <div className="border-b border-outline-variant/40 pb-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold text-on-surface">{selectedFaculty.name}</h3>
                            <p className="text-xs text-on-surface-variant mt-1">Primary administrative dean: <strong className="text-secondary">{selectedFaculty.dean}</strong></p>
                          </div>
                          <span className="text-[10px] bg-primary-container text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            Authorized Unit
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Underlying Departments & Major Pathways</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                            {selectedFaculty.departments.map((dept, idx) => (
                              <div key={idx} className="bg-surface-container border border-outline-variant rounded-xl p-4 flex items-center gap-3">
                                <span className="p-2 bg-secondary/15 text-secondary rounded-lg material-symbols-outlined text-sm">school</span>
                                <div>
                                  <span className="text-xs font-bold text-on-surface">{dept} Department</span>
                                  <p className="text-[10px] text-on-surface-variant uppercase mt-0.5">B.Sc / B.Eng Programme</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-secondary-container/20 border border-secondary/10 p-4 rounded-xl text-xs text-on-surface-variant leading-relaxed">
                          <strong>Accreditation Compliance:</strong> All departments under the <span className="text-secondary font-bold">{selectedFaculty.name}</span> are fully cleared by the National Higher Education Commission (NHEC) for academic degrees up to PhD candidacy level.
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : activeTab === 'highered_courses' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Programmes & Course Registration</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Manage semester calendar stages, coordinate lecturer portals, and verify credit limits.</p>
                </div>
                <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded-xl px-4 py-1.5 shadow-sm text-xs font-bold">
                  <span className="text-on-surface-variant">Active Term Stage:</span>
                  <select 
                    value={selectedSession}
                    onChange={e => {
                      onSessionChange?.(e.target.value);
                    }}
                    className="bg-transparent text-secondary border-none focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="2023/2024 Fall">2023/2024 Fall</option>
                    <option value="2023/2024 Spring">2023/2024 Spring</option>
                    <option value="2024/2025 Fall">2024/2025 Fall</option>
                    <option value="2024/2025 Spring">2024/2025 Spring</option>
                  </select>
                </div>
              </div>

              {/* Course Registration Approval Matrix */}
              <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Student Course Registration Requests • {selectedSession}
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Requires Admin Clearance</span>
                </div>

                <div className="overflow-x-auto border-t border-outline-variant">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                        <th className="p-4">Undergraduate Student</th>
                        <th className="p-4">Department major</th>
                        <th className="p-4">Course Codes Requested</th>
                        <th className="p-4 font-mono">Credit Load</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Clearance Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-mono">
                      {courseRegList.map(reg => (
                        <tr key={reg.studentId} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="p-4 font-sans font-bold text-on-surface">{reg.name}</td>
                          <td className="p-4 font-sans text-on-surface-variant">{reg.dept}</td>
                          <td className="p-4 flex flex-wrap gap-1 items-center">
                            {reg.courses.map(code => (
                              <span key={code} className="bg-surface-container px-2 py-0.5 rounded text-[10px] border border-outline-variant font-mono">
                                {code}
                              </span>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-secondary">{reg.credits} / {reg.maxCredits} Max</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              reg.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            {reg.status === 'Pending Approval' ? (
                              <>
                                <button 
                                  onClick={() => {
                                    handleCourseRegApproval(reg.studentId, 'Approved');
                                    alert(`Approved Course registration list for ${reg.name}`);
                                  }}
                                  className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold hover:bg-green-500 hover:text-white transition-colors"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleCourseRegApproval(reg.studentId, 'Declined')}
                                  className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold hover:bg-red-500 hover:text-white transition-colors"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-on-surface-variant font-mono italic">Cleared & Registered</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'highered_gpa' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">GPA & Official Transcript Registry</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Compute grade point averages, manage carry-overs, and sign digital transcripts.</p>
                </div>
              </div>

              {/* CGPA Ledger and Carryovers */}
              <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Official Student CGPA Register (5.00 Scale)
                  </span>
                  <span className="text-[10px] bg-primary-container text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Authorized Registry Office</span>
                </div>

                <div className="overflow-x-auto border-t border-outline-variant">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                        <th className="p-4">Enrolled Student</th>
                        <th className="p-4">Major Department</th>
                        <th className="p-4 font-mono text-center">CGPA</th>
                        <th className="p-4">Honours Standing</th>
                        <th className="p-4">Carry-over Backlogs</th>
                        <th className="p-4 text-right">Transcript Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-mono">
                      {cgpaRegistry.map(rec => (
                        <tr key={rec.studentId} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="p-4 font-sans font-bold text-on-surface">
                            <div>
                              <span>{rec.name}</span>
                              <p className="text-[9px] text-on-surface-variant uppercase mt-0.5">{rec.level}</p>
                            </div>
                          </td>
                          <td className="p-4 font-sans text-on-surface-variant">{rec.dept}</td>
                          <td className="p-4 text-center font-bold text-secondary text-sm">{rec.cgpa.toFixed(2)}</td>
                          <td className="p-4 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              rec.cgpa >= 3.50 ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                              rec.cgpa >= 2.00 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                              {rec.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {rec.carryOvers.length > 0 ? (
                              <div className="flex gap-1">
                                {rec.carryOvers.map(co => (
                                  <span key={co} className="bg-red-500/10 text-red-500 text-[9px] px-1.5 py-0.5 rounded font-bold border border-red-500/20">
                                    {co}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-green-500 font-sans font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                No Backlogs
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                onNavigate('transcript', rec.studentId);
                                alert(`Opening official Transcript interface for ${rec.name}. Prepare system seal.`);
                              }}
                              className="px-2.5 py-1 bg-secondary text-white hover:bg-secondary-container hover:text-on-secondary-container rounded text-[10px] font-bold transition-colors"
                            >
                              Verify Academic File
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'highered_graduation' ? (
            <div className="space-y-6 animate-fadeIn text-on-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Graduation Processing & Clearance</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Confirm institutional departments are satisfied prior to digital graduation certificate delivery.</p>
                </div>
              </div>

              {/* Graduation list */}
              <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Graduating Seniors Clearance Board • Interactive Checklist
                  </span>
                  <span className="text-[10px] bg-primary-container text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Clearance Registry</span>
                </div>

                <div className="overflow-x-auto border-t border-outline-variant">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant">
                        <th className="p-4">Senior Candidate</th>
                        <th className="p-4 text-center">Library</th>
                        <th className="p-4 text-center">Bursary Office</th>
                        <th className="p-4 text-center">Sports Center</th>
                        <th className="p-4 text-center">Faculty Dept</th>
                        <th className="p-4 text-center">Hostel Office</th>
                        <th className="p-4">Overall Standing</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-mono">
                      {graduationClearanceList.map(item => (
                        <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="p-4 font-sans font-bold text-on-surface">
                            <div>
                              <span>{item.name}</span>
                              <p className="text-[9px] text-on-surface-variant uppercase mt-0.5">{item.dept}</p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleClearance(item.id, 'library')}
                              className={`p-1 rounded-md text-xs font-bold transition-all ${item.library ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {item.library ? 'Cleared' : 'Pending'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleClearance(item.id, 'bursary')}
                              className={`p-1 rounded-md text-xs font-bold transition-all ${item.bursary ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {item.bursary ? 'Cleared' : 'Pending'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleClearance(item.id, 'sports')}
                              className={`p-1 rounded-md text-xs font-bold transition-all ${item.sports ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {item.sports ? 'Cleared' : 'Pending'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleClearance(item.id, 'faculty')}
                              className={`p-1 rounded-md text-xs font-bold transition-all ${item.faculty ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {item.faculty ? 'Cleared' : 'Pending'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleToggleClearance(item.id, 'hostels')}
                              className={`p-1 rounded-md text-xs font-bold transition-all ${item.hostels ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {item.hostels ? 'Cleared' : 'Pending'}
                            </button>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              item.overallStatus === 'Cleared' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {item.overallStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              disabled={item.overallStatus !== 'Cleared'}
                              onClick={() => alert(`Official electronic Degree certificate generated and sent to ${item.name} alumni mail portal.`)}
                              className="px-2.5 py-1 bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary rounded text-[10px] font-bold transition-colors"
                            >
                              Issue Degree
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'audit' ? (() => {
            const accesses = transcriptAccesses || [];
            const totalAccesses = accesses.length;
            const uniqueUsers = new Set(accesses.map((log: any) => log.userId)).size;
            
            const studentFrequency: Record<string, number> = {};
            let mostAccessedStudent = 'None';
            let maxFreq = 0;
            accesses.forEach((log: any) => {
              const sName = log.studentName || log.studentId;
              studentFrequency[sName] = (studentFrequency[sName] || 0) + 1;
              if (studentFrequency[sName] > maxFreq) {
                maxFreq = studentFrequency[sName];
                mostAccessedStudent = sName;
              }
            });

            const lastAccessTime = accesses.length > 0 
              ? new Date(accesses[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Never';

            const filteredAccesses = accesses.filter((log: any) => {
              const userName = (log.userName || '').toLowerCase();
              const studentName = (log.studentName || '').toLowerCase();
              const userEmail = (log.userEmail || '').toLowerCase();
              const searchLower = auditSearch.toLowerCase();
              
              const matchesSearch = userName.includes(searchLower) || studentName.includes(searchLower) || userEmail.includes(searchLower);
              const matchesRole = auditRoleFilter === 'all' || log.userRole === auditRoleFilter;
              
              return matchesSearch && matchesRole;
            });

            return (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Security Audit Logs</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Immutable ledger tracking credentials and user events for digital transcript verification.</p>
                </div>

                {/* Stats Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-primary-container text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Total Audits</p>
                      <p className="text-xl font-bold text-on-surface">{totalAccesses}</p>
                    </div>
                  </div>

                  <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Unique Auditors</p>
                      <p className="text-xl font-bold text-on-surface">{uniqueUsers}</p>
                    </div>
                  </div>

                  <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined">star</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Hot Record</p>
                      <p className="text-sm font-bold text-on-surface truncate max-w-[130px]" title={mostAccessedStudent}>{mostAccessedStudent}</p>
                    </div>
                  </div>

                  <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                      <span className="material-symbols-outlined">history</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Last Access</p>
                      <p className="text-xl font-bold text-on-surface">{lastAccessTime}</p>
                    </div>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                  <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/60 focus-within:border-secondary transition-all w-full sm:max-w-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-base mr-2">search</span>
                    <input
                      type="text"
                      placeholder="Search by auditor, email, or student..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="bg-transparent border-none focus:outline-none text-xs w-full text-on-surface"
                    />
                    {auditSearch && (
                      <button onClick={() => setAuditSearch('')} className="text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">Filter Role:</span>
                    <select
                      value={auditRoleFilter}
                      onChange={(e) => setAuditRoleFilter(e.target.value)}
                      className="text-xs bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-secondary transition-colors"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Administrator</option>
                      <option value="teacher">Faculty Teacher</option>
                      <option value="parent">Guardian Parent</option>
                      <option value="student">Student Profile</option>
                    </select>
                  </div>
                </div>

                {/* Table of logs */}
                <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          <th className="py-3 px-5">Auditor / Accessor</th>
                          <th className="py-3 px-5">Auditor Role</th>
                          <th className="py-3 px-5">Accessed Student</th>
                          <th className="py-3 px-5">Timestamp (Local)</th>
                          <th className="py-3 px-5 text-right">Integrity Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/60 text-xs text-on-surface">
                        {filteredAccesses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">gavel</span>
                              No matching transcript access logs found.
                            </td>
                          </tr>
                        ) : (
                          filteredAccesses.map((log: any) => {
                            const formattedDate = log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            }) : 'N/A';

                            let roleColor = 'bg-gray-200/10 text-gray-400 border border-gray-500/20';
                            if (log.userRole === 'admin') roleColor = 'bg-red-500/10 text-red-400 border border-red-500/20';
                            if (log.userRole === 'teacher') roleColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                            if (log.userRole === 'parent') roleColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                            if (log.userRole === 'student') roleColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

                            return (
                              <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                                <td className="py-4 px-5">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-on-surface">{log.userName}</span>
                                    <span className="text-[10px] text-on-surface-variant font-mono">{log.userEmail}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono ${roleColor}`}>
                                    {log.userRole}
                                  </span>
                                </td>
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-secondary">description</span>
                                    <span className="font-semibold text-on-surface">{log.studentName}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-5 font-mono text-on-surface-variant">
                                  {formattedDate}
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping mr-1" />
                                    SECURED LOG
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })() : activeTab === 'profile' ? (
            <SchoolProfileSection schoolProfile={schoolProfile || {} as any} />
          ) : activeTab === 'settings' ? (
            <AdminSettingsSection 
              institutionType={institutionType} 
              onInstitutionTypeChange={onInstitutionTypeChange} 
            />
          ) : (
            /* Staff & Workspace User Roles Manager */
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Staff & Workspace Users</h2>
                <p className="text-sm text-on-surface-variant mt-1">Manage and update active roles for academic institution accounts.</p>
              </div>

              {/* Status Notifications */}
              {updateSuccess && (
                <div className="bg-emerald-950/80 text-emerald-400 p-4 border border-emerald-500/30 rounded-xl flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                  <p className="text-xs font-semibold">{updateSuccess}</p>
                </div>
              )}
              {updateError && (
                <div className="bg-red-950/80 text-red-400 p-4 border border-red-500/30 rounded-xl flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-red-400">error</span>
                  <p className="text-xs font-semibold">{updateError}</p>
                </div>
              )}

              {/* Directory Filter Card */}
              <div className="bg-surface rounded-xl border border-outline-variant p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-secondary text-on-surface"
                  />
                </div>
                <button
                  onClick={fetchUsers}
                  disabled={usersLoading}
                  className="px-4 py-2 bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm ${usersLoading ? 'animate-spin' : ''}`}>sync</span>
                  Refresh Directory
                </button>
              </div>

              {/* User Table Grid */}
              <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/60">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">User Details</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Email Address</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Workspace Role</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date Registered</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {usersLoading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-secondary border-t-transparent animate-spin rounded-full" />
                              <span className="text-xs text-on-surface-variant">Loading user directory from secure ledger...</span>
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-xs text-on-surface-variant">
                            No registered users found.
                          </td>
                        </tr>
                      ) : (
                        users
                          .filter(u => 
                            (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
                            (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
                          )
                          .map((u) => {
                            const isCurrentUser = auth.currentUser?.uid === u.uid;
                            return (
                              <tr key={u.uid} className="hover:bg-surface-container-lowest transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-[#ff3e00]/10 text-[#ff3e00] flex items-center justify-center font-bold text-xs border border-[#ff3e00]/25">
                                    {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                                      {u.name || 'Anonymous User'}
                                      {isCurrentUser && (
                                        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[8px] font-bold uppercase tracking-wider rounded">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-mono text-on-surface-variant uppercase">{u.uid.slice(0, 12)}...</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-mono text-on-surface">{u.email}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    u.role === 'admin' ? 'bg-primary-container text-white' :
                                    u.role === 'teacher' ? 'bg-secondary-container text-white' :
                                    u.role === 'parent' ? 'bg-tertiary-container text-tertiary-fixed' :
                                    'bg-surface-container-highest text-on-surface-variant'
                                  }`}>
                                    {u.role === 'admin' ? '🏛️ Admin' :
                                     u.role === 'teacher' ? '👩‍🏫 Teacher' :
                                     u.role === 'parent' ? '👨‍👩‍👦 Parent' :
                                     '🎓 Student'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-on-surface-variant">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <select
                                    value={u.role}
                                    disabled={isCurrentUser}
                                    onChange={(e) => handleUpdateRole(u.uid, e.target.value as any, u.email)}
                                    className="bg-surface-container-low border border-outline-variant text-xs text-on-surface rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <option value="admin">Institutional Admin</option>
                                    <option value="teacher">Faculty Professor</option>
                                    <option value="student">Enrolled Student</option>
                                    <option value="parent">Guardian & Parent</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 w-full z-40 flex justify-around items-center h-16 bg-surface border-t border-outline-variant px-2 lg:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-transform duration-200 ${activeTab === 'dashboard' ? 'bg-secondary-container text-on-secondary-container font-bold scale-95' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className="text-[10px] uppercase font-semibold">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('staff');
          }}
          className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-transform duration-200 ${activeTab === 'staff' ? 'bg-secondary-container text-on-secondary-container font-bold scale-95' : 'text-on-surface-variant hover:text-secondary'}`}
        >
          <span className="material-symbols-outlined">badge</span>
          <span className="text-[10px] uppercase font-semibold">Staff</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('audit');
          }}
          className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-transform duration-200 ${activeTab === 'audit' ? 'bg-secondary-container text-on-secondary-container font-bold scale-95' : 'text-on-surface-variant hover:text-secondary'}`}
        >
          <span className="material-symbols-outlined">shield</span>
          <span className="text-[10px] uppercase font-semibold">Audit</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('records');
            onNavigate('parent');
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] uppercase font-semibold">Parents</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('logs');
            setIsAuditModalOpen(true);
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined">terminal</span>
          <span className="text-[10px] uppercase font-semibold">Logs</span>
        </button>
      </nav>

      {/* Interactive Modals */}
      <CriticalAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onResolve={onResolveAlert}
      />

      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        activities={activities}
        onAddLog={onAddActivity}
      />

      <NewRecordModal
        isOpen={isNewRecordModalOpen}
        onClose={() => setIsNewRecordModalOpen(false)}
        onAddRecord={onAddRecord}
      />
    </div>
  );
};
