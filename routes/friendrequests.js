/**
 * IoSL-INav routes/hotspots
 * SNET TU Berlin
 * using PIazza code base
 *
 * friendrequest specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var Friendrequest = require('./../models/friendrequest');
var config = require('./../config');
var controller = require('./../controllers/friendrequests');

var router = express();

/* If given, add group ID to request. */
router.param('fid', function(req, res, next, fid) {
	req.friendrequestId = fid;
	next();
});

/* Routes concerning friendrequest. */

router.route('/')
    .all(config.authenticate)
    .post(controller.createFriendRequest)
    .get(controller.getPendingFriendRequests);

router.route('/:fid')
    .all(config.authenticate)
    .get(controller.getFriendRequest)
    .put(controller.updateFriendRequest)
    .delete(controller.deleteFriendRequest);

/* Export router with described routes. */

module.exports = router;
