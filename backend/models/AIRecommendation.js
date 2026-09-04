const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIRecommendation = sequelize.define('AIRecommendation', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  weak_subject: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  recommendation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  generated_by: {
    type: DataTypes.STRING(100),
    defaultValue: 'ExcelMind AI Academic Coach'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ai_recommendations',
  timestamps: false,
  underscored: true
});

module.exports = AIRecommendation;
