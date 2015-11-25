/**
 * IoSL-INav app
 * SNET TU Berlin
 * using PIazza code base
 *
 * This is the main server where
 * everything else branches off
 */

var express = require('express');
var config = require('./config');
var routes = require('./routes');
/* BEGIN DEVELOPMENT ONLY */
var morgan = require('morgan');
/* END DEVELOPMENT ONLY */

var app = express();
app.use(morgan('dev'));
app.use(routes);

var server = app.listen(config.port, config.host, function() {
    var address = server.address();
    console.log('IoSL-INav server listening on host %s at port %s.', address.address, address.port);
});