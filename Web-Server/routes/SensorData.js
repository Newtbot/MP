const { sequelize } = require("../../Database/mySql.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
const {
    getSensorData,
    addSensorData,
    updateSensorData,
    deleteSensorData,
    getSensorDataById,
    getData,

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

router.post("/new", async (req, res, next) => {
	try {
        const { id, id_sensor, id_location, sensordata } = req.body;
        await addSensorData(id , id_sensor , id_location , sensordata);
        res.sendStatus(200).json({message: "SensorData " + id + " added"  });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.put("/update", async (req, res, next) => {
	try {
		const { id , id_sensor , id_location , sensordata } = req.body;
		await updateSensorData( id , id_sensor , id_location , sensordata );
        res.status(200).json({ message: "SensorData " + id + " updated"  });
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
        let query = {
            //can be desc or asc
            order: req.query.order,

            // number of data to be returned
            limit: req.query.limit,

            //can be  sensorid, locationid
            sensorid: req.query.sensorid,

            //can be  sensorid, locationid
            locationid: req.query.locationid,
            //yearly
            year: req.query.year,

            //monthly
            month: req.query.month,

            //weekly
            week: req.query.week,

            //daily
            day: req.query.day,

            //hourly
            hour: req.query.hour,

            //minute
            minute: req.query.minute,
            

          };
          
          const data = await getData(query);
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
