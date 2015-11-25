/**
 * IoSL-INav routes/beacons
 * SNET TU Berlin
 * using PIazza code base
 *
 * Beacons specific endpoints
 */

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/beacons')

var router = express.Router();

module.exports = router;