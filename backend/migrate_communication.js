const sequelize = require('./config/database');

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL excelmind_academic');

    // Helper to add column if missing
    async function addColumnIfNotExists(table, colName, colDef) {
      const [results] = await sequelize.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'excelmind_academic' AND TABLE_NAME = '${table}' AND COLUMN_NAME = '${colName}'`
      );
      if (results.length === 0) {
        await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${colName}\` ${colDef}`);
        console.log(`✓ Added column ${colName} to ${table}`);
      } else {
        console.log(`- Column ${colName} already exists on ${table}`);
      }
    }

    // 1. Teachers
    await addColumnIfNotExists('teachers', 'phone_number', 'VARCHAR(30) NULL');
    await addColumnIfNotExists('teachers', 'whatsapp_number', 'VARCHAR(30) NULL');
    await addColumnIfNotExists('teachers', 'communication_status', "ENUM('available', 'busy', 'offline') NOT NULL DEFAULT 'available'");
    await addColumnIfNotExists('teachers', 'allow_parent_contact', 'BOOLEAN NOT NULL DEFAULT TRUE');

    await sequelize.query(`
      UPDATE teachers SET 
        phone_number = '+2348022334455',
        whatsapp_number = '2348022334455',
        communication_status = 'available',
        allow_parent_contact = TRUE
      WHERE id = 1;
    `);

    // 2. Parents
    await addColumnIfNotExists('parents', 'phone_number', 'VARCHAR(30) NULL');
    await addColumnIfNotExists('parents', 'whatsapp_number', 'VARCHAR(30) NULL');
    await addColumnIfNotExists('parents', 'communication_preference', "ENUM('whatsapp', 'in_app', 'phone') NOT NULL DEFAULT 'whatsapp'");

    await sequelize.query(`
      UPDATE parents SET 
        phone_number = '+2348033445566',
        whatsapp_number = '2348033445566',
        communication_preference = 'whatsapp'
      WHERE id = 1;
    `);

    // 3. Messages
    await addColumnIfNotExists('messages', 'sender_role', "VARCHAR(20) NOT NULL DEFAULT 'parent'");
    await addColumnIfNotExists('messages', 'receiver_role', "VARCHAR(20) NOT NULL DEFAULT 'teacher'");
    await addColumnIfNotExists('messages', 'student_id', 'BIGINT NULL');
    await addColumnIfNotExists('messages', 'message_type', "VARCHAR(50) NOT NULL DEFAULT 'text'");

    // 4. Communication Settings
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS communication_settings (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        school_id BIGINT NOT NULL DEFAULT 1,
        allow_whatsapp_contact BOOLEAN NOT NULL DEFAULT TRUE,
        allow_parent_teacher_chat BOOLEAN NOT NULL DEFAULT TRUE,
        allow_phone_visibility BOOLEAN NOT NULL DEFAULT TRUE,
        working_hours VARCHAR(100) NOT NULL DEFAULT 'Monday - Friday, 8:00 AM - 5:00 PM',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await sequelize.query(`
      INSERT INTO communication_settings (school_id, allow_whatsapp_contact, allow_parent_teacher_chat, allow_phone_visibility, working_hours)
      SELECT 1, 1, 1, 1, 'Monday - Friday, 8:00 AM - 5:00 PM'
      WHERE NOT EXISTS (SELECT 1 FROM communication_settings WHERE school_id = 1);
    `);

    // 5. Communication Logs
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS communication_logs (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        sender_id BIGINT NOT NULL,
        receiver_id BIGINT NOT NULL,
        student_id BIGINT NULL,
        communication_type ENUM('call', 'whatsapp', 'in_app') NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'initiated'
      ) ENGINE=InnoDB;
    `);

    console.log('✓ Communication database tables synchronized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
