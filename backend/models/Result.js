const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  term_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  ca_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  exam_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  total_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  grade: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  remark: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  teacher_comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'results',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Result;
