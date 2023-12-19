const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 
const express = require('express');
const router = express.Router();

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

router.get('/', async (req, res) => {
  try {
    const data = await getallData();

    if (data === null) {
      res.status(404).send("No data found");
    } else {
      res.send(data);   
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
    
  }
});

// Export the router
module.exports = router;