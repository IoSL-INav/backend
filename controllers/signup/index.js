// PIazza signup & login controller
var Jwt = require('jsonwebtoken');
var uuid = require('node-uuid');

var config = require('./../../config');
var User = require('./../../models/user');
var Device = require('./../../models/device');
var isErrorOrNull = require('./../../util').isErrorOrNull;

var controller = {};

/**
 * Provides a user to passwordless for use by token request, creating the user first if necessary
 */ 
controller.provideUser = function(user, delivery, callback, req) {
	var email = req.body.email;	
	User.findOne({ email: email }, function(err, user) {		
		if (err) return callback(err, null);
		if (user) return callback(null, email);
		
		var name = email.substring(0, email.indexOf('@'));
		User.create({ name: name, email: email }, function(err, user) {
			if (err) return callback(err, null);
			
			callback(null, email);
		});	
	});
};

/**
 * Handle login with passwordless one time password and return signed jwt
 */ 
controller.handleLogin = function(req, res) {
	User.findOne({ email: req.email }, function(err, user) {
		if (isErrorOrNull(err, user, res)) return;
		
		updateUserToken(user, req.body.device, function(err, token) {
			if (err) return res.status(500).end(err);
			res.json({ jwt: token });
		});		
	});
};

/**
 * Handles token refresh requests
 */ 
controller.refreshToken = function(req, res) {
	User.findOne({ id: req.user._id }, function(err, user) {
		if (isErrorOrNull(err, user, res)) return;
		
		updateUserToken(user, req.user.device, function(err, token) {
			if (err) return res.status(500).end(err);
			res.json({ jwt: token });
		});
	});
}

/**
 * Updates user with a new token and returns it
 */ 
function updateUserToken(user, deviceId, callback) {
	var payload = {
		jti: uuid.v4(),
		_id: user._id,
		device: deviceId
	};
	
	var token = Jwt.sign(
		payload, 
		config.secret, 
		{ expiresIn: config.expiresIn }
	);
	
	Device.create({ name: payload.device, jti: payload.jti }, function(err, device) {
		if (err) return callback(err, null);
		
		user.devices.push(device._id);
		user.save(function(err, user) {
			if (err) return callback(err, null);
			
			callback(null, token);
		});
	});
}

module.exports = controller;
