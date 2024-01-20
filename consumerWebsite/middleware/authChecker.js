const { apikeyModel } = require("../database/model/apiKeyModel");
const { userModel } = require("../database/model/userModel");
const { comparePassword } = require("../functions/bcrypt");

async function auth(req, res, next){
    try{ 
        //		let user = await Auth.checkToken({token: req.header('auth-token')});
        let authToken = req.header('auth-token');
        let splitAuthToken = authToken.split('-');
        let rowid = splitAuthToken[0];
        let suppliedToken = splitAuthToken.slice(1).join('-');

        //get from db
        let token = await apikeyModel.findByPk(rowid, {include: userModel});

        //compare
        let isMatch = await comparePassword(suppliedToken, token.apikey);
        if (!isMatch) return false;

        //else do logic
        //pass hashed token to req.token (IMPORTANT ITS NOT PASSED TO CLIENT)
        req.token = token
        req.user = await token.getUser();
        next();
    }catch(error){
        next(error);
    }
}

module.exports = { auth };
