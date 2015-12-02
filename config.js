/**
 * IoSL-INav configuration
 * SNET TU Berlin
 * using PIazza code base
 *
 * Holds all important configuration
 * files and variables
 */

var fs = require('fs');
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
var passwordless = require('passwordless');
var TokenStore = require('passwordless-memorystore');
var expressSession = require('express-session');
var authenticate = require('./middleware/authenticate.js');

var Delivery = require('./controllers/signup/consoledelivery');

var Keycloak = require('connect-keycloak');

function loadSecret(path) {

	if (path) {
		return fs.readFileSync(path);
	}
}

var host = process.env.PIAZZA_HOST || 'localhost';
var port = process.env.PIAZZA_PORT || 8080;
var dbPath = process.env.PIAZZA_DB || 'mongodb://mongo-db:27017/iosl-inav';
var sessionSecret = process.env.PIAZZA_SESSION_SECRET || 'This secret should be replaced in production';
var useMongoSessionStore = !!(process.env.PIAZZA_USE_MONGODB_SESSION_STORE);
var sessionStore;

// connect to database
var options = {
	server: {},
	replset: {}
};
options.server.socketOptions = options.replset.socketOptions = {
	keepAlive: 1
};
mongoose.connect(dbPath, options);

if(useMongoSessionStore) {
	var MongoStore = require('connect-mongo')(expressSession);

	// Setup Keycloak and MongoDB session
	sessionStore = new MongoStore({
		// Reuse mongoose connection to MongoDB for MongoDB session store
		mongooseConnection: mongoose.connection,
		ttl: 30 * 24 * 60 * 60, // Expire after 30 days
		touchAfter: 24 * 3600, // refresh the session in the database only once every 24 hours, unless the session is changed
		stringify: false
	})
} else {
	sessionStore = new expressSession.MemoryStore()
}

var keycloak = new Keycloak({
	store: sessionStore
});

var session = expressSession({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	store: sessionStore
});

var delivery = new Delivery();
passwordless.init(new TokenStore(), {
	userProperty: 'email'
});
passwordless.addDelivery(function(token, uid, recipient, callback) {
	delivery.deliver(token, uid, recipient); // FIXME: add error handling, maybe by callback?
	callback();
	// TODO: add tokenAlgorithm which creates shorter tokens
}); //, { tokenAlgorithm: function() { return crypto.randomBytes(6).toInt().toString(); }});

module.exports = {
	host: host,
	port: port,
	session: session,
	keycloak: keycloak,
	authenticate: authenticate(keycloak)
};