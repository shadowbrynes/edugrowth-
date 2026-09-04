const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CurriculumContent = sequelize.define('CurriculumContent', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  class_level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(50),
    defaultValue: 'Science'
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  lesson_content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  examples: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  exam_questions: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  solutions: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'curriculum_content',
  timestamps: false,
  underscored: true
});

module.exports = CurriculumContent;
