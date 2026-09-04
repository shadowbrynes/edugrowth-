const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  teacher_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  class_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachment: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'assignments',
  timestamps: false,
  underscored: true
});

module.exports = Assignment;
