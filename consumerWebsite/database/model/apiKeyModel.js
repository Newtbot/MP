"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../mySQL");
const { userModel } = require("./userModel");

sequelize.sync();
const apikeyModel = sequelize.define(
    "apikey",
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
        userid:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
            //fk
            references: {
                model: userModel,
                key: "id",
            },
        },
        apikey: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 255,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        permission: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 255,
            validate: {
                notEmpty: true,
                len: [1, 255],
                isIn: [['canRead' , 'canWrite']],  
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

)

module.exports = { apikeyModel };
