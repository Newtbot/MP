"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");

sequelize.sync();
const locationModel = sequelize.define(
	"location",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
            autoIncrement: true,
		},
		name: {
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

module.exports = { locationModel };
