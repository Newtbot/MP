const { Op, Sequelize } = require("sequelize");
const { sequelize }  = require("../database/mySQL.js");
const { sensorDataModel } = require("../database/model/sensorDataModel.js");
const io = require('../functions/socket');

//helper function to convert month name to month number
//https://stackoverflow.com/questions/13566552/easiest-way-to-convert-month-name-to-month-number-in-js-jan-01
function getMonthFromString(mon) {
	var d = Date.parse(mon + "1, 2012");
	if (!isNaN(d)) {
		return new Date(d).getMonth() + 1;
	}
	return -1;
}


async function getSensorData() {
	const sensorData = await sensorDataModel.findAll();
	return sensorData;
}
async function addSensorData(sensorid , locationid , measurement) {
	console	.log("measurement", measurement.measurement);
	const sensorData = await sensorDataModel.create({
		sensorid: sensorid,
		locationid: locationid,
		measurement: measurement.measurement,
	});
	//console.log("sensorData", sensorData);
	//console.log("sensorData", sensordata.measurement);
	//console.log("sensorData", sensorData.measurement);
	
	io().emit('sensorData:new', sensorData);
	return sensorData;
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

async function getLatestData() {
	const sensorData = await sensorDataModel.findAll({
		limit: 6,
		order: [["createdAt", "DESC"]],
	});
	return sensorData;
}
var ormQuery = {};
var whereClause = {};
var whereDate = {};
const allowedQuery = [
	"limit",
	"order",
	"year",
	"month",
	"week",
	"day",
	"hour",
	"minute",
	"sensorid",
	"locationid",
];
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
//handle buildfunc for query
buildQuery = {
	limit: async function (queryString) {
		if (queryString.limit !== undefined) {
			ormQuery.limit = parseInt(queryString.limit);
		}
	},
	order: async function (queryString) {
		if (queryString.order !== undefined) {
			ormQuery = {
				...ormQuery,
				order: [["createdAt", queryString.order.toUpperCase()]],
			};
		}
	},
	year: async function (queryString) {
		if (queryString.year !== undefined) {
			//whereclause assign a value
			whereClause.year = sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				queryString.year
			);
		}
	},
	month: async function (queryString) {
		if (queryString.month !== undefined) {
			if (validMonths.includes(queryString.month)) {
				whereClause.month = sequelize.where(
					sequelize.fn("MONTH", sequelize.col("createdAt")),
					queryString.month
				);
			} else {
				queryString.month = getMonthFromString(queryString.month)
				whereClause.month = sequelize.where(
					sequelize.fn("MONTH", sequelize.col("createdAt")),
					queryString.month
				);
			}
		}
	},
	week: async function (queryString) {
		if (queryString.week !== undefined) {
			whereClause.week = sequelize.where(
				sequelize.fn("WEEK", sequelize.col("createdAt")),
				queryString.week
			);
		}
	},
	day: async function (queryString) {
		if (queryString.day !== undefined) {
			whereClause.day = sequelize.where(
				sequelize.fn("DAY", sequelize.col("createdAt")),
				queryString.day
			);
		}
	},
	hour: async function (queryString) {
		if (queryString.hour !== undefined) {
			whereClause.hour = sequelize.where(
				sequelize.fn("HOUR", sequelize.col("createdAt")),
				queryString.hour
			);
		}
	},
	minute: async function (queryString) {
		if (queryString.minute !== undefined) {
			whereClause.minute = sequelize.where(
				sequelize.fn("MINUTE", sequelize.col("createdAt")),
				queryString.minute
			);
		}
	},
	sensorid: async function (queryString) {
		if (queryString.sensorid !== undefined) {
			whereClause.sensorid = sequelize.where(
				sequelize.col("sensorid"),
				queryString.sensorid
			);
		}
	},
	locationid: async function (queryString) {
		if (queryString.locationid !== undefined) {
			whereClause.locationid = sequelize.where(
				sequelize.col("locationid"),
				queryString.locationid
			);
		}
	},
	psi: async function (queryString) {
		if (queryString.psi !== undefined && queryString.psi === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.psi')"), "psi"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("psi"), "DESC"]],
				limit: 10,
			};
		}
		if (queryString.psi !== undefined && queryString.psi === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.psi')"), "psi"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("psi"), "ASC"]],
				limit: 10,
			};
		}
	},
	co: async function (queryString) {
		if (queryString.co !== undefined && queryString.co === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.co')"), "co"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("co"), "DESC"]],
				limit: 10,
			};
		}
		if (queryString.co !== undefined && queryString.co === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.co')"), "co"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("co"), "ASC"]],
				limit: 10,
			};
		}
	},
	o3: async function (queryString) {
		if (queryString.o3 !== undefined && queryString.o3 === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.o3')"), "o3"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("o3"), "DESC"]],
				limit: 10,
			};
		}
		if (queryString.o3 !== undefined && queryString.o3 === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.o3')"), "o3"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("o3"), "ASC"]],
				limit: 10,
			};
		}
	},
	no2: async function (queryString) {
		if (queryString.no2 !== undefined && queryString.no2 === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.no2')"), "no2"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("no2"), "DESC"]],
				limit: 10,
			};
		}
		if (queryString.no2 !== undefined && queryString.no2 === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.no2')"), "no2"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("no2"), "ASC"]],
				limit: 10,
			};
		}
	},
	so2: async function (queryString) {
		if (queryString.so2 !== undefined && queryString.so2 === "highest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.so2')"), "so2"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("so2"), "DESC"]],
				limit: 10,
			};
		}
		if (queryString.so2 !== undefined && queryString.so2 === "lowest") {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[sequelize.literal("JSON_EXTRACT(measurement, '$.so2')"), "so2"],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("so2"), "ASC"]],
				limit: 10,
			};
		}
	},
	humidity: async function (queryString) {
		if (
			queryString.humidity !== undefined &&
			queryString.humidity === "highest"
		) {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.humidity')"),
						"humidity",
					],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("humidity"), "DESC"]],
				limit: 10,
			};
		}
		if (
			queryString.humidity !== undefined &&
			queryString.humidity === "lowest"
		) {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.humidity')"),
						"humidity",
					],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("humidity"), "ASC"]],
				limit: 10,
			};
		}
	},
	windspeed: async function (queryString) {
		if (
			queryString.windspeed !== undefined &&
			queryString.windspeed === "highest"
		) {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.windspeed')"),
						"windspeed",
					],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("windspeed"), "DESC"]],
				limit: 10,
			};
		}
		if (
			queryString.windspeed !== undefined &&
			queryString.windspeed === "lowest"
		) {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.windspeed')"),
						"windspeed",
					],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("windspeed"), "ASC"]],
				limit: 10,
			};
		}
	},
	temperature: async function (queryString) {
		if (
			queryString.temperature !== undefined &&
			queryString.temperature === "highest"
		) {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.temperature')"),
						"temperature",
					],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("temperature"), "DESC"]],
				limit: 10,
			};
		}
		if (
			queryString.temperature !== undefined &&
			queryString.temperature === "lowest"
		) {
			ormQuery = {
				attributes: [
					"id",
					"sensorid",
					"locationid",
					[
						sequelize.literal("JSON_EXTRACT(measurement, '$.temperature')"),
						"temperature",
					],
					"createdAt",
				],
				group: ["id", "sensorid", "locationid"],
				order: [[sequelize.literal("temperature"), "ASC"]],
				limit: 10,
			};
		}
	},
	//average
	avg: async function (queryString) {
		if (queryString.avg !== undefined) {
			ormQuery = {
				attributes: [
					//round to 2 decimal places
					[
						sequelize.fn(
							"ROUND",
							sequelize.fn(
								"AVG",
								Sequelize.literal(
									`JSON_EXTRACT(measurement, '$.${queryString.avg}')`
								)
							),
							2
						),
						"avg of " + queryString.avg,
					],
				],
			};
		}
	},

	sum: async function (queryString) {
		if (queryString.sum !== undefined) {
			ormQuery = {
				attributes: [
					[
						sequelize.fn(
							"SUM",
							Sequelize.literal(
								`JSON_EXTRACT(measurement, '$.${queryString.sum}')`
							)
						),
						"sum of " + queryString.sum,
					],
				],
			};
		}
	},

	//total number of records
	total: async function (queryString) {
		if (queryString.total !== undefined) {
			ormQuery = {
				attributes: [
					[sequelize.fn("COUNT", sequelize.col("id")), "total id / records"],
				],
			};
		}
	},
};

