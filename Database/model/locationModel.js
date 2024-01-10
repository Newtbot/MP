"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const { isAlphaNumericwithSpaces } = require('../../Web-Server/functions/validateData')

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
			unique: true,
			validate: {
				notEmpty: true,
				len: [1, 20],
				//accept only alphanumeric and spaces
				isAlphaNumericwithSpaces(value){
					if(!isAlphaNumericwithSpaces(value)){
						throw new Error('Invalid characters in name')
					}
				}									
				},
		},
		added_by: {
			type: DataTypes.STRING,
			allowNull: false,
			length: 10,
			validate: {
				notEmpty: true,
				len: [1, 20],			
				is: ["^[a-z0-9]+$", "i"],
				isIn: [['admin', 'system' , 'Admin', 'System']],  
			},
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			length: 100,
			validate: {
				notEmpty: true,
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
