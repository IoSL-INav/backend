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

  /* TODO */
  return res.status(501).end();
};

controller.getHotspot = function(req, res, next) {

  /* TODO */
  return res.status(501).end();
};

controller.getAllBeacons = function(req, res, next) {

  /* TODO */
  return res.status(501).end();
};

controller.getBeacon = function(req, res, next) {

  /* TODO */
  return res.status(501).end();
};

controller.getActiveFriends = function(req, res, next) {

  /* TODO */
  return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;