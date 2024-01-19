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


// /user/register
router.post("/register", async (req, res, next) => {
	try {
		console.log("this is " , req.body);
		await addUser(req.body);
		res.status(200).json({ register: true });
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


/*

curl localhost/api/v0/user/register -H "Content-Type: application/json" -X POST -d '{"username": 
"testuser123", "password": "thisisthesystemuserpasswordnoob", "email": "testuser123@ecosaver.com", "address": 
"Nanyang Polytechnic 180 Ang Mo Kio Avenue 8 Singapore 569830", "phone": "12345678"}'
'use strict';

const router = require('express').Router();
const {User} = require('../models/user'); 

router.get('/', async function(req, res, next){
  try{
    return res.json({
      results:  await User[req.query.detail ? "listDetail" : "list"]()
    });
  }catch(error){
    next(error);
  }
});

router.get('/me', async function(req, res, next){
  try{

    return res.json(await User.get({uid: req.user.uid}));
  }catch(error){
    next(error);
  }
});

router.get('/:uid', async function(req, res, next){
  try{
    return res.json({
      results:  await User.get(req.params.uid),
    });
  }catch(error){
    next(error);
  }
});

module.exports = router;


*/