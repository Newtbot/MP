const { sequelize } = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js");
const { locationModel } = require("../../Database/model/locationModel.js");

async function getLocation() {
	try {
		sequelize.sync();
		const location = await locationModel.findAll({
			attributes: [
				"id",
				"name",
				"added_by",
				"description",
				"createdAt",
				"updatedAt",
			],
		});
		return location;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function addLocation(name, added_by, description) {
	try {
		sequelize.sync();
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
		sequelize.sync();
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
		sequelize.sync();
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
		sequelize.sync();
		//delete by id
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

async function getallData() {
	try {
		sequelize.sync();
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
		sequelize.sync();
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
};
