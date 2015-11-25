// IoSL-INav beacons api controller

var util = require('./../../util');
var isErrorOrNull = util.isErrorOrNull;

var config = require('./../../config');
var beacon = require('./../../models/beacon');

var controller = {};

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

module.exports = controller;
