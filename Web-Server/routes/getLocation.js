const { sequelize }  = require("../../Database/mySql.js");
const { locatioModel } = require("../../Database/model/locationModel.js"); 
const { getLocation } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const location = await getLocation();
        res.json(location);
    } catch (error) {
        console.error(error);
    }
  });
  
  // Export the router
  module.exports = router;