'use strict';
const router = require('express').Router();
const { auth } = require("../middleware/authChecker")
const { APIlogger } = require('../middleware/apiLogger.js');

router.use('/auth', require('./auth'));

router.use('/token', [auth, APIlogger], require('./token.js'));

router.use('/user', [auth, APIlogger], require('./user'));

//location route
router.use('/location', [auth, APIlogger], require('./location.js'));

//location route
router.use('/sensor', [auth, APIlogger], require('./sensor.js'));

//sensor data route
router.use('/sensor-data', [auth, APIlogger], require('./sensorData.js'));

module.exports = router;

