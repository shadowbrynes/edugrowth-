-- ==========================================================
-- ExcelMind Academic Companion: Complete MySQL Database Schema
-- Database: excelmind_academic
-- ==========================================================

CREATE DATABASE IF NOT EXISTS excelmind_academic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE excelmind_academic;

-- 1. Users Table (Core Authentication)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'parent', 'admin') DEFAULT 'student',
  profile_image VARCHAR(255) NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  email VARCHAR(150),
  phone VARCHAR(30),
  address TEXT,
  logo VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  school_id BIGINT DEFAULT 1,
  department_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  school_id BIGINT DEFAULT 1,
  class_name VARCHAR(50) NOT NULL,
  level VARCHAR(20) NOT NULL,
  department VARCHAR(50) NULL,
  capacity INT DEFAULT 40,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Parents Table
CREATE TABLE IF NOT EXISTS parents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  school_id BIGINT DEFAULT 1,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  relationship VARCHAR(50),
  phone VARCHAR(30),
  phone_number VARCHAR(30),
  whatsapp_number VARCHAR(30),
  email VARCHAR(150),
  occupation VARCHAR(150),
  address TEXT,
  communication_preference ENUM('whatsapp', 'in_app', 'phone') DEFAULT 'whatsapp',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_parents_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Students Table
