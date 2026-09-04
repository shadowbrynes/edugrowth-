const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginActivity = sequelize.define('LoginActivity', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  device: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  login_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  logout_time: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'login_activity',
  timestamps: true,
  underscored: true
});

module.exports = LoginActivity;
