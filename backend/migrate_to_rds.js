/**
 * ExcelMind Academic Companion - AWS RDS Database Migration Tool
 * Migrates schema and all 64 tables from local dump to AWS RDS MySQL.
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const HOST = process.env.DATABASE_HOST || process.env.DB_HOST || 'excelmind-db.cwhwi6e6yyee.us-east-1.rds.amazonaws.com';
const PORT = parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306', 10);
const USER = process.env.DATABASE_USER || process.env.DB_USERNAME || process.env.DB_USER || 'admin';
const PASSWORD = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD;
const DATABASE = process.env.DATABASE_NAME || process.env.DB_DATABASE || process.env.DB_NAME || 'excelmind_academic';
const DUMP_FILE = path.join(__dirname, 'excelmind_academic_backup.sql');

async function migrate() {
  console.log('=====================================================');
  console.log('  EXCELMIND AWS RDS MYSQL MIGRATION UTILITY');
  console.log('=====================================================');
  console.log(`Endpoint : ${HOST}:${PORT}`);
  console.log(`Database : ${DATABASE}`);
  console.log(`Username : ${USER}`);
  console.log(`Dump File: ${DUMP_FILE}`);
  console.log('-----------------------------------------------------');

  if (!PASSWORD || PASSWORD === 'YOUR_AWS_RDS_PASSWORD_HERE') {
    console.error('❌ Error: DATABASE_PASSWORD is not configured in backend/.env.');
    console.error('Please set your AWS RDS master password in backend/.env before running this script.');
    process.exit(1);
  }

  if (!fs.existsSync(DUMP_FILE)) {
    console.error(`❌ Error: Backup file not found at ${DUMP_FILE}`);
    console.error('Generate it first with mysqldump.');
    process.exit(1);
  }

  try {
    // 1. Verify connection to AWS RDS Server
    console.log('\n[1/4] Connecting to AWS RDS MySQL server...');
    const conn = await mysql.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password: PASSWORD,
      multipleStatements: true
    });
    console.log('✓ Successfully connected to AWS RDS!');

    // 2. Ensure Database Exists
    console.log(`\n[2/4] Ensuring database '${DATABASE}' exists on RDS...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✓ Database '${DATABASE}' is ready on RDS.`);
    await conn.end();

    // 3. Import SQL Dump using mysql client
    console.log(`\n[3/4] Importing '${DUMP_FILE}' into AWS RDS '${DATABASE}'...`);
    const mysqlBin = 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe';

    if (fs.existsSync(mysqlBin)) {
      console.log(`Using MySQL client at: ${mysqlBin}`);
      const importCmd = `"${mysqlBin}" -h ${HOST} -P ${PORT} -u ${USER} -p"${PASSWORD}" ${DATABASE} < "${DUMP_FILE}"`;
      execSync(importCmd, { stdio: 'inherit', shell: 'cmd.exe' });
    } else {
      console.log('MySQL client binary not found in standard path, importing via Node SQL stream...');
      const targetConn = await mysql.createConnection({
        host: HOST,
        port: PORT,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        multipleStatements: true
      });
      const sqlContent = fs.readFileSync(DUMP_FILE, 'utf8');
      await targetConn.query(sqlContent);
      await targetConn.end();
    }
    console.log('✓ Schema and data imported successfully!');

    // 4. Verify Tables and Record Counts
    console.log('\n[4/4] Verifying migrated tables and records on AWS RDS...');
    const verifyConn = await mysql.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });

    const [tables] = await verifyConn.query('SHOW TABLES;');
    const tableList = tables.map(row => Object.values(row)[0]);
    console.log(`✓ Total tables present in AWS RDS '${DATABASE}': ${tableList.length}`);

    // Check sample key tables
    const sampleTables = ['users', 'students', 'teachers', 'parents', 'subjects', 'questions_bank', 'cbt_results'];
    console.log('\n--- Record Counts on AWS RDS ---');
    for (const t of sampleTables) {
      if (tableList.includes(t)) {
        const [rows] = await verifyConn.query(`SELECT COUNT(*) AS count FROM \`${t}\`;`);
        console.log(`  • ${t.padEnd(25)}: ${rows[0].count} records`);
      }
    }

    await verifyConn.end();

    console.log('\n=====================================================');
    console.log('  🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=====================================================');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Migration failed:');
    console.error(`Error Code: ${err.code || 'UNKNOWN'}`);
    console.error(`Message   : ${err.message}`);
    process.exit(1);
  }
}

migrate();
