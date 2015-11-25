// IoSL-INav me

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/me')

var router = express.Router();

router.route('/')
    .get(controller.getUserInfo());

module.exports = router;
