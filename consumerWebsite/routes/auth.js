const { addUser, loginUser, checkEmail } = require("../functions/user");
const { sendContactEmail } = require("../functions/nodeMail");

const express = require("express");
const router = express.Router();

// /user/register
router.post("/register", async (req, res, next) => {
	try {
		let Res = await addUser(req.body);
		if (Res == false) {
			let error = new Error("UserRegFailed");
			error.message = "The user failed to be craated";
			error.status = 400;
			return next(error);
		} else {
			return res.json({
				message: "User created successfully",
			});
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//login
router.post("/login", async (req, res, next) => {
	try {
		let Res = await loginUser(req.body);
		if (Res == false) {
			let error = new Error("User Login Failed");
			error.status = 400;
			return next(error);
		} else {
			//pass res back to form to be set in local storage
			return res.json({
				message: "User login successfully",
				token: Res.token,
				userid: Res.userid,
				username: Res.username,
			});
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//contact
//auth/contact
router.post("/contact", async (req, res, next) => {
	try {
		//console.log(req.body);
		let Res = await checkEmail(req.body.email);
		if (!Res) {
			let error = new Error("Email not found");
			error.status = 400;
			return next(error);
		}
		else{
			//console.log(Res);
			sendContactEmail(req.body.email, req.body.name, req.body.message);
			return res.json({
				message: "Email sent successfully",
			});
			
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//reset
router.post("/checkemail", async (req, res, next) => {
	try{
		//console.log(req.body);
		let Res = await checkEmail(req.body.email);
		if (!Res) {
			let error = new Error("Email not found");
			error.status = 400;
			return next(error);
		}
		else{
			//console.log(Res);
			
			return res.json({
				message: "Reset Password Link has successfully sent to your email!",
			});
			
		}
	}catch (error){
		console.error(error);
		next(error);
	}
});

module.exports = router;
