const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  subject_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  class_level: {
    type: DataTypes.STRING(20),
    allowNull: false // e.g. 'SS1', 'SS2', 'SS3'
  },
  topic_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  term: {
    type: DataTypes.STRING(50),
    allowNull: true // e.g. 'Term 1', 'Term 2', 'Term 3'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'topics',
  timestamps: false,
  underscored: true
});

module.exports = Topic;
