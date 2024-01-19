const { sequelize } = require("../database/mySql.js");
const { apikeyModel } = require("../database/model/apikeyModel.js");
const { userModel } = require("../database/model/userModel.js");
const { Op, Sequelize } = require("sequelize");
const { generateUUID } = require("../functions/generateUUID.js");
const { hashPassword , comparePassword , hashAPIKey } = require("../functions/bcrypt.js");

//helper function


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

    const addRes = await userModel.create({
		username: user.username,
		password: hash,
		email: user.email,
		address: user.address,
		phone: user.phone,
	});
    if (addRes){
        return true;
    }
    else{
        return false;
    }
}

//add token to db 
async function addToken(userid , token) {
    console.log(userid);
    console.log(token);

}

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
        })
	//if user exists
    if (userRes){
        //compare password
        let match = await comparePassword(user.password, userRes.password);
        if (match){
            console.log(userRes.id);
            console.log(userRes.username);

			//generate token
			let token = await generateUUID();

            //add to db 
            addToken(userRes.id, token);
			

            //sucessful login
            /*
            1) generate token
            2) store in db and localstorage (maybe hash it?)
            3) return userid and username and token and store in localstorage
            */
			return { token: token, userid: userRes.id, username: userRes.username };
		}		
		else {
			return false;
		}
    }

    else{
        return false;
    }
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
