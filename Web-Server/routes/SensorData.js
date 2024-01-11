const { sequelize } = require("../../Database/mySql.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
const {
	getSensorData,
	addSensorData,
	updateSensorData,
	deleteSensorData,
	getSensorDataById,
	getData,
	getDatabyRange,
	getdataFilter,
	getAverage,
} = require("../functions/apiDatabase.js");

const express = require("express");
const { json } = require("body-parser");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const sensor = await getSensorData();
		res.status(200).json(sensor);
	} catch (error) {
		console.error(error);
		next(error);
	}
});
/*
router.post("/new", async (req, res, next) => {
	try {
		const { id, id_sensor, id_location, sensordata } = req.body;
		await addSensorData(id, id_sensor, id_location, sensordata);
		res.sendStatus(200).json({ message: "SensorData " + id + " added" });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.put("/update", async (req, res, next) => {
	try {
		const { id, id_sensor, id_location, sensordata } = req.body;
		await updateSensorData(id, id_sensor, id_location, sensordata);
		res.status(200).json({ message: "SensorData " + id + " updated" });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete("/delete", async (req, res, next) => {
	try {
		const { id } = req.body;
		await deleteSensorData(id);
		res.status(200).json({ message: "SensorData " + id + " deleted" });
	} catch (error) {
		console.error(error);
		next(error);
	}
});
*/
router.get("/data", async (req, res, next) => {
    try {
		console.log(req.query);
        const data = await getData(req.query);
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

//date range
router.get("/range", async (req, res, next) => {
    try {
		console.log(req.query);
        const data = await getDatabyRange(req.query);
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.get("/:id", async (req, res, next) => {
	try {
		const sensor = await getSensorDataById(req.params.id);
		res.status(200).json(sensor);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;

