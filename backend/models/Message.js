const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  sender_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  sender_role: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  receiver_role: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachment: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  message_type: {
    type: DataTypes.ENUM('text', 'file', 'image', 'system'),
    defaultValue: 'text'
  },
  read_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
  timestamps: false,
  underscored: true
});

module.exports = Message;
