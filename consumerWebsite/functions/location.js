const {locationModel} = require("../database/model/locationModel");
const {Op} = require("sequelize");

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
	const location = await locationModel.destroy({
		where: {
			id: id,
		},
	});
}
/*
const { Op } = require("sequelize");

var options = {
  where: {
    [Op.or]: [
      { 'subject': { [Op.like]: '%' + query + '%' } },
      { '$Comment.body$': { [Op.like]: '%' + query + '%' } }
    ]
  },
  include: [{ model: Comment }]
};
*/

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
	getLocationByName,
	getLocationById,
};