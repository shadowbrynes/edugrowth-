const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Parent = sequelize.define('Parent', {
  parent_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
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
  phone: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(191),
    allowNull: false
  },
  occupation: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  relationship: {
    type: DataTypes.STRING(50),
    defaultValue: 'Parent'
  }
}, {
  tableName: 'parents',
  timestamps: false
});

module.exports = Parent;
