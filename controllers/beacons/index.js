/**
 * IoSL-INav controllers/beacons/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Beacons specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');

var Beacon = require('./../../models/beacon');

var controller = {};


/* Controllers. */

controller.getAllBeacons = function getAllBeacons(req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.addBeacon = function addBeacon(req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.getBeaconInfo = function getBeaconInfo(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.updateBeacon = function updateBeacon(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.deleteBeacon = function deleteBeacon(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.getBeaconLocation = function getBeaconLocation(req, res, next) {
  //TODO
  return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;