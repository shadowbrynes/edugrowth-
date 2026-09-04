const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  school_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  school_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  subscription_plan: {
    type: DataTypes.STRING(50),
    defaultValue: 'Enterprise'
  }
}, {
  tableName: 'schools',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = School;
