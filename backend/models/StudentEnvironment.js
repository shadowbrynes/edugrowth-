const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentEnvironment = sequelize.define('StudentEnvironment', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  school_id: {
    type: DataTypes.BIGINT,
    defaultValue: 1
  },
  class_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  department_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  academic_session: {
    type: DataTypes.STRING(50),
    defaultValue: '2026/2027 Session'
  },
  learning_group: {
    type: DataTypes.STRING(100),
    defaultValue: 'Physics Learning Group'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_environment',
  timestamps: false,
  underscored: true
});

module.exports = StudentEnvironment;
