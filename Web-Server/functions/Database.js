const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 

async function insertData(data) {
    console.log(data);
    try {
        const latestData = await IoTModel.create({
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

module.exports = { insertData };





