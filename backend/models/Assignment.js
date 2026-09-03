const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
  assignment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  attachment: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'assignments',
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: false
});

module.exports = Assignment;
