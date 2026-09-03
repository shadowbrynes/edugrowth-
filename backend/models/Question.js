const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
    allowNull: false
  },
  option_d: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  correct_answer: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'questions',
  timestamps: false
});

module.exports = Question;
