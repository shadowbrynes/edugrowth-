const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  class_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late'),
    defaultValue: 'Present'
  }
}, {
  tableName: 'attendance',
  timestamps: false,
  underscored: true
});

module.exports = Attendance;
