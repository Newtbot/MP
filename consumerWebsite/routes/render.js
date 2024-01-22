/*
'use strict';

var router = require('express').Router();
const conf = require('../conf')

const values ={
  title: conf.environment !== 'production' ? `<i class="fa-brands fa-dev"></i>` : ''
}

router.get('/', async function(req, res, next) {
  res.render('runner', {...values});
});


router.get('/topics', function(req, res, next) {
  res.render('topics', {...values});
});

router.get('/chat', function(req, res, next) {
  res.render('chat', {...values});
});

router.get('/login*', function(req, res, next) {
  res.render('login', {redirect: req.query.redirect, ...values});
});

router.get('/runner', function(req, res, next) {
  res.render('runner', {...values});
});

router.get('/worker', function(req, res, next) {
  res.render('worker', {...values});
});

module.exports = router;

*/

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

//api doc
router.get("/api", function (req, res, next) {
	res.render("api");
});


module.exports = router;
