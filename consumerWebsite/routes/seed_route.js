'use strict';
const router = require('express').Router();

//location route
router.use('/seedSensorData', require('./seedsensorData.js'));

router.use('/seed', require('./seedLocationAndSensor.js'));






module.exports = router;