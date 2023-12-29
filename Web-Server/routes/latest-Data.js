const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 
const { getLatestData } = require("../functions/APIDatabase.js");
const express = require('express');
const router = express.Router();

// Logic for model and API by 1 
/*
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
*/


router.get('/', async (req, res) => {
  try {
    const data = await getLatestData();

    if (data === null) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the router
module.exports = router;