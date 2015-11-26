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

controller.getAllMeetings = function getAllMeetings(req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.createMeeting = function createMeeting(req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.getMeetingInfo = function getMeetingInfo(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.updateMeeting = function updateMeeting(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.deleteMeeting = function deleteMeeting(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.getMeetingLocation = function getMeetingLocation(req, res, next) {
  //TODO
  return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;