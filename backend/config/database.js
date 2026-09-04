const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'Shadowalker@123';
const dbName = process.env.DB_NAME || 'excelmind_academic';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
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
    console.log("MYSQL DATABASE CONNECTED");
  })
  .catch(error => {
    console.error("MYSQL DATABASE CONNECTION ERROR:", error.message);
  });

module.exports = sequelize;
