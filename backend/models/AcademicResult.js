const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AcademicResult = sequelize.define('AcademicResult', {
  result_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  term: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Term 1'
  },
  session: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '2025/2026'
  },
  ca_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  exam_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  grade: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  teacher_comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  principal_comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'academic_results',
  timestamps: false
});

module.exports = AcademicResult;
