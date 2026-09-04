const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityPost = sequelize.define('CommunityPost', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  class_level: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'SS2'
  },
  department: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Science'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'Study Group'
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'community_posts',
  timestamps: false,
  underscored: true
});

module.exports = CommunityPost;
