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
var Group = require('./../../models/group');
var Location = require('./../../models/location');

var controller = {};


/* Helpers. */

var getCurUser = function(userID, callback) {

	User.findById(userID, function(err, curUser) {

		if (err) {
			console.log("user controller error: getCurUser query yielded error.");
			callback(err);
		}

		callback(null, curUser);
	});
};



/* Controllers. */


controller.getAllUsers = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.addUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


/**
 * This function returns the user data of
 * the currently logged in user.
 */
controller.getCurrentUser = function(req, res, next) {

	getCurUser(req.kauth.grant.id_token.content.sub, function(err, curUser) {

		if (err) {
			console.log("getCurUser call done from getCurrentUser controller.");
			res.status(500).json(err);
		}

		res.json({
			id: curUser._id,
			name: curUser.name,
			email: curUser.email
		});
	});
};


controller.updateCurrentUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.deleteCurrentUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.logout = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.updateLocation = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.deleteLocation = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


/**
 * This function returns all existing groups
 * associated to the currently logged in user ID.
 */
controller.getGroupsForUser = function(req, res, next) {

	Group.find({
		creatorID: req.kauth.grant.id_token.content.sub
	}, 'name members', function(err, groups) {

		if (err) {
			console.log("Could not get all groups for user in user controller getGroupsForUser.");
			res.status(500).json(err);
		}

		res.json(groups);
	});
};


controller.addGroupForUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.getGroupForUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.updateGroupForUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.deleteGroupForUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.addUserToGroup = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.deleteUserFromGroup = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.getUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.updateUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


controller.deleteUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;