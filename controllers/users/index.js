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

    User.findByIdAndUpdate(req.user._id, updateQuery, {
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
    }

    /* Log out users via "See other" redirect to /logout. */
    res.status(303).location('/logout').end();
  });
};


controller.updateLocation = function(req, res, next) {

  var lat = req.body.userLat;
  var lon = req.body.userLon;
  var building = req.body.userBuilding;
  var floor = req.body.userFloor;


  /* TODO: Validate input! */


  Location.create({
    coordinates: [lon, lat],
    building: building,
    floor: floor
  }, function(err, loc) {

    if (err) {
      console.log("Could not insert new location for user.");
      res.status(500).end();
    }

    res.json(loc);
    next();
  });
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
  res.json(req.user.groups);
  next();
};


controller.addGroupForUser = function(req, res, next) {

  var groupName = req.body.groupName;
  /* TODO: Validate input! */

  console.log('TODO: addGroupForUser');
  var reason = 'group added';
  var status = "failure";
  var newGroup = {
    name: groupName,
    members: []
  };
  var foundGroup = -1;
  for (var i = 0; i < req.user.groups.length && foundGroup == -1; i++) {
    if (req.user.groups[i].name == groupName) {
      foundGroup = req.user.groups[i].id;
      reason = 'group already exists';
      res.status(400);
    }
  }

  if (foundGroup == -1) {
    req.user.groups.push(newGroup);
    req.user.save();
    for (var i = 0; i < req.user.groups.length && foundGroup == -1; i++) {
      if (req.user.groups[i].name == groupName) {
        status = 'success';
        res.status(200);
        foundGroup = req.user.groups[i].id;
      }
    }
  }
  res.json({
    status: status,
    reason: reason,
    groupID: foundGroup
  });
  next();


};


controller.getGroupForUser = function(req, res, next) {
  console.log('TODO: getGroupForUser');
  var foundGroup = -1;
  for (var i = 0; i < req.user.groups.length && foundGroup == -1; i++) {
    if (req.user.groups[i].id == req.params.gid) {
      foundGroup = req.user.groups[i].id;
      res.json(req.user.groups[i]);
    }
  }
  if (foundGroup == -1) {
    res.status(500).end();
  }
  next();
  /*
  Group.findById(req.groupID, 'name members', function(err, groupID) {

  	if (err) {
  		console.log("Could not retrieve information about specific group in user controller getGroupForUser.");
  		res.status(500).end();
  	}

  	res.json(groupID);
  	next();
  });
  */
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
