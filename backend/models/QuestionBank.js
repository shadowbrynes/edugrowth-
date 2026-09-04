const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuestionBank = sequelize.define('QuestionBank', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  exam_body: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'WAEC' // 'WAEC' | 'NECO' | 'JAMB' | 'School Exam'
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  subject_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  class_level: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'SS3'
  },
  department: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Science' // 'Science', 'Arts', 'Commercial', 'Junior', 'General'
  },
  topic: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  sub_topic: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_a: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_b: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_c: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  option_d: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  correct_answer: {
    type: DataTypes.STRING(10), // 'A', 'B', 'C', 'D'
    allowNull: false
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty_level: {
    type: DataTypes.STRING(50), // 'Easy', 'Medium', 'Hard'
    defaultValue: 'Medium'
  },
  year: {
    type: DataTypes.INTEGER,
    defaultValue: 2024
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'questions_bank',
  timestamps: false,
  underscored: true
});

module.exports = QuestionBank;
