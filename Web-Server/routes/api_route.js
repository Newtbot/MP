/*
'use strict';

const router = require('express').Router();
const middleware = require('../middleware/auth');

router.use('/runner', require('./runner'));
router.use('/worker', require('./worker'));
router.use('/auth', require('./auth'));
router.use('/user', middleware.auth, require('./user'));
router.use('/token',middleware.auth, require('./token'));

module.exports = router;

*/

'use strict';
const router = require('express').Router();

//location route
router.use('/location', require('./getLocation'));
router.use('/add-location', require('./addLocation'));
router.use('/update-location', require('./updateLocation'));
router.use('/delete-location', require('./deleteLocation'));
router.use('/', require('./getLocationId'));




router.use('/test' , require('./test'));
router.use('/latest-data', require('./latest-data'));
router.use('/:month', require('./monthlyData'));

module.exports = router;