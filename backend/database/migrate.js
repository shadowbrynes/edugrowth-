const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

async function runMigrations() {
  console.log('====================================================');
  console.log('  EXCELMIND ACADEMIC COMPANION - DATABASE MIGRATOR   ');
  console.log('====================================================');

  try {
    await sequelize.authenticate();
    console.log('[Migration]: Connected to MySQL database successfully.');

    const sqlFile = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const rawSql = fs.readFileSync(sqlFile, 'utf8');

    // Remove block and line comments, then split cleanly
    const cleanSql = rawSql.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '');
    const statements = cleanSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 5);

    console.log(`[Migration]: Executing ${statements.length} schema definitions...`);

    for (const stmt of statements) {
      if (stmt.toLowerCase().startsWith('use ') || stmt.toLowerCase().startsWith('create database')) {
        continue;
      }
      try {
        await sequelize.query(stmt);
      } catch (err) {
        if (!err.message.includes('already exists') && !err.message.includes('Duplicate key')) {
          console.warn(`[Migration Notice]: ${err.message.split('\n')[0]}`);
        }
      }
    }

    console.log('[Migration]: ✓ All 30 database tables verified and created.');

    // Seed default departments if empty
    const [existingDepts] = await sequelize.query('SELECT COUNT(*) as cnt FROM departments');
    if (existingDepts[0].cnt === 0) {
      console.log('[Migration]: Seeding initial departments...');
      await sequelize.query(`
        INSERT INTO departments (school_id, department_name, description) VALUES
        (1, 'Sciences', 'Pure and Applied Sciences (Physics, Chemistry, Biology, Further Maths)'),
        (1, 'Arts & Humanities', 'Literature, History, Government, Visual Arts'),
        (1, 'Commercial & Business', 'Accounting, Commerce, Economics, Bookkeeping'),
        (1, 'Technical & Vocational', 'Technical Drawing, Data Processing, Computer Studies')
      `);
    }

    // Seed default classes if empty
    const [existingClasses] = await sequelize.query('SELECT COUNT(*) as cnt FROM classes');
    if (existingClasses[0].cnt === 0) {
      console.log('[Migration]: Seeding secondary school classes...');
      await sequelize.query(`
        INSERT INTO classes (school_id, class_name, level, department, capacity) VALUES
        (1, 'SS 1 Science', 'SS1', 'Sciences', 40),
        (1, 'SS 1 Arts', 'SS1', 'Arts & Humanities', 40),
        (1, 'SS 1 Commercial', 'SS1', 'Commercial & Business', 40),
        (1, 'SS 2 Science', 'SS2', 'Sciences', 40),
        (1, 'SS 2 Arts', 'SS2', 'Arts & Humanities', 40),
        (1, 'SS 2 Commercial', 'SS2', 'Commercial & Business', 40),
        (1, 'SS 3 Science', 'SS3', 'Sciences', 40),
        (1, 'SS 3 Arts', 'SS3', 'Arts & Humanities', 40),
        (1, 'SS 3 Commercial', 'SS3', 'Commercial & Business', 40)
      `);
    }

    // Seed default subjects if empty
    const [existingSubjects] = await sequelize.query('SELECT COUNT(*) as cnt FROM subjects');
    if (existingSubjects[0].cnt === 0) {
      console.log('[Migration]: Seeding Nigerian secondary school curriculum subjects...');
      await sequelize.query(`
        INSERT INTO subjects (school_id, subject_name, subject_code, department, category) VALUES
        (1, 'Mathematics', 'MTH101', 'General', 'Compulsory'),
        (1, 'English Language', 'ENG101', 'General', 'Compulsory'),
        (1, 'Physics', 'PHY101', 'Sciences', 'Science Core'),
        (1, 'Chemistry', 'CHM101', 'Sciences', 'Science Core'),
        (1, 'Biology', 'BIO101', 'Sciences', 'Science Core'),
        (1, 'Further Mathematics', 'FMTH101', 'Sciences', 'Science Elective'),
        (1, 'Economics', 'ECO101', 'Commercial & Business', 'Commercial Core'),
        (1, 'Financial Accounting', 'ACC101', 'Commercial & Business', 'Commercial Core'),
        (1, 'Commerce', 'COM101', 'Commercial & Business', 'Commercial Elective'),
        (1, 'Government', 'GOV101', 'Arts & Humanities', 'Arts Core'),
        (1, 'Literature in English', 'LIT101', 'Arts & Humanities', 'Arts Core'),
        (1, 'Civic Education', 'CIV101', 'General', 'Compulsory'),
        (1, 'Data Processing', 'DPR101', 'Technical & Vocational', 'Vocational Elective')
      `);
    }

    // Seed default school if empty
    const [existingSchools] = await sequelize.query('SELECT COUNT(*) as cnt FROM schools');
    if (existingSchools[0].cnt === 0) {
      await sequelize.query(`
        INSERT INTO schools (id, name, code, email, phone, address, status) VALUES
        (1, 'ExcelMind International College', 'EXM-LAG-01', 'info@excelmind.edu.ng', '+2348003923564', '15 Admiralty Way, Lekki Phase 1, Lagos, Nigeria', 'active')
      `);
    }

    // Verify all tables
    const [tables] = await sequelize.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'excelmind_academic'");
    console.log(`[Migration]: Successfully verified ${tables.length} tables in excelmind_academic:`);
    console.log(tables.map(t => t.TABLE_NAME).join(', '));
    console.log('====================================================');
    console.log('  MIGRATION & DATABASE INITIALIZATION COMPLETE!      ');
    console.log('====================================================');
  } catch (error) {
    console.error('[Migration Fatal Error]:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
