const { getAPIKey , addAPIKey } = require("../functions/apiDatabase.js");
const { hashAPIKey } = require("../functions/bcrypt.js");
const { generateUUID } = require("../functions/generateUUID.js");

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
2) when user click on generate api key button, it will generate a random api key 
3) hash the api key
4) store the api key in database
*/
router.post("/new", async (req, res, next) => {
	try {
        let uuid = await generateUUID()
        //attach uuid to req.body
        req.body.apikey = uuid
        //hash apikey
        req.body.apikey = await hashAPIKey(req.body.apikey)

        await addAPIKey(req.body);
		res.sendStatus(200);

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
async function addAPIKey(userId) {
    let apikey = await generateUUID()
    apikey = await hashAPIKey(req.body.apikey)
    let token =  await apikeyModel.create({apikey, userId});
    return `${token.id}-${apikey}`
}


router.post("/new", async (req, res, next) => {
    try {
        let apikey = await addAPIKey(req.body.userid)
        res.json({apiKey: apikey})

    } catch (error) {
        console.error(error);
        next(error);
    }
});


*/