const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  topic_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  lesson_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  learning_objectives: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  lesson_content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  examples: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Pending Review', 'Approved', 'Published', 'Archived'),
    defaultValue: 'Draft'
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Lesson;
