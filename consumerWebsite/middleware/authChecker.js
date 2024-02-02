const { getTokenByToken } = require("../functions/api");

const permissionError = new Error('PermissionError')
permissionError.name = "Inadequate Permission Error"
permissionError.status = 401
permissionError.message = "Inadequate permission to complete this response"

async function auth(req, res, next) {
    try {
        const token = await getTokenByToken(req.header("auth-token"));

        if (!token || !token.isValid){
            throw permissionError;
        }

        //if token is a match
        req.token = token;
        req.user = await token.getUser();

        const route = req.originalUrl.split("?")[0]; // Removing query parameters
        //if route is from user/ and permission is canRead allow it to do CRUD
        if (route.includes("/user/") || route.includes("/token/") && token.permission === "canRead") {
            // console.log("user route");
            return next();
        }
        if ((req.method === "GET" && token.permission === "canRead")){
            // console.log("wtf you shldnt be here");
            return next();
        }
        if (["GET", "POST", "PUT", "DELETE"].includes(req.method) && token.permission === "canWrite") {
            // console.log("wtf you shldnt be here");
            return next();
        }
        /*
        if ((req.method === "GET" && token.permission === "canRead") ||
         (["GET", "POST", "PUT", "DELETE"].includes(req.method) && token.permission === "canWrite")) {
            return next();
        }
        */

        throw permissionError
     
    } catch (error) {
        next(error);
    }
}
module.exports = { auth };

