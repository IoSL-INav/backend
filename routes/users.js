/**
 * IoSL-INav routes/users
 * SNET TU Berlin
 * using PIazza code base
 *
 * Users specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/users');

var router = express();


/* Param middleware. */

/* If given, add group ID to request. */
router.param('gid', function(req, res, next, gid) {
	req.groupID = gid;
	next();
});


/* If given, add requested (other) user ID to request. */
router.param('uid', function(req, res, next, uid) {
	req.otherUserID = uid;
	next();
});


/* Routes concerning everything around users. */

router.route('/me')
	.all(config.authenticate)
	.get(controller.getCurrentUser)
	.put(controller.updateCurrentUser)
	.delete(controller.deleteCurrentUser);

router.route('/me/location')
	.all(config.authenticate)
	.put(controller.updateLocation)
	.delete(controller.deleteLocation);

router.route('/me/groups')
	.all(config.authenticate)
	.get(controller.getGroupsForUser)
	.post(controller.addGroupForUser);

router.route('/me/groups/:gid')
	.all(config.authenticate)
	.get(controller.getGroupForUser)
	.put(controller.updateGroupForUser)
	.delete(controller.deleteGroupForUser);

router.route('/me/groups/:gid/users')
	.post(config.authenticate, controller.addUserToGroup);

router.route('/me/groups/:gid/users/:uid')
	.delete(config.authenticate, controller.deleteUserFromGroup);


/* Export router with described routes. */
module.exports = router;