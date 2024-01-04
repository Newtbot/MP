const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 
const { getLatestData } = require("../functions/apiDatabase.js");
const express = require('express');
const router = express.Router();

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