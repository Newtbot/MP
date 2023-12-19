'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../mySql.js");

const userModel = sequelize.define('users', {
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
    }
  },{
    timestamps: false, // Disable automatic timestamps
  });

module.exports = { userModel }