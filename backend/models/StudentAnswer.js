const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentAnswer = sequelize.define('StudentAnswer', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  attempt_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  question_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  selected_option: {
    type: DataTypes.STRING(10), // 'A', 'B', 'C', 'D'
    allowNull: true
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  time_spent_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_answers',
  timestamps: false,
  underscored: true
});

module.exports = StudentAnswer;
