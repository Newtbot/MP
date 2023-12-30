"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const { locationModel } = require("./locationModel");

//sequelize.sync();
const sensorModel = sequelize.define("sensors",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
            autoIncrement: true,
		},
		sensortype: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
		},
		added_by: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			length: 100,
		},
        location: {
            type: DataTypes.INTEGER,
			allowNull: true,
			length: 100,
            //one to many relationship
            references: {
                model: locationModel,
                key: 'id'
            }
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

module.exports = { sensorModel };
