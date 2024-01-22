const { getUserID, updateProfile } = require("../functions/apiDatabase.js");

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
router.delete("/logout", async function (req, res, next) {
	try {
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
	} catch (error) {
		next(error);
	}
});

//update
router.put("/update", async function (req, res, next) {
	try {
		if (!req.body.password) {
			let updateRes = await updateProfile(req.user, req.body);
			if (!updateRes) return next(error);
            console.log(updateRes);
			res.json({
				message: "User updated successfully",
			});
		} else {
			let updateRes = await updateProfile(req.user, req.body);
			if (!updateRes) return next(error);
			res.json({
				message: "User updated successfully",
			});            
		}
	} catch (error) {
		next(error);
	}
});

//delete
router.delete("/delete", async function (req, res, next) {
	//https://stackoverflow.com/questions/23128816/sequelize-js-ondelete-cascade-is-not-deleting-records-sequelize
	//destroy method call on seq object
	req.token.destroy({
		onDelete: "cascade",
	});
	req.user.destroy();
	res.json({
		message: "User deleted successfully",
	});
});

module.exports = router;
