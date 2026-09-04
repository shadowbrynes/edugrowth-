const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIQuestion = sequelize.define('AIQuestion', {
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
  subject: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  class_level: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  response: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  structured_sections: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  accuracy_score: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 0.98
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ai_questions',
  timestamps: false,
  underscored: true
});

module.exports = AIQuestion;
