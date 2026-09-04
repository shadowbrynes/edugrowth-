const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityComment = sequelize.define('CommunityComment', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'community_comments',
  timestamps: false,
  underscored: true
});

module.exports = CommunityComment;
