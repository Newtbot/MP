const { sequelize }  = require("../../Database/mySql.js");
const { locatioModel } = require("../../Database/model/locationModel.js"); 
const { deleteLocation } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

router.delete('/', async (req, res) => {
    try {
        const {id} = req.body;
        await deleteLocation(id);

    } catch (error) {
        console.error(error);
    }
  });
  
  // Export the router
  module.exports = router;