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
  Friendrequest.find({toUser:req.user._id}, function(err, friendrequests) {
		if (err) {
      console.log(err);
			console.log("Error while get friendrequests.");
			res.status(500).end();
			return next();
		}else{
      console.log(friendrequests);
      res.json(friendrequests);
    }
		return next();
	});
  next();
	return res.status(501).end();
};
controller.createFriendRequest = function(req, res, next) {
  // TODO check username
  // TODO check if request already exists
  var userToRequest = req.body.userToRequest;
  var newFriendRequest = {
    fromUser : req.user,
    toUser : userToRequest,
    status : 'pending'
  };

  Friendrequest.update(
    {fromUser: newFriendRequest.fromUser,toUser:newFriendRequest.toUser},
    {$setOnInsert: newFriendRequest},
    {upsert: true},
    function(err, numAffected) {
      console.log('add new friendrequest');
    });
  next();
	return res.json({
    status: "success"
  });
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
