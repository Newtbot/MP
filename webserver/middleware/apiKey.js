const { checkAPikey } = require("../functions/database.js");
async function apikeyCheck(req, res, next) {
	//const authHeader = req.headers.authorization
	try {
		let apikey = req.headers.authorization;
		if (!apikey) {
            res.status(401).json({
                message: "No API key was supplied. Invalid request",
            });
			//throw new Error("No API key was supplied. Invalid request");
		} else {
			//split the string by the -
			let splitAPIkey = apikey.split("-");
			let rowid = splitAPIkey[0];

			//rejoin withouth the rowid
			let SuppliedKey = splitAPIkey.slice(1).join("-");
			if (checkAPikey(SuppliedKey, rowid)) {
				//get permission
				let permission = await checkAPikey(SuppliedKey, rowid);
				console.log(permission);
				if (req.method === "GET" && permission === "canRead") {
					return next();
				}
				//['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
				if (
					["GET", "POST", "PUT", "DELETE"].includes(req.method) &&
					permission === "canWrite"
				) {
					console.log("write");
					return next();
				}
				//throw status 403
				res.status(403).json({
					message:
						"Your API key does not have the correct permissions to access this resource",
				});
			}
		}
	} catch (error) {
		next(error);
	}
}

module.exports = { apikeyCheck };

/*
//web server microservice
1) take user supplied rowid-apikey
2) split the string by -
3) get the rowid or table id
4) get the apikey
5) compare the apikey with the one in database
6) if match, return true
*/

/*

I plan to seed some data in user and api
Than use the system info and my API middleware will somehow check the supplied API key and check
If it's correct API key and has canWrite perms
I allow it to access put and post


*/
