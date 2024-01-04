const { sequelize } = require("../../Database/mySql.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");

const express = require("express");
const router = express.Router();

async function seedSensorData(seedOptions) {
	//2024-01-01 18:48:04
    seedOptions.endDate = seedOptions.endDate || Date.now();
    seedOptions.interval = seedOptions.interval || 150000; //15 minutes
    seedOptions.sensorid = seedOptions.sensorid || (await sensorModel.findAll()).map((i) => i.id);
    seedOptions.seedData = seedOptions.seedData || {};
    
    let rows = []

    for (let sensorId of seedOptions.sensorid) {
        let sensor = await sensorModel.findByPk(sensorId)
		let locationID = sensor.location_id;
		
        let currentRow = firstDataRow(seedOptions.startDate , sensorId, locationID);
        rows.push(currentRow);
        while (currentRow.createdAt < seedOptions.endDate) {
            currentRow = nextDataRow(currentRow, seedOptions.interval);
            rows.push(currentRow);
        }
    }

    //await sensorDataModel.bulkCreate(rows)
	console.log(rows);
}

//populate first row of sensordata model with random data from seedData
function firstDataRow(startDate , sensorId, locationID) {
	console.log(startDate);
	console.log(locationID);
	return {
		sensorid: sensorId,
		locationid: locationID,
		sensordata: {
			//console.log(Math.floor(Math.random() * 30) + 5)
			psi: Math.floor(Math.random() * 30) + 5,
			humidity: Math.floor(Math.random() * (90 - 80 + 1) + 80),
			o3: Math.floor(Math.random() * (100 - 20 + 1) + 30),
			no2: Math.floor(Math.random() * 30) + 5,
			so2: Math.floor(Math.random() * 30) + 5,
			co: Math.floor(Math.random() * 25 - 0.5),
			temperature: Math.floor(Math.random() * (30 - 23 + 1) + 25),
			windspeed: Math.floor(Math.random() * (10 - 1 + 1) + 1),
		},
		createdAt: startDate,
	};
}

function numberWithinTenPercent(inputNumber) {
    // Calculate the range for 10% of the input number
    const range = 0.1 * inputNumber;

    // Generate a random number within the range (-10% to +10%)
    const randomOffset = Math.random() * range * 2 - range;

    // Calculate the new number within the +/- 10% range
    const newNumber = inputNumber + randomOffset;

    return newNumber;
}

function nextDataRow(currentRow, interval) {
    return {
        sensorid: currentRow.sensorid,
        locationid: currentRow.locationid,
        sensordata: {
            psi: numberWithinTenPercent(currentRow.sensordata.psi),
            humidity: numberWithinTenPercent(currentRow.sensordata.humidity),
            o3: numberWithinTenPercent(currentRow.sensordata.o3),
            no2: numberWithinTenPercent(currentRow.sensordata.no2),
            so2: numberWithinTenPercent(currentRow.sensordata.so2),
            co: numberWithinTenPercent(currentRow.sensordata.co),
            temperature: numberWithinTenPercent(currentRow.sensordata.temperatue),
            windspeed: numberWithinTenPercent(currentRow.sensordata.windspeed),
        },
		//convert 10-10-2020 to utc time
		/*	
		const createdAtString = 'Sat Oct 10 2020 00:00:00 GMT+0800 (Singapore Standard Time)';
		const createdAtDateObject = new Date(createdAtString);

		// Add 150000 milliseconds
		const updatedTimestamp = createdAtDateObject.getTime() + 150000;

		// Create a new Date object with the updated timestamp
		const updatedDateObject = new Date(updatedTimestamp);

		console.log(updatedDateObject);
		*/
        createdAt: new Date (currentRow.createdAt).getTime() + interval,
    };    

}




//add seed
router.post("/new", async (req, res, next) => {
	try {
		const seedOptions = req.body;
		console.log(seedOptions);
		seedSensorData(seedOptions);

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
