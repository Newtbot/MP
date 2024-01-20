const { sequelize } = require("../database/mySql.js");
const { apikeyModel } = require("../database/model/apikeyModel.js");
const { userModel } = require("../database/model/userModel.js");
const { Op, Sequelize } = require("sequelize");
const { generateUUID } = require("../functions/generateUUID.js");
const {
	hashPassword,
	comparePassword,
	hashAPIKey,
} = require("../functions/bcrypt.js");

//getuser
//api/v0/user/me
async function getUserID(userid) {
    //console.log(userid);
    //console.log(userid.id);
    let userRes = await userModel.findByPk(userid.id, {
        attributes: {
            exclude: ["password"],
        },
    });

    if (!userRes) return false;
    return userRes;
    
}




//api/v0/auth/register
/* Registering new user 
1) req.body is taken from html form or wtv 
2) bcrpyt and hash the password on the server side
3) pass to db 
*/
async function addUser(user) {
	//hash password
	let hash = await hashPassword(user.password);

	const addRes = await userModel.create({
        firstname: user.firstname,
        lastname: user.lastname,
		username: user.username,
		password: hash,
		email: user.email,
		address: user.address,
		phone: user.phone,
	});
	if (addRes) {
		return true;
	} else {
		return false;
	}
}

//api/v0/auth/login
async function loginUser(user) {
    //look up username or email in db
    const userRes = await userModel.findOne({
        where: {
            [Op.or]: [
                {
                    username: user.userInfo,
                },
                {
                    email: user.userInfo,
                },
            ],
        },
    });
    // Make sure user exists
    if (!userRes) return false; 
    
    // Compare passwords
    let match = await comparePassword(user.password, userRes.password);
    if (!match) return false;
    //console.log('loginUser', userRes.id, userRes.username);

    //generate token
    let token = await addAPIKey(userRes.id, "auto-generated"); 

    return { token: token, userid: userRes.id, username: userRes.username };
}

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
	let apikey = await hashAPIKey(hashtoken);

	let token = await apikeyModel.create({
		userid: userId,
		apikey: apikey,
		permission: permission,
	});

	//user token with - tokenid is table id
	return token.id + "-" + hashtoken;
}

//api/v0/user/logout
async function deleteUserToken(token) {
    //get row id
    let splitAuthToken = token.split("-");
    let rowid = splitAuthToken[0];

    //console.log(rowid);

    //delete from db
    let delRes = await apikeyModel.destroy({
        where: {
            id: rowid,
        },
    });

    if (!delRes) return false; 
    return true;



}
module.exports = {
    getUserID,
	addUser,
	loginUser,
	addAPIKey,
    deleteUserToken,
};
