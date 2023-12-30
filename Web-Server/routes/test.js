const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 
const { getallData } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

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