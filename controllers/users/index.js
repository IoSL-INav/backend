/**
 * IoSL-INav controllers/users/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Users specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');
var validator = require('validator');
var async = require('async');
var User = require('./../../models/user');
var Hotspot = require('./../../models/hotspot');
var Location = require('./../../models/location');
var CompanionRequest = require('./../../models/companionrequest');

var controller = {};



/* Controllers. */


/**
 * This function returns the user information
 * of the currently logged in user.
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
 * Updates all configurable attributes a logged
 * in user can change about the user itself.
 *
 * Parameters:
 * - req.body.userName: different user name to display
 * - req.body.userAutoPing: defines if user wants to auto ping friends
 * - req.body.userAutoGroup: specifies the group to auto ping
 * - req.body.userAutoLocate: defines if user wants to be located automatically
 */
controller.updateCurrentUser = function(req, res, next) {

    var newUserName = req.body.userName;
    var newUserAutoPing = req.body.userAutoPing;
    var newUserAutoGroup = req.body.userAutoGroup;
    var newUserAutoLocate = req.body.userAutoLocate;

    var updateQuery = {};
    var noError = true;


    /* Sanity and validity tests for user name. */
    if (newUserName != undefined) {

        /**
         * Sanitize supplied user name.
         * Remove surrounding white space and unwanted
         * control characters and escape special characters.
         * Proceed with a string.
         */
        newUserName = validator.escape(validator.stripLow(validator.trim(newUserName)));
        newUserName = validator.toString(newUserName);

        /* Check if group name is (now) empty. */
        if (newUserName !== "") {
            updateQuery.name = newUserName;
        } else {
            noError = false;
            res.status(400).json({
                status: "failure",
                reason: "User name was empty."
            });
            return next();
        }
    }

    /* Sanity and validity tests for the auto ping value. */
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

    /* Sanity and validity tests for supplied group name. Also checks existence. */
    if (newUserAutoGroup != undefined) {

        /**
         * Sanitize supplied group name.
         * Remove surrounding white space and unwanted
         * control characters and escape special characters.
         * Proceed with a string.
         */
        newUserAutoGroup = validator.escape(validator.stripLow(validator.trim(newUserAutoGroup)));
        newUserAutoGroup = validator.toString(newUserAutoGroup);

        /* Check if group name is (now) empty. */
        if (newUserAutoGroup !== "") {

            var g;
            var found;

            for (g = 0; g < req.user.groups.length; g++) {

                if (req.user.groups[g].name === newUserAutoGroup) {

                    /* Found group that matches newUserAutoGroup name. Save it. */
                    updateQuery.autoPingGroup = req.user.groups[g];
                    found = true;

                    break;
                }
            }

            if (!found) {
                noError = false;
                res.status(400).json({
                    status: "failure",
                    reason: "No group matching supplied name was found."
                });
                return next();
            }
        } else {
            noError = false;
            res.status(400).json({
                status: "failure",
                reason: "Auto ping group was empty."
            });
            return next();
        }
    }

    /* Sanity and validity tests for auto location. */
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


    /* All sanity tests went well. Try to save update. */
    if (noError) {

        User.findByIdAndUpdate(req.user._id, updateQuery, {
            new: true
        }, function(err, updUser) {

            if (err) {
                console.log("Updating modified user went wrong.");
                console.log(err);
                res.status(500).json();
                return next();
            }

            /* Return updated user information. */
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
 * Also deletes all created groups, all open companion
 * requests as well as all open locations.
 */
controller.deleteCurrentUser = function(req, res, next) {

    /* Delete all open companion requests matching the user's ID. */
    CompanionRequest.find({
        $or: [{
            'from': req.user._id
        }, {
            'to': req.user._id
        }]
    }).remove().exec();

    /* Delete all open locations belonging to the user's ID. */
    Location.find({
        owner: req.user._id
    }).remove().exec();

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


/**
 * Takes whatever location information of
 * building & floor, major & minor, latitude & longitude
 * is available and updates the user's location with
 * respect to which information is the most precise one.
 *
 * Parameters:
 * - req.body.userBuilding: building information from MSE API
 * - req.body.userFloor: floor information from MSE API
 * - req.body.userMajor: beacon major value
 * - req.body.userMinor: beacon minor value
 * - req.body.userLat: latitude of user
 * - req.body.userLon: longitude of user
 */
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
                        newLoc.building = beacons[0].location.building;
                        newLoc.floor = beacons[0].location.floor;
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

            /* As no error occurred - add owner and indicator. */
            newLoc.owner = req.user._id;
            newLoc.accuracyIndicator = accuracyIndicator;

            /* Find old location and replace by new one. */
            Location.findOneAndRemove({
                owner: req.user._id
            }, function(err) {

                if (err) {
                    console.log("Error during deleting the old location of a user.");
                    console.log(err);
                    res.status(500).end();
                    return next();
                }

                newLoc.save(function(err) {

                    if (err) {
                        console.log("Error during inserting the new location of a user.");
                        console.log(err);
                        res.status(500).end();
                        return next();
                    }

                    /* New location updated. Return that location. */
                    res.json(newLoc);
                    next();
                });
            });
        }
    });
};


/**
 * Deletes the set location information
 * for the currently logged in user.
 */
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


/**
 * Adds a new group to the currently logged in user's
 * groups if the supplied groupName passes a field of tests.
 *
 * Parameters:
 * - req.body.groupName: Name of the group to add
 */
controller.addGroupForUser = function(req, res, next) {

    var i;
    var groupName = req.body.groupName;
    var foundGroup = false;


    /* Check if no group was supplied. */
    if (groupName == undefined) {

        res.status(400).json({
            status: "failure",
            reason: "no groupName specified"
        });
        return next();
    }

    /**
     * Sanitize supplied group name.
     * Remove surrounding white space and unwanted
     * control characters and escape special characters.
     * Proceed with a string.
     */
    groupName = validator.escape(validator.stripLow(validator.trim(groupName)));
    groupName = validator.toString(groupName);

    /* Check for (now) empty group name. */
    if (groupName === "") {

        res.status(400).json({
            status: "failure",
            reason: "groupName is empty"
        });
        return next();
    }

    /* Start gathering object to insert. */
    var newGroup = {
        name: groupName,
        members: []
    };

    /* Check if user already has a group with supplied name. */
    for (i = 0; i < req.user.groups.length; i++) {

        /* We found a duplicate! */
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

    /* No group with same name exists and everything clear. Save. */
    if (!foundGroup) {

        /* Find current user and push new group to existing groups. */
        User.findByIdAndUpdate(req.user._id, {
            $push: {
                "groups": newGroup
            }
        }, {
            new: true
        }, function(err, updUser) {

            if (err) {
                console.log("Error during adding a group to a user.");
                console.log(err);
                res.status(500).end();
                return next();
            }

            for (i = 0; i < updUser.groups.length; i++) {

                /* Found new group. */
                if (updUser.groups[i].name === groupName) {

                    /* Return success and ID of newly created group. */
                    res.json({
                        status: "success",
                        reason: "group added",
                        groupID: updUser.groups[i].id
                    });

                    break;
                }
            }

            return next();
        });
    }
};


/**
 * This controller retrieves a specific group
 * of the currently logged in user's groups.
 */
controller.getGroupForUser = function(req, res, next) {

    var i;
    var foundGroup = req.user.groups.id(req.groupID);

    /* No group for supplied groupID found. */
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


/**
 * Change the name of an existing group that
 * is not the default 'All friends' group.
 * New name needs to pass the same tests as a
 * name in group creation needs to pass.
 *
 * Parameters:
 * - req.body.newGroupName: Name to change group name to
 */
controller.updateGroupForUser = function(req, res, next) {

    var foundGroup = req.user.groups.id(req.groupID);
    var newGroupName = req.body.newGroupName;


    /* No group matching supplied groupID was found. */
    if (foundGroup == null) {

        res.status(404).json({
            status: "failure",
            reason: "group not found"
        });
        return next();
    }

    /* The new group name was an empty field. */
    if (newGroupName == undefined) {

        res.status(400).json({
            status: "failure",
            reason: "no newGroupName specified"
        });
        return next();
    }

    /**
     * Sanitize supplied group name.
     * Remove surrounding white space and unwanted
     * control characters and escape special characters.
     * Proceed with a string.
     */
    newGroupName = validator.escape(validator.stripLow(validator.trim(newGroupName)));
    newGroupName = validator.toString(newGroupName);

    /* Check for (now) empty group name. */
    if (newGroupName === "") {

        res.status(400).json({
            status: "failure",
            reason: "new group name is empty"
        });
        return next();
    }

    /* Don't allow to name the group 'All friends'. */
    if (newGroupName === "All friends") {

        res.status(400).json({
            status: "failure",
            reason: "attempt to name the group after the default group 'All friends' (not possible)"
        });
        return next();
    }

    /* Don't allow to rename default group 'All friends'. */
    if (foundGroup.name === "All friends") {

        res.status(400).json({
            status: "failure",
            reason: "attempt to rename default group (not possible)"
        });
        return next();
    }

    /* All checks passed. Save. */
    foundGroup.name = newGroupName;
    req.user.save(function(err) {

        if (err) {
            console.log("Error during updating group of user.");
            console.log(err);
            res.status(500).end();
            return next();
        }

        /* Return success and group information of updated group. */
        res.json({
            status: "success",
            reason: "group updated",
            group: req.user.groups.id(req.groupID)
        });
        next();
    });
};


/**
 * Delete supplied group if found from all
 * groups of currently logged in user.
 */
controller.deleteGroupForUser = function(req, res, next) {

    var foundGroup = req.user.groups.id(req.groupID);

    /* Check if no group was found for given group ID. */
    if (foundGroup == null) {

        res.status(404).json({
            status: "failure",
            reason: "group not found"
        });
        return next();
    }

    /* If found: remove the group. */
    foundGroup.remove();

    /* Save modified user object. */
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


/**
 * Add a friend to a group other than 'All friends'.
 * The friend already has to be in the logged in
 * user's 'All friends' list.
 *
 * Parameters:
 * - req.body.userID: ID of user to add to group
 * - req.groupID: ID of group to add user to
 */
controller.addUserToGroup = function(req, res, next) {

    /**
     * At this point, we assume:
     * Friend approval done - both parties have accepted each other
     * so that both parties are in the corresponding 'All friends' list.
     *
     * Query logged in user's 'All friends' list for submitted user
     * - if found and not already in other group: add to submitted other group
     * - if not found or already in other group: deny request
     */

    var g;
    var companionID = req.body.userID;
    var group = req.user.groups.id(req.groupID);


    /* Check if group exists. */
    if (group == null) {
        res.status(400).json({
            status: "error",
            reason: "no group found for supplied groupID"
        });
        return next();
    }

    for (g = 0; g < req.user.groups.length; g++) {

        if (req.user.groups[g].name == 'All friends') {

            /* Prevents adding friend to 'All friends' a second time. */
            if (req.user.groups[g]._id == req.groupID) {
                res.status(400).json({
                    status: "error",
                    reason: "supplied user already in 'All friends' list"
                });
                return next();
            }

            /* Check for at least one member in 'All friends' list. */
            if (req.user.groups[g].members.length > 0) {

                var mem;

                for (mem = 0; mem < req.user.groups[g].members.length; mem++) {

                    /* We found the supplied companionID in 'All friends'. */
                    if (req.user.groups[g].members[mem]._id == companionID) {

                        /* If group has no members - add user. */
                        if (group.members.length <= 0) {
                            var friends = [companionID];
                            group.members = friends;
                        } else {

                            var memNew;
                            var foundUser = false;

                            for (memNew = 0; memNew < group.members.length; memNew++) {

                                /* Check if user already is in supplied group. */
                                if (group.members[memNew]._id == companionID) {
                                    foundUser = true;
                                }
                            }

                            if (foundUser) {
                                res.status(400).json({
                                    status: "error",
                                    reason: "supplied user already in supplied group"
                                });
                                return next();
                            }

                            /* Group already has members, push other user. */
                            group.members.push(companionID);
                        }

                        /* And save modified user object. */
                        req.user.save();

                        res.json({
                            status: "success",
                            reason: "user added to group"
                        });
                        return next();
                    } else {
                        res.status(400).json({
                            status: "error",
                            reason: "supplied user not found in 'All friends' list"
                        });
                        return next();
                    }
                }
            } else {
                res.status(400).json({
                    status: "error",
                    reason: "supplied user not found in 'All friends' list"
                });
                return next();
            }
        }
    }
};


/**
 * Removes a user from a group.
 * If user is removed from 'All friends' list,
 * treat this as an unfriend request and delete
 * user from both respective 'All friends' groups.
 *
 * Parameters:
 * - req.otherUserID: ID of user to remove from group
 * - req.groupID: ID of group to remove user from
 */
controller.deleteUserFromGroup = function(req, res, next) {

    var companionID = req.otherUserID;
    var group = req.user.groups.id(req.groupID);
    var found = false;

    /* Check if group exists. */
    if (group == null) {
        res.status(400).json({
            status: "error",
            reason: "no group found matching supplied groupID"
        });
        return next();
    }

    /**
     * Filter group's members array and only include users
     * that do not have the companionID as _id.
     * Set found to true if the supplied user was found.
     */
    var rmdMember = group.members.filter(function(mem) {

        var inc = (mem._id !== companionID) ? true : false;

        if (!inc) {
            found = true;
        }

        return inc;
    });

    /* Consider this an unfriend request. */
    if ((group.name === "All friends") && (found)) {

        /* Find the other user to edit her/his groups. */
        User.findById(companionID, function(err, otherUser) {

            var g;

            if (err) {
                console.log("Error during finding the to be removed companion.");
                console.log(err);
                res.status(500).end();
                return next();
            }

            /* Loop over all groups and remove the currently logged in user. */
            for (g = 0; g < otherUser.groups.length; g++) {

                var meFound = false;

                /**
                 * Filter group's members array and only include users
                 * that do not have the ID of the currently logged in user.
                 * Set meFound to true if the logged in user was found.
                 */
                var otherUserMembers = otherUser.groups[g].members.filter(function(mem) {

                    var inc = (mem._id !== req.user._id) ? true : false;

                    if (!inc) {
                        meFound = true;
                    }

                    return inc;
                });

                /* Only make a database request when user found. */
                if (meFound) {
                    otherUser.groups[g].members = otherUserMembers;
                    otherUser.save();
                }
            }

            /* Loop over all groups of current user and remove companion. */
            for (g = 0; g < req.user.groups.length; g++) {

                var otherFound = false;

                /**
                 * Filter group's members array and only include users
                 * that do not have the companionID as _id.
                 * Set otherFound to true if the supplied user was found.
                 */
                var meUserMembers = req.user.groups[g].members.filter(function(mem) {

                    var inc = (mem._id !== companionID) ? true : false;

                    if (!inc) {
                        otherFound = true;
                    }

                    return inc;
                });

                /* Only make a database request when user found. */
                if (otherFound) {
                    req.user.groups[g].members = meUserMembers;
                    req.user.save();
                }
            }
        });
    }

    /* If the supplied user was not found, return an error. */
    if (!found) {
        res.status(400).json({
            status: "error",
            reason: "no user found matching supplied userID"
        });
        return next();
    }

    /* Otherwise update the user object. */
    group.members = rmdMember;
    req.user.save();

    res.json({
        status: "success",
        reason: "user removed from group"
    });
    return next();
};


/* Export all controllers. */

module.exports = controller;