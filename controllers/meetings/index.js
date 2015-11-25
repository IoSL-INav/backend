// IoSL-INav meetings api controller

var util = require('./../../util');
var isErrorOrNull = util.isErrorOrNull;

var config = require('./../../config');
var meeting = require('./../../models/meeting');

var controller = {};

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

module.exports = controller;
