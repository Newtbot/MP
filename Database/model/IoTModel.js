"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySql.js");

const IoTModel = sequelize.define("iot-data",{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		psiData: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		humidityData: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		o3Data: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		no2Data: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		so2Data: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		coData: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		temperatureData: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		windspeedData: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 8,
		},
		currentTime: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 20,
		},
		regionData: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
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

module.exports = { IoTModel };