buildFunc = {
	limit: async function (queryString) {
		if (queryString.limit !== undefined) {
			ormQuery.limit = parseInt(queryString.limit);
		}
	},
	startdate: async function (queryString) {
		if (queryString.startdate !== undefined) {
			whereDate.startdate = new Date(queryString.startdate);
		}
	},
	enddate: async function (queryString) {
		if (queryString.enddate !== undefined) {
			whereDate.enddate = new Date(queryString.enddate);
		}
	},
	//total by startdate and enddate
	total: async function (queryString) {
		if (queryString.total !== undefined) {
			ormQuery = {
				attributes: [
					[sequelize.fn("COUNT", sequelize.col("id")), "total id / records"],
				],
			};
		}
	},
	//average
	avg: async function (queryString) {
		if (queryString.avg !== undefined) {
			ormQuery = {
				attributes: [
					//round to 2 decimal places
					[
						sequelize.fn(
							"ROUND",
							sequelize.fn(
								"AVG",
								Sequelize.literal(
									`JSON_EXTRACT(measurement, '$.${queryString.avg}')`
								)
							),
							2
						),
						"avg of " + queryString.avg,
					],
				],
			};
		}
	},

	sum: async function (queryString) {
		if (queryString.sum !== undefined) {
			ormQuery = {
				attributes: [
					[
						sequelize.fn(
							"SUM",
							Sequelize.literal(
								`JSON_EXTRACT(measurement, '$.${queryString.sum}')`
							)
						),
						"sum of " + queryString.sum,
					],
				],
			};
		}
	},

	//total number of records
	total: async function (queryString) {
		if (queryString.total !== undefined) {
			ormQuery = {
				attributes: [
					[sequelize.fn("COUNT", sequelize.col("id")), "total id / records"],
				],
			};
		}
	},
};

