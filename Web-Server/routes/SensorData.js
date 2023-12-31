const { sequelize } = require("../../Database/mySql.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
const {
	getSensorData,
	addSensorData,
	updateSensorData,
	deleteSensorData,
	getSensorDataById,
	getData,
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

			//start date
			startdate: req.query.startdate,

			//end date
			enddate: req.query.enddate,

            //highest or lowest of psi, co, o3, no2, so2, humidity, windspeed, temperature
			psi: req.query.psi,
            co: req.query.co,
            o3: req.query.o3,
            no2: req.query.no2,
            so2: req.query.so2,
            humidity: req.query.humidity,
            windspeed: req.query.windspeed,
            temperature: req.query.temperature,

		};

		const data = await getData(query);
		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


router.get("/filter", async (req, res, next) => {
	try {
		const query = {
			limit: req.query.limit,
			psi: req.query.psi,
            co: req.query.co,
            o3: req.query.o3,
            no2: req.query.no2,
            so2: req.query.so2,
            humidity: req.query.humidity,
            windspeed: req.query.windspeed,
            temperature: req.query.temperature,

			//sensorid and locationid
		};
        const data = await getdataFilter(query);
        res.status(200).json(data);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


//average 
router.get("/average", async (req, res, next) => {
	try {
		const query = {
			psi: req.query.psi,
			co: req.query.co,
			o3: req.query.o3,
			no2: req.query.no2,
			so2: req.query.so2,
			humidity: req.query.humidity,
			windspeed: req.query.windspeed,
			temperature: req.query.temperature,
			//daily
			day: req.query.day,
			//hourly
			hour: req.query.hour,
			//weekly
			week: req.query.week,
			//monthly
			month: req.query.month,
			//yearly
			year: req.query.year,			
		};
		const data = await getAverage(query);
		
		res.status(200).json(data);

	}
	catch (error) {
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
/*
**Aggregate Sensor Data (e.g., Average PSI):**

- **Route:** `GET /api/v0/sensor-data/aggregate`
- **Query Parameter:** `metric` (e.g., `psi`, `co`, `o3`)
- **Description:** Calculate aggregate metrics for the specified parameter.


*/

/*
"measurement": {
      "co": 8,
      "o3": 89,
      "no2": 31,
      "psi": 34,
      "so2": 17,
      "humidity": 86,
      "windspeed": 10,
      "temperature": 26
    },

*/