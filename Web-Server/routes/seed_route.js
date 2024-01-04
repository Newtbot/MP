'use strict';
const router = require('express').Router();

//location route
router.use('/seed', require('./seedLocationAndSensor'));

router.use('/seedSensorData ', require('./seedsensorData')); 





module.exports = router;