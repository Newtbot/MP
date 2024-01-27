const { addToken, checkToken } = require("../functions/api");
const { checkEmail, getUserByEmail } = require("../functions/user");
const { sendTokenEmail } = require("../functions/nodeMail");

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
		//console.log(req.body);
		const Res = await checkEmail(req.body.email);
		if (!Res) {
			let error = new Error("Email not found");
			error.status = 400;
			return next(error);
		} else {
			let userid = await getUserByEmail(req.body.email);
			if (!userid) return false;
			
			const tokenRes = await checkToken(userid.id);
			if (tokenRes.isKey !== "null" && tokenRes.isKey !== "isKey") {
				//allow user to create token
				const token = await addToken(
					userid.id,
					"canRead",
					"isKey",
					"2204-01-24 07:34:36"
				);
				if (!token) return false;
				sendTokenEmail(req.body.email, token);
				res.json({
					message: "Token generated successfully and sent to email",
				});
			}
		}

		//const token = await addToken(req.body.userid, "canRead" , "2204-01-24 07:34:36" );
		//res.json({token: token});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
