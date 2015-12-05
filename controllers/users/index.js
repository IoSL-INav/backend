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

controller.getAllUsers = function(req, res, next) {
	// TODO
	return res.status(501).end();
};

controller.addUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
};

controller.getCurrentUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
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

controller.getGroupsForUser = function(req, res, next) {
	// TODO
	return res.status(501).end();
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