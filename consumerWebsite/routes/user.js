const { getUser, addUser } = require("../functions/apiDatabase.js");

const express = require("express");
const router = express.Router();

//get all users
router.get("/", async (req, res, next) => {
	try {
		const location = await getUser();
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


router.post("/register", async (req, res, next) => {
	try {
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
