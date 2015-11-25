// PIazza Server
// TODO logging

var express = require('express');

var config = require('./config');
var routes = require('./routes');

var app = express();
app.use(routes);

var server = app.listen(config.port, config.host, function() {
	var address = server.address();
	console.log('PIazza server listening on host %s at port %s', address.address, address.port);
});
