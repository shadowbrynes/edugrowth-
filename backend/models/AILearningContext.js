const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AILearningContext = sequelize.define('AILearningContext', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  topic_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  difficulty_level: {
    type: DataTypes.STRING(50),
    defaultValue: 'WAEC Standard'
  },
  learning_history: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ai_learning_context',
  timestamps: false,
  underscored: true
});

module.exports = AILearningContext;
