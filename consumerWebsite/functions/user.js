const { Op } = require('sequelize')
const { hash, compareHash } = require("./bcrypt.js");
const { addToken } = require("./api");
const { userModel } = require("../database/model/userModel");



//getuser
//api/v0/user/me
async function getUserByID(userid) {
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

async function getUserByEmail(email) {
	let userRes = await userModel.findOne({
		where: {
			email: email,
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
	let hashed = await hash(user.password);

	const addRes = await userModel.create({
		firstname: user.firstname,
		lastname: user.lastname,
		username: user.username,
		password: hashed,
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
	//console.log(user);
	//look up username or email in db
	const userRes = await userModel.findOne({
		where: {
			[Op.or]: [
				{
					username: user.username,
				},
				{
					email: user.username,
				},
			],
		},
	});
	// Make sure user exists
	if (!userRes) return false;

	// Compare passwords
	let match = await compareHash(user.password, userRes.password);
	if (!match) return false;
	//console.log('loginUser', userRes.id, userRes.username);

	//generate token and permission and experiation time + 30 mins
	//let tokenToLive = moment().add(30, 'minutes').format();
	let currentDate = new Date();
	let tokenToLive = new Date(currentDate.getTime() + 30 * 60000);
	let token = await addToken(userRes.id , "canRead" , "isNotKey" , tokenToLive);
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


//api/v0/user/update
async function updateProfile(user, body) {
	if (!body.password) {
		let updateUser = await userModel.update(
			{
				firstname: body.first_name,
				lastname: body.last_name,
				username: body.username,
				email: body.email,
				address: body.address,
				phone: body.phone,
			},
			{
				where: {
					id: user.id,
				},
			}
		);
		if (!updateUser) return false;
		return true;
	} else {
		let hashed = await hash(body.password);
		let updateUser = await userModel.update(
			{
				firstname: body.first_name,
				lastname: body.last_name,
				username: body.username,
				email: body.email,
				address: body.address,
				phone: body.phone,
				password: hashed,
			},
			{
				where: {
					id: user.id,
				},
			}
		);
		if (!updateUser) return false;
		return true;
	}
}

async function checkEmail(email) {
	let emailRes = await userModel.findOne({
		where: {
			email: email,
		},
	});	
	if (!emailRes) return false;
	return true;

}


module.exports = {
	getUserByID,
	getUserByEmail,
	addUser,
	loginUser,
	updateProfile,
	checkEmail
};