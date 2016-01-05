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

var controller = {};


/* Controllers. */

controller.getAllHotspots = function(req, res, next) {

  Hotspot.find(function(err, hotspots) {

    if (err) {
      console.log("Could not get all hotspots controller getAllHotspots.");
      console.log(err);
      res.status(500).json(err);
      next();
    }

    res.json(hotspots);
    next();
  }).populate({
    path: 'beacons',
    // Get location of beacons - populate the 'location' array for every beacon
    populate: {
      path: 'location'
    }
  });

};

controller.getHotspot = function(req, res, next) {

  var hid = req.params.hid;

  Hotspot.findById(hid, function(err, hotspot) {

    if (err) {
      console.log("hotspot controller error: getHotspot query yielded error.");
      res.status(500).json(err);
    }

    res.json(hotspot);
  }).populate({
    path: 'beacons',
    populate: {
      path: 'location'
    }
  });

  next();
};

// get all beacons of a given hotspot
controller.getAllBeacons = function(req, res, next) {

  var hid = req.params.hid;

  Hotspot.findById(hid, function(err, hotspot) {

    if (err) {
      console.log("hotspot controller error: getAllBeacons query yielded error.");
      res.status(500).json(err);
    }

    res.json(hotspot.beacons);
  }).populate({
    path: 'beacons',
    populate: {
      path: 'location'
    }
  });

  next();
};

//get a single beacon of a given hotspot
controller.getBeacon = function(req, res, next) {

  var hid = req.params.hid;
  var bid = req.params.bid;

  Hotspot.findById(hid, function(err, hotspot) {

    var beacon = null;

    if (err) {
      console.log("hotspot controller error: getHotspot query yielded error.");
      res.status(500).json(err);
    }

    for (var index in hotspot.beacons) {

      if (hotspot.beacons[index]._id == bid) {
        beacon = hotspot.beacons[index];
      }
    }

    res.json(beacon);
  }).populate({
    path: 'beacons',
    populate: {
      path: 'location'
    }
  });

  next();
};

controller.getActiveFriends = function(req, res, next) {

  /* TODO */
  return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;
