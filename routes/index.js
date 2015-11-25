/**
 * IoSL-INav routes/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Index file for registering all
 * API endpoints existing
 */

var express = require('express');

var bodyParser = require('body-parser');
var config = require('./../config');

var me = require('./me');
var signup = require('./signup');
var users = require('./users');
var events = require('./events');
var lists = require('./lists');
var meetings = require('./meetings');
var beacons = require('./beacons');

var router = express.Router();

router.use(bodyParser.json());
router.use('/', signup);
//router.use('/me', config.jwtMiddleware, me);
router.use('/users', config.jwtMiddleware, users);
router.use('/events', config.jwtMiddleware, events);
router.use('/lists', /*config.jwtMiddleware, */lists);
//router.use('/meetings', config.jwtMiddleware, meetings);
//router.use('/beacons', config.jwtMiddleware, beacons);

module.exports = router;