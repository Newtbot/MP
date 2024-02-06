const {
	addUser,
	loginUser,
	checkEmail,
	checkEmailDetails,
	resetPass,
} = require("../functions/user");
const { sendContactEmail } = require("../functions/nodeMail");
const { generateUUID } = require("../functions/generateUUID");
const { addPasswordResetToken } = require("../functions/api");
const { sendResetPasswordEmail } = require("../functions/nodeMail");
const { checkTokenByrowID } = require("../functions/api");

const express = require("express");
const { render } = require("ejs");
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
		sendContactEmail(req.body.email, req.body.name, req.body.message);
		return res.json({
			message: "Email sent successfully",
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//reset
router.post("/checkemail", async (req, res, next) => {
	try {
		let Res = await checkEmail(req.body.email);
		if (!Res) {
			console.log("email not found");
			//should be silent.
		} else {
			//user info lookup
			let data = await checkEmailDetails(req.body.email);
			//console.log(data);
			//token generation and insert into token table
			let token = await generateUUID();

			let tokenRes = await addPasswordResetToken(data, token);

			//email user with temp token link
			if (!tokenRes) return false;

			//apend table id to token
			token = tokenRes + "-" + token;

			//email logic to send reset password link
			sendResetPasswordEmail(req.body.email, token);

			return res.json({
				message: "Reset Password Link has successfully sent to your email!",
			});
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//reset password
router.post("/resetpassword/:token", async (req, res, next) => {
	console.log(req.body);
	console.log(req.params.token);

	//if token is valid
	let tokenRes = await checkTokenByrowID(req.params.token);

	if (!tokenRes) {
		let error = new Error("Token not found");
		error.status = 400;
		return next(error);
	}
	//token is valid and reset password
	else {
		let Res = await resetPass(tokenRes.userid, req.body);
		if (!Res) return false;
		else {
			res.json({
				message: "Password reset successfully",
			});
			tokenRes.destroy();
		}
	}
});

module.exports = router;
