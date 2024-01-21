const { getUserID , deleteUserToken } = require("../functions/apiDatabase.js");

const express = require("express");
const router = express.Router();

//api/v0/user/me
//getbyid
router.get("/me", async function (req, res, next) {
    try {
        let user = await getUserID(req.user);
        if (!user) {
            let error = new Error("User not found");
            error.status = 400;
            return next(error);
        }
        res.json({
            user: user,
        });

    } catch (error) {
        next(error);
    }
});


//logout 
router.delete('/logout', async function(req, res, next){
    try{
        /*
        let authToken = req.header('auth-token');
        let userDel = await deleteUserToken(authToken);
        if (!userDel) {
            let error = new Error("User not found");
            error.status = 400;
            return next(error);
        }
        */
       //destroy method call on seq object  
        req.token.destroy();
        // DO NOT CALL THIS!!! IT WILL DESTROY USERMODEL SEQ OBJ
        //req.user.destroy(); 
        res.json({
            message: "User logged out successfully",
        });

    }catch(error){
        next(error);
    }
  });

//update
//delete

module.exports = router;



