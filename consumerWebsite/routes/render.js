"use strict";
const { checkTokenByrowID } = require("../functions/api");

var router = require("express").Router();

//landing page of index
router.get("/", function (req, res, next) {
	res.render("index");
});

//news page
router.get("/news", function (req, res, next) {
	res.render("news");
});

//learn more page
router.get("/learnmore", function (req, res, next) {
	res.render("learnmore");
});

//login | register page
router.get("/login", function (req, res, next) {
	res.render("signuplogin");
});

//profile page
router.get("/profile", function (req, res, next) {
	res.render("profile");
});


//forgot password page
router.get("/forgotpassword", function (req, res, next) {
	res.render("forgotpassword");
});

//resetting password page
router.get("/resetpassword", function (req, res, next) {
	res.render("resetpassword");
});

//check email page
router.get("/checkemail", function (req, res, next) {
	res.render("checkemail");
});

//contact page
router.get("/contact", function (req, res, next) {
	res.render("contact");
});

//data page
router.get("/viewdata", function (req, res, next) {
	res.render("viewdata");
});

//api doc
router.get("/api", function (req, res, next) {
	res.render("api");
});

// sensor data
router.get("/sensor-data", function (req, res, next) {
	res.render("sensor-data");
});

//reset password page
router.get("/resetpassword/:token", async (req, res, next) => {	
	try{
	//pass token to reset password page 
	//console.log(req.params.token);

	//check if token is valid
	let tokenRes = await checkTokenByrowID(req.params.token);

	if (!tokenRes) {
		let error = new Error("Token not found");
		error.status = 400;
		return next(error);
	}
	else {
		let token = req.params.token;
		console.log(token);
		res.render("resetpassword", { token: token });
	  }

	}catch(error){
		console.error(error);
		next(error);
	}
});


module.exports = router;