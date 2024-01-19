const mysql = require("mysql2");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const fs = require('fs');
const UserModel = require('../models/User');// Adjust the path based on your project structure
const { Sequelize } = require('sequelize');



  const sequelize = new Sequelize(
	"adminusers",
	process.env.DB_USER,
	process.env.DB_PASS,
	{
	  host: "mpsqldatabasean.mysql.database.azure.com",
	   dialect: 'mysql',
	   //  attributeBehavior?: 'escape' | 'throw' | 'unsafe-legacy';
	   attributeBehavior: 'escape',
	   dialectOptions: {
		 ssl: {
			ca: fs.readFileSync(path.resolve(__dirname, '../../cert/DigiCertGlobalRootCA.crt.pem')),
		
		 },
   
	   },
	  },
   
	  
   );
   
   sequelize.authenticate().then(() => {
	  console.log('Connection has been established successfully.');
   }).catch((error) => {
	  console.error('Unable to connect to the database: ', error);
   });
   

  const User = UserModel(sequelize);

  // Synchronize the models with the database
  sequelize.sync();
  
  module.exports = {
	sequelize,
	User,
  };

  
