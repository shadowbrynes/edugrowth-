const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subject = sequelize.define('Subject', {
  subject_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  subject_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'subjects',
  timestamps: false
});

module.exports = Subject;
