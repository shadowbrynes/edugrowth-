const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CBTResult = sequelize.define('CBTResult', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  exam_body: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'WAEC'
  },
  subject_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  class_level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  jamb_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  performance_rating: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  time_taken_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  weak_topics: {
    type: DataTypes.TEXT, // JSON array string
    allowNull: true
  },
  strong_topics: {
    type: DataTypes.TEXT, // JSON array string
    allowNull: true
  },
  ai_recommendation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cbt_results',
  timestamps: false,
  underscored: true
});

module.exports = CBTResult;
