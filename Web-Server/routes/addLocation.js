const { sequelize }  = require("../../Database/mySql.js");
const { locatioModel } = require("../../Database/model/locationModel.js"); 
const { addLocation } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {name , added_by , description } = req.body;
        await addLocation(name, added_by, description);

    } catch (error) {
        console.error(error);
    }
  });
  
  // Export the router
  module.exports = router;