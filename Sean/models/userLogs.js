// userLogs.js

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const userLogs = sequelize.define('user_logs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
  }, {
    timestamps: false, // Disabling timestamps
  });

  return userLogs;
};
