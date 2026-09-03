const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentExamResult = sequelize.define('StudentExamResult', {
  result_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }
}, {
  tableName: 'student_exam_results',
  timestamps: true,
  createdAt: 'exam_date',
  updatedAt: false
});

module.exports = StudentExamResult;
