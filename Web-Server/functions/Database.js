const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js");
const { api_log_Model } = require("../../Database/model/apiLog.js"); 

function insertData(data) {
    try {
        //const latestData = await IoTModel.create({
        IoTModel.create({
            psiData: data.psi,
            humidityData: data.humidity,
            o3Data: data.o3,
            no2Data: data.no2,
            so2Data: data.so2,
            coData: data.co,
            temperatureData: data.temperature,
            windspeedData: data.windspeed,
            currentTime: data.time,
            regionData: data.region,
        });
    }
    catch (error) {
        console.error(error);
    }
}

function insertLogData(log){
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

module.exports = { insertData , insertLogData };





