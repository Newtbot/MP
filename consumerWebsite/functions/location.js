const {locationModel} = require("../database/model/locationModel");

async function getLocation() {
	const location = await locationModel.findAll();
	return location;
}

async function addLocation(name, added_by, description) {
	console.log(name, added_by, description);
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

module.exports = {
	getLocation,
	addLocation,
	updateLocation,
	deleteLocation,
	getLocationById,
};