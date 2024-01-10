'use strict';
const router = require('express').Router();

//location route
router.use('/seedSensorData', require('./seedSensorData.js'));

router.use('/seed', require('./seedLocationAndSensor'));






module.exports = router;