/**
 * IoSL-INav routes/me
 * SNET TU Berlin
 * using PIazza code base
 *
 * Me specific endpoints
 */

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/me')

var router = express.Router();

module.exports = router;