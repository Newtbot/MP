const { sequelize }  = require("../../Database/mySql.js");
const { IoTModel } = require("../../Database/model/IoTModel.js"); 
const { getallData } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        //get month from url 
        console.log(req.params.month);



    } catch (error) {
        console.error(error);
    }
  });
  
  // Export the router
  module.exports = router;