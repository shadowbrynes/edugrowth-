const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfileImage = sequelize.define('ProfileImage', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  image_type: {
    type: DataTypes.ENUM('student_passport', 'parent_passport', 'teacher_passport', 'guardian_passport'),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  upload_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved'
  }
}, {
  tableName: 'profile_images',
  timestamps: false,
  underscored: true
});

module.exports = ProfileImage;
