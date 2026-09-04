const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  school_id: {
    type: DataTypes.BIGINT,
    defaultValue: 1
  },
  class_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  department_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  class_teacher_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: 'classes',
  timestamps: false
});

module.exports = Class;
