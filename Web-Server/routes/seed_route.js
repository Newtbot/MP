'use strict';
const router = require('express').Router();

//location route
router.use('/seed', require('./SeedLocationAndSensor'));





module.exports = router;