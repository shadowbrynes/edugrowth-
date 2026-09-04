const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReportCard = sequelize.define('ReportCard', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  term_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 1
  },
  overall_average: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  position: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  teacher_comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  principal_comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  generated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'report_cards',
  timestamps: false,
  underscored: true
});

module.exports = ReportCard;
