// IoSL-INav me api controller

var util = require('./../../util');
var isErrorOrNull = util.isErrorOrNull;

var config = require('./../../config');
var user = require('./../../models/user');

var controller = {};

controller.getUserInfo = function getUserInfo(req, res, next) {
	// TODO
	return res.status(501).end();
};

module.exports = controller;
