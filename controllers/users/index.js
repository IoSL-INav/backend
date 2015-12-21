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
var validator = require('validator');
var User = require('./../../models/user');
var Group = require('./../../models/group');
var Location = require('./../../models/location');

var controller = {};


/* Helpers. */

var getupdUser = function(userID, callback) {

	User.findById(userID, function(err, updUser) {

		if (err) {
			console.log("user controller error: getupdUser query yielded error.");
			callback(err);
		}

		callback(null, updUser);
	});
};



/* Controllers. */


/**
 * This function returns the user data of
 * the currently logged in user.
 */
controller.getCurrentUser = function(req, res, next) {

	getupdUser(req.userID, function(err, updUser) {

		if (err) {
			console.log("getupdUser call done from getCurrentUser controller.");
			res.status(500).end();
		}

		res.json({
			userID: updUser._id,
			userName: updUser.name,
			userEmail: updUser.email,
			userAutoPing: updUser.autoPingEnabled,
			userAutoGroup: updUser.autoPingGroup,
			userAutoLocate: updUser.autoLocateEnabled
		});
		next();
	});
};


controller.updateCurrentUser = function(req, res, next) {

	var newUserName = req.body.userName;
	var newUserAutoPing = req.body.userAutoPing;
	var newUserAutoGroup = req.body.userAutoGroup;
	var newUserAutoLocate = req.body.userAutoLocate;
	var updateQuery = {};
	var noError = true;

	if (newUserName != undefined) {
		newUserName = validator.stripLow(validator.trim(newUserName));

		if (validator.isAlphanumeric(newUserName)) {
			updateQuery.name = newUserName;
		} else {
			noError = false;
			res.status(400).json({
				status: "failure",
				reason: "User name contains unallowed characters (only alphanumeric ones allowed)."
			}).end();
		}
	}

	if (newUserAutoPing != undefined) {
		newUserAutoPing = validator.stripLow(validator.trim(newUserAutoPing));

		if (validator.isBoolean(newUserAutoPing)) {
			updateQuery.autoPingEnabled = newUserAutoPing;
		} else {
			noError = false;
			res.status(400).json({
				status: "failure",
				reason: "Received auto ping indicator was no boolean."
			}).end();
		}
	}

	if (newUserAutoGroup != undefined) {
		newUserAutoGroup = validator.stripLow(validator.trim(newUserAutoGroup));

		if (validator.isAlphanumeric(newUserAutoGroup)) {
			updateQuery.autoPingGroup = newUserAutoGroup;
		} else {
			noError = false;
			res.status(400).json({
				status: "failure",
				reason: "Auto ping group contained other than alphanumeric characters."
			}).end();
		}
	}

	if (newUserAutoLocate != undefined) {
		newUserAutoLocate = validator.stripLow(validator.trim(newUserAutoLocate));

		if (validator.isBoolean(newUserAutoLocate)) {
			updateQuery.autoLocateEnabled = newUserAutoLocate;
		} else {
			noError = false;
			res.status(400).json({
				status: "failure",
				reason: "Received auto locate indicator was no boolean."
			}).end();
		}
	}

	if (noError) {

		User.findByIdAndUpdate(req.userID, updateQuery, {
			new: true
		}, function(err, updUser) {

			if (err) {
				console.log("\n\nUpdating modified user went wrong.\nError:", err, "\n\n");
				res.status(500).json(err.message).end();
				return next();
			}

			res.json({
				userID: updUser._id,
				userName: updUser.name,
				userEmail: updUser.email,
				userAutoPing: updUser.autoPingEnabled,
				userAutoGroup: updUser.autoPingGroup,
				userAutoLocate: updUser.autoLocateEnabled
			});
			next();
		});
	}
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
					reason: "group added",
					groupID: addedGroup._id
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


/* Export all controllers. */

module.exports = controller;