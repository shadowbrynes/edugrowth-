const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CurriculumKnowledge = sequelize.define('CurriculumKnowledge', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  class_level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(50),
    defaultValue: 'Science'
  },
  topic: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  exam_relevance: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'curriculum_knowledge',
  timestamps: false,
  underscored: true
});

module.exports = CurriculumKnowledge;
