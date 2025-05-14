const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('notifications_db', 'root', 'Ef89211991234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
