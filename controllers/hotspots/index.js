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

    for (index in hotspot.beacons) {

      if (hotspot.beacons[index]._id == bid) {
        beacon = hotspot.beacons[index];
      }
    }

    res.json(beacon);
    next();
  });
};

controller.getActiveFriends = function(req, res, next) {

  /* Look through all friends of user. */

  var i;
  var allFriends;

  Location.findOne({
    owner: req.user._id
  }, function(err, ownLoc) {

    if (err) {
      console.log("Could not retrieve user's location. Not updated?");
      console.log(err);
      res.status(500).end();
      return next();
    }

    console.log(ownLoc);

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
        }, /*{
          coordinates: {
            $geoWithin: {
              $geometry:
            }
          }
        }, */{
          building: ownLoc.building
        }]
      }]
    }, function(err, found) {
      console.log(found);
    });

    //.populate('owner').exec(function(err, ));

    /* Select all friends who have shared their location and are in the same area as the user. */

    /* Return those friends. */
  });


  /* TODO */
  return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;