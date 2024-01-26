const { tokenModel } = require("../database/model/tokenModel.js");
const { userModel } = require("../database/model/userModel");
const { hash, compareHash } = require("./bcrypt.js");
const { generateUUID } = require("./generateUUID.js");
const { isValid } = require("./isValid");

async function getTokenByToken(token) {
	const splitAuthToken = token.split("-");
	const rowid = splitAuthToken[0];
	const suppliedToken = splitAuthToken.slice(1).join("-");

	token = await tokenModel.findByPk(rowid, { include: userModel });

	token.isValid = await compareHash(suppliedToken, token.token); //true
	console.log("function api getTokenByToken token", token.isValid);
	token.isValid = token.isValid && isValid(token.expiration); 
	console.log("function api getTokenByToken token", token.isValid);
	if (!token.isValid) {
		//add boolean to token table
		token.destroy();
	}
	/*
	console.log(
		"function api getTokenByToken token",
		await compareHash(suppliedToken, token.token),
		isValid("token" , token.expiration)
	);
	*/
	console.log(token.isValid);
	return token;
}

async function addToken(userId, permission, expiry) {
	let uuid = await generateUUID();
	let hashtoken = await hash(uuid);
	//console.log("user id", userId);
	//	return { token: token, userid: userRes.id, username: userRes.username };
	//	let token = await addToken(userRes.id , "canRead" , tokenToLive);

	let token = await tokenModel.create({
		userid: userId,
		token: hashtoken,
		permission: permission,
		expiration: expiry,
	});

	//user token with - tokenid is table id
	return token.id + "-" + uuid;
}

module.exports = { addToken, getTokenByToken };
