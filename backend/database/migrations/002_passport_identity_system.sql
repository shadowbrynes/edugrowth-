-- ==========================================================
-- ExcelMind Student Digital Directory & Passport Image System
-- Database: excelmind_academic
-- ==========================================================

USE excelmind_academic;

-- 1. Create profile_images table
CREATE TABLE IF NOT EXISTS profile_images (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  image_type ENUM('student_passport', 'parent_passport', 'teacher_passport', 'guardian_passport') NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  uploaded_by BIGINT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pimg_user (user_id),
  INDEX idx_pimg_type (image_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
