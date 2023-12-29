const { sequelize }  = require("../../Database/mySql.js");
const { locatioModel } = require("../../Database/model/locationModel.js"); 
const { getLocationById } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        //get params
        const { id } = req.params;
        const location = await getLocationById(id);
        res.json(location);
    } catch (error) {
        console.error(error);
    }
  });
  
  // Export the router
  module.exports = router;