'use strict';
const router = require('express').Router();

router.use('/user', require('./user'));

router.use('/apikey', require('./apikey'));

module.exports = router;


