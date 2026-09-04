const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunicationLog = sequelize.define('CommunicationLog', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
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
  communication_type: {
    type: DataTypes.ENUM('call', 'whatsapp', 'in_app'),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'initiated'
  }
}, {
  tableName: 'communication_logs',
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false
});

module.exports = CommunicationLog;
