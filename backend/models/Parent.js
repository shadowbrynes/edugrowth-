const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parent = sequelize.define('Parent', {
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
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  relationship: {
    type: DataTypes.STRING(50),
    defaultValue: 'Parent'
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
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  occupation: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  communication_preference: {
    type: DataTypes.ENUM('whatsapp', 'in_app', 'phone'),
    defaultValue: 'whatsapp'
  }
}, {
  tableName: 'parents',
  timestamps: false,
  underscored: true
});

module.exports = Parent;
