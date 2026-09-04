const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIChatHistory = sequelize.define('AIChatHistory', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ai_chat_history',
  timestamps: false,
  underscored: true
});

module.exports = AIChatHistory;
