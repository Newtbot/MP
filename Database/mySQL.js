require("dotenv").config({ path: "../../.env" }); 
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
 "your_database_name",
 process.env.
 process.env.,
{
    host: '',
    dialect: 'mysql'
  }
);


sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = { sequelize };
