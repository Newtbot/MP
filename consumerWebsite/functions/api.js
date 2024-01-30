const { tokenModel } = require("../database/model/tokenModel.js");
const { userModel } = require("../database/model/userModel");
const { hash, compareHash } = require("./bcrypt.js");
const { generateUUID } = require("./generateUUID.js");
const { isValid , resetIsValid  } = require("./isValid");

async function getTokenByToken(token) {
	const splitAuthToken = token.split("-");
	const rowid = splitAuthToken[0];
	const suppliedToken = splitAuthToken.slice(1).join("-");
	if (!suppliedToken) return false;

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

async function addToken(userId, permission, isKey ,expiry) {
	let uuid = await generateUUID();
	let hashtoken = await hash(uuid);
	//console.log("user id", userId);
	//	return { token: token, userid: userRes.id, username: userRes.username };
	//	let token = await addToken(userRes.id , "canRead" , tokenToLive);

	let token = await tokenModel.create({
		userid: userId,
		token: hashtoken,
		permission: permission,
		isKey: isKey,
		expiration: expiry,
	});

	//user token with - tokenid is table id
	return token.id + "-" + uuid;
}

async function addPasswordResetToken(data , token){
	let hashtoken = await hash(token);
	let currentDate = new Date();
	let tokenToLive = new Date(currentDate.getTime() + 5 * 60000);

	let tokenRes = await tokenModel.create({
		userid: data.id,
		token: hashtoken,
		permission: "canRead",
		isKey: "isNotKey",
		expiration: tokenToLive,
	});
	return tokenRes.id
}

async function checkToken(id) {
	let tokenRes = await tokenModel.findOne(
		{
			where: {
				userid: id,
			}
		}

	);	
	return tokenRes;
}

async function checkTokenByrowID(token) {
	if (!token) return false;
	//split
	const splitAuthToken = token.split("-");
	const rowid = splitAuthToken[0];
	const suppliedToken = splitAuthToken.slice(1).join("-");

	let tokenRes = await tokenModel.findByPk(rowid);
	//console.log(tokenRes);

	if (!tokenRes) return false;

	if (!compareHash(suppliedToken, tokenRes.token)) return false;


	//pass tokemRes.expiration to isValid
	if (!isValid(tokenRes.expiration)) {
		//add boolean to token table
		tokenRes.destroy();
		return false;
	}

	return tokenRes;

}


module.exports = { addToken, getTokenByToken , checkToken , addPasswordResetToken , checkTokenByrowID};
