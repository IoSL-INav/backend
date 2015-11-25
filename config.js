// PIazza configuration
var fs = require('fs');
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
var passwordless = require('passwordless');
var TokenStore = require('passwordless-memorystore');

var Delivery = require('./controllers/signup/consoledelivery');

function loadSecret(path) {
	if (path) {
		return fs.readFileSync(path);
	}
}

var host = process.env.PIAZZA_HOST || 'localhost';
var port = process.env.PIAZZA_PORT || 8080;
var dbPath = process.env.PIAZZA_DB || 'localhost:27017';
var expiresIn = process.env.PIAZZA_TOKEN_EXPIRES_IN || 300000*60;	// 300000 minutes in seconds...

var secretPath = process.env.PIAZZA_SECRET_PATH;
var secret = process.env.PIAZZA_SECRET || loadSecret(secretPath);
if (secret == null) {
	throw new Error('No secret specified. Either PIAZZA_SECRET_PATH or PIAZZA_SECRET must be defined.');
}	
var jwtMiddleware = expressJwt({ secret: secret });

// connect to database
var options = { server: {}, replset: {} };
options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
mongoose.connect(dbPath, options);

var delivery = new Delivery();
passwordless.init(new TokenStore(), { userProperty: 'email' });
passwordless.addDelivery(function(token, uid, recipient, callback) {
	delivery.deliver(token, uid, recipient);		// FIXME: add error handling, maybe by callback?
	callback();
	// TODO: add tokenAlgorithm which creates shorter tokens
});//, { tokenAlgorithm: function() { return crypto.randomBytes(6).toInt().toString(); }});

module.exports = {
	host: host,
	port: port,
	expiresIn: expiresIn,
	secret: secret,
	passwordless: passwordless,
	jwtMiddleware: jwtMiddleware
};
