/**
 * IoSL-INav controllers/hotspots/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Hotspots specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');
var Hotspot = require('./../../models/hotspot');
var User = require('./../../models/user');
var Location = require('./../../models/location');

var controller = {};


/* Controllers. */

controller.getAllHotspots = function(req, res, next) {

  Hotspot.find(function(err, hotspots) {

    if (err) {
      console.log("Could not get all hotspots controller getAllHotspots.");
      console.log(err);
      res.status(500).json(err);
      return next();
    }

    res.json(hotspots);
    next();
  });
};

controller.getHotspot = function(req, res, next) {

  var hid = req.params.hid;

  Hotspot.findById(hid, function(err, hotspot) {

    if (err) {
      console.log("hotspot controller error: getHotspot query yielded error.");
      console.log(err);
      res.status(500).json(err);
      return next();
    }

    res.json(hotspot);
    next();
  });
};


/* Get all beacons of a given hotspot. */
controller.getAllBeacons = function(req, res, next) {

  var hid = req.params.hid;

  Hotspot.findById(hid, function(err, hotspot) {

    if (err) {
      console.log("hotspot controller error: getAllBeacons query yielded error.");
      console.log(err);
      res.status(500).json(err);
    }

    res.json(hotspot.beacons);
    next();
  });
};


/* Get a single beacon of a given hotspot. */
controller.getBeacon = function(req, res, next) {

  var hid = req.params.hid;
  var bid = req.params.bid;

  Hotspot.findById(hid, function(err, hotspot) {

    var index;
    var beacon = null;

    if (err) {
      console.log("hotspot controller error: getHotspot query yielded error.");
      console.log(err);
      res.status(500).json(err);
      return next();
    }

    for (index = 0; index < hotspot.beacons.length; index++) {

      if (hotspot.beacons[index]._id == bid) {
        beacon = hotspot.beacons[index];
      }
    }

    res.json(beacon);
    next();
  });
};


controller.getActiveFriends = function(req, res, next) {

  var i;
  var allFriends;

  Location.findOne({
    owner: req.user._id
  }, function(err, ownLoc) {

    if (err) {
      console.log("Error during retrieving user's location.");
      console.log(err);
      res.status(500).end();
      return next();
    }

    if (ownLoc == null) {
      res.status(400).json({
        status: "failure",
        reason: "retrieving friends in area not possible when location not shared"
      });
      return next();
    }

    for (i = 0; i < req.user.groups.length; i++) {
      if (req.user.groups[i].name == "All friends") {
        allFriends = req.user.groups[i].members;
      }
    }

    Location.find({
        $and: [{
          owner: {
            $in: allFriends
          }
        }, {
          $or: [{
            coordinates: ownLoc.coordinates
          }, { // TODO: GEO FENCING MISSING!
            building: ownLoc.building
          }]
        }]
      }, 'owner coordinates building floor accuracyIndicator')
      .populate('owner')
      .lean()
      .exec(function(err, foundFriends) {

        if (err) {
          console.log("Error during collectiong friends at same hotspot.");
          console.log(err);
          res.status(500).end();
          return next();
        }

        if (foundFriends.length === 0) {
          res.json({
            message: "no friends in area"
          });
          return next();
        }

        var u;
        var resFriends = {
          friends: []
        };

        for (u = 0; u < foundFriends.length; u++) {

          var friend = {
            id: foundFriends[u].owner._id,
            name: foundFriends[u].owner.name,
            location: {
              coordinates: foundFriends[u].coordinates,
              building: foundFriends[u].building,
              floor: foundFriends[u].floor,
              accuracyIndicator: foundFriends[u].accuracyIndicator
            }
          };

          resFriends.friends.push(friend);
        }

        res.json(resFriends);
        next();
      });
  });
};


/* Export all controllers. */

module.exports = controller;