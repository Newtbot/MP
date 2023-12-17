'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../mySQL.js")

const adminUserModel = sequelize.define('adminusers', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      length: 255
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        length: 50
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        length: 255
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        length: 255
    },
    lastLogin: {
        type: DataTypes.timestamps,
        allowNull: true,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
        length: 255
    }
  },{
    timestamps: false, // Disable automatic timestamps
  });

module.exports = { adminUserModel }