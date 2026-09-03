const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Timetable = sequelize.define('Timetable', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'timetable',
  timestamps: false
});

module.exports = Timetable;
