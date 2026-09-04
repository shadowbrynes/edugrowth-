/**
 * ExcelMind Academic Companion - Unified API Client
 * Connects Frontend Application -> Express Backend -> MySQL (excelmind_academic)
 */

const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('excelmind_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('excelmind_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('excelmind_token');
  localStorage.removeItem('excelmind_user');
};

export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<{
  success: boolean;
  data?: T;
  error?: string;
  isOffline?: boolean;
  status?: number;
}> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    return { success: response.ok && data.success !== false, data, status: response.status };
  } catch (err: any) {
    console.warn(`[ExcelMind API]: Backend request to ${endpoint} failed (${err.message}). Using local state fallback.`);
    return { success: false, error: err.message, isOffline: true };
  }
};

// Check backend status
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return await res.json();
  } catch {
    return null;
  }
};

// ==========================================
// 1. STUDENTS API (MySQL users & students)
// ==========================================
export const studentApi = {
  getAll: () => apiRequest('/students'),
  getById: (id: number | string) => apiRequest(`/students/${id}`),
  registerStudent: (data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    gender?: string;
    dob?: string;
    admissionNo?: string;
    classLevel?: string;
    department?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    relationship?: string;
    address?: string;
    photo?: string;
    password?: string;
  }) => apiRequest('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) => apiRequest(`/students/${id}`, { method: 'DELETE' }),
  getProfile: () => apiRequest('/students/profile'),
  getTimetable: () => apiRequest('/students/timetable'),
  getAttendance: () => apiRequest('/students/attendance')
};

// ==========================================
// 2. RESULTS API (MySQL results & academic_results)
// ==========================================
export const resultApi = {
  getAll: () => apiRequest('/results'),
  getStudentResults: (studentId: number | string) => apiRequest(`/results/student/${studentId}`),
  saveScore: (data: {
    student_id: number;
    subject_id: number;
    term?: string;
    session?: string;
    ca_score: number;
    exam_score: number;
    teacher_comment?: string;
    principal_comment?: string;
  }) => apiRequest('/results', { method: 'POST', body: JSON.stringify(data) }),
  getReportCard: (studentId: number | string, term = 'Term 1') => apiRequest(`/results/report-card/${studentId}?term=${encodeURIComponent(term)}`)
};

// ==========================================
// 3. ASSIGNMENTS API (MySQL assignments & assignment_submissions)
// ==========================================
export const assignmentApi = {
  getAll: () => apiRequest('/assignments'),
  create: (data: {
    teacher_id?: number;
    subject_id: number;
    class_id?: number;
    title: string;
    description: string;
    deadline?: string;
  }) => apiRequest('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  submit: (data: { assignment_id: number; submission_file: string; student_id?: number }) =>
    apiRequest('/assignments/submit', { method: 'POST', body: JSON.stringify(data) }),
  grade: (data: { student_id?: number; assignment_id?: number; submission_id?: number; score: number; teacher_feedback?: string }) =>
    apiRequest('/assignments/grade', { method: 'POST', body: JSON.stringify(data) })
};

// ==========================================
// 4. CBT EXAMS API (MySQL exams, questions & exam_attempts)
// ==========================================
export const examApi = {
  getAll: () => apiRequest('/exams'),
  getQuestions: (examId: number | string) => apiRequest(`/exams/${examId}/questions`),
  submitExam: (examId: number | string, answers: Record<number, string>, studentId?: number) =>
    apiRequest(`/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify({ answers, student_id: studentId }) }),
  recordAttempt: (data: { student_id?: number; exam_id?: number; score: number; percentage: number }) =>
    apiRequest('/exams/attempt', { method: 'POST', body: JSON.stringify(data) }),
  getAttempts: (studentId: number | string) => apiRequest(`/exams/attempts/student/${studentId}`)
};

// ==========================================
// 5. CURRICULUM API (MySQL subjects, topics, lessons & files)
// ==========================================
export const curriculumApi = {
  getSubjects: () => apiRequest('/curriculum/subjects'),
  getTopics: (subjectId?: number, classLevel?: string) => {
    const params = new URLSearchParams();
    if (subjectId) params.append('subject_id', String(subjectId));
    if (classLevel) params.append('class_level', classLevel);
    return apiRequest(`/curriculum/topics?${params.toString()}`);
  },
  getLessons: (topicId?: number) => apiRequest(`/curriculum/lessons${topicId ? `?topic_id=${topicId}` : ''}`),
  getFiles: (category?: string) => apiRequest(`/curriculum/files${category ? `?category=${encodeURIComponent(category)}` : ''}`)
};

// ==========================================
// 6. ATTENDANCE API (MySQL attendance)
// ==========================================
export const attendanceApi = {
  mark: (data: { student_id: number; class_id?: number; teacher_id?: number; date: string; status: 'Present' | 'Absent' | 'Late' }) =>
    apiRequest('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  getClassAttendance: (classId: number | string, date?: string) =>
    apiRequest(`/attendance/class/${classId}${date ? `?date=${date}` : ''}`),
  getStudentAttendance: (studentId: number | string) => apiRequest(`/attendance/student/${studentId}`)
};

// ==========================================
// 7. AI LEARNING API (MySQL ai_chat_history & ai_recommendations)
// ==========================================
export const aiApi = {
  saveChat: (data: { student_id?: number; question: string; response: string }) =>
    apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (studentId: number | string) => apiRequest(`/ai/chat/${studentId}`),
  saveRecommendation: (data: { student_id?: number; weak_subject?: string; recommendation: string }) =>
    apiRequest('/ai/recommendations', { method: 'POST', body: JSON.stringify(data) }),
  getRecommendations: (studentId: number | string) => apiRequest(`/ai/recommendations/${studentId}`)
};

// ==========================================
// 8. NOTIFICATIONS API (MySQL notifications)
// ==========================================
export const notificationApi = {
  getForUser: (userId: number | string) => apiRequest(`/notifications/${userId}`),
  create: (data: { user_id: number; title: string; message: string; type?: string }) =>
    apiRequest('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  markRead: (id: number | string) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' })
};

// ==========================================
// 9. DATABASE BACKUP API (MySQL Backups)
// ==========================================
export const backupApi = {
  runBackup: (type: 'daily' | 'weekly' | 'monthly' = 'daily') =>
    apiRequest('/backup/run', { method: 'POST', body: JSON.stringify({ type }) }),
  listBackups: () => apiRequest('/backup/list')
};

// ==========================================
// 10. DIGITAL IDENTITY & PASSPORT API (MySQL profile_images)
// ==========================================
export const imageApi = {
  uploadPassport: (data: {
    user_id?: number;
    student_id?: number;
    parent_id?: number;
    teacher_id?: number;
    image_type: 'student_passport' | 'parent_passport' | 'father_passport' | 'mother_passport' | 'guardian_passport' | 'teacher_passport';
    base64_image?: string;
    image_url?: string;
  }) => apiRequest('/images/upload', { method: 'POST', body: JSON.stringify(data) }),

  getStudentIdentity: (studentId: number | string) =>
    apiRequest(`/images/student/${studentId}`),

  getDirectory: (params?: { search?: string; classLevel?: string; department?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.classLevel) q.append('classLevel', params.classLevel);
    if (params?.department) q.append('department', params.department);
    return apiRequest(`/images/directory?${q.toString()}`);
  },

  updateEmergencyContact: (studentId: number | string, data: {
    name: string;
    phone: string;
    relationship?: string;
    address?: string;
    photo?: string;
  }) => apiRequest(`/images/emergency/${studentId}`, { method: 'PUT', body: JSON.stringify(data) })
};

