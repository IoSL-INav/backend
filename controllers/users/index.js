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
var async = require('async');
var User = require('./../../models/user');
var Hotspot = require('./../../models/hotspot');
var Location = require('./../../models/location');

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

	/**
	 * Pairs of location information.
	 * Backend accepts either combination.
	 */
	var building = req.body.userBuilding;
	var floor = req.body.userFloor;
	var major = req.body.userMajor;
	var minor = req.body.userMinor;
	var lat = req.body.userLat;
	var lon = req.body.userLon;

	var newLoc = new Location();
	var accuracyIndicator = -1;
	var noError = true;


	/* Sanity and incompleteness checks. */

	async.series([

		function(callback) {

			/* Building and floor. */
			if ((building != undefined) && (floor != undefined)) {

				building = validator.trim(building);
				floor = validator.trim(floor);

				/* Check for empty. */

				if (building.length === 0) {
					noError = false;
					res.status(400).json({
						status: "failure",
						reason: "building missing"
					});
					return next();
				}

				if (floor.length === 0) {
					noError = false;
					res.status(400).json({
						status: "failure",
						reason: "floor missing"
					});
					return next();
				}

				/* Everything fine. Save. */

				building = validator.stripLow(building);
				floor = validator.stripLow(floor);

				newLoc.building = building;
				newLoc.floor = floor;

				accuracyIndicator = 0;
			} else if ((building != undefined) && (floor == undefined)) {

				noError = false;
				res.status(400).json({
					status: "failure",
					reason: "floor missing"
				});
				return next();
			} else if ((building == undefined) && (floor != undefined)) {

				noError = false;
				res.status(400).json({
					status: "failure",
					reason: "building missing"
				});
				return next();
			}

			callback(null);
		},
		function(callback) {

			/* Major & minor (beacons). */
			if ((major != undefined) && (minor != undefined)) {

				major = validator.toInt(validator.trim(major));
				minor = validator.toInt(validator.trim(minor));

				Hotspot.aggregate([{
					$match: {
						$and: [{
							'beacons.major': major
						}, {
							'beacons.minor': minor
						}]
					}
				}, {
					$unwind: '$beacons'
				}, {
					$match: {
						$and: [{
							'beacons.major': major
						}, {
							'beacons.minor': minor
						}]
					}
				}, {
					$project: {
						name: '$beacons.name',
						companyUUID: '$beacons.companyUUID',
						major: '$beacons.major',
						minor: '$beacons.minor',
						location: '$beacons.location'
					}
				}], function(err, beacons) {

					if (err) {
						console.log("Error during retrieving matching beacons for supplied major and minor on updateLocation.");
						console.log(err);
						res.status(500).end();
						return next();
						callback(null);
					}

					if (beacons.length > 0) {
						newLoc.coordinates = beacons[0].location.coordinates;
						accuracyIndicator = 1;
						callback(null);
					} else {
						noError = false;
						res.status(400).json({
							status: "failure",
							reason: "no beacon found for supplied major and minor"
						});
						return next();
						callback(null);
					}
				});
			} else if ((major != undefined) && (minor == undefined)) {

				noError = false;
				res.status(400).json({
					status: "failure",
					reason: "minor missing"
				});
				return next();
				callback(null);
			} else if ((major == undefined) && (minor != undefined)) {

				noError = false;
				res.status(400).json({
					status: "failure",
					reason: "major missing"
				});
				return next();
				callback(null);
			} else {
				callback(null);
			}
		},
		function(callback) {

			/* Latitude & longitude. */
			if ((lat != undefined) && (lon != undefined)) {

				lat = validator.trim(lat);
				lon = validator.trim(lon);

				/* Check for empty. */

				if (lat.length === 0) {
					noError = false;
					res.status(400).json({
						status: "failure",
						reason: "latitude missing"
					});
					return next();
				}

				if (lon.length === 0) {
					noError = false;
					res.status(400).json({
						status: "failure",
						reason: "longitude missing"
					});
					return next();
				}

				/* Check for out of bounds. */

				if (!validator.isFloat(lat, {
						min: 0.0,
						max: 90.0
					})) {
					noError = false;
					res.status(400).json({
						status: "failure",
						reason: "latitude out of bounds"
					});
					return next();
				}

				if (!validator.isFloat(lon, {
						min: 0.0,
						max: 180.0
					})) {
					noError = false;
					res.status(400).json({
						status: "failure",
						reason: "longitude out of bounds"
					});
					return next();
				}

				/* Everything fine. Save. */

				lat = validator.toFloat(lat);
				lon = validator.toFloat(lon);

				newLoc.coordinates = [lon, lat];
				accuracyIndicator = 2;
			} else if ((lat != undefined) && (lon == undefined)) {

				noError = false;
				res.status(400).json({
					status: "failure",
					reason: "longitude missing"
				});
				return next();
			} else if ((lat == undefined) && (lon != undefined)) {

				noError = false;
				res.status(400).json({
					status: "failure",
					reason: "latitude missing"
				});
				return next();
			}

			callback(null);
		}
	], function(err, results) {

		if (err) {
			console.log("Error during async series in updateLocation.");
			console.log(err);
			res.status(500).end();
			return next();
		}

		/* Check for no data. */
		if (accuracyIndicator == -1) {

			res.status(400).json({
				status: "failure",
				reason: "no data submitted"
			});
			return next();
		}

		if (noError) {

			newLoc.accuracyIndicator = accuracyIndicator;

			Location.findOneAndUpdate({
				owner: req.user._id
			}, newLoc, {
				new: true,
				upsert: true
			}, function(err, updLoc) {

				if (err) {
					console.log("Error during updating the location of a user.");
					console.log(err);
					res.status(500).end();
					return next();
				}

				res.json(updLoc);
			});
		}

		next();
	});
};


controller.deleteLocation = function(req, res, next) {

	Location.findOneAndRemove({
		owner: req.user._id
	}, function(err) {

		if (err) {
			console.log("Error during deleting the location of a user.");
			console.log(err);
			res.status(500).end();
			return next();
		}

		res.json({
			status: "success"
		});
	});

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

	if (groupName == undefined) {

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

	if (foundGroup == null) {

		res.status(404).json({
			status: "failure",
			reason: "group not found"
		});
		return next();
	}

	if (newGroupName == undefined) {

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

	if (foundGroup.name == "All friends") {

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

		if (err) {
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
	var companionID = req.body.userID;
	/**
	 * At this point, assume:
	 * Friend approval done - both parties have accepted each other
	 * so that both parties are in the corresponding 'All friends' list.
	 *
	 * Query logged in user's 'All friends' list for submitted user
	 * if found: add to submitted other group
	 * if not found: deny request
	 */
	var group = req.user.groups.id(req.groupID);
	var added = false;
	for (var g in req.user.groups) {
		if (req.user.groups[g].name == 'All friends') {
			if (req.user.groups[g].members.length > 0) {
				for (var mem in req.user.groups[g].members) {
					if (req.user.groups[g].members[mem].id == companionID) {
						if (group.members.length <= 0) {
							var data = [companionID];
							group.members = data;
						} else {
							group.members.push(companionID);
						}
						req.user.save();
						added = true;
						res.json({
							status: "success",
							reason: "user added to group"
						});
						return next();
					}
				}
			}
		}
	}
	//TODO: better error handling
	res.json({
		status: "error",
		reason: "user not added to group"
	});
	return next();
};


controller.deleteUserFromGroup = function(req, res, next) {
	// TODO
	return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;