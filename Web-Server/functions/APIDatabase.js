const { sequelize } = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");

async function getLocation() {
	try {
		const location = await locationModel.findAll();
		return location;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function addLocation(name, added_by, description) {
	try {
		const location = await locationModel.create({
			name: name,
			added_by: added_by,
			description: description,
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function updateLocation(id, name, added_by, description) {
	try {
		//update by id
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
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function deleteLocation(id) {
	try {
		//delete by id
		const location = await locationModel.destroy({
			where: {
				id: id,
			},
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getLocationById(id) {
	try {
		const location = await locationModel.findAll({
			where: {
				id: id,
			},
		});
		return location;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getSensor() {
	try {
		const sensor = await sensorModel.findAll();
		return sensor;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function addSensor(sensortype, added_by, description, location) {
	try {
		const sensor = await sensorModel.create({
			sensortype: sensortype,
			added_by: added_by,
			description: description,
			location: location,
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function updateSensor(id, sensortype, added_by, description, location) {
	try {
		//update by id
		const sensor = await sensorModel.update(
			{
				sensortype: sensortype,
				added_by: added_by,
				description: description,
				location: location,

			},
			{
				where: {
					id: id,
				},
			}
		);
	} catch (error) {
		console.error(error);
		return null;
	}

}

async function deleteSensor(id) {
	try {
		//delete by id
		const sensor = await sensorModel.destroy({
			where: {
				id: id,
			},
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getSensorById(id) {
	try {
		const sensor = await sensorModel.findAll({
			where: {
				id: id,
			},
		});
		return sensor;
	} catch (error) {
		console.error(error);
		return null;
	}
}


async function getallData() {
	try {
		const allData = await IoTModel.findAll({
			attributes: [
				"id",
				"psiData",
				"humidityData",
				"o3Data",
				"no2Data",
				"so2Data",
				"coData",
				"temperatureData",
				"windspeedData",
				"currentTime",
				"regionData",
				"createdAt",
				"updatedAt",
			],
		});
		return allData;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getLatestData() {
	try {
		const latestData = await IoTModel.findAll({
			limit: 1,
			order: [["createdAt", "DESC"]],
		});
		return latestData;
	} catch (error) {
		console.error(error);
		return null;
	}
}

module.exports = {
	getallData,
	getLatestData,
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
};
