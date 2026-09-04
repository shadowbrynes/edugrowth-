const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
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
  admission_number: {
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
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  student_passport: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  class_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  department_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  academic_level: {
    type: DataTypes.STRING(50),
    defaultValue: 'SS2'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  emergency_contact_name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  emergency_contact_relationship: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  emergency_contact_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergency_contact_photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  admission_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'graduated', 'suspended'),
    defaultValue: 'active'
  }
}, {
  tableName: 'students',
  timestamps: false,
  underscored: true
});

module.exports = Student;
