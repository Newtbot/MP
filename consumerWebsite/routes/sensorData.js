const {
	getSensorData,
	addSensorData,
	updateSensorData,
	deleteSensorData,
	getSensorDataById,
	getData,
	getDatabyRange,
} = require("../functions/sensorData");

const express = require("express");
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

router.post("/new", async (req, res, next) => {
	try {
		const { id_sensor, id_location, sensordata } = req.body;
		let data = await addSensorData(id_sensor, id_location, sensordata);
		res.json({ message: "SensorData " + data.id + " added", ...data });
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
