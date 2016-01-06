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

var controller = {};



/* Controllers. */


/**
 * This function returns the user data of
 * the currently logged in user.
 */
controller.getCurrentUser = function(req, res, next) {

	res.json({
		userID: req.user._id,
		userName: req.user.name,
		userEmail: req.user.email,
		userAutoPing: req.user.autoPingEnabled,
		userAutoGroup: req.user.autoPingGroup,
		userAutoLocate: req.user.autoLocateEnabled
	});
	next();
};


/**
 * Updates a user.
 * Possible attributes:
 * - userName: alphanumeric,
 * - userAutoPing: boolean,
 * - userAutoGroup: alphanumeric,
 * - userAutoLocate: boolean
 */
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
			});
			return next();
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
			});
			return next();
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
			});
			return next();
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
			});
			return next();
		}
	}

	if (noError) {

		User.findByIdAndUpdate(req.user._id, updateQuery, {
			new: true
		}, function(err, updUser) {

			if (err) {
				console.log("\n\nUpdating modified user went wrong.\nError:", err, "\n\n");
				res.status(500).json(err.message);
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


/**
 * Completely erases a user from database.
 * Also deletes all created groups.
 */
controller.deleteCurrentUser = function(req, res, next) {

	/* Now remove the user itself. */
	User.findByIdAndRemove(req.user._id, function(err, rmUser) {

		if (err) {
			console.log("Error while removing the user itself.");
			res.status(500).end();
			return next();
		}

		/* Log out users via "See other" redirect to /logout. */
		res.status(303).location('/logout').end();
		next();
	});
};


controller.updateLocation = function(req, res, next) {

	var lat = req.body.userLat;
	var lon = req.body.userLon;
	var building = req.body.userBuilding;
	var floor = req.body.userFloor;
	var newLoc = {};
	var noError = true;

	if ((lat != undefined) && (lon == undefined)) {

		noError = false;
		res.status(400).json({
			status: "failure",
			reason: "longitude missing"
		});
		return next();
	}

	if ((lat == undefined) && (lon != undefined)) {

		noError = false;
		res.status(400).json({
			status: "failure",
			reason: "latitude missing"
		});
		return next();
	}

	if ((building == undefined) || (floor == undefined)) {

		noError = false;
		res.status(400).json({
			status: "failure",
			reason: "building and/or floor information missing"
		});
		return next();
	}

	if (noError) {

		if ((lat != undefined) && (lon != undefined)) {
			lat = validator.toFloat(validator.trim(lat));
			lon = validator.toFloat(validator.trim(lon));

			newLoc.coordinates = [lon, lat];
		}

		building = validator.stripLow(validator.trim(building));
		floor = validator.stripLow(validator.trim(floor));

		newLoc.building = building;
		newLoc.floor = floor;

		req.user.location = newLoc;
		req.user.save();

		if (req.user.location.building == building) {
			res.json(newLoc);
		} else {
			console.log("Could not insert new location for user.");
			res.status(500).end();
		}
	}

	next();
};


controller.deleteLocation = function(req, res, next) {

	req.user.location = null;
	req.user.save();

	if (req.user.location == null) {
		res.json({
			status: "success"
		});
	} else {
		console.log("Error during deleting a location from user.");
		res.status(500).end();
	}

	next();
};


/**
 * This function returns all existing groups
 * associated to the currently logged in user ID.
 */
controller.getGroupsForUser = function(req, res, next) {
	res.json(req.user.groups);
	next();
};


controller.addGroupForUser = function(req, res, next) {

	var i;
	var groupName = req.body.groupName;
	var foundGroup = false;

	if(groupName == undefined) {

		res.status(400).json({
			status: "failure",
			reason: "no groupName specified"
		});
		return next();
	}

	groupName = validator.stripLow(validator.trim(groupName));

	if (!validator.isAlphanumeric(groupName)) {

		res.status(400).json({
			status: "failure",
			reason: "group name contains unallowed characters (only alphanumeric ones allowed)"
		});
		return next();
	}

	var newGroup = {
		name: groupName,
		members: []
	};

	for (i = 0; i < req.user.groups.length; i++) {

		if (req.user.groups[i].name == groupName) {

			foundGroup = true;

			res.status(400).json({
				status: "failure",
				reason: "group already exists",
				groupID: req.user.groups[i].id
			});

			break;
		}
	}

	if (!foundGroup) {

		req.user.groups.push(newGroup);
		req.user.save();

		for (i = 0; i < req.user.groups.length; i++) {

			if (req.user.groups[i].name == groupName) {

				res.json({
					status: "success",
					reason: "group added",
					groupID: req.user.groups[i].id
				});

				break;
			}
		}
	}

	next();
};


controller.getGroupForUser = function(req, res, next) {

	var i;
	var foundGroup = req.user.groups.id(req.groupID);

	if (foundGroup == null) {

		res.status(404).json({
			status: "failure",
			reason: "group not found"
		});
		return next();
	}

	res.json(foundGroup);
	next();
};


controller.updateGroupForUser = function(req, res, next) {

	var foundGroup = req.user.groups.id(req.groupID);
	var newGroupName = req.body.newGroupName;

	if(foundGroup == null) {

		res.status(404).json({
			status: "failure",
			reason: "group not found"
		});
		return next();
	}

	if(newGroupName == undefined) {

		res.status(400).json({
			status: "failure",
			reason: "no newGroupName specified"
		});
		return next();
	}

	newGroupName = validator.stripLow(validator.trim(newGroupName));

	if (!validator.isAlphanumeric(newGroupName)) {

		res.status(400).json({
			status: "failure",
			reason: "group name contains unallowed characters (only alphanumeric ones allowed)"
		});
		return next();
	}

	if(foundGroup.name == "All friends") {

		res.status(400).json({
			status: "failure",
			reason: "attempt to rename default group (not possible)"
		});
		return next();
	}

	foundGroup.name = newGroupName;
	req.user.save(function(err) {

		if (err) {
			console.log("Error during updating group of user.");
			console.log(err);
			res.status(500).end();
			return next();
		}

		res.json({
			status: "success",
			reason: "group updated",
			group: req.user.groups.id(req.groupID)
		});
		next();
	});
};


controller.deleteGroupForUser = function(req, res, next) {

	var foundGroup = req.user.groups.id(req.groupID);

	if (foundGroup == null) {

		res.status(404).json({
			status: "failure",
			reason: "group not found"
		});
		return next();
	}

	foundGroup.remove();
	req.user.save(function(err) {

		if(err) {
			console.log("Error during removing group from user.");
			console.log(err);
			res.status(500).end();
			return next();
		}

		res.json({
			status: "success",
			reason: "group removed"
		});
		next();
	});
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