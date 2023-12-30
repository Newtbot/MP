"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const { locationModel } = require("./locationModel");
const { sensorModel } = require("./sensorModel");

//sequelize.sync();
const sensorDataModel = sequelize.define("sensorData",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
            autoIncrement: true,
		},
        id_sensor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            length: 100,
            //FK 
            references: {
                model: sensorModel,
                key: 'id'
            }
        },
        id_location: {
            type: DataTypes.INTEGER,
            allowNull: false,
            length: 100,
            //FK 
            references: {
                model: locationModel,
                key: 'id'
            }
        },
        Sensordata: {
            type: DataTypes.JSON,
            allowNull: false,
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
