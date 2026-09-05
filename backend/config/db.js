const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbHost = process.env.DATABASE_HOST || process.env.DB_HOST || 'excelmind-db.cwhwi6e6yyee.us-east-1.rds.amazonaws.com';
const dbPort = parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DATABASE_USER || process.env.DB_USERNAME || process.env.DB_USER || 'admin';
const dbPassword = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '';
const dbName = process.env.DATABASE_NAME || process.env.DB_DATABASE || process.env.DB_NAME || 'excelmind_academic';

const dialectOptions = {};
if (process.env.DB_SSL === 'true' || process.env.DATABASE_SSL === 'true' || (dbHost && dbHost.includes('rds.amazonaws.com'))) {
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

module.exports = sequelize;
