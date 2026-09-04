const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunicationSetting = sequelize.define('CommunicationSetting', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  school_id: {
    type: DataTypes.BIGINT,
    defaultValue: 1
  },
  allow_whatsapp_contact: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allow_parent_teacher_chat: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allow_phone_visibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  working_hours: {
    type: DataTypes.STRING(100),
    defaultValue: 'Monday - Friday, 8:00 AM - 5:00 PM'
  }
}, {
  tableName: 'communication_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = CommunicationSetting;
