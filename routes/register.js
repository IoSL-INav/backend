/**
 * Routes for registering and retrieving jwt
 */
var passwordless = require('passwordless'),
	MemoryTokenStore = require('passwordless-memorystore'),
	Jwt = require('jsonwebtoken'),
	uuid = require('node-uuid'),
	util = require('util');
//crypto = require('crypto');

//var	Delivery = require('./../ConsoleDelivery');
var Delivery = require('./../MailDelivery');
var delivery = new Delivery();

passwordless.init(new MemoryTokenStore(), {
	userProperty: 'email'
});
passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback) {
	delivery.deliver(tokenToSend, uidToSend, recipient);
	callback();
});

module.exports = function(express, secret, User) {
	var router = express.Router();

	router.post('/register',
		function(req, res, next) {
			req.checkBody('email', 'Invalid Email').notEmpty().isEmail().isTUB();
			var errors = req.validationErrors();
			if (errors)
				res.status(400).send('Invalid Parameters: ' + util.inspect(errors));
			else
				next();
		},
		passwordless.requestToken(function(user, delivery, callback, req) {
			var email = req.body.email;
			var name = email.substring(0, email.indexOf('@'));
			User.findOne({
				name: name,
				email: email
			}, function(err, usr) {
				if (usr) callback(null, email);
				else createNewUser(User, email, name, callback);
			});
		}, {
			userField: 'email'
		}),
		function(req, res) {
			res.status(200).end();
		}
	);

	router.post('/login', passwordless.acceptToken({
			uidField: 'email',
			allowPost: true
		}),
		passwordless.restricted(),
		function(req, res, next) {
			req.checkBody('device', 'Invalid device').notEmpty();
			req.sanitizeBody('device').toString();

			var errors = req.validationErrors();
			if (errors) res.status(400).send('Invalid Parameters: ' + util.inspect(errors));
			else next();
		},
		function(req, res) {
			User.findOne({
				email: req.email
			}, function(err, user) {
				if (err) {
					res.status(404).end();
					return;
				}

				var jti = uuid.v4();
				var device = req.body.device;
				var token = Jwt.sign({
					jti: jti,
					uid: user._id,
					device: device
				}, secret, {
					expiresInMinutes: 300000
				});
				user.devices.push({
					name: device,
					jti: jti
				});

				user.save(function(err, fluffy) {
					if (err) return console.error(err);

					res.json({
						jwt: token
					});
				});
			});
		}
	);

	return router;
};

function createNewUser(User, email, name, callback) {
	// TODO check if name is unique?
	var user = new User({
		name: name,
		email: email
	});
	user.save(function(error, user) {
		if (error) console.error(error);

		if (user) callback(null, user.email);
		else callback(null, null);
	});
}