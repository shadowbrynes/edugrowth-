const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  course_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  course_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Course;
