const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 


async function getallData() {
    try {
      sequelize.sync();
      const allData = await IoTModel.findAll({
          attributes: ['id', 'psiData', 'humidityData', 'o3Data', 'no2Data', 'so2Data', 'coData', 'temperatureData', 'windspeedData', 'currentTime', 'regionData' , 'createdAt' , 'updatedAt'],
      });
      return allData;
      }
      catch(error) {
          console.error(error);
          return null;
  
      }
  }


  async function getLatestData() {
    try {
      sequelize.sync();
      const latestData = await IoTModel.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']]
      });
      return latestData;
    }
    catch (error) {
      console.error(error);
      return null;
    }
  }




module.exports = { getallData , getLatestData };