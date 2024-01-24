'use strict';
const router = require('express').Router();
const { auth } = require("../middleware/authChecker")
const { APIlogger } = require('../middleware/apiLogger.js');
const { apikeyCheck } = require('../middleware/apiKey.js');

router.use('/auth', require('./auth'));

router.use('/apikey', require('./apikey'));

router.use('/user', [auth, APIlogger], require('./user'));

//TO REFACTOR INTO ONE MIDDLWARE

//location route
router.use('/location', [apikeyCheck , APIlogger], require('./location.js'));

//location route
router.use('/sensor', [apikeyCheck , APIlogger], require('./sensor.js'));

//sensor data route
router.use('/sensor-data', [ APIlogger], require('./sensorData.js'));

module.exports = router;


/*

'use strict';
const router = require('express').Router();
const { auth }   = require("../middleware/authChecker")


router.use('/auth', require('./auth'));

router.use('/apikey', require('./apikey'));

router.use('/user', auth ,require('./user'));

module.exports = router;


*/