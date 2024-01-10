let ormQuery = {};
let whereClause = {};
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
    year: async function (query) {
		if (query.year !== undefined) {
			//whereclause assign a value 
			whereClause.year = sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				query.year
			);

		}
	},
};

/*
function getData(queryString)
    for(let query in queryString){
	if(buildFuncs[query]); buildFuncs[query](queryString)

	if (!whereClause) {
			return await sensorDataModel.findAll(ormQuery);
		} else if (whereClause) {


					if (query.year) {
			whereClause.year = sequelize.where(
				sequelize.fn("YEAR", sequelize.col("createdAt")),
				query.year
			);
		}

*/


async function getData(query) {
	for (let queryString in query) {
		console.log(query);
		console.log(queryString);
		console.log(whereClause);
		console.log(ormQuery);

		if (buildQuery[queryString]);
		await buildQuery[queryString](query);

		if (!whereClause) {
			return await sensorDataModel.findAll(ormQuery);
		} else if (whereClause) {
			return await sensorDataModel.findAll({
				limit: query.limit || 10,
				//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
				where: {
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
}


async function getData(query) {
	for (let queryString in query) {
		console.log(query);
		console.log(queryString);
		console.log(whereClause);
		console.log(ormQuery);

		if (buildQuery[queryString]);
		await buildQuery[queryString](query);

		if (!whereClause) {
			return await sensorDataModel.findAll(ormQuery);
		} else if (whereClause) {
			return await sensorDataModel.findAll({
				limit: query.limit || 10,
				//The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.
				//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#examples-with-opand-and-opor
				where: {
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
}

query.hour ||
		query.sensorid ||
		query.locationid ||
		query.startdate ||
		query.enddate