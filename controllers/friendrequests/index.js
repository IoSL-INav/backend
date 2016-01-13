/**
 * IoSL-INav controllers/hotspots/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * FriendRequest specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');
var Friendrequest = require('./../../models/friendrequest');

var controller = {};

controller.getPendingFriendRequests = function(req, res, next) {
  // TODO
	return res.status(501).end();
};
controller.getFriendRequest = function(req, res, next) {
  // TODO
	return res.status(501).end();
};
controller.updateFriendRequest = function(req, res, next) {
  // TODO
	return res.status(501).end();
};
controller.deleteFriendRequest = function(req, res, next) {
  // TODO
	return res.status(501).end();
};

/* Export all controllers. */

module.exports = controller;
