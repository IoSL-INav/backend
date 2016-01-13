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

var login = require('./login');
var users = require('./users');
var events = require('./events');
var hotspots = require('./hotspots');
var friendrequests = require('./friendrequests');

var router = express.Router();

/* Support JSON bodies. */
router.use(bodyParser.json());

router.use('/login', login);
router.use('/users', users);
router.use('/events', events);
router.use('/hotspots', hotspots);
router.use('/friendrequests', friendrequests);

/* Do we want to redirect all left requests to authentication? */
router.use(config.authenticate);

module.exports = router;
