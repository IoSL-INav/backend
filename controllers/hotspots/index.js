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


/**
 * Return all hotspots available in database.
 */
controller.getAllHotspots = function(req, res, next) {

  /* Find all hotspots and return them. */
  Hotspot.find(function(err, hotspots) {

    if (err) {
      console.log("Could not get all hotspots controller getAllHotspots.");
      console.log(err);
      res.status(500).json();
      return next();
    }

    res.json(hotspots);
    next();
  });
};


/**
 * Retrieve information for a specific hotspot.
 */
controller.getHotspot = function(req, res, next) {

  Hotspot.findById(req.hotspotID, function(err, hotspot) {

    if (err) {
      console.log("Error during retrieving information about specific hotspot.");
      console.log(err);
      res.status(500).json();
      return next();
    }

    res.json(hotspot);
    next();
  });
};


/**
 * Get all beacons of a given hotspot ID.
 */
controller.getAllBeacons = function(req, res, next) {

  Hotspot.findById(req.hotspotID, function(err, hotspot) {

    if (err) {
      console.log("Could not retrieve all beacons for a specific hotspot.");
      console.log(err);
      res.status(500).json();
    }

    res.json(hotspot.beacons);
    next();
  });
};


/**
 * Get a single beacon of a given hotspot ID.
 */
controller.getBeacon = function(req, res, next) {

  Hotspot.findById(req.hotspotID, function(err, hotspot) {

    var i;
    var beacon = null;

    if (err) {
      console.log("hotspot controller error: getHotspot query yielded error.");
      console.log(err);
      res.status(500).json(err);
      return next();
    }

    for (i = 0; i < hotspot.beacons.length; i++) {

      /* We found the one requested beacon. Save that. */
      if (hotspot.beacons[i]._id == req.beaconID) {
        beacon = hotspot.beacons[i];
      }
    }

    res.json(beacon);
    next();
  });
};


/**
 * Retrieve all friends of currently logged in user
 * that also have shared their location and are currently
 * in the same hotspot.
 */
controller.getActiveFriends = function(req, res, next) {

  var i;
  var allFriends;

  /* Find the logged in user's location. */
  Location.findOne({
    owner: req.user._id
  }, function(err, ownLoc) {

    if (err) {
      console.log("Error during retrieving user's location.");
      console.log(err);
      res.status(500).end();
      return next();
    }

    /* If logged in user has not shared her/his location, deny request. */
    if (ownLoc == null) {
      res.status(400).json({
        status: "failure",
        reason: "retrieving friends in area not possible when location not shared"
      });
      return next();
    }

    for (i = 0; i < req.user.groups.length; i++) {

      /* Get the list of friends in user's 'All friends' list. */
      if (req.user.groups[i].name == "All friends") {
        allFriends = req.user.groups[i].members;
      }
    }

    /* Reverse lookup to find hotspot that includes user's location. */
    Hotspot.findOne({
      geoFence: {
        $geoIntersects: {
          $geometry: ownLoc.coordinates
        }
      }
    }, function(err, ownHotspot) {

      if (err) {
        console.log("Could not determine the hotspot for given user's location.");
        console.log(err);
        res.status(500).end();
        return next();
      }

      /* No hotspot for user location found. Report back to user. */
      if (ownHotspot == null) {
        res.status(400).json({
          status: "failure",
          reason: "user's location outside any hotspot's geo fence"
        });
        return next();
      }

      /**
       * From all locations in database, select the ones that
       * - belong to owners in the collected 'All friends' list and
       * - match the hotspot geo fence or
       * - match the same building
       */
      Location.find({
          $and: [{
            owner: {
              $in: allFriends
            }
          }, {
            $or: [{
              building: ownLoc.building
            }, {
              coordinates: {
                $geoWithin: {
                  $geometry: ownHotspot.geoFence
                }
              }
            }]
          }]
        }, 'owner coordinates building floor accuracyIndicator') /* Select specific fields back from results. */
        .populate('owner') /* Add owner's user information. */
        .lean() /* Return objects as plain JavaScript, not Mongoose. */
        .exec(function(err, foundFriends) {

          if (err) {
            console.log("Error during collecting friends at same hotspot.");
            console.log(err);
            res.status(500).end();
            return next();
          }

          /* No friends currently in same location. */
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

          /**
           * Friends in same location were found.
           * Build up the response object with special
           * structure and return it.
           */
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
  });
};


/* Export all controllers. */

module.exports = controller;