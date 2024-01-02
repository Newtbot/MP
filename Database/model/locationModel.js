"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");

//sequelize.sync();
const locationModel = sequelize.define(
	"location",
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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			validate: {
				notEmpty: { msg: "Name cannot be empty" },
				len: [1, 20],
				/*
				//will not validate this and fail it
				"hello world" (contains a space)
				"hello@123" (contains a symbol)
				"" (empty string)
				is: /^[a-z]+$/i,          // matches this RegExp
				is: ["^[a-z]+$",'i'], 
				*/
				is: ["^[a-z0-9]+$", "i"]
			},
		},
		added_by: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			validate: {
				notEmpty: { msg: "Added by cannot be empty" },
				len: [1, 20],			
				is: ["^[a-z0-9]+$", "i"]
			},
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			length: 100,
			validate: {
				notEmpty: { msg: "Description cannot be empty" },
				len: [1, 100],
				/*
				//will not validate this and fail it
				"hello@123" (contains a symbol)
				"" (empty string)

				*/				
				is: ["^[a-zA-Z0-9 ]+$", "i"]
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

module.exports = { locationModel };
