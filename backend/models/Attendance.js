const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  attendance_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late'),
    defaultValue: 'Present'
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: false
});

module.exports = Attendance;
