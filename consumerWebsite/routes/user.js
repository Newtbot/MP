const { addUser, loginUser } = require("../functions/apiDatabase.js");

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
		}
    else{
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
		}
    else{
      //pass res back to form to be set in local storage
      console.log(Res);
      return res.json({
        message: "User login successfully",
        token: Res.token,
        userId: Res.userid,
        username: Res.username,
      }); 

    }
	} catch (error) {
		console.error(error);
		next(error);
	}
});
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
