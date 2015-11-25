/**
 * IoSL-INav controllers/users/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Users specific controllers
 */


/* Variables and configurations. */

var util = require('./../../util');
var isErrorOrNull = util.isErrorOrNull;

var config = require('./../../config');
var User = require('./../../models/user');
var Location = require('./../../models/location');

var controller = {};


/* Controllers. */

controller.searchUsers = function searchUsers(req, res, next) {
	// TODO
	return res.status(501).end();
};

controller.provideRequestedUser = function provideRequestedUser(req, res, next) {

	User.findOne({
		id: req.param.id
	}, function(err, user) {
		if (isErrorOrNull(err, user, res)) return;
		req.requestedUser = user;
		next();
	});
};

controller.getUser = function getUser(req, res, next) {

	var user = req.requestedUser;

	user.getAccessableInfo(req.user.id, function(err, data) {
		if (err) return res.status(500).end();
		res.json(data);
	});
};

controller.updateUser = function updateUser(req, res, next) {
	// TODO
	return res.status(501).end();
};

controller.deleteUser = function deleteUser(req, res, next) {
	// TODO
	return res.status(501).end();
};

function getAccessableData(user, requester) {

}


/* Export all controllers. */

module.exports = controller;