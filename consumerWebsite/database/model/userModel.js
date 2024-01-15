"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const {
	isAlphaNumericWithSpacesAndDash,
	isAddress,
} = require("../../functions/validateData");

sequelize.sync();
const userModel = sequelize.define(
	"user",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			validate: {
				isNumeric: true,
			},
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 60,
			validate: {
				notEmpty: true,
				len: [1, 60],
				isAlphaNumericWithSpacesAndDash(value) {
					if (!isAlphaNumericWithSpacesAndDash(value)) {
						throw new Error("Invalid characters in username");
					}
				},
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 255,
			validate: {
				notEmpty: true,
				len: [1, 255],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 60,
			unique: true,
			validate: {
				notEmpty: true,
				len: [1, 60],
				isEmail: true,
			},
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
			length: 255,
			validate: {
				notEmpty: true,
				len: [1, 255],
				isAddress(value) {
					if (!isAddress(value)) {
						throw new Error("Invalid address");
					}
				},
			},
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			length: 20,
			validate: {
				notEmpty: true,
				len: [1, 20],
				isNumeric: true,
			},
		},
        //utc time
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
module.exports = { userModel };