CREATE TABLE IF NOT EXISTS students (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  school_id BIGINT DEFAULT 1,
  admission_number VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  date_of_birth DATE NULL,
  photo VARCHAR(255) NULL,
  class_id BIGINT NULL,
  department_id BIGINT NULL,
  academic_level VARCHAR(50) DEFAULT 'SS2',
  religion VARCHAR(50) NULL,
  address TEXT NULL,
  state VARCHAR(100) NULL,
  country VARCHAR(100) DEFAULT 'Nigeria',
  parent_id BIGINT NULL,
  admission_date DATE NULL,
  status ENUM('active', 'inactive', 'graduated', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_students_adm (admission_number),
  INDEX idx_students_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  school_id BIGINT DEFAULT 1,
  employee_number VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  qualification VARCHAR(100) NULL,
  specialization VARCHAR(150) NULL,
  department VARCHAR(100) NULL,
  phone VARCHAR(30) NULL,
  phone_number VARCHAR(30) NULL,
  whatsapp_number VARCHAR(30) NULL,
  communication_status ENUM('available', 'busy', 'offline') DEFAULT 'available',
  allow_parent_contact TINYINT(1) DEFAULT 1,
  address TEXT NULL,
  employment_date DATE NULL,
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_teachers_emp (employee_number),
  INDEX idx_teachers_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Parent-Student Relationship Table
CREATE TABLE IF NOT EXISTS parent_student_relationship (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  relationship_type VARCHAR(50) DEFAULT 'Parent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_psr_parent (parent_id),
  INDEX idx_psr_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  school_id BIGINT DEFAULT 1,
  teacher_id BIGINT NULL,
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20) UNIQUE,
  department VARCHAR(50) NULL,
  category VARCHAR(50) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(50) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  level VARCHAR(50),
  term VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Topics Table (Nigerian Curriculum)
CREATE TABLE IF NOT EXISTS topics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  subject_id BIGINT NOT NULL,
  class_level VARCHAR(20) NOT NULL,
  topic_name VARCHAR(255) NOT NULL,
  term VARCHAR(50) DEFAULT 'Term 1',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_topics_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  topic_id BIGINT NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  learning_objectives TEXT,
  lesson_content LONGTEXT,
  examples TEXT,
  summary TEXT,
  assignment TEXT,
  created_by BIGINT NULL,
  status ENUM('Draft', 'Pending Review', 'Approved', 'Published', 'Archived') DEFAULT 'Published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lessons_topic (topic_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Files Table (PDFs, Videos, Assignments, Images)
CREATE TABLE IF NOT EXISTS files (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  uploaded_by BIGINT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NULL,
  file_url VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  teacher_id BIGINT NOT NULL,
  subject_id BIGINT NOT NULL,
  class_id BIGINT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  attachment VARCHAR(255) NULL,
  deadline DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  assignment_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  file_url VARCHAR(255) NULL,
  score DECIMAL(5,2) NULL,
  teacher_comment TEXT NULL,
  submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_asub_assignment (assignment_id),
  INDEX idx_asub_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  class_id BIGINT NULL,
  teacher_id BIGINT NULL,
  date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Late') DEFAULT 'Present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attendance_student (student_id),
  INDEX idx_attendance_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  school_id BIGINT DEFAULT 1,
  subject_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  exam_type VARCHAR(50) DEFAULT 'CBT',
  duration INT DEFAULT 60,
  total_questions INT DEFAULT 40,
  created_by BIGINT NULL,
  exam_date DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  exam_id BIGINT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  explanation TEXT NULL,
  difficulty_level ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  INDEX idx_questions_exam (exam_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Exam Attempts Table
CREATE TABLE IF NOT EXISTS exam_attempts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  exam_id BIGINT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME NULL,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'completed',
  INDEX idx_attempts_student (student_id),
  INDEX idx_attempts_exam (exam_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Results Table
CREATE TABLE IF NOT EXISTS results (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  subject_id BIGINT NOT NULL,
  term_id BIGINT DEFAULT 1,
  ca_score DECIMAL(5,2) DEFAULT 0,
  exam_score DECIMAL(5,2) DEFAULT 0,
  total_score DECIMAL(5,2) DEFAULT 0,
  grade VARCHAR(10) NULL,
  remark VARCHAR(100) NULL,
  teacher_comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_results_student (student_id),
  INDEX idx_results_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Academic Results Table (Full Academic Terms)
CREATE TABLE IF NOT EXISTS academic_results (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  term VARCHAR(50) DEFAULT 'Term 1',
  session VARCHAR(50) DEFAULT '2025/2026',
  ca_score DECIMAL(5,2) DEFAULT 0,
  exam_score DECIMAL(5,2) DEFAULT 0,
  total_score DECIMAL(5,2) DEFAULT 0,
  grade VARCHAR(10) NULL,
  teacher_comment TEXT NULL,
  principal_comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ares_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Report Cards Table
CREATE TABLE IF NOT EXISTS report_cards (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  term_id BIGINT DEFAULT 1,
  total_marks DECIMAL(6,2) NULL,
  average_score DECIMAL(5,2) NULL,
  class_position VARCHAR(20) NULL,
  attendance_rate DECIMAL(5,2) NULL,
  principal_remark TEXT NULL,
  teacher_remark TEXT NULL,
  issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rc_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sender_id BIGINT NOT NULL,
  receiver_id BIGINT NOT NULL,
  student_id BIGINT NULL,
  sender_role VARCHAR(30) NULL,
  receiver_role VARCHAR(30) NULL,
  message TEXT NOT NULL,
  attachment VARCHAR(255) NULL,
  message_type ENUM('text', 'file', 'image', 'system') DEFAULT 'text',
  status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_msg_sender (sender_id),
  INDEX idx_msg_receiver (receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. Communication Settings & Logs
CREATE TABLE IF NOT EXISTS communication_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT DEFAULT 1,
  working_hours_start TIME DEFAULT '08:00:00',
  working_hours_end TIME DEFAULT '17:00:00',
  allow_weekend_contact BOOLEAN DEFAULT FALSE,
  emergency_hotline VARCHAR(30) DEFAULT '+2348003923564',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS communication_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NOT NULL,
  teacher_id INT NOT NULL,
  student_id INT NULL,
  communication_type ENUM('whatsapp', 'call', 'in_app') NOT NULL,
  status VARCHAR(50) DEFAULT 'initiated',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_commlog_parent (parent_id),
  INDEX idx_commlog_teacher (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'academic',
  status ENUM('unread', 'read') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. AI Chat History Table
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  question TEXT NOT NULL,
  response LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ai_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 27. AI Recommendations Table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  weak_subject VARCHAR(150) NULL,
  recommendation TEXT NOT NULL,
  generated_by VARCHAR(100) DEFAULT 'ExcelMind AI Coach',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_airec_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 28. Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiry_time DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prt_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 29. Login Activity Table
CREATE TABLE IF NOT EXISTS login_activity (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  device VARCHAR(255) NULL,
  ip_address VARCHAR(45) NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_login_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 30. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
