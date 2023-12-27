const mysql = require("mysql2");

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


module.exports = { connection , mysqlConfig };