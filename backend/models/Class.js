const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
  class_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  class_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  academic_session: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '2025/2026'
  }
}, {
  tableName: 'classes',
  timestamps: false
});

module.exports = Class;
