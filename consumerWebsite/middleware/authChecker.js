const { tokenModel } = require("../database/model/tokenModel");
const { userModel } = require("../database/model/userModel");
const { compareHash } = require("../functions/bcrypt");
const { checkToken } = require("../functions/api");
const { isValid } = require("../functions/isValid");


async function auth(req, res, next) {
    try {
        const authToken = req.header("auth-token");
        if (!authToken) {
            const error = new Error("No Token key was supplied. Invalid request");
            throw error;
        }

        const splitAuthToken = authToken.split("-");
        const rowid = splitAuthToken[0];
        const suppliedToken = splitAuthToken.slice(1).join("-");

        const token = await tokenModel.findByPk(rowid, { include: userModel });

        if (!token) {
            const error = new Error("Token key not found. Invalid request");
            throw error;
        }

        const isMatch = await compareHash(suppliedToken, token.token);

        console.log(isMatch);
        if (!isMatch) {
            const error = new Error("Token key not found. Invalid request");
            throw error;
        }
        //if token is a match
        req.token = token;
        req.user = await token.getUser();
        const permission = await checkToken(suppliedToken, rowid);

        const route = req.originalUrl.split("?")[0]; // Removing query parameters
        //if route is from user/ and permission is canRead allow it to do CRUD
        if (route.includes("/user/") && permission === "canRead") {
            next();
        }
        if ((req.method === "GET" && permission === "canRead") || (["GET", "POST", "PUT", "DELETE"].includes(req.method) && permission === "canWrite")) {
            next();
        }

        if (!isValid(token.expiration)){
            req.token.destroy();
            throw new Error("Token expired");            
        }

     
    } catch (error) {
        next(error);
    }
}

module.exports = { auth };

/*
        else {
            const error = new Error("Insufficient permission");
            error.status = 401;
            throw error;
        }

*/