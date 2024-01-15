const { getUser, addUser } = require("../functions/apiDatabase.js");
const { hashPassword } = require("../functions/bcrypt.js");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const location = await getUser();
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

/*
1) req.body is taken from html form or wtv 
2) bcrpyt and hash the password on the server side
3) pass to db 
*/
router.post("/new", async (req, res, next) => {
	try {
		//pass pass to hashPassword
		let hash = await hashPassword(req.body.password);
		//add hash back to req.body
		req.body.password = hash;
		await addUser(req.body);
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


//login
//update
//delete
//getbyid

module.exports = router;
