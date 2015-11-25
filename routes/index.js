// PIazza REST API routes

var express = require('express');
var bodyParser = require('body-parser');

var config = require('./../config');
var signup = require('./signup');
var users = require('./users');
var events = require('./events');
var lists = require('./lists');
var meetings = require('./meetings');
var me = require('./me');

var router = express.Router();

router.use(bodyParser.json());
router.use('/', signup);
router.use('/users', config.jwtMiddleware, users);
router.use('/events', config.jwtMiddleware, events);
router.use('/lists', config.jwtMiddleware, lists);
router.use('/meetings', config.jwtMiddleware, meetings);
router.use('/me', config.jwtMiddleware, me);

module.exports = router;
