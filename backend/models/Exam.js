const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  school_id: {
    type: DataTypes.BIGINT,
    defaultValue: 1
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  exam_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'CBT'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  total_questions: {
    type: DataTypes.INTEGER,
    defaultValue: 40
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  exam_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'exams',
  timestamps: false,
  underscored: true
});

module.exports = Exam;
