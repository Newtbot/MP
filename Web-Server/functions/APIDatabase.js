const { sequelize } = require("../../Database/mySql.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
const { Op } = require("sequelize");

//helper function to convert month name to month number
//https://stackoverflow.com/questions/13566552/easiest-way-to-convert-month-name-to-month-number-in-js-jan-01
function getMonthFromString(mon) {
	var d = Date.parse(mon + "1, 2012");
	if (!isNaN(d)) {
		return new Date(d).getMonth() + 1;
	}
	return -1;
}
async function getLocation() {
	const location = await locationModel.findAll();
	return location;
}

async function addLocation(name, added_by, description) {
	const location = await locationModel.create({
		name: name,
		added_by: added_by,
		description: description,
	});
}

async function updateLocation(id, name, added_by, description) {
	const location = await locationModel.update(
		{
			name: name,
			added_by: added_by,
			description: description,
		},
		{
			where: {
				id: id,
			},
		}
	);
}

async function deleteLocation(id) {
	//delete by id
	const location = await locationModel.destroy({
		where: {
			id: id,
		},
	});
}

async function getLocationById(id) {
	const location = await locationModel.findAll({
		where: {
			id: id,
		},
	});
	return location;
}

async function getSensor() {
	const sensor = await sensorModel.findAll();
	return sensor;
	console.error(error);
}

async function addSensor(
	sensorname,
	added_by,
	mac_address,
	description,
	location
) {
	const sensor = await sensorModel.create({
		name: sensorname,
		added_by: added_by,
		mac_address: mac_address,
		description: description,
		location: location,
	});
}

async function updateSensor(
	id,
	sensorname,
	added_by,
	mac_address,
	description,
	location
) {
	const sensor = await sensorModel.update(
		{
			name: sensorname,
			added_by: added_by,
			mac_address: mac_address,
			description: description,
			location: location,
		},
		{
			where: {
				id: id,
			},
		}
	);
}

async function deleteSensor(id) {
	//delete by id
	const sensor = await sensorModel.destroy({
		where: {
			id: id,
		},
	});

	console.error(error);
}

async function getSensorById(id) {
	const sensor = await sensorModel.findAll({
		where: {
			id: id,
		},
	});
	return sensor;
}

async function getSensorData() {
	const sensorData = await sensorDataModel.findAll();
	return sensorData;
}

async function addSensorData(id, id_sensor, id_location, sensordata) {
	const sensorData = await sensorDataModel.create({
		id: id,
		sensorid: id_sensor,
		locationid: id_location,
		measurement: sensordata,
	});
}

async function updateSensorData(id, id_sensor, id_location, sensordata) {
	const sensorData = await sensorDataModel.update(
		{
			ensorid: id_sensor,
			locationid: id_location,
			measurement: sensordata,
		},
		{
			where: {
				id: id,
			},
		}
	);
}

async function deleteSensorData(id) {
	const sensorData = await sensorDataModel.destroy({
		where: {
			id: id,
		},
	});
}

async function getSensorDataById(id) {
	const sensorData = await sensorDataModel.findAll({
		where: {
			id: id,
		},
	});
	return sensorData;
}
var ormQuery = {};
var whereClause = {};
const validMonths = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
];
//handle buildfunc for query
buildQuery = {
	limit: async function (queryString) {
		if (queryString.limit !== undefined) {
			ormQuery.limit = parseInt(queryString.limit);
		}
	},
	order: async function (queryString) {
		if (queryString.order !== undefined) {
			ormQuery = {
				...ormQuery,
				order: [["createdAt", queryString.order.toUpperCase()]],
			};
		}
	},
	year: async function (queryString) {
		if (queryString.year !== undefined) {
			//whereclause assign a value
			whereClause.year = sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				queryString.year
			);
		}
	},
	month: async function (queryString) {
		console.log("queryString month:", queryString.month, queryString);
		if (queryString.month !== undefined) {
			console.log("queryString month:", "i should not be here");
			if (validMonths.includes(queryString.month)) {
				whereClause.month = sequelize.where(
					sequelize.fn("MONTH", sequelize.col("createdAt")),
					queryString.month
				);
			} else {
				queryString.month = getMonthFromString(queryString.month);
				whereClause.month = sequelize.where(
					sequelize.fn("MONTH", sequelize.col("createdAt")),
					queryString.month
				);
			}
		}
	},
	week: async function (queryString) {
		if (queryString.week !== undefined) {
			whereClause.week = sequelize.where(
				sequelize.fn("WEEK", sequelize.col("createdAt")),
				queryString.week
			);
		}
	},
	day: async function (queryString) {
		if (queryString.day !== undefined) {
			whereClause.day = sequelize.where(
				sequelize.fn("DAY", sequelize.col("createdAt")),
				queryString.day
			);
		}
	},
	hour: async function (queryString) {
		if (queryString.hour !== undefined) {
			whereClause.hour = sequelize.where(
				sequelize.fn("HOUR", sequelize.col("createdAt")),
				queryString.hour
			);
		}
	},
	minute: async function (queryString) {
		if (queryString.minute !== undefined) {
			whereClause.minute = sequelize.where(
				sequelize.fn("MINUTE", sequelize.col("createdAt")),
				queryString.minute
			);
		}
	},
};

async function getData(queryString) {
	// reset keys...
	ormQuery = {};
	whereClause = {};
	for (let query in queryString) {
		console.log(queryString);
		console.log(query);
		console.log(whereClause);
		//console.log(ormQuery);

		if (buildQuery[query]) {
			await buildQuery[query](queryString);
		}
	}

	if (!whereClause) {
		return await sensorDataModel.findAll(ormQuery);
	} else if (whereClause) {
		return await sensorDataModel.findAll({
			limit: queryString.limit || 1000000,
			//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
			//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
			where: {
				[Op.and]: [whereClause],
			},
			//only use where clause to lookup based on condition that i put into whereClause
			...ormQuery,
		});
	}
}

async function getAverage(query) {}

/*

*/

module.exports = {
	getLocation,
	addLocation,
	updateLocation,
	deleteLocation,
	getLocationById,
	getSensor,
	addSensor,
	updateSensor,
	deleteSensor,
	getSensorById,
	getSensorData,
	addSensorData,
	updateSensorData,
	deleteSensorData,
	getSensorDataById,
	getData,
	getAverage,
};
