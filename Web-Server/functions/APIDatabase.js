const { sequelize } = require("../../Database/mySql.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
var moment = require("moment");

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

async function getData(query) {
	let ormQuery = {};
	if (query.limit !== undefined && query.order !== undefined)
		ormQuery = {
			limit: parseInt(query.limit),
			//console.log(sentence.toUpperCase());
			order: [["createdAt", query.order.toUpperCase()]],
			...ormQuery,
		};
	else if (query.sensorid !== undefined) {
		ormQuery = {
			where: {
				sensorid: query.sensorid,
			},
			...ormQuery,
		};
	} else if (query.locationid !== undefined) {
		ormQuery = {
			where: {
				locationid: query.locationid,
			},
			...ormQuery,
		};
	} else if (query.year !== undefined) {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				query.year
			),
			...ormQuery,
		};
	} else if (query.month !== undefined) {
		console.log(typeof query.month);
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
		if (validMonths.includes(query.month)) {
			ormQuery = {
				where: sequelize.where(
					sequelize.fn("MONTH", sequelize.col("createdAt")),
					query.month
				),
				...ormQuery,
			};
		} else {
			query.month = getMonthFromString(query.month);
			ormQuery = {
				where: sequelize.where(
					sequelize.fn("MONTH", sequelize.col("createdAt")),
					query.month
				),
				...ormQuery,
			};
		}
		//weekly
	} else if (query.week !== undefined) {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("WEEK", sequelize.col("createdAt")),
				query.week
			),
			...ormQuery,
		};
	}

	//daily data

	//hourly data

	//get data by year by specific sensor

	//get by month by specific sensor

	//get by week by specific sensor

	//get by daily  by specific sensor

	//get by hourly by specific sensor

	//get data by year by specific location

	//get by month by specific location

	//get by week by specific location

	//get by daily  by specific location

	//get by hourly by specific location

	//get specific data like psi or wtv

	return await sensorDataModel.findAll(ormQuery);
}

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
};
