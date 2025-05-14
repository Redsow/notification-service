const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  target: DataTypes.STRING,
  type: DataTypes.STRING,
  payload: DataTypes.STRING,
  status: DataTypes.STRING,
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
