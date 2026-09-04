-- =============================================================================
-- ExcelMind Academic Companion Platform - Production Database Architecture
-- Database Name: excelmind_academic
-- Dialect: MySQL 8.0+
-- Schema: Complete School Information System + LMS + CBT Platform + AI Engine
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `excelmind_academic`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `excelmind_academic`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Central user authentication and credential storage
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NULL,
  `password_hash` TEXT NOT NULL,
  `role` ENUM('admin', 'teacher', 'student', 'parent') NOT NULL,
  `profile_image` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. Table: schools
-- Stores accredited schools and campuses
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `schools`;
CREATE TABLE `schools` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `school_name` VARCHAR(200) NOT NULL,
  `school_code` VARCHAR(50) NOT NULL UNIQUE,
  `address` TEXT NULL,
  `phone` VARCHAR(30) NULL,
  `email` VARCHAR(150) NULL,
  `logo` VARCHAR(255) NULL,
  `website` VARCHAR(150) NULL,
  `subscription_plan` VARCHAR(50) NOT NULL DEFAULT 'Enterprise',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_schools_code` (`school_code`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Table: school_settings
-- Configures colors, grading benchmarks, and calendar for each school
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `school_settings`;
CREATE TABLE `school_settings` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `school_id` BIGINT NOT NULL,
  `school_colour` VARCHAR(50) NOT NULL DEFAULT '#111B5E',
  `grading_system` VARCHAR(100) NOT NULL DEFAULT 'WAEC_Standard',
  `academic_calendar` VARCHAR(100) NOT NULL DEFAULT 'Term_Based_3Terms',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Table: departments
-- Tracks academic faculties: Science, Commercial, Arts & Humanities
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `department_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. Table: classes
-- Specific class arms (e.g. SSS 3 Gold, SSS 2 Silver, JSS 1 Diamond)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `school_id` BIGINT NULL,
  `class_name` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `department_id` BIGINT NULL,
  `class_teacher_id` BIGINT NULL,
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  INDEX `idx_classes_level` (`level`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. Table: parents
-- Guardian profiles linked to users table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `parents`;
CREATE TABLE `parents` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `school_id` BIGINT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `relationship` VARCHAR(50) NOT NULL DEFAULT 'Parent',
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `occupation` VARCHAR(150) NULL,
  `address` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. Table: students
-- Primary student registry linked to users, classes, and parents
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `school_id` BIGINT NULL,
  `admission_number` VARCHAR(50) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `date_of_birth` DATE NULL,
  `photo` VARCHAR(255) NULL,
  `class_id` BIGINT NULL,
  `department_id` BIGINT NULL,
  `academic_level` VARCHAR(50) NOT NULL DEFAULT 'SSS 3',
  `religion` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `state` VARCHAR(100) NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
  `parent_id` BIGINT NULL,
  `admission_date` DATE NULL,
  `status` ENUM('active', 'inactive', 'graduated', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE SET NULL,
  INDEX `idx_students_admission` (`admission_number`),
  INDEX `idx_students_level` (`academic_level`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. Table: student_profiles
-- Rich demographic, medical, and psychological learning style metrics
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_profiles`;
CREATE TABLE `student_profiles` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL UNIQUE,
  `previous_school` VARCHAR(200) NULL,
  `blood_group` VARCHAR(10) NULL,
  `medical_information` TEXT NULL,
  `learning_style` VARCHAR(100) NOT NULL DEFAULT 'Visual & Analytical',
  `career_interest` VARCHAR(150) NOT NULL DEFAULT 'Engineering / Medicine',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. Table: parent_student_relationship
-- Supports multiple children per guardian
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `parent_student_relationship`;
CREATE TABLE `parent_student_relationship` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `parent_id` BIGINT NOT NULL,
  `student_id` BIGINT NOT NULL,
  `relationship_type` VARCHAR(50) NOT NULL DEFAULT 'Father',
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_parent_student` (`parent_id`, `student_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 10. Table: teachers
-- Faculty staff registry linked to users table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `school_id` BIGINT NULL,
  `employee_number` VARCHAR(50) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `qualification` VARCHAR(100) NULL,
  `specialization` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `address` TEXT NULL,
  `employment_date` DATE NULL,
  `status` ENUM('active', 'inactive', 'on_leave') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL,
  INDEX `idx_teachers_emp_no` (`employee_number`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 11. Table: academic_sessions
-- Academic year records (e.g. 2025/2026, 2026/2027)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `academic_sessions`;
CREATE TABLE `academic_sessions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `session_name` VARCHAR(50) NOT NULL UNIQUE,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `status` ENUM('active', 'upcoming', 'completed') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 12. Table: terms
-- Specific terms within an academic year
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `terms`;
CREATE TABLE `terms` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `term_name` VARCHAR(50) NOT NULL,
  `session_id` BIGINT NOT NULL,
  FOREIGN KEY (`session_id`) REFERENCES `academic_sessions`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_term_session` (`term_name`, `session_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 13. Table: subjects
-- Subjects offered across Nigerian secondary curriculum
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `subject_name` VARCHAR(150) NOT NULL,
  `subject_code` VARCHAR(50) NOT NULL UNIQUE,
  `department_id` BIGINT NULL,
  `description` TEXT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  INDEX `idx_subjects_code` (`subject_code`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 14. Table: curriculum_levels
-- Standard NERDC education stages (JSS1-3, SS1-3)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `curriculum_levels`;
CREATE TABLE `curriculum_levels` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `class_level` VARCHAR(20) NOT NULL UNIQUE,
  `education_stage` VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 15. Table: curriculum_subjects
-- Maps subjects to specific levels and terms
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `curriculum_subjects`;
CREATE TABLE `curriculum_subjects` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `subject_id` BIGINT NOT NULL,
  `level_id` BIGINT NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT 'Term 1',
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`level_id`) REFERENCES `curriculum_levels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 16. Table: topics
-- Statutory syllabus topics mapped to subjects and levels
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `topics`;
CREATE TABLE `topics` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `subject_id` BIGINT NOT NULL,
  `class_level` VARCHAR(20) NOT NULL,
  `topic_name` VARCHAR(255) NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT 'Term 1',
  `description` TEXT NULL,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  INDEX `idx_topics_subject_level` (`subject_id`, `class_level`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 17. Table: lessons
-- Structured 10-point pedagogical lesson plans with approval workflow
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `topic_id` BIGINT NOT NULL,
  `lesson_title` VARCHAR(255) NOT NULL,
  `learning_objectives` TEXT NOT NULL,
  `lesson_content` LONGTEXT NOT NULL,
  `examples` TEXT NULL,
  `summary` TEXT NULL,
  `assignment` TEXT NULL,
  `created_by` BIGINT NULL,
  `status` ENUM('Draft', 'Pending Review', 'Approved', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_lessons_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 18. Table: courses
-- Learning Hub interactive courses
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `subject_id` BIGINT NOT NULL,
  `teacher_id` BIGINT NULL,
  `course_title` VARCHAR(255) NOT NULL,
  `course_description` TEXT NULL,
  `thumbnail` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 19. Table: course_modules
-- Course syllabus module breakdown
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `course_modules`;
CREATE TABLE `course_modules` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `course_id` BIGINT NOT NULL,
  `module_title` VARCHAR(255) NOT NULL,
  `module_order` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 20. Table: course_lessons
-- Specific video lectures and document resources inside a course module
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `course_lessons`;
CREATE TABLE `course_lessons` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `module_id` BIGINT NOT NULL,
  `lesson_title` VARCHAR(255) NOT NULL,
  `video_url` VARCHAR(255) NULL,
  `document_url` VARCHAR(255) NULL,
  `duration` VARCHAR(50) NULL,
  `content` LONGTEXT NULL,
  FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 21. Table: student_courses
-- Tracks student enrollment in Learning Hub courses
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_courses`;
CREATE TABLE `student_courses` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `course_id` BIGINT NOT NULL,
  `progress_percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `enrollment_date` DATE NULL,
  `status` ENUM('active', 'completed', 'dropped') NOT NULL DEFAULT 'active',
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_student_course` (`student_id`, `course_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 22. Table: learning_progress
-- Granular topic and lesson mastery tracking
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `learning_progress`;
CREATE TABLE `learning_progress` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_id` BIGINT NOT NULL,
  `completion_status` ENUM('in_progress', 'completed') NOT NULL DEFAULT 'in_progress',
  `score` DECIMAL(5,2) NULL,
  `time_spent` INT NOT NULL DEFAULT 0 COMMENT 'Duration in seconds',
  `completed_at` TIMESTAMP NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 23. Table: assignments
-- Tasks, homework, and laboratory assignments
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `teacher_id` BIGINT NOT NULL,
  `subject_id` BIGINT NOT NULL,
  `class_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `attachment` VARCHAR(255) NULL,
  `deadline` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 24. Table: assignment_submissions
-- Student submissions, grades, and teacher remarks
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `assignment_submissions`;
CREATE TABLE `assignment_submissions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `assignment_id` BIGINT NOT NULL,
  `student_id` BIGINT NOT NULL,
  `file_url` VARCHAR(255) NULL,
  `score` DECIMAL(5,2) NULL,
  `teacher_comment` TEXT NULL,
  `submitted_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 25. Table: attendance
-- Daily classroom and period attendance register
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `class_id` BIGINT NOT NULL,
  `teacher_id` BIGINT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL,
  INDEX `idx_attendance_date` (`date`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 26. Table: exams
-- High-stakes CBT examinations (WAEC, NECO, JAMB, Termly Mocks)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `school_id` BIGINT NULL,
  `subject_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `exam_type` VARCHAR(50) NOT NULL DEFAULT 'WAEC',
  `duration` INT NOT NULL DEFAULT 45,
  `total_questions` INT NOT NULL DEFAULT 20,
  `created_by` BIGINT NULL,
  `exam_date` DATETIME NULL,
  FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 27. Table: questions
-- CBT question bank with rationales and difficulty calibration
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `exam_id` BIGINT NOT NULL,
  `question_text` TEXT NOT NULL,
  `option_a` TEXT NOT NULL,
  `option_b` TEXT NOT NULL,
  `option_c` TEXT NOT NULL,
  `option_d` TEXT NOT NULL,
  `correct_answer` ENUM('A', 'B', 'C', 'D') NOT NULL,
  `explanation` TEXT NULL,
  `difficulty_level` ENUM('Easy', 'Medium', 'Hard') NOT NULL DEFAULT 'Medium',
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 28. Table: exam_attempts
-- CBT exam session tracking, timers, and scoring
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `exam_attempts`;
CREATE TABLE `exam_attempts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `exam_id` BIGINT NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `start_time` DATETIME NULL,
  `end_time` DATETIME NULL,
  `status` ENUM('in_progress', 'completed', 'abandoned') NOT NULL DEFAULT 'completed',
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 29. Table: results
-- Academic evaluation records per subject and term
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `results`;
CREATE TABLE `results` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `subject_id` BIGINT NOT NULL,
  `term_id` BIGINT NOT NULL,
  `ca_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Continuous Assessment out of 30',
  `exam_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Terminal Exam out of 70',
  `total_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Total score out of 100',
  `grade` VARCHAR(10) NOT NULL,
  `remark` VARCHAR(100) NULL,
  `teacher_comment` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`term_id`) REFERENCES `terms`(`id`) ON DELETE CASCADE,
  INDEX `idx_results_student` (`student_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 30. Table: report_cards
-- Termly composite broadsheet and transcript certificates
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `report_cards`;
CREATE TABLE `report_cards` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `term_id` BIGINT NOT NULL,
  `overall_average` DECIMAL(5,2) NOT NULL,
  `position` VARCHAR(20) NULL,
  `teacher_comment` TEXT NULL,
  `principal_comment` TEXT NULL,
  `generated_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`term_id`) REFERENCES `terms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 31. Table: ai_recommendations
-- Personalized diagnostics and prescriptive interventions
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ai_recommendations`;
CREATE TABLE `ai_recommendations` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `weak_subject` VARCHAR(150) NOT NULL,
  `recommendation` TEXT NOT NULL,
  `generated_by` VARCHAR(100) NOT NULL DEFAULT 'Gemini AI',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 32. Table: ai_chat_history
-- Transcripts of student interactions with the AI Tutor
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ai_chat_history`;
CREATE TABLE `ai_chat_history` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `question` TEXT NOT NULL,
  `response` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 33. Table: messages
-- Internal messaging system (Teachers, Parents, Students)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `sender_id` BIGINT NOT NULL,
  `receiver_id` BIGINT NOT NULL,
  `message` TEXT NOT NULL,
  `attachment` VARCHAR(255) NULL,
  `read_status` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_messages_sender_receiver` (`sender_id`, `receiver_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 34. Table: notifications
-- Real-time alerts for assignments, exams, and grades
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'academic',
  `status` ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notifications_user` (`user_id`, `status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 35. Table: files
-- Media repository for PDFs, past questions, video assets
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `uploaded_by` BIGINT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(100) NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'document',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 36. Table: password_reset_tokens
-- Cryptographic tokens for secure two-step password recovery
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 37. Table: audit_logs
-- Security logs and administrative action auditing
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SAMPLE SEED DATA (Institutions, Users, Curriculum, Classes, Exams, Results)
-- All default user passwords are: Password@123
-- =============================================================================

-- 1. Schools & Settings
INSERT INTO `schools` (`id`, `school_name`, `school_code`, `address`, `phone`, `email`, `logo`, `website`, `subscription_plan`) VALUES
(1, 'ExcelMind International College', 'EXM-LAG-001', 'Plot 14 Victoria Island, Lagos, Nigeria', '+2348011223344', 'info@excelmind.edu.ng', 'https://edugrowth-tawny.vercel.app/logo.png', 'https://excelmind.edu.ng', 'Enterprise');

INSERT INTO `school_settings` (`id`, `school_id`, `school_colour`, `grading_system`, `academic_calendar`) VALUES
(1, 1, '#111B5E', 'WAEC_Standard', 'Term_Based_3Terms');

-- 2. Users (Admin, Teacher, Parent, Student)
-- Password hash: $2a$10$oS34iNrV4i54aScddqfBaOZQ3a3FYRv3DRksH8IHD5e322yU.kIkO (Password@123)
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `role`, `profile_image`, `status`) VALUES
(1, 'System', 'Administrator', 'admin@excelmind.edu.ng', '+2348011223344', '$2a$10$oS34iNrV4i54aScddqfBaOZQ3a3FYRv3DRksH8IHD5e322yU.kIkO', 'admin', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', 'active'),
(2, 'Kenneth', 'Okon', 'k.okon@excelmind.edu.ng', '+2348022334455', '$2a$10$oS34iNrV4i54aScddqfBaOZQ3a3FYRv3DRksH8IHD5e322yU.kIkO', 'teacher', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', 'active'),
(3, 'Michael', 'Doe', 'parent.doe@excelmind.edu.ng', '+2348033445566', '$2a$10$oS34iNrV4i54aScddqfBaOZQ3a3FYRv3DRksH8IHD5e322yU.kIkO', 'parent', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120', 'active'),
(4, 'John', 'Doe', 'john.doe@excelmind.edu.ng', '+2348044556677', '$2a$10$oS34iNrV4i54aScddqfBaOZQ3a3FYRv3DRksH8IHD5e322yU.kIkO', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120', 'active');

-- 3. Departments
INSERT INTO `departments` (`id`, `department_name`, `description`) VALUES
(1, 'Science', 'Physical, Biological and Applied Engineering Sciences'),
(2, 'Commercial', 'Business Studies, Accounting, Commerce and Financial Economics'),
(3, 'Arts', 'Humanities, Languages, Literature, Law and Social Sciences');

-- 4. Classes
INSERT INTO `classes` (`id`, `school_id`, `class_name`, `level`, `department_id`, `class_teacher_id`) VALUES
(1, 1, 'SSS 3 Gold', 'SS3', 1, 2),
(2, 1, 'SSS 3 Silver', 'SS3', 2, NULL),
(3, 1, 'SSS 2 Diamond', 'SS2', 1, 2),
(4, 1, 'JSS 1 Ruby', 'JSS1', NULL, NULL);

-- 5. Parents
INSERT INTO `parents` (`id`, `user_id`, `school_id`, `first_name`, `last_name`, `relationship`, `phone`, `email`, `occupation`, `address`) VALUES
(1, 3, 1, 'Michael', 'Doe', 'Father', '+2348033445566', 'parent.doe@excelmind.edu.ng', 'Senior Petroleum Engineer', 'Plot 14 Victoria Island, Lagos');

-- 6. Students
INSERT INTO `students` (`id`, `user_id`, `school_id`, `admission_number`, `first_name`, `last_name`, `gender`, `date_of_birth`, `photo`, `class_id`, `department_id`, `academic_level`, `religion`, `address`, `state`, `country`, `parent_id`, `admission_date`, `status`) VALUES
(1, 4, 1, 'EXM-2025-0842', 'John', 'Doe', 'Male', '2008-05-14', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120', 1, 1, 'SSS 3', 'Christianity', 'Plot 14 Victoria Island, Lagos', 'Lagos', 'Nigeria', 1, '2022-09-10', 'active');

-- 7. Student Profiles
INSERT INTO `student_profiles` (`id`, `student_id`, `previous_school`, `blood_group`, `medical_information`, `learning_style`, `career_interest`) VALUES
(1, 1, 'Corona Secondary School', 'O+', 'No chronic allergies reported', 'Visual & Analytical', 'Aerospace Engineering');

-- 8. Parent-Student Relationship
INSERT INTO `parent_student_relationship` (`id`, `parent_id`, `student_id`, `relationship_type`) VALUES
(1, 1, 1, 'Father');

-- 9. Teachers
INSERT INTO `teachers` (`id`, `user_id`, `school_id`, `employee_number`, `first_name`, `last_name`, `gender`, `qualification`, `specialization`, `department`, `phone`, `address`, `employment_date`, `status`) VALUES
(1, 2, 1, 'EMP-PHY-001', 'Kenneth', 'Okon', 'Male', 'Ph.D Physics, M.Sc Education', 'Physics & Applied Mechanics', 'Science', '+2348022334455', 'Staff Quarters B2, ExcelMind Campus', '2019-08-15', 'active');

-- 10. Academic Sessions & Terms
INSERT INTO `academic_sessions` (`id`, `session_name`, `start_date`, `end_date`, `status`) VALUES
(1, '2025/2026', '2025-09-08', '2026-07-24', 'active'),
(2, '2026/2027', '2026-09-07', '2027-07-23', 'upcoming');

INSERT INTO `terms` (`id`, `term_name`, `session_id`) VALUES
(1, 'First Term', 1),
(2, 'Second Term', 1),
(3, 'Third Term', 1);

-- 11. Subjects
INSERT INTO `subjects` (`id`, `subject_name`, `subject_code`, `department_id`, `description`, `status`) VALUES
(1, 'Physics', 'PHY 302', 1, 'Senior Secondary Physics: Mechanics, Waves, Electricity and Modern Physics', 'active'),
(2, 'General Mathematics', 'MTH 301', 1, 'Algebra, Geometry, Trigonometry, Statistics and Calculus', 'active'),
(3, 'Chemistry', 'CHM 303', 1, 'Organic, Inorganic and Physical Chemistry', 'active'),
(4, 'English Language', 'ENG 304', 3, 'Grammar, Essay Writing, Summary and Oral Phonetics', 'active'),
(5, 'Financial Accounting', 'ACC 301', 2, 'Principles of Accounts, Ledgers and Financial Statements', 'active');

-- 12. Curriculum Levels
INSERT INTO `curriculum_levels` (`id`, `class_level`, `education_stage`) VALUES
(1, 'JSS1', 'Basic Education (Basic 7)'),
(2, 'JSS2', 'Basic Education (Basic 8)'),
(3, 'JSS3', 'Basic Education (Basic 9 / BECE)'),
(4, 'SS1', 'Senior Secondary 1'),
(5, 'SS2', 'Senior Secondary 2'),
(6, 'SS3', 'Senior Secondary 3 / WAEC WASSCE');

-- 13. Topics
INSERT INTO `topics` (`id`, `subject_id`, `class_level`, `topic_name`, `term`, `description`) VALUES
(1, 1, 'SS2', 'Motion & Kinematics', 'Term 1', 'Equations of uniformly accelerated motion, graphs and projectiles'),
(2, 1, 'SS3', 'Electromagnetic Induction & Transformers', 'Term 1', 'Faradays laws, Lenzs law, AC generators and transformers'),
(3, 2, 'SS2', 'Quadratic Equations & Parabolic Roots', 'Term 1', 'Factorization, completing square, quadratic formula and roots nature');

-- 14. Lessons
INSERT INTO `lessons` (`id`, `topic_id`, `lesson_title`, `learning_objectives`, `lesson_content`, `examples`, `summary`, `assignment`, `created_by`, `status`) VALUES
(1, 1, 'Rectilinear Motion & Velocity-Time Graphs', 'Derive the 3 equations of motion and calculate graph area for displacement', 'Uniform acceleration represents a steady rate of change of velocity over time.', 'A car accelerating from rest at 4 m/s² covers s = 0.5(4)(25) = 50m in 5s.', 'Area under v-t graph gives displacement, slope gives acceleration.', 'Solve WAEC Past Questions 2020-2024 Section B.', 2, 'Published'),
(2, 2, 'Transformers & Energy Efficiency', 'Explain step-up and step-down transformer equations and energy dissipation', 'Transformers operate on mutual electromagnetic induction between primary and secondary windings.', 'Vp/Vs = Np/Ns = Is/Ip.', 'Laminated soft iron cores eliminate eddy current dissipation.', 'Calculate secondary voltage given 2400 primary turns and 120 secondary turns.', 2, 'Published');

-- 15. Courses & Modules
INSERT INTO `courses` (`id`, `subject_id`, `teacher_id`, `course_title`, `course_description`, `thumbnail`) VALUES
(1, 1, 1, 'Comprehensive Physics Mastery (SSS 1 - 3)', 'Complete video masterclasses covering WAEC, NECO and JAMB UTME syllabus', 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600'),
(2, 2, 1, 'General Mathematics Excellence', 'Step-by-step mathematical proofs, past question dissections and shortcuts', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600');

INSERT INTO `course_modules` (`id`, `course_id`, `module_title`, `module_order`) VALUES
(1, 1, 'Module 1: Mechanics & Properties of Matter', 1),
(2, 1, 'Module 2: Electromagnetism & AC Circuits', 2);

INSERT INTO `course_lessons` (`id`, `module_id`, `lesson_title`, `video_url`, `document_url`, `duration`, `content`) VALUES
(1, 1, 'Kinematics & Velocity-Time Graphs', 'https://www.youtube.com/watch?v=motion_lesson', '/docs/kinematics.pdf', '32 mins', 'Detailed exposition on equations of motion.'),
(2, 2, 'Transformers & Mutual Induction', 'https://www.youtube.com/watch?v=transformers', '/docs/transformers.pdf', '38 mins', 'Laboratory experiment on step-up and step-down transformers.');

-- 16. Student Course Enrollment
INSERT INTO `student_courses` (`id`, `student_id`, `course_id`, `progress_percentage`, `enrollment_date`, `status`) VALUES
(1, 1, 1, 85.00, '2025-09-10', 'active'),
(2, 1, 2, 92.00, '2025-09-10', 'active');

-- 17. Assignments & Submissions
INSERT INTO `assignments` (`id`, `teacher_id`, `subject_id`, `class_id`, `title`, `description`, `attachment`, `deadline`) VALUES
(1, 1, 1, 1, 'Electromagnetic Induction & Transformer Numerical Assignment', 'Solve all 5 questions on transformer efficiency and national grid high-voltage transmission.', '/attachments/physics_hw_01.pdf', '2025-10-25 23:59:00');

INSERT INTO `assignment_submissions` (`id`, `assignment_id`, `student_id`, `file_url`, `score`, `teacher_comment`, `submitted_date`) VALUES
(1, 1, 1, '/submissions/john_doe_physics_hw1.pdf', 19.50, 'Outstanding mathematical derivations and clear step-by-step working.', CURRENT_TIMESTAMP);

-- 18. Attendance
INSERT INTO `attendance` (`id`, `student_id`, `class_id`, `teacher_id`, `date`, `status`) VALUES
(1, 1, 1, 1, CURRENT_DATE, 'Present');

-- 19. Exams, Questions & Attempts
INSERT INTO `exams` (`id`, `school_id`, `subject_id`, `title`, `exam_type`, `duration`, `total_questions`, `created_by`, `exam_date`) VALUES
(1, 1, 2, 'WAEC WASSCE Mathematics National Standard Mock 2025', 'WAEC', 45, 15, 1, '2025-10-15 10:00:00'),
(2, 1, 1, 'JAMB UTME Comprehensive Physics CBT Simulation', 'JAMB', 30, 10, 1, '2025-10-18 11:30:00');

INSERT INTO `questions` (`id`, `exam_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `difficulty_level`) VALUES
(1, 1, 'Solve for x if 3^(2x - 1) = 81.', 'x = 2', 'x = 2.5', 'x = 3', 'x = 4', 'B', '81 = 3⁴. 2x - 1 = 4 => 2x = 5 => x = 2.5.', 'Medium'),
(2, 1, 'If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, find log₁₀ 72.', '1.8572', '1.7581', '1.9214', '1.6980', 'A', '72 = 2³ × 3² = 3(0.3010) + 2(0.4771) = 1.8572.', 'Medium'),
(3, 2, 'A body accelerates uniformly at 4 m/s² for 5 seconds from rest. Calculate distance covered.', '20 m', '50 m', '100 m', '40 m', 'B', 's = ut + 0.5at² = 0 + 0.5(4)(25) = 50m.', 'Easy');

INSERT INTO `exam_attempts` (`id`, `student_id`, `exam_id`, `score`, `percentage`, `start_time`, `end_time`, `status`) VALUES
(1, 1, 1, 14.00, 93.33, '2025-10-15 10:00:00', '2025-10-15 10:38:00', 'completed');

-- 20. Results & Report Cards
INSERT INTO `results` (`id`, `student_id`, `subject_id`, `term_id`, `ca_score`, `exam_score`, `total_score`, `grade`, `remark`, `teacher_comment`) VALUES
(1, 1, 2, 1, 28.00, 61.00, 89.00, 'A1', 'Distinction', 'Brilliant mathematical proofs and problem-solving speed.'),
(2, 1, 1, 1, 25.00, 57.00, 82.00, 'A1', 'Distinction', 'Superb laboratory acumen and conceptual mastery.');

INSERT INTO `report_cards` (`id`, `student_id`, `term_id`, `overall_average`, `position`, `teacher_comment`, `principal_comment`) VALUES
(1, 1, 1, 85.50, '3rd out of 42', 'Exemplary dedication and academic discipline.', 'An outstanding candidate on track for 8 WAEC distinctions.');

-- 21. AI Recommendations & Chat History
INSERT INTO `ai_recommendations` (`id`, `student_id`, `weak_subject`, `recommendation`, `generated_by`) VALUES
(1, 1, 'Chemistry', 'Complete the Atomic Structure & Electron Configuration module before proceeding to Complex Hybridization.', 'Gemini AI');

INSERT INTO `ai_chat_history` (`id`, `student_id`, `question`, `response`) VALUES
(1, 1, 'Explain quadratic equations with examples and WAEC tips', 'Quadratic equations are polynomial equations of degree 2: ax² + bx + c = 0. Use the quadratic formula x = (-b ± √(b² - 4ac)) / 2a.');

-- 22. Messages & Notifications
INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `read_status`) VALUES
(1, 2, 4, 'Hello John! Your transformer mutual induction numericals were flawless. Well done!', 1),
(2, 4, 2, 'Thank you Dr. Okon! Should we apply Lenzs law directly in question 4?', 1);

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `status`) VALUES
(1, 4, 'Assignment Graded', 'Dr. Kenneth Okon graded your Physics assignment: 19.5/20', 'academic', 'unread');

-- 23. Audit Logs
INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `description`, `ip_address`) VALUES
(1, 1, 'DATABASE_INITIALIZATION', 'ExcelMind Complete Production Schema synchronized successfully', '127.0.0.1');
