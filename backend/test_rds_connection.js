const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  const host = process.env.DATABASE_HOST || process.env.DB_HOST || 'excelmind-db.cwhwi6e6yyee.us-east-1.rds.amazonaws.com';
  const port = parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306', 10);
  const user = process.env.DATABASE_USER || process.env.DB_USERNAME || process.env.DB_USER || 'admin';
  const password = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD;
  const database = process.env.DATABASE_NAME || process.env.DB_DATABASE || process.env.DB_NAME || 'excelmind_academic';

  console.log('--- Testing AWS RDS Connection ---');
  console.log(`Host: ${host}`);
  console.log(`Port: ${port}`);
  console.log(`User: ${user}`);
  console.log(`Database: ${database}`);

  if (!password || password === 'YOUR_AWS_RDS_PASSWORD_HERE') {
    console.warn('⚠️ Warning: DATABASE_PASSWORD is not set in backend/.env.');
    console.log('Please replace YOUR_AWS_RDS_PASSWORD_HERE in backend/.env with your AWS master password.');
  }

  try {
    // 1. Test basic connection to MySQL server
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });
    console.log('✓ Successfully connected to AWS RDS MySQL server!');

    // 2. Check available databases
    const [databases] = await connection.query('SHOW DATABASES;');
    console.log('Available databases on RDS:', databases.map(d => d.Database));

    const dbExists = databases.some(d => d.Database === database);
    if (!dbExists) {
      console.log(`Database '${database}' does not exist yet. Creating it...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log(`✓ Database '${database}' created successfully on RDS!`);
    } else {
      console.log(`✓ Database '${database}' exists on RDS.`);
    }

    // 3. Connect to the specific database and check tables
    await connection.changeUser({ database });
    const [tables] = await connection.query('SHOW TABLES;');
    console.log(`Number of tables in '${database}': ${tables.length}`);
    if (tables.length > 0) {
      console.log('Tables found:', tables.map(t => Object.values(t)[0]));
    }

    await connection.end();
    console.log('✓ AWS RDS connection and verification completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Connection failed:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    process.exit(1);
  }
}

testConnection();
