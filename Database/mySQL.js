const dotenv = require("dotenv");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const Sequelize = require("sequelize");
const fs = require('fs');

const sequelize = new Sequelize(
 "eco_saver",
 process.env.DB_USER,
 process.env.DB_PASS,
 {
    host: "mpsqldatabase.mysql.database.azure.com",
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
         ca: fs.readFileSync(path.resolve(__dirname, '../cert/DigiCertGlobalRootCA.crt.pem')),
      }
    },
   }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = { sequelize };

