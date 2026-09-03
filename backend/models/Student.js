const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
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
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Science & Technology'
  },
  academic_level: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'SSS 3'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enrollment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Student;
