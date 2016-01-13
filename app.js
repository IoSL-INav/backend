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
  var CompReq = require('./models/compreq');

  User.remove({}, function(err) {
    console.log('User collection removed');
  });
  Hotspot.remove({}, function(err) {
    console.log('Hotspot collection removed');
  });
  CompReq.remove({}, function(err) {
    console.log('Companion requests collection removed');
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

  var hot1 = {
    name: "Mensa",
    beacons: [backRightCornerBeacon, backLeftCornerBeacon, frontLeftCornerBeacon, frontRightCornerBeacon],
  };

  Hotspot.update({
      name: hot1.name
    }, {
      $setOnInsert: hot1
    }, {
      upsert: true
    },
    function(err, numAffected) {
      if (typeof numAffected.upserted !== 'undefined') {
        console.log('add mensa as hotspot');
      }
    }
  );

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

  var hot2 = {
    name: "Library",
    beacons: [dummyBeacon02, dummyBeacon01]
  };

  Hotspot.update({
      name: hot2.name
    }, {
      $setOnInsert: hot2
    }, {
      upsert: true
    },
    function(err, numAffected) {
      if (typeof numAffected.upserted !== 'undefined') {
        console.log('add library as hotspot');
      }
    }
  );
}


var server = app.listen(config.port, config.host, function() {

  var address = server.address();
  console.log('IoSL-INav server listening on host %s at port %s.', address.address, address.port);

  /* DEV ONLY BEGIN */
  /* Start with some default data. */
  console.log("Init database with initial data...");
  dropDatabase();
  console.log("Add dummy data to database...");
  //initDummyDatabase();
  /* DEV ONLY END */
});