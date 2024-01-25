"use strict";

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

//resetted password page
router.get("/resetpassword", function (req, res, next) {
	res.render("resetpassword");
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

module.exports = router;