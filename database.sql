-- =============================================================================
-- ExcelMind Academic Companion Platform - Database Schema & Seed Data
-- Database Engine: MySQL 8.0+
-- Database Name: excelmind_academic
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `excelmind_academic` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `excelmind_academic`;

-- Disable foreign key checks for clean re-creation
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Administrator', 'Teacher', 'Student', 'Parent') NOT NULL DEFAULT 'Student',
  `profile_image` VARCHAR(255) NULL,
  `status` ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. Table: classes
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `class_id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_name` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `academic_session` VARCHAR(50) NOT NULL DEFAULT '2025/2026'
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Table: parents
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `parents`;
CREATE TABLE `parents` (
  `parent_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `occupation` VARCHAR(150) NULL,
  `address` TEXT NULL,
  `relationship` VARCHAR(50) NOT NULL DEFAULT 'Parent',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Table: students
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `student_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `admission_number` VARCHAR(50) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `date_of_birth` DATE NULL,
  `class_id` INT NOT NULL,
  `department` VARCHAR(100) NOT NULL DEFAULT 'Science & Technology',
  `academic_level` VARCHAR(50) NOT NULL DEFAULT 'SSS 3',
  `address` TEXT NULL,
  `parent_id` INT NULL,
  `enrollment_date` DATE NULL,
  `photo` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT,
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`parent_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. Table: teachers
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `teacher_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `employee_number` VARCHAR(50) NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `subject_specialization` VARCHAR(150) NOT NULL,
  `qualification` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NOT NULL,
  `address` TEXT NULL,
  `date_joined` DATE NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. Table: subjects
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `subject_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject_name` VARCHAR(150) NOT NULL,
  `subject_code` VARCHAR(50) NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `teacher_id` INT NULL,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. Table: timetable
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `timetable`;
CREATE TABLE `timetable` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `room` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. Table: assignments
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `assignment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject_id` INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `deadline` DATETIME NOT NULL,
  `attachment` VARCHAR(255) NULL,
  `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. Table: assignment_submission
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `assignment_submission`;
CREATE TABLE `assignment_submission` (
  `submission_id` INT AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `submission_file` VARCHAR(255) NULL,
  `submission_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `score` DECIMAL(5,2) NULL,
  `teacher_feedback` TEXT NULL,
  `status` ENUM('pending', 'submitted', 'graded') NOT NULL DEFAULT 'submitted',
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`assignment_id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 10. Table: exams
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `exam_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subject_id` INT NOT NULL,
  `exam_type` ENUM('WAEC', 'NECO', 'JAMB', 'School Term') NOT NULL DEFAULT 'School Term',
  `duration` INT NOT NULL COMMENT 'Duration in minutes',
  `total_questions` INT NOT NULL,
  `created_by` INT NOT NULL,
  `exam_date` DATETIME NOT NULL,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `teachers`(`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 11. Table: questions
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `question_id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `option_a` TEXT NOT NULL,
  `option_b` TEXT NOT NULL,
  `option_c` TEXT NOT NULL,
  `option_d` TEXT NOT NULL,
  `correct_answer` ENUM('A', 'B', 'C', 'D') NOT NULL,
  `explanation` TEXT NULL,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 12. Table: student_exam_results
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_exam_results`;
CREATE TABLE `student_exam_results` (
  `result_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `exam_id` INT NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `grade` VARCHAR(10) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `exam_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 13. Table: academic_results
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `academic_results`;
CREATE TABLE `academic_results` (
  `result_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT 'Term 1',
  `session` VARCHAR(50) NOT NULL DEFAULT '2025/2026',
  `ca_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Continuous assessment out of 30',
  `exam_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Exam out of 70',
  `total_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Total score out of 100',
  `grade` VARCHAR(10) NOT NULL,
  `teacher_comment` TEXT NULL,
  `principal_comment` TEXT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 14. Table: attendance
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `attendance_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
  `teacher_id` INT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 15. Table: messages
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `message_id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `attachment` VARCHAR(255) NULL,
  `read_status` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 16. Table: password_reset_tokens
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expiry_time` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 17. Table: curriculum_framework
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `curriculum_framework`;
CREATE TABLE `curriculum_framework` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `standard_name` VARCHAR(100) NOT NULL COMMENT 'e.g. NERDC, WAEC, NECO, JAMB, BECE',
  `level_category` ENUM('Basic Education', 'Senior Secondary') NOT NULL,
  `academic_level` VARCHAR(20) NOT NULL COMMENT 'e.g. JSS1, JSS2, JSS3, SS1, SS2, SS3',
  `subject_name` VARCHAR(150) NOT NULL,
  `nerdc_code` VARCHAR(50) NOT NULL,
  `is_compulsory` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 18. Table: student_subjects
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_subjects`;
CREATE TABLE `student_subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `compulsory_or_elective` ENUM('compulsory', 'elective') NOT NULL DEFAULT 'compulsory',
  `status` ENUM('active', 'pending', 'dropped') NOT NULL DEFAULT 'active',
  `assigned_date` DATE NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 19. Table: topics
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `topics`;
CREATE TABLE `topics` (
  `topic_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject_id` INT NOT NULL,
  `academic_level` VARCHAR(20) NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT 'Term 1',
  `week_number` INT NOT NULL,
  `topic_name` VARCHAR(255) NOT NULL,
  `learning_objectives` TEXT NOT NULL,
  `exam_frequency` ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'High',
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 20. Table: lessons
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `lesson_id` INT AUTO_INCREMENT PRIMARY KEY,
  `topic_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 40,
  `author_id` INT NOT NULL,
  `status` ENUM('Draft', 'Pending Review', 'Approved', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
  `ai_confidence_score` DECIMAL(5,2) NULL,
  `lesson_plan` TEXT NOT NULL,
  `teacher_notes` TEXT NOT NULL,
  `student_notes` LONGTEXT NOT NULL,
  `homework` TEXT NULL,
  `revision_summary` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `teachers`(`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 21. Table: lesson_progress
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `lesson_progress`;
CREATE TABLE `lesson_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `is_completed` BOOLEAN NOT NULL DEFAULT FALSE,
  `time_spent_seconds` INT NOT NULL DEFAULT 0,
  `completed_at` TIMESTAMP NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 22. Table: quiz_attempts
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `quiz_attempts`;
CREATE TABLE `quiz_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `total` INT NOT NULL,
  `attempt_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 23. Table: ai_recommendations
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ai_recommendations`;
CREATE TABLE `ai_recommendations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `diagnosis` TEXT NOT NULL,
  `action_plan` TEXT NOT NULL,
  `priority` ENUM('high', 'medium', 'normal') NOT NULL DEFAULT 'normal',
  `status` ENUM('active', 'completed', 'dismissed') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 24. Table: revision_plans
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `revision_plans`;
CREATE TABLE `revision_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `exam_target` VARCHAR(100) NOT NULL COMMENT 'e.g. WAEC May/June 2027',
  `exam_date` DATE NOT NULL,
  `target_grade` VARCHAR(50) NOT NULL,
  `weekly_json_schedule` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 25. Table: student_rewards
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_rewards`;
CREATE TABLE `student_rewards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `points` INT NOT NULL DEFAULT 0,
  `badges` VARCHAR(255) NOT NULL,
  `achievement` VARCHAR(255) NOT NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 26. Table: learning_analytics
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `learning_analytics`;
CREATE TABLE `learning_analytics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `learning_hours` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  `completed_lessons_count` INT NOT NULL DEFAULT 0,
  `average_quiz_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `study_streak_days` INT NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 27. Table: content_reviews
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `content_reviews`;
CREATE TABLE `content_reviews` (
  `review_id` INT AUTO_INCREMENT PRIMARY KEY,
  `lesson_id` INT NOT NULL,
  `reviewer_id` INT NOT NULL,
  `review_stage` ENUM('AI_Audit', 'Admin_Approval', 'Final_Publish') NOT NULL,
  `feedback` TEXT NULL,
  `decision` ENUM('Approved', 'Rejected', 'Needs_Revision') NOT NULL,
  `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SEED DATA (Default Accounts, Classes, Subjects, Questions, and Records)
-- All default passwords are: Password@123
-- Bcrypt hash below corresponds to: Password@123 ($2a$10$7vMhU2yYtG3XfF1rK6bXUegsK15m5VwQh0l0g5M.H5kP2J7mG7i8a)
-- =============================================================================

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `role`, `profile_image`, `status`) VALUES
(1, 'System', 'Administrator', 'admin@excelmind.edu.ng', '+2348011223344', '$2a$10$7vMhU2yYtG3XfF1rK6bXUegsK15m5VwQh0l0g5M.H5kP2J7mG7i8a', 'Administrator', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', 'Active'),
(2, 'Kenneth', 'Okon', 'k.okon@excelmind.edu.ng', '+2348022334455', '$2a$10$7vMhU2yYtG3XfF1rK6bXUegsK15m5VwQh0l0g5M.H5kP2J7mG7i8a', 'Teacher', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', 'Active'),
(3, 'Michael', 'Doe', 'parent.doe@excelmind.edu.ng', '+2348033445566', '$2a$10$7vMhU2yYtG3XfF1rK6bXUegsK15m5VwQh0l0g5M.H5kP2J7mG7i8a', 'Parent', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120', 'Active'),
(4, 'John', 'Doe', 'john.doe@excelmind.edu.ng', '+2348044556677', '$2a$10$7vMhU2yYtG3XfF1rK6bXUegsK15m5VwQh0l0g5M.H5kP2J7mG7i8a', 'Student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120', 'Active');

INSERT INTO `classes` (`class_id`, `class_name`, `level`, `department`, `academic_session`) VALUES
(1, 'SSS 3 Gold', 'Senior Secondary 3', 'Science & Technology', '2025/2026'),
(2, 'SSS 3 Silver', 'Senior Secondary 3', 'Arts & Social Science', '2025/2026'),
(3, 'SSS 2 Gold', 'Senior Secondary 2', 'Science & Technology', '2025/2026');

INSERT INTO `parents` (`parent_id`, `user_id`, `first_name`, `last_name`, `phone`, `email`, `occupation`, `address`, `relationship`) VALUES
(1, 3, 'Michael', 'Doe', '+2348033445566', 'parent.doe@excelmind.edu.ng', 'Senior Petroleum Engineer', 'Plot 14 Victoria Island, Lagos', 'Father');

INSERT INTO `students` (`student_id`, `user_id`, `admission_number`, `first_name`, `last_name`, `gender`, `date_of_birth`, `class_id`, `department`, `academic_level`, `address`, `parent_id`, `enrollment_date`, `photo`) VALUES
(1, 4, 'EXM-2025-0842', 'John', 'Doe', 'Male', '2008-05-14', 1, 'Science & Technology', 'SSS 3', 'Plot 14 Victoria Island, Lagos', 1, '2022-09-10', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120');

INSERT INTO `teachers` (`teacher_id`, `user_id`, `employee_number`, `department`, `subject_specialization`, `qualification`, `phone`, `address`, `date_joined`) VALUES
(1, 2, 'EMP-PHY-01', 'Science & Technology', 'Physics & Applied Mechanics', 'Ph.D Physics, M.Sc Edu', '+2348022334455', 'Staff Quarters B2, ExcelMind Campus', '2019-08-15');

INSERT INTO `subjects` (`subject_id`, `subject_name`, `subject_code`, `department`, `teacher_id`) VALUES
(1, 'Physics', 'PHY 302', 'Science & Technology', 1),
(2, 'General Mathematics', 'MTH 301', 'Mathematics', 1),
(3, 'Chemistry', 'CHM 303', 'Science & Technology', 1),
(4, 'English Language', 'ENG 304', 'Languages', NULL);

INSERT INTO `exams` (`exam_id`, `title`, `subject_id`, `exam_type`, `duration`, `total_questions`, `created_by`, `exam_date`) VALUES
(1, 'WAEC SSSCE Mathematics National Standard Mock 2025', 2, 'WAEC', 45, 15, 1, '2025-10-15 10:00:00'),
(2, 'JAMB UTME Comprehensive Physics CBT Simulation', 1, 'JAMB', 30, 10, 1, '2025-10-18 11:30:00');

INSERT INTO `questions` (`question_id`, `exam_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`) VALUES
(1, 1, 'Solve for x if 3^(2x - 1) = 81.', 'x = 2', 'x = 2.5', 'x = 3', 'x = 4', 'B', '81 = 3⁴. 2x - 1 = 4 => 2x = 5 => x = 2.5.'),
(2, 1, 'If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, find log₁₀ 72.', '1.8572', '1.7581', '1.9214', '1.6980', 'A', '72 = 2³ × 3² = 3(0.3010) + 2(0.4771) = 1.8572.'),
(3, 2, 'A body accelerates uniformly at 4 m/s² for 5 seconds from rest. Calculate distance covered.', '20 m', '50 m', '100 m', '40 m', 'B', 's = ut + 0.5at² = 0 + 0.5(4)(25) = 50m.');

INSERT INTO `academic_results` (`result_id`, `student_id`, `subject_id`, `term`, `session`, `ca_score`, `exam_score`, `total_score`, `grade`, `teacher_comment`, `principal_comment`) VALUES
(1, 1, 2, 'Term 1', '2025/2026', 28.00, 61.00, 89.00, 'A1', 'Brilliant mathematical proofs and problem solving.', 'Consistently demonstrates superior cognitive mastery.'),
(2, 1, 1, 'Term 1', '2025/2026', 25.00, 57.00, 82.00, 'A1', 'Superb laboratory acumen and theoretical understanding.', 'Exemplary scientific discipline.');

INSERT INTO `attendance` (`attendance_id`, `student_id`, `class_id`, `date`, `status`, `teacher_id`) VALUES
(1, 1, 1, CURRENT_DATE, 'Present', 1);

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `message`, `read_status`) VALUES
(1, 2, 4, 'Hello John! Your transformer eddy current assignment was exceptional. Keep focused.', 1),
(2, 4, 2, 'Thank you Dr. Okon! Should we apply Lenz law directly in question 4?', 1);
