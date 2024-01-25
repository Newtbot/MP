const { hash, compareHash } = require("./bcrypt.js");
const { tokenModel } = require("../database/model/tokenModel.js");
const { generateUUID } = require("./generateUUID.js");

/*
1) take userid 
2) generate random api key
3) hash the api key
4) append userid with - and api key
5) you give the user rowid-uuidv4
6) store in database
*/
//can be used for api key or token. Both are the same logic
async function addToken(userId, permission , expiry) {
	let uuid = await generateUUID();
	let hashtoken = await hash(uuid);

	let token = await tokenModel.create({
		userid: userId,
		token: hashtoken,
		permission: permission,
		expiration: expiry,
	});

	//user token with - tokenid is table id
	return token.id + "-" + uuid;
}

async function checkToken(Supplied, rowid) {
	try {
		const retrivedToken = await tokenModel.findOne({
			raw: true,
			attributes: ["token", "permission"],
			where: {
				id: rowid,
			},
		});
		//console.log(retrivedKey.apikey);
		if (compareHash(Supplied, retrivedToken.token)) {
			//return true;
			return retrivedToken.permission;
		}
	} catch (error) {
		console.error(error);
	}
}

module.exports = { addToken  , checkToken };