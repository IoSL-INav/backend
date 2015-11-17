/**
 * SNET Internet of Services Lab - Indoor Navigation
 * Uses parts of TU-B-HERE server component
 */

// modules ===============================================
var express = require('express'),
    expressJwt = require('express-jwt'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator');

var fs = require('fs'),
    mongoose = require('mongoose'),
    config = require('./config');

// models ===============================================
var User = require('./models/user'),
    Event = require('./models/event');

// routes ================================================
var register = require('./routes/register'),
    user = require('./routes/user'),
    event = require('./routes/event');

var dbConnection = mongoose.createConnection(config.mongodb);

dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
dbConnection.once('open', start);

function start() {

    var app = express();
    var secret = null;

    if(config.secret_type == 'code') {
        secret = config.secret;
    }

    if(config.secret_type === 'file') {
        secret = fs.readFileSync(config.secret);
    }

    if(secret === null) {
        throw new Error('Invalid secret type ' + config.secret_type);
    }


    // Register middleware

    app.use(bodyParser.json());

    app.use(expressValidator({
        customValidators: {
            isTUB: function(value) {
                var suffix = 'tu-berlin.de';
                return typeof value === 'string' && value.indexOf(suffix, value.length - suffix.length) !== -1;
            }
        }
    })); // TODO errorFormatter

    app.use(expressJwt({
        secret: secret
    }).unless({
        path: ['/register', '/login']
    }));

    // register 'register' route
    app.use('/', register(express, secret, User));

    // register 'user' route

    // register 'event' route

    // start the server TODO https only
    var server = app.listen(config.port, config.host, function() {
        console.log("IoSL-INav server listening on %s:%s", server.address().address, server.address().port);
    });
};