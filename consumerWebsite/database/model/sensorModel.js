"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const { locationModel } = require("./locationModel");
const {
	isAlphaNumericwithSpaces,
	isAlphaNumericWithSpacesAndDash,
	isMacAddress,
} = require('../../functions/validateData');

//sequelize.sync();
const sensorModel = sequelize.define(
	"sensors",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
			validate: {
				notEmpty: true,
				isNumeric: true,
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			unique: true,
			validate: {
				notEmpty: true,
				len: [1, 30],
				//accept only alphanumeric and spaces
				isAlphaNumericWithSpacesAndDash(value) {
					if (!isAlphaNumericWithSpacesAndDash(value)) {
						throw new Error("Invalid characters in name");
					}
				},
			},
		},
		added_by: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			validate: {
				notEmpty: { msg: "Added by cannot be empty" },
				len: [1, 20],
				is: ["^[a-z0-9]+$", "i"],
				isIn: [["admin", "system", "Admin", "System"]],
			},
		},
		mac_address: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 12,
			unique: true,
			validate: {
				notEmpty: true,
				len: [12, 18],
				isMacAddress(value) {
					if (!isMacAddress(value)) {
						throw new Error("Invalid Mac Address");
					}
				},
			},
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			length: 100,
			validate: {
				notEmpty: true,
				len: [1, 100],
				isAlphaNumericwithSpaces(value) {
					if (!isAlphaNumericwithSpaces(value)) {
						throw new Error("Invalid characters in name");
					}
				},
			},
		},
		locationid: {
			type: DataTypes.INTEGER,
			allowNull: true,
			length: 100,
			//one to many relationship
			references: {
				model: locationModel,
				key: "id",
			},
			validate: {
				notEmpty: true,
				isNumeric: true,
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

//sensorModel.belongsTo(locationModel);

module.exports = { sensorModel };
