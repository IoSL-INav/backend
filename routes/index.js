// PIazza REST API routes

var express = require('express');
var bodyParser = require('body-parser');

var config = require('./../config');
var signup = require('./signup');
var users = require('./users');
var events = require('./events');

var router = express.Router();

router.use(bodyParser.json());
router.use('/', signup);
router.use('/users', config.jwtMiddleware, users);
router.use('/events', config.jwtMiddleware, events);

module.exports = router;
