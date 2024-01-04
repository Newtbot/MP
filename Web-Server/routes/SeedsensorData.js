const { sequelize } = require("../../Database/mySql.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");

const express = require("express");
const router = express.Router();

let mockLocation = [] 

//add seed
router.post("/new", async (req, res, next) => {
    try {

	} catch (error) {
		console.error(error);
		next(error);
	}
});




module.exports = router;

/*
1) get id of sensor and location
2) mock data 
3) take post req for start date and end date 
4) post to db 

that takes startDate and an option endDate (the defaults to day) and an option interval to declare the polling interval
i would have more field TBH, that i would start with that

*/