const { sequelize } = require("../database/mySql.js");
const { apikeyModel } = require("../database/model/apikeyModel.js");
const { userModel } = require("../database/model/userModel.js");
const { Op, Sequelize } = require("sequelize");
const { hashAPIKey } = require("../functions/bcrypt.js");
const { generateUUID } = require("../functions/generateUUID.js");
const { hashPassword , comparePassword , hashAPIKey } = require("../functions/bcrypt.js");


//api/v0/user/register

/* Registering new user 
1) req.body is taken from html form or wtv 
2) bcrpyt and hash the password on the server side
3) pass to db 
*/
async function addUser(user) {
	console.log(user);
	//hash password
	let hash = await hashPassword(user.password);

	await userModel.create({
		username: user.username,
		password: hash,
		email: user.email,
		address: user.address,
		phone: user.phone,
	});
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
	return usertoken;
}

module.exports = {
	addUser,
	loginUser,
	addAPIKey,
};
