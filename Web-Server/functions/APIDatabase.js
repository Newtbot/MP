const { sequelize } = require("../../Database/mySql.js");
const { locationModel } = require("../../Database/model/locationModel.js");
const { sensorModel } = require("../../Database/model/sensorModel.js");
const { sensorDataModel } = require("../../Database/model/sensorDataModel.js");
const { Op, where, or } = require("sequelize");

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
	let whereClause = {};
	let whereNest = {};
	let whereDate = {};

	if (query.limit !== undefined && query.order !== undefined)
		ormQuery = {
			limit: parseInt(query.limit),
			//console.log(sentence.toUpperCase());
			order: [["createdAt", query.order.toUpperCase()]],
			...ormQuery,
		};
	//handle year and month and week and day and hour and minute and sensorid and locationid through optional chaining
	else if (
		query.limit ||
		query.order ||
		query.year ||
		query.month ||
		query.week ||
		query.day ||
		query.hour ||
		query.minute ||
		query.sensorid ||
		query.locationid ||
		query.startdate ||
		query.enddate

		//get specific data like psi or wtv
	) {
		if (query.limit !== undefined && query.order !== undefined)
			ormQuery = {
				limit: parseInt(query.limit),
				order: [["createdAt", query.order.toUpperCase()]],
				...ormQuery,
			};

		if (query.year) {
			whereClause.year = sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				query.year
			);
		}

		if (query.month) {
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
				whereClause = {
					where: sequelize.where(
						sequelize.fn("MONTH", sequelize.col("createdAt")),
						query.month
					),
				};
			} else {
				query.month = getMonthFromString(query.month);
				whereClause = {
					where: sequelize.where(
						sequelize.fn("MONTH", sequelize.col("createdAt")),
						query.month
					),
				};
			}
		}
		if (query.week) {
			whereClause.week = sequelize.where(
				sequelize.fn("WEEK", sequelize.col("createdAt")),
				query.week
			);
		}
		if (query.day) {
			whereClause.day = sequelize.where(
				sequelize.fn("DAY", sequelize.col("createdAt")),
				query.day
			);
		}
		if (query.hour) {
			whereClause.hour = sequelize.where(
				sequelize.fn("HOUR", sequelize.col("createdAt")),
				query.hour
			);
		}
		if (query.minute) {
			whereClause.minute = sequelize.where(
				sequelize.fn("MINUTE", sequelize.col("createdAt")),
				query.minute
			);
		}
		if (query.startdate) {
			let startdate = new Date(query.startdate);
			whereDate.startdate = startdate;
		}
		if (query.enddate) {
			let enddate = new Date(query.enddate);
			whereDate.enddate = enddate;
		}

		if (query.sensorid) {
			whereNest.sensorid = sequelize.where(
				sequelize.col("sensorid"),
				query.sensorid
			);
		}
		if (query.locationid) {
			whereNest.locationid = sequelize.where(
				sequelize.col("locationid"),
				query.locationid
			);
		}
	}
	//accept year
	else if (query.year !== undefined) {
		ormQuery = {
			//handle all year, month
			where: sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				query.year
			),
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
	else if (query.day !== undefined) {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("DAY", sequelize.col("createdAt")),
				query.day
			),
			...ormQuery,
		};
	}

	//hourly data
	else if (query.hour !== undefined) {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("HOUR", sequelize.col("createdAt")),
				query.hour
			),
			...ormQuery,
		};
	}

	//minute data
	else if (query.minute !== undefined) {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("MINUTE", sequelize.col("createdAt")),
				query.minute
			),
			...ormQuery,
		};
	} else if (query.sensorid !== undefined) {
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
	}

	if (!whereClause) {
		return await sensorDataModel.findAll(ormQuery);
	} else if (whereClause && whereNest) {
		console.log(whereClause);
		console.log(whereNest);
		console.log(whereDate);
		console.log(query);
		console.log(ormQuery);

		return await sensorDataModel.findAll({
			//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
			//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
			where: {
				[Op.and]: [whereNest, whereClause],
				createdAt: {
					//https://stackoverflow.com/questions/43115151/sequelize-query-to-find-all-records-that-falls-in-between-date-range
					[Op.between]: [whereDate.startdate, whereDate.enddate],
				},
			},

			//only use where clause to lookup based on condition that i put into whereClause
			...ormQuery,
		});
	}
}

async function getdataFilter(query) {
	let ormQuery = {};
	//get highest and lowest data of measurement from all data
	if (query.psi !== undefined && query.psi === "highest") {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("JSON_EXTRACT", sequelize.col("measurement"), "$.psi"),
				//sequelize.fn('JSON_EXTRACT', sequelize.col('aa.bb.field'), sequelize.literal(`'$.attr'`))
				sequelize.literal(`'$$.type'`),

				//max value of psi
				sequelize.fn("MAX", sequelize.col("measurement.psi"))
			),
		};
	}

	console.log(ormQuery);
	return await sensorDataModel.findAll(ormQuery);
}

/*
sequelize.fn('JSON_EXTRACT', sequelize.col('aa.bb.field'), sequelize.literal(`'$.attr'`))

	else if (query.hour !== undefined) {
		ormQuery = {
			where: sequelize.where(
				sequelize.fn("HOUR", sequelize.col("createdAt")),
				query.hour
			),
			...ormQuery,
		};
	}



*/

/*'		ormQuery = {
			order: [sequelize.fn("max", sequelize.col("measurement.psi::int"))],
			limit: 1,
		};
					sequelize.literal('(SELECT MAX(`measurement`->>"$.psi") FROM `sensorData`)'),
					'max_psi'
		if (query.highest) {
			//[sequelize.fn("max", sequelize.col("measurement.psi")), "max_psi"],

			ormQuery = {
				attributes: [
					[sequelize.fn("max", sequelize.col("measurement")), "max"],
				],
			};
		}

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
	getdataFilter,
};
