const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  subject_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  subject_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active'
  }
}, {
  tableName: 'subjects',
  timestamps: false
});

module.exports = Subject;
