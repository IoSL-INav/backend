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

	getCurUser(req.userID, function(err, curUser) {

		if (err) {
			console.log("getCurUser call done from getCurrentUser controller.");
			res.status(500).end();
		}

		res.json({
			userID: curUser._id,
			userName: curUser.name,
			userEmail: curUser.email
		});
		next();
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
		creatorID: req.userID
	}, 'name members', function(err, groups) {

		if (err) {
			console.log("Could not get all groups for user in user controller getGroupsForUser.");
			res.status(500).end();
		}

		res.json(groups);
		next();
	});
};


controller.addGroupForUser = function(req, res, next) {

	var groupName = req.body.groupName;

	Group.findOne({
		$and: [{
			name: groupName
		}, {
			creatorID: req.userID
		}]
	}, function(err, found) {

		if (err) {
			console.log("While checking for group duplicate on insert an error occured in user controller addGroupForUser.");
			res.status(500).end();
		}

		if (found) {

			console.log("Detected group duplicate on insert in user controller addGroupForUser.");
			res.status(400).json({
				status: "failure",
				reason: "group exists"
			}).end();
		} else {

			Group.create({
				name: groupName,
				creatorID: req.userID
			}, function(err, addedGroup) {

				if (err) {
					console.log("Error during saving new group in user controller addGroupForUser.");
					res.status(500).end();
				}

				res.json({
					status: "success",
					reason: "group added"
				});
				next();
			});
		}
	});
};


controller.getGroupForUser = function(req, res, next) {

	Group.findById(req.groupID, 'name members', function(err, groupID) {

		if (err) {
			console.log("Could not retrieve information about specific group in user controller getGroupForUser.");
			res.status(500).end();
		}

		res.json(groupID);
		next();
	});
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