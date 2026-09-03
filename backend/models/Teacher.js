const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Teacher = sequelize.define('Teacher', {
  teacher_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  employee_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  subject_specialization: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_joined: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'teachers',
  timestamps: false
});

module.exports = Teacher;
