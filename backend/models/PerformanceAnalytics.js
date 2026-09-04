const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerformanceAnalytics = sequelize.define('PerformanceAnalytics', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  subject_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  questions_attempted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  correct_answers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  average_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0
  },
  weak_topics: {
    type: DataTypes.TEXT, // JSON array string
    allowNull: true
  },
  strong_topics: {
    type: DataTypes.TEXT, // JSON array string
    allowNull: true
  },
  last_practiced: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cbt_performance_analytics',
  timestamps: false,
  underscored: true
});

module.exports = PerformanceAnalytics;
