const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  submission_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  submission_file: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  teacher_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'submitted', 'graded'),
    defaultValue: 'submitted'
  }
}, {
  tableName: 'assignment_submission',
  timestamps: true,
  createdAt: 'submission_date',
  updatedAt: false
});

module.exports = AssignmentSubmission;
