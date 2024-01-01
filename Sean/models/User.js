// models/User.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
  host: process.env.host,
  dialect: 'mysql',
  timezone: 'Z', // Set the timezone to UTC
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
