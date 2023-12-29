const { sequelize }  = require("../../Database/mySql.js");
const { locatioModel } = require("../../Database/model/locationModel.js"); 
const { updateLocation } = require("../functions/APIDatabase.js");

const express = require('express');
const router = express.Router();

router.put('/', async (req, res) => {
    try {
        const {id , name , added_by , description } = req.body;
        await updateLocation(id , name, added_by , description);

    } catch (error) {
        console.error(error);
    }
  });
  
  // Export the router
  module.exports = router;