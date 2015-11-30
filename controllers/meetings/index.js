/**
 * IoSL-INav controllers/meetings/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Meetings specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');

var Meeting = require('./../../models/meeting');
var User = require('./../../models/user');
var Location = require('./../../models/location');

var controller = {};


/* Controllers. */

controller.getAllMeetings = function (req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.createMeeting = function (req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.getMeetingInfo = function (req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.updateMeeting = function (req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.deleteMeeting = function (req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.getMeetingLocation = function (req, res, next) {
  //TODO
  return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;