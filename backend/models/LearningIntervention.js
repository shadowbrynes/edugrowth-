const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningIntervention = sequelize.define('LearningIntervention', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  priority_level: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'high'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recommended_action: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  action_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'remedial_video' // 'remedial_video' | 'worked_examples' | 'olympiad'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'recommended' // 'recommended' | 'started' | 'completed'
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score_before: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 58
  },
  score_after: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  mastery_target: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 80
  },
  recommended_time_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  action_plan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content_payload: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'learning_interventions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = LearningIntervention;
