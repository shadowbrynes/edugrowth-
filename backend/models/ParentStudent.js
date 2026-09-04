const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParentStudent = sequelize.define('ParentStudent', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  relationship_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'Father'
  }
}, {
  tableName: 'parent_student_relationship',
  timestamps: false
});

module.exports = ParentStudent;
