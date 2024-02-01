const { sensorModel } = require("../database/model/sensorModel");
const {Op} = require("sequelize");

async function getSensor() {
	const sensor = await sensorModel.findAll();
	return sensor;
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
		locationid: location,
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
			locationid: location,
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
		//cascade delete
		onDelete: "cascade",
		where: {
			id: id,
		},
	});
}
/*
async function getLocationByName(name) {
	const location = await locationModel.findAll({
		where: {
			[Op.or]: [
				{name: {[Op.like]: "%" + name + "%"}},
				{added_by: {[Op.like]: "%" + name + "%"}},
				{description: {[Op.like]: "%" + name + "%"}},
			],
		},
	});
	return location;
}
*/
async function getSensorByName(name) {
	const sensor = await sensorModel.findAll({
		where: {
			[Op.or]: [
				{name: {[Op.like]: "%" + name + "%"}},
				{added_by: {[Op.like]: "%" + name + "%"}},
				{mac_address: {[Op.like]: "%" + name + "%"}},
				{description: {[Op.like]: "%" + name + "%"}},
			],
		},
	});
	return sensor;
}

async function getSensorById(id) {
	const sensor = await sensorModel.findAll({
		where: {
			id: id,
		},
	});
	return sensor;
}

module.exports = {
	getSensor,
	addSensor,
	updateSensor,
	deleteSensor,
	getSensorByName,
	getSensorById,
};
