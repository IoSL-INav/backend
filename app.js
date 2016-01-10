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

var app = express();

app.use(config.session);
app.use(config.morgan('dev'));
app.use(config.keycloak.middleware({
  logout: '/logout',
  admin: '/admin'
}));
app.use(routes);

var dropDatabase = function() {

  var User = require('./models/user');
  var Hotspot = require('./models/hotspot');

  User.remove({}, function(err) {
    console.log('User collection removed');
  });
  Hotspot.remove({}, function(err) {
    console.log('Hotspot collection removed');
  });
}

var initDatabase = function() {
  console.log("add some real data like defined hotspots etc.");
}

var initDummyDatabase = function() {

  var Hotspot = require('./models/hotspot');

  var backRightCorner = {
    coordinates: [52.509646, 13.326402],
    building: "Mensa",
    floor: "1st",
  };

  var backLeftCorner = {
    coordinates: [52.509851, 13.325760],
    building: "Mensa",
    floor: "1st",
  };

  var frontLeftCorner = {
    coordinates: [52.509693, 13.325618],
    building: "Mensa",
    floor: "1st",
  };

  var frontRightCorner = {
    coordinates: [52.509489, 13.326261],
    building: "Mensa",
    floor: "1st",
  };

  var backRightCornerBeacon = {
    name: "backRightCorner",
    companyUUID: "somerandomUUID",
    major: "major1",
    minor: "minor1",
    location: backRightCorner,
  };

  var backLeftCornerBeacon = {
    name: "backLeftCorner",
    companyUUID: "somerandomUUID",
    major: "major2",
    minor: "minor2",
    location: backLeftCorner,
  };

  var frontLeftCornerBeacon = {
    name: "frontLeftCorner",
    companyUUID: "somerandomUUID",
    major: "major3",
    minor: "minor3",
    location: frontLeftCorner,
  };

  var frontRightCornerBeacon = {
    name: "frontRightCorner",
    companyUUID: "somerandomUUID",
    major: "major4",
    minor: "minor4",
    location: frontRightCorner,
  };

  Hotspot.create({
    name: "Mensa",
    beacons: [backRightCornerBeacon, backLeftCornerBeacon,frontLeftCornerBeacon,frontRightCornerBeacon],
  }, function(err, hotspot) {

    if (err) {
      console.log("Could not create hotspot Mensa.");
    } else {
      console.log("Create hotspot Mensa.");
    }
  });



  var dummyLoc = {
    coordinates: [1.5, 2.5],
    building: "Mensa",
    floor: "1st",
  };

  var dummyBeacon01 = {
    name: "beacon01",
    companyUUID: "somerandomUUID",
    major: "major9383",
    minor: "minor84372",
    location: dummyLoc,
  };

  var dummyBeacon02 = {
    name: "beacon02",
    companyUUID: "somerandomUUID",
    major: "major87283",
    minor: "minor1234",
    location: dummyLoc,
  };

  Hotspot.create({
    name: "Library",
    beacons: [dummyBeacon02, dummyBeacon01],
  }, function(err, hotspot) {

    if (err) {
      console.log("Could not create hotspot Library.");
    } else {
      console.log("Create hotspot Library.");
    }
  });
}


var server = app.listen(config.port, config.host, function() {

  var address = server.address();
  console.log('IoSL-INav server listening on host %s at port %s.', address.address, address.port);

  if (process.argv.indexOf("--init") != -1) {
    console.log("init database with initial data");
    dropDatabase();

    if (process.argv.indexOf("--devel") != -1) {
      console.log("add devel data to database");
      initDummyDatabase();
    } else {
      initDatabase();
    }
  }
});
