const { hash, compareHash } = require("./bcrypt.js");
const { apikeyModel } = require("../database/model/apiKeyModel");
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
async function addAPIKey(userId, permission) {
	let hashtoken = await generateUUID();
	let apikey = await hash(hashtoken);

	let token = await apikeyModel.create({
		userid: userId,
		apikey: apikey,
		permission: permission,
	});

	//user token with - tokenid is table id
	return token.id + "-" + hashtoken;
}

async function checkAPikey(SuppliedKey, rowid) {
	try {
		const retrivedKey = await apikeyModel.findOne({
			raw: true,
			attributes: ["apikey", "permission"],
			where: {
				id: rowid,
			},
		});
		//console.log(retrivedKey.apikey);
		if (compareHash(SuppliedKey, retrivedKey.apikey)) {
			//return true;
			return retrivedKey.permission;
		}
	} catch (error) {
		console.error(error);
	}
}

module.exports = { addAPIKey  , checkAPikey };