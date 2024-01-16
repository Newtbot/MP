const { sequelize } = require("../Database/mySql.js");
const { api_log_Model } = require("../Database/model/apiLogModel.js");
const { sensorDataModel } = require("../Database/model/sensorDataModel.js");
const { apikeyModel } = require("../Database/model/apiKeyModel.js");
const { compareAPIKey } = require("../functions/bcrypt.js");

async function insertLogData(log) {
	try {
		api_log_Model.create({
			ip: log.ip,
			time: log.time,
			method: log.method,
			host: log.host,
			statusCode: log.statusCode,
			Responsesize: log.Responsesize,
			referrer: log.referrer,
			userAgent: log.userAgent,
		});
	} catch (error) {
		console.error(error);
	}
}

async function insertDatatoDB(data) {
	try {
		sensorDataModel.create({
			sensorid: data.sensorid,
			locationid: data.locationid,
			measurement: data.measurement,
		});
	} catch (error) {
		console.error(error);
	}
}

async function checkAPikey(SuppliedKey, rowid) {
	try {
		const retrivedKey = await apikeyModel.findOne({
			raw: true,
			attributes: ["apikey" , "permission"],
			where: {
				userid: rowid,
			},
		});
		//console.log(retrivedKey.apikey);
		if (compareAPIKey(SuppliedKey, retrivedKey.apikey)) {
			//return true;
            return retrivedKey.permission;
		}
	} catch (error) {
		console.error(error);
	}
}

module.exports = { insertLogData, insertDatatoDB, checkAPikey };
