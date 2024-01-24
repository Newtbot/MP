const { addToken } = require("../functions/api");


const express = require("express");
const router = express.Router();

/*
1) ensure user is logged in (frontend session validation blah or wtv)
2) when user click on generate api key button, it will generate a random api key. how to get userid can be done by session or wtv
3) hash the api key
4) store the api key in database
*/
//token/new
//curl localhost:3000/api/v0/token/new -H "Content-Type: application/json" -X POST -d 
//'{"userid": "5", "permission": "canRead" ,}'
router.post("/new", async (req, res, next) => {
	try {
        const token = await addToken(req.body.userid, req.body.permission , "2204-01-24 07:34:36" );
        res.json({token: token});
	} catch (error) {
		console.error(error);
		next(error);
	}
});


module.exports = router;

