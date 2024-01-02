"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const {
	isValidDateString,
} = require("../../Web-Server/functions/validateData");

//sequelize.sync();
const api_log_Model = sequelize.define(
	"api-logs",
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
            autoIncrement: true,
			validate: {
				isNumeric: true,
			},
		},
		ip: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 45,
			validate: {
				isIP: true,
			},
		},
		time: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 20,
			validate: {
				//validate     time: new Date().toUTCString(),
				isValidDateString(value) {
					if (!isValidDateString(value)) {
						throw new Error("Time must be a valid date string");
					}
				},
				notEmpty: { msg: "Time cannot be empty" },
				len: [1, 20],
			},
		},
		method: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			validate: {
				isIn: [["GET", "POST", "PUT", "DELETE"]],
			},
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
			validate: {
				isNumeric: true,
				len: [1, 3],
			},
		},
		Responsesize: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			validate: {
				isNumeric: true,
				len: [1, 100],
			},
		},
		referrer: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 45,
			validate: {
				isString(value) {
					if (typeof value !== "string") {
						throw new Error("Referrer must be a string");
					}
				},
				notEmpty: { msg: "Referrer cannot be empty" },
				len: [1, 45], // Length between 1 and 45 characters
			},
		},
		userAgent: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 100,
			validate: {
				isString(value) {
					if (typeof value !== "string") {
						throw new Error("UserAgent must be a string");
					}
				},
				notEmpty: { msg: "UserAgent cannot be empty" },
				len: [1, 100], // Length between 1 and 100 characters
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},

	{
		timestamps: true,
	}
);

module.exports = { api_log_Model };
