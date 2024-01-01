const { sequelize } = require("../../Database/mySql.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
const {
    getSensorData,
    addSensorData,
    updateSensorData,
    deleteSensorData,
    getSensorDataById,

} = require("../functions/APIDatabase.js");

const express = require("express");
const { json } = require("body-parser");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const sensor = await getSensorData();
		res.json(sensor);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.post("/new", async (req, res, next) => {
	try {
    //JSON.parse(d) /* d is the parameter of the method 'add()'  */

        const { id, id_sensor, id_location, sensordata } = req.body;
        await addSensorData(id , id_sensor , id_location , sensordata);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.put("/update", async (req, res, next) => {
	try {
		const { id , id_sensor , id_location , sensordata } = req.body;
		await updateSensorData( id , id_sensor , id_location , sensordata );
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete("/delete", async (req, res, next) => {
    try {
        const { id } = req.body;
        await deleteSensorData(id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const sensor = await getSensorDataById(req.params.id);
        res.json(sensor);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
