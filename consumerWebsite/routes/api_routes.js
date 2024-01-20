'use strict';
const router = require('express').Router();
const { auth }   = require("../middleware/authChecker")


router.use('/auth', require('./auth'));

router.use('/apikey', require('./apikey'));

router.use('/user', auth ,require('./user'));

module.exports = router;


