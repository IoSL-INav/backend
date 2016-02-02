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
var companionrequests = require('./companionrequests');

var router = express.Router();


/* Support JSON bodies. */
router.use(bodyParser.json());


/**
 * For each important API endpoint we have
 * one specific controller file.
 */
router.use('/login', login);
router.use('/users', users);
router.use('/events', events);
router.use('/hotspots', hotspots);
router.use('/companionrequests', companionrequests);


module.exports = router;