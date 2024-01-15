const {
	getSensor,
	addSensor,
	updateSensor,
    deleteSensor,
    getSensorById
} = require("../functions/apiDatabase.js");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const sensor = await getSensor();
		res.status(200).json(sensor);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


router.post("/new", async (req, res, next) => {
	try {
		const { sensorname, added_by, mac_address ,  description, location } = req.body;
		await addSensor(sensorname, added_by, mac_address ,description, location);
		res.sendStatus(200)
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.put("/update", async (req, res, next) => {
	try {
		const { id, sensorname, added_by, mac_address ,description, location } = req.body;
		await updateSensor(id, sensorname, added_by, mac_address ,  description, location);
		res.status(200).json({ message: "Sensor " + id + " updated"  });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete("/delete", async (req, res, next) => {
    try {
        const { id } = req.body;
        await deleteSensor(id);
		res.status(200).json({ message: "Sensor " + id + " deleted" });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const sensor = await getSensorById(req.params.id);
        res.status(200).json(sensor);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
