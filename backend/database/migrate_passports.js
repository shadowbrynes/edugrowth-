const sequelize = require('../config/database');

async function migratePassportSystem() {
  console.log('[Migration]: Starting Student Directory & Passport System Migration...');
  try {
    await sequelize.authenticate();

    // 1. Create profile_images table
    await sequelize.query(`
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
    `);
    console.log('[Migration]: ✓ profile_images table ready.');

    // 2. Helper to add column safely
    async function addColumnIfMissing(tableName, columnName, columnDef) {
      const [existing] = await sequelize.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'excelmind_academic'
        AND TABLE_NAME = '${tableName}'
        AND COLUMN_NAME = '${columnName}'
      `);
      if (existing.length === 0) {
        await sequelize.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDef}`);
        console.log(`[Migration]: ✓ Added column \`${columnName}\` to \`${tableName}\`.`);
      } else {
        console.log(`[Migration]: Column \`${columnName}\` already exists in \`${tableName}\`.`);
      }
    }

    // 3. Add passport and emergency columns to students
    await addColumnIfMissing('students', 'student_passport', 'VARCHAR(255) NULL');
    await addColumnIfMissing('students', 'emergency_contact_name', 'VARCHAR(150) NULL');
    await addColumnIfMissing('students', 'emergency_contact_phone', 'VARCHAR(30) NULL');
    await addColumnIfMissing('students', 'emergency_contact_relationship', 'VARCHAR(50) NULL');
    await addColumnIfMissing('students', 'emergency_contact_address', 'TEXT NULL');
    await addColumnIfMissing('students', 'emergency_contact_photo', 'VARCHAR(255) NULL');

    // 4. Add passport columns to parents
    await addColumnIfMissing('parents', 'passport_photo', 'VARCHAR(255) NULL');
    await addColumnIfMissing('parents', 'father_photo', 'VARCHAR(255) NULL');
    await addColumnIfMissing('parents', 'mother_photo', 'VARCHAR(255) NULL');
    await addColumnIfMissing('parents', 'guardian_photo', 'VARCHAR(255) NULL');

    // 5. Add passport column to teachers
    await addColumnIfMissing('teachers', 'teacher_passport', 'VARCHAR(255) NULL');

    // 6. Ensure default student passport is populated if null
    await sequelize.query(`
      UPDATE students 
      SET student_passport = COALESCE(photo, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400')
      WHERE student_passport IS NULL
    `);

    // Ensure default teacher passport is populated if null
    await sequelize.query(`
      UPDATE teachers 
      SET teacher_passport = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
      WHERE teacher_passport IS NULL
    `);

    // Ensure default parent passport is populated if null
    await sequelize.query(`
      UPDATE parents 
      SET passport_photo = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
          father_photo = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
          mother_photo = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
      WHERE passport_photo IS NULL
    `);

    console.log('[Migration]: ✓ Passport & digital identity migration completed successfully.');
  } catch (err) {
    console.error('[Migration Error]:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  migratePassportSystem();
}

module.exports = migratePassportSystem;
