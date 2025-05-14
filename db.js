const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('notifications_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
