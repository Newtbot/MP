const { sequelize }  = require("../Database/mySql.js");
const { api_log_Model } = require("../Database/model/apiLogModel.js"); 
const { sensorDataModel } = require("../Database/model/sensorDataModel.js");

async function insertLogData(log){
    try{
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
    }
    catch
    (error){
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
    }
    catch (error) {
        console.error(error);
    }

}

module.exports = { insertLogData , insertDatatoDB};





