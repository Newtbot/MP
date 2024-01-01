const { sequelize } = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");


async function getLocation() {
	try {
		const location = await locationModel.findAll();
		return location;
	} catch (error) {
		console.error(error);
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
	}
}

async function getSensor() {
	try {
		const sensor = await sensorModel.findAll();
		return sensor;
	} catch (error) {
		console.error(error);
	}
}

async function addSensor(sensorname, added_by, mac_address , description, location) {
	try {
		const sensor = await sensorModel.create({
			sensorname: sensorname,
			added_by: added_by,
			mac_address: mac_address,
			description: description,
			location: location,
		});
	} catch (error) {
		console.error(error);
	}
}

async function updateSensor(id, sensorname, added_by, mac_address ,description, location) {
	try {
		//update by id
		const sensor = await sensorModel.update(
			{
				sensorname: sensorname,
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
	} catch (error) {
		console.error(error);
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
	}
}

async function getSensorData() {
	try {
		const sensorData = await sensorDataModel.findAll();
		return sensorData;
	} catch (error) {
		console.error(error);
	}
}

async function addSensorData(id , id_sensor , id_location , sensordata){
	try{
		console.log(typeof sensordata);
		console.log(sensordata);
		if (!sensordata){
			console.log("Sensor Data is null");
		}
		const sensorData = await sensorDataModel.create({
			id: id,
			id_sensor: id_sensor,
			id_location: id_location,
			sensordata: sensordata,
		});
	}catch(error){
		console.error(error);
	}

}

async function updateSensorData(id, id_sensor, id_location, sensordata) {
	try {
		const sensorData = await sensorDataModel.update(
			{
				id_sensor: id_sensor,
				id_location: id_location,
				sensordata: sensordata,
			},
			{
				where: {
					id: id,
				},
			}
		);
	} catch (error) {
		console.error(error);
	}

}

async function deleteSensorData(id) {
	try {
		const sensorData = await sensorDataModel.destroy({
			where: {
				id: id,
			},
		});
	} catch (error) {
		console.error(error);
	}
}

async function getSensorDataById(id) {
	try {
		const sensorData = await sensorDataModel.findAll({
			where: {
				id: id,
			},
		});
		return sensorData;
	} catch (error) {
		console.error(error);
	}
}

async function getallData() {
	try {
		const allData = await IoTModel.findAll();
		return allData;
	} catch (error) {
		console.error(error);
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
	getSensorData,
	addSensorData,
	updateSensorData,
	deleteSensorData,
	getSensorDataById,
};