async function getData(queryString) {
	if (queryString.pagesize || queryString.page) {
		//https://blog.bitsrc.io/pagination-with-sequelize-explained-83054df6e041
		//pass pageSize taken from page=4 or default to 50
		queryString.pagesize = queryString.pagesize || 50;
		let offset = (queryString.page || 0) * queryString.pagesize;
		queryString.limit = queryString.pagesize;
		//reset keys in whereClause and ormQuery. else it will keep appending to the previous query
		ormQuery = {};
		whereClause = {};
		whereDate = {};

		for (let query in queryString) {
			if (buildQuery[query]) {
				await buildQuery[query](queryString);
			}
		}
		if (!whereClause) {
			return await sensorDataModel.findAll(ormQuery);
		} else if (whereClause) {
			console.log(whereClause);
			console.log(ormQuery);
			console.log(whereDate);
			return await sensorDataModel.findAll({
				limit: queryString.limit || 1000000,
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#limits-and-pagination
				offset: parseInt(offset),
				//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
				where: {
					[Op.and]: [whereClause],
				},
				//only use where clause to lookup based on condition that i put into whereClause
				...ormQuery,
			});
		}
	} else {
		//reset keys in whereClause and ormQuery. else it will keep appending to the previous query
		ormQuery = {};
		whereClause = {};
		whereDate = {};

		for (let query in queryString) {
			if (buildQuery[query]) {
				await buildQuery[query](queryString);
			}
		}
		if (!whereClause) {
			return await sensorDataModel.findAll(ormQuery);
		} else if (whereClause) {
			console.log(whereClause);
			console.log(ormQuery);
			console.log(whereDate);
			return await sensorDataModel.findAll({
				limit: queryString.limit || 1000000,
				//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
				where: {
					[Op.and]: [whereClause],
				},
				//only use where clause to lookup based on condition that i put into whereClause
				...ormQuery,
			});
		}
	}
}

async function getDatabyRange(queryString) {
	if (queryString.pagesize || queryString.page) {
		//https://blog.bitsrc.io/pagination-with-sequelize-explained-83054df6e041
		//pass pageSize taken from page=4 or default to 50
		queryString.pagesize = queryString.pagesize || 50;
		let offset = (queryString.page || 0) * queryString.pagesize;
		queryString.limit = queryString.pagesize;

		whereDate = {};
		ormQuery = {};
		for (let query in queryString) {
			if (buildFunc[query]) {
				await buildFunc[query](queryString);
			}
		}
		if (whereClause) {
			console.log(ormQuery);
			console.log(whereDate);
			return await sensorDataModel.findAll({
				limit: queryString.limit || 1000000,
				offset: offset,
				//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
				where: {
					createdAt: {
						[Op.between]: [whereDate.startdate, whereDate.enddate],
					},
				},
				//only use where clause to lookup based on condition that i put into whereClause
				...ormQuery,
			});
		} else {
			return "Invalid query";
		}
	} else {
		whereDate = {};
		ormQuery = {};
		
		for (let query in queryString) {
			if (buildFunc[query]) {
				await buildFunc[query](queryString);
			}
		}
		if (whereClause) {
			console.log(ormQuery);
			console.log(whereDate);
			return await sensorDataModel.findAll({
				limit: queryString.limit || 1000000,
				//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
				where: {
					createdAt: {
						[Op.between]: [whereDate.startdate, whereDate.enddate],
					},
				},
				//only use where clause to lookup based on condition that i put into whereClause
				...ormQuery,
			});
		} else {
			return "Invalid query";
		}
	}
}

module.exports = {
	getSensorData,
	addSensorData,
	updateSensorData,
	deleteSensorData,
	getSensorDataById,
	getData,
	getDatabyRange,
	getLatestData,

};