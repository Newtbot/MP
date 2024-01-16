const { getAPIKey , addAPIKey } = require("../functions/apiDatabase.js");


const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const location = await getAPIKey();
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

/*
1) ensure user is logged in (frontend session validation blah or wtv)
2) when user click on generate api key button, it will generate a random api key. how to get userid can be done by session or wtv
3) hash the api key
4) store the api key in database
*/
router.post("/new", async (req, res, next) => {
	try {
        //curl localhost/api/v0/apikey/new -H "Content-Type: application/json" -X POST -d 
        //'{"userid": 1, "permission": "canWrite"}'
        const apikey = await addAPIKey(req.body.userid, req.body.permission);
        //console.log(typeof req.body.userid);
        //console.log(typeof req.body.permission);
        res.json({apikey: apikey});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//update
//delete
//getbyid

module.exports = router;

