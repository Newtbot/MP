const { sequelize } = require("../database/mySql.js");
const { apikeyModel } = require("../database/model/apikeyModel.js");
const { userModel } = require("../database/model/userModel.js");
const { Op, Sequelize } = require("sequelize");
const { hashAPIKey } = require("../functions/bcrypt.js");
const { generateUUID } = require("../functions/generateUUID.js");

async function getUser() {
	const user = await userModel.findAll();
	return user;
}

async function addUser(user) {
	//console.log(user);
	await userModel.create(user);
}

async function getAPIKey() {
	const apikey = await apikeyModel.findAll();
	return apikey;
}

/*
1) take userid 
2) generate random api key
3) hash the api key
4) append userid with - and api key
5) you give the user rowid-uuidv4
6) store in database
*/


async function addAPIKey(userId, permission) {
	let token = await generateUUID();
    let usertoken = userId + "-" + token;
	let apikey = await hashAPIKey(token);

    console.log(token);
    console.log(apikey);

    await apikeyModel.create({ 
        userid: userId,
        apikey: apikey,
        permission: permission
    });


    //user token with - 
    //"apikey": "1-9beba05f-1bf1-4d8a-9ee8-9f61e1428e20"
	return usertoken;
}

module.exports = {
	getUser,
	addUser,
	getAPIKey,
	addAPIKey,
};
