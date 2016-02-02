/**
 * IoSL-INav configuration
 * SNET TU Berlin
 * using PIazza code base
 *
 * Holds all important configuration
 * files and variables
 */

var mongoose = require('mongoose');
var morgan = require('morgan');
var stream = require('logrotate-stream');
var expressSession = require('express-session');
var keycloak = require('connect-keycloak');
var authenticate = (process.env.TEST_MODE === "true") ? require('./middleware/authenticate-test.js') : require('./middleware/authenticate.js');

/* Load config files. */
var envFile = require('./.env');
var keycloakConfig = require('./keycloak.json');
var sessionStore = new expressSession.MemoryStore();


/**
 * Load environment variables from .env file or
 * fall back to default (production safe) values.
 */
var host = process.env.PIAZZA_HOST || '0.0.0.0';
var port = process.env.PIAZZA_PORT || 8080;
var dbPath = process.env.PIAZZA_DB || 'mongodb://mongo-db:27017/iosl-inav';
var secret = process.env.PIAZZA_SECRET || "BEWARE! Please change this to something different than this in production mode.";
var logFileLocation = process.env.PIAZZA_LOG_FILE || "/logs/iosl-inav-backend-access.log";
var useMongoSessionStore = (process.env.PIAZZA_USE_MONGODB_SESSION_STORE === "true") ? true : false;


/* Define log file rotation every 100k, keeping the last 28 logs. */
var logFile = stream({
	file: logFileLocation,
	size: '1m',
	keep: 28
});


/* Set database option and connect to it. */

var options = {
	server: {},
	replset: {}
};

options.server.socketOptions = options.replset.socketOptions = {
	keepAlive: 1
};

mongoose.connect(dbPath, options);


/* Initialize keycloak. */

if (useMongoSessionStore) {

	/* Reset to set to mongo store. */
	sessionStore = {};
	var MongoStore = require('connect-mongo')(expressSession);

	/* Setup Keycloak and MongoDB session */
	sessionStore = new MongoStore({
		/* Reuse mongoose connection to MongoDB for MongoDB session store */
		mongooseConnection: mongoose.connection,
		/* Expire after 30 days */
		ttl: 30 * 24 * 60 * 60,
		/* Refresh the session in the database only once every 24 hours, unless the session is changed */
		touchAfter: 24 * 3600,
		stringify: false
	})
}

var keycloak = new keycloak({
	store: sessionStore
}, keycloakConfig);


/* Initialize an express session with loaded secret. */
var session = new expressSession({
	secret: secret,
	resave: false,
	saveUninitialized: true,
	store: sessionStore
});


/* Export all funcationality. */
module.exports = {
	host: host,
	port: port,
	morgan: morgan,
	logFile: logFile,
	session: session,
	keycloak: keycloak,
	authenticate: authenticate(keycloak)
};