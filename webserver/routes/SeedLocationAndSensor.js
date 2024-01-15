const { sequelize } = require("../Database/mySql.js");
const { locationModel } = require("../Database/model/locationModel.js");
const { sensorModel } = require("../Database/model/sensorModel.js");

const express = require("express");
const router = express.Router();

let mockLocation = [] 

//add seed
router.post("/new", async (req, res, next) => {
    try {
        console.log(mockLocation)

        for(let locationName of req.body.mockLocation){
            //create location and create sensor 
            let location =  await locationModel.create({
                name: locationName,
                added_by: "system",
                description: "system generated location",
            });
            await sensorModel.create({
                name: `AQI-${Math.floor(Math.random()*898)+101}`,
                added_by: "system",
                mac_address: `${Math.floor(Math.random()*256).toString(16).padStart(2, '0')}-${Math.floor(Math.random()*256).toString(16).padStart(2, '0')}-${Math.floor(Math.random()*256).toString(16).padStart(2, '0')}-${Math.floor(Math.random()*256).toString(16).padStart(2, '0')}-${Math.floor(Math.random()*256).toString(16).padStart(2, '0')}-${Math.floor(Math.random()*256).toString(16).padStart(2, '0')}`,
                description: "system generated sensor",
                locationid: location.id

            });
        }
        res.sendStatus(200)
	} catch (error) {
		console.error(error);
		next(error);
	}
});




module.exports = router;
