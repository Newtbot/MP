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
	//let whereNest = {};
	//let whereDate = {};
	//limit default value if query.limit is undefined
	if (query.limit === undefined) {
		query.limit = 10;
	}
	if (query.limit !== undefined && query.order !== undefined)
		ormQuery = {
			limit: parseInt(query.limit),
			//console.log(sentence.toUpperCase());
			order: [["createdAt", query.order.toUpperCase()]],
			...ormQuery,
		};
	}

	/*	
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
			whereClause.startdate = startdate;
		}
		if (query.enddate) {
			let enddate = new Date(query.enddate);
			whereClause.enddate = enddate;
		}

		//WHERE NEST PREVIOUSLY
		if (query.sensorid) {
			whereClause.sensorid = sequelize.where(
				sequelize.col("sensorid"),
				query.sensorid
			);
		}
		if (query.locationid) {
			whereClause.locationid = sequelize.where(
				sequelize.col("locationid"),
				query.locationid
			);
		}
		//highest and lowest
		if (query.psi !== undefined && query.psi === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.psi')"), "max_psi"],
					"createdAt",
				],
				//group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_psi"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.psi !== undefined && query.psi === "lowest") {
			//https://gist.github.com/WunGCQ/c4df1929c5975c2a79133bc8300fcd6e

			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.psi')"), "min_psi"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_psi"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.co !== undefined && query.co === "highest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.co')"), "max_co"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_co"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.co !== undefined && query.co === "lowest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.co')"), "min_co"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_co"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.o3 !== undefined && query.o3 === "highest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.o3')"), "max_o3"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_o3"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.o3 !== undefined && query.o3 === "lowest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.o3')"), "min_o3"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_o3"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.no2 !== undefined && query.no2 === "highest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.no2')"), "max_no2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_no2"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.no2 !== undefined && query.no2 === "lowest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.no2')"), "min_no2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_no2"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.so2 !== undefined && query.so2 === "highest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.so2')"), "max_so2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_so2"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.so2 !== undefined && query.so2 === "lowest") {
			ormQuery = {
				attributes: [
					[sequelize.literal("JSON_EXTRACT(measurement, '$.so2')"), "min_so2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_so2"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.humidity !== undefined && query.humidity === "highest") {
			ormQuery = {
				attributes: [
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.humidity')"),
						"max_humidity",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_humidity"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.humidity !== undefined && query.humidity === "lowest") {
			ormQuery = {
				attributes: [
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.humidity')"),
						"min_humidity",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_humidity"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.windspeed !== undefined && query.windspeed === "highest") {
			ormQuery = {
				attributes: [
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.windspeed')"),
						"max_windspeed",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_windspeed"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.windspeed !== undefined && query.windspeed === "lowest") {
			ormQuery = {
				attributes: [
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.windspeed')"),
						"min_windspeed",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_windspeed"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.temperature !== undefined && query.temperature === "highest") {
			ormQuery = {
				attributes: [
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.temperature')"),
						"max_temperature",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_temperature"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.temperature !== undefined && query.temperature === "lowest") {
			ormQuery = {
				attributes: [
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.temperature')"),
						"min_temperature",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_temperature"), "ASC"]],
				limit: parseInt(query.limit),
			};
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
	} else if (whereClause) {
		console.log(whereClause);
		//console.log(whereNest);
		//console.log(whereDate);
		console.log(query);
		console.log(ormQuery);

		return await sensorDataModel.findAll({
			//limit default value if query.limit is undefined or not provided
			limit: query.limit,
			//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
			//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
			where: {
				//[Op.and]: [whereNest, whereClause],
				[Op.and]: [whereClause],
				createdAt: {
					//https://stackoverflow.com/questions/43115151/sequelize-query-to-find-all-records-that-falls-in-between-date-range
					[Op.between]: [whereClause.startdate, whereClause.enddate],
				},
			},

			//only use where clause to lookup based on condition that i put into whereClause
			...ormQuery,
		});
	}
}
*/
//if no query is provided

/*
async function getdataFilter(query) {
	let allowWords = ["highest", "lowest", "Highest", "Lowest"];
	let ormQuery = {};
	//preset limit if limit is not provided
	if (query.limit === undefined) {
		query.limit = 10;
	}
	if (
		allowWords.includes(query.psi) ||
		allowWords.includes(query.co) ||
		allowWords.includes(query.o3) ||
		allowWords.includes(query.no2) ||
		allowWords.includes(query.so2) ||
		allowWords.includes(query.humidity) ||
		allowWords.includes(query.windspeed) ||
		allowWords.includes(query.temperature)
	) {
		//get highest and lowest data of measurement from all data
		if (query.psi !== undefined && query.psi === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.psi')"), "max_psi"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_psi"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.psi !== undefined && query.psi === "lowest") {
			//https://gist.github.com/WunGCQ/c4df1929c5975c2a79133bc8300fcd6e

			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.psi')"), "min_psi"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_psi"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.co !== undefined && query.co === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.co')"), "max_co"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_co"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.co !== undefined && query.co === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.co')"), "min_co"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_co"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.o3 !== undefined && query.o3 === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.o3')"), "max_o3"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_o3"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.o3 !== undefined && query.o3 === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.o3')"), "min_o3"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_o3"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.no2 !== undefined && query.no2 === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.no2')"), "max_no2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_no2"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.no2 !== undefined && query.no2 === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.no2')"), "min_no2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_no2"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.so2 !== undefined && query.so2 === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.so2')"), "max_so2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_so2"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.so2 !== undefined && query.so2 === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.so2')"), "min_so2"],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_so2"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.humidity !== undefined && query.humidity === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.humidity')"),
						"max_humidity",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_humidity"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.humidity !== undefined && query.humidity === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.humidity')"),
						"min_humidity",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_humidity"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.windspeed !== undefined && query.windspeed === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.windspeed')"),
						"max_windspeed",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_windspeed"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.windspeed !== undefined && query.windspeed === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.windspeed')"),
						"min_windspeed",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_windspeed"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.temperature !== undefined && query.temperature === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.temperature')"),
						"max_temperature",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("max_temperature"), "DESC"]],
				limit: parseInt(query.limit),
			};
		}
		if (query.temperature !== undefined && query.temperature === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.temperature')"),
						"min_temperature",
					],
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("min_temperature"), "ASC"]],
				limit: parseInt(query.limit),
			};
		}

		console.log(ormQuery);
		console.log(query);
		return await sensorDataModel.findAll(ormQuery);
	} else {
		return "Please enter correct query or Please provide a query";
	}
}
*/
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
	getdataFilter,
	getAverage,
};
