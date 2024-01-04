"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const { locationModel } = require("./locationModel");
const { sensorModel } = require("./sensorModel");
const { isJson } = require("../../Web-Server/functions/validateData");

//sequelize.sync();
const sensorDataModel = sequelize.define(
	"sensorData",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
			validate: {
				isNumeric: true,
				notEmpty: true,
			},
		},
		id_sensor: {
			type: DataTypes.INTEGER,
			allowNull: false,
			length: 100,
			//FK
			references: {
				model: sensorModel,
				key: "id",
			},
			validate: {
				isNumeric: true,
				notEmpty: true,
			},
		},
		id_location: {
			type: DataTypes.INTEGER,
			allowNull: false,
			length: 100,
			//FK
			references: {
				model: locationModel,
				key: "id",
			},
			validate: {
				isNumeric: true,
				notEmpty: true,
			},
		},
		sensordata: {
			type: DataTypes.JSON,
			allowNull: false,
			validate: {
				notEmpty: true,
				isJson(value) 
				{
					if (isJson(value) !== true)
						throw new Error("sensordata must be a JSON");
				},
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

module.exports = { sensorDataModel };
