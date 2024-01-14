const { sequelize } = require("../Database/mySql.js");
const { locationModel } = require("../Database/model/locationModel.js");
const { sensorModel } = require("../Database/model/sensorModel.js");
const { sensorDataModel } = require("../Database/model/sensorDataModel.js");

const express = require("express");
const router = express.Router();
var moment = require("moment");

async function seedSensorData(seedOptions) {
	seedOptions.endDate = new Date(seedOptions.endDate) || Date.now();
	seedOptions.interval = seedOptions.interval || 15; //15 minutes
	seedOptions.sensorid = seedOptions.sensorid || (await sensorModel.findAll()).map((i) => i.id);
	seedOptions.seedData = seedOptions.seedData || {};

	let rows = [];

	for (let sensorId of seedOptions.sensorid) {
		let sensor = await sensorModel.findByPk(sensorId);
		let locationId = sensor.locationid;

		let currentRow = firstDataRow(seedOptions.startDate, sensorId, locationId);
		rows.push(currentRow);
		while (currentRow.createdAt <= seedOptions.endDate) {
			currentRow = nextDataRow(currentRow, seedOptions.interval);
			rows.push(currentRow);
		}
	}

	await sensorDataModel.bulkCreate(rows)
}

function convertDateToUTC(startDate) {
	let date = new Date(startDate);
	date = moment(date).utc().toDate();
	//return as object
	return date;
}

//populate first row of sensordata model with random data from seedData
function firstDataRow(startDate, sensorId, locationId) {
	return {
		sensorid: sensorId,
		locationid: locationId,
		measurement: {
			psi: Math.floor(Math.random() * 30) + 5,
			humidity: Math.floor(Math.random() * (90 - 80 + 1) + 80),
			o3: Math.floor(Math.random() * (100 - 20 + 1) + 30),
			no2: Math.floor(Math.random() * 30) + 5,
			so2: Math.floor(Math.random() * 30) + 5,
			co: Math.floor(Math.random() * 25 - 0.5),
			temperature: Math.floor(Math.random() * (30 - 23 + 1) + 25),
			windspeed: Math.floor(Math.random() * (10 - 1 + 1) + 1),
		},
		createdAt: convertDateToUTC(startDate),
	};
}

function nextDataRow(currentRow, interval) {
	return {
		sensorid: currentRow.sensorid,
		locationid: currentRow.locationid,
		measurement: {
			psi: numberWithinPercent(currentRow.measurement.psi),
			humidity: Math.floor(Math.random() * (90 - 80 + 1) + 80),
			o3: numberWithinPercent(currentRow.measurement.o3),
			no2: numberWithinPercent(currentRow.measurement.no2),
			so2: numberWithinPercent(currentRow.measurement.so2),
			co: numberWithinPercent(currentRow.measurement.co),
			temperature: Math.floor(Math.random() * (30 - 23 + 1) + 25),
			windspeed: Math.floor(Math.random() * (10 - 1 + 1) + 1),
		},
		//add 15 minutes to current row time to get next row time in UTC
		createdAt: moment(currentRow.createdAt).add(interval, "m").toDate(),
	};
}

function numberWithinPercent(inputNumber) {
	// Define a reasonable range for the random offset
	const maxOffset = 5;
	const minOffset = -5;
  
	// Add a random offset within the defined range
	const randomOffset = Math.random() * (maxOffset - minOffset) + minOffset;
	
	// Calculate the new number with the offset
	const newNumber = inputNumber + randomOffset;
  
	// Ensure the new number is within a reasonable range
	return Math.max(5, Math.min(100, Math.floor(newNumber)));
  }

//add seed
router.post("/new", async (req, res, next) => {
	try {
		const seedOptions = req.body;
		console.log(seedOptions);
		seedSensorData(seedOptions);
		res.status(200)
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;

/*
POST /api/v0/seed/sensordata
{
"startDate" : "10-10-2010", // Date to start faking data REQUIRED
"endDate": "10-10-2011", // Date to stop fake data, optional defaults today
"interval": 150000, // Time in seconds between sensor polling
"sensors": [0,1,2], // ID of sensors to fake, optional defaults to all
"seedData": {"object of sensor data"} // The first sensor data row to start with, optional, will use random function as default
}

1) firstDataRow(startDate)
2) nextDataRow(lastRow, interval)
3) seedSensorData({post object from abovr})

*/
