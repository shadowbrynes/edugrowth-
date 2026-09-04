const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  school_id: {
    type: DataTypes.BIGINT,
    defaultValue: 1
  },
  employee_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    defaultValue: 'Male'
  },
  qualification: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  whatsapp_number: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  communication_status: {
    type: DataTypes.ENUM('available', 'busy', 'offline'),
    defaultValue: 'available'
  },
  allow_parent_contact: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  employment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
    defaultValue: 'active'
  }
}, {
  tableName: 'teachers',
  timestamps: false,
  underscored: true
});

module.exports = Teacher;
