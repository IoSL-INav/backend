/**
 * IoSL-INav routes/users
 * SNET TU Berlin
 * using PIazza code base
 *
 * Users specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var User = require('./../models/user');
var config = require('./../config');
var controller = require('./../controllers/users');

var router = express();


/* Routes concerning everything around users. */

router.route('/')
	.all(config.authenticate)
	.get(controller.getAllUsers)
	.post(controller.addUser);

router.route('/me')
	.all(config.authenticate)
	.get(controller.getCurrentUser)
	.put(controller.updateCurrentUser)
	.delete(controller.deleteCurrentUser);

router.route('/me/logout')
	.get(config.authenticate, controller.logout);

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

router.route('/:uid')
	.all(config.authenticate)
	.get(controller.getUser)
	.put(controller.updateUser)
	.delete(controller.deleteUser);

router.route('/:uid/groups')
	.get(config.authenticate, controller.getGroupsForUser);


/* Export router with described routes. */

module.exports = router;