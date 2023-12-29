"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");


sequelize.sync();
const api_log_Model = sequelize.define("api-logs",{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
		},
        ip:{
            type: DataTypes.STRING,
            allowNull: false,
            length: 45,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 20,
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 10,
        },
        host: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 45,
        },
        statusCode: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 10,
        },
        Responsesize: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 10,
        },
        referrer: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 45,
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 100,
        },
        },
	{
		timestamps: false,
	}
);



module.exports = { api_log_Model };
