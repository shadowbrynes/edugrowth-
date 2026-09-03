const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exam = sequelize.define('Exam', {
  exam_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exam_type: {
    type: DataTypes.ENUM('WAEC', 'NECO', 'JAMB', 'School Term'),
    defaultValue: 'School Term'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exam_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'exams',
  timestamps: false
});

module.exports = Exam;
