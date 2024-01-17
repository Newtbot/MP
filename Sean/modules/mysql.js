const mysql = require("mysql2");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const fs = require('fs');
/*
const mysqlConfig = {
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
	timezone: "Z", // Set the timezone to UTC
};

const connection = mysql.createConnection(mysqlConfig);
connection.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL");
});
*/

const connection = mysql.createConnection({
	host: process.env.host,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: "adminusers",
	timezone: "Z", // Set the timezone to UTC
	ssl: {
		ca: fs.readFileSync(path.resolve(__dirname, '../../cert/DigiCertGlobalRootCA.crt.pem')),
		
	}
  });
/*
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "adminusers",
	timezone: "Z", // Set the timezone to UTC
  });
*/
 
module.exports = { connection };


  
