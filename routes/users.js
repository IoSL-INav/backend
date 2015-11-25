// PIazza user routes

var express = require('express');
var User = require('./../models/user');
var controller = require('./../controllers/users');
var router = express();

// GET /users?(name | radius)=value
// GET/POST/DELETE /users/(me | :id)
// GET /users/(me | :id)/(name | friends | privacyLevel | devices | location | friendrequests | notifications)
// POST /users/(me | :id)/(name | friends | privacyLevel | devices | location | notifications)
// DELETE /users/(me | :id)/(friends/:fid | devices/:did | location)

router.param('id', function(req, res, next, id) {

	if (id === 'me') {
		req.param.id = req.user.id;
	}
	next();
});

router.route('/?')
	.get(controller.searchUsers);

router.route('/:id')
	.all(controller.provideRequestedUser)
	.get(controller.getUser)
	.post(controller.updateUser)
	.delete(controller.deleteUser);

/*router.route('/:id/name')
	.get(controller.getUserName)
	.post(controller.updateUserName);

// router.route('/:id/:property').get(controller.getUserProperty)....

router.route('/:id/email')
	.get(controller.getUserEmail);

router.route('/:id/friends')
	.get(controller.getUserFriends);

router.route('/:id/privacyLevel')
	.get(controller.getUserPrivacyLevel)
	.post(controller.updateUserPrivacyLevel);

router.route('/:id/devices')
	.get(controller.getUserDevices);

router.route('/:id/devices/:deviceId')
	.get(controller.getUserDevice)
	.delete(controller.deleteUserDevice);*/

// etc...

module.exports = router;