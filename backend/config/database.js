const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let dbHost = process.env.DATABASE_HOST || process.env.DB_HOST || 'excelmind-db.cwhwi6e6yyee.us-east-1.rds.amazonaws.com';
let dbPort = parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306', 10);
let dbUser = process.env.DATABASE_USER || process.env.DB_USERNAME || process.env.DB_USER || 'admin';
let dbPassword = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '';
let dbName = process.env.DATABASE_NAME || process.env.DB_DATABASE || process.env.DB_NAME || 'excelmind_academic';

// Seamless fallback: If RDS password placeholder is still present, use local MySQL
const isRdsConfigured = dbPassword && dbPassword !== 'YOUR_AWS_RDS_PASSWORD_HERE';
if (!isRdsConfigured && dbHost.includes('rds.amazonaws.com')) {
  dbHost = 'localhost';
  dbUser = 'root';
  dbPassword = process.env.LOCAL_DB_PASSWORD || 'Shadowalker@123';
}

const dialectOptions = {};
if (process.env.DB_SSL === 'true' || process.env.DATABASE_SSL === 'true' || (isRdsConfigured && dbHost.includes('rds.amazonaws.com'))) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions,
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true,
    timestamps: true
  }
});

sequelize.authenticate()
  .then(() => {
    console.log(`[ExcelMind DB]: ✓ MySQL Database connected successfully to '${dbName}' on ${dbHost}:${dbPort}`);
  })
  .catch(error => {
    console.error(`[ExcelMind DB ERROR]: Failed to connect to MySQL on ${dbHost}:${dbPort}:`, error.message);
  });

module.exports = sequelize;
