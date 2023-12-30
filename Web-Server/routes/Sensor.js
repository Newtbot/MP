const { sequelize } = require("../../Database/mySql.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");
const {
	getSensor,
	addSensor,
	updateSensor,
    deleteSensor,
    getSensorById
} = require("../functions/APIDatabase.js");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const sensor = await getSensor();
		res.json(sensor);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.post("/new", async (req, res, next) => {
	try {
		const { sensortype, added_by, description, location } = req.body;
		await addSensor(sensortype, added_by, description, location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.put("/update", async (req, res, next) => {
	try {
		const { id, sensortype, added_by, description, location } = req.body;
		await updateSensor(id, sensortype, added_by, description, location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete("/delete", async (req, res, next) => {
    try {
        const { id } = req.body;
        await deleteSensor(id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const sensor = await getSensorById(req.params.id);
        res.json(sensor);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
