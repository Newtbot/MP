const { locationModel } = require("../database/locationModel");
const { sensorModel } = require("../database/sensorModel");

async function getLocation() {
	const location = locationModel.findAll({
		raw: true,
		order: [["id", "ASC"]],
		attributes: ["id"],
	});
	return location;
}

async function getSensor() {
	const sensor = sensorModel.findAll({
		raw: true,
		order: [["id", "ASC"]],
		attributes: ["id"],
	});
	return sensor;
}


module.exports = { getLocation, getSensor };