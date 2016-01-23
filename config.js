/**
 * IoSL-INav configuration
 * SNET TU Berlin
 * using PIazza code base
 *
 * Holds all important configuration
 * files and variables
 */

var fs = require('fs');
var mongoose = require('mongoose');
var morgan = require('morgan');
var expressSession = require('express-session');

if(process.env.TEST_MODE) {
	var authenticate = require('./middleware/authenticate-test.js');
	console.log("Uses dummy authenticator for testing purposes.");
} else {
	var authenticate = require('./middleware/authenticate.js');
	console.log("Uses real authenticator.");
}

var Keycloak = require('connect-keycloak');
var keycloakConfig = require('./keycloak.json')


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


/* Connect to database */

var options = {
	server: {},
	replset: {}
};

options.server.socketOptions = options.replset.socketOptions = {
	keepAlive: 1
};

mongoose.connect(dbPath, options);


/* Initialize keycloak */

if (useMongoSessionStore) {
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
} else {
	sessionStore = new expressSession.MemoryStore()
}

var keycloak = new Keycloak({
	store: sessionStore
}, keycloakConfig);

var session = expressSession({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	store: sessionStore
});


/* Export all funcationality */

module.exports = {
	host: host,
	port: port,
	morgan: morgan,
	session: session,
	keycloak: keycloak,
	authenticate: authenticate(keycloak)
};