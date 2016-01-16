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
  var CompReq = require('./models/companionrequest');

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

  var beaconShoe = {
    name: "shoe",
    companyUUID: "D0D3FA86-CA76-45EC-9BD9-6AF44C51822F",
    major: 9386,
    minor: 56215,
    location: backRightCorner,
  };

  var beaconCar = {
    name: "car",
    companyUUID: "D0D3FA86-CA76-45EC-9BD9-6AF41DFC866B",
    major: 62242,
    minor: 28193,
    location: backRightCorner,
  };

  var beaconFridge = {
    name: "fridge",
    companyUUID: "D0D3FA86-CA76-45EC-9BD9-6AF4BC5AD3C5",
    major: 62245,
    minor: 37267,
    location: backLeftCorner,
  };

  var beaconDoor = {
    name: "door",
    companyUUID: "D0D3FA86-CA76-45EC-9BD9-6AF4BB14CA82",
    major: 42882,
    minor: 54653,
    location: backLeftCorner,
  };

  var beaconBed = {
    name: "door",
    companyUUID: "D0D3FA86-CA76-45EC-9BD9-6AF4BE96DEFD",
    major: 8694,
    minor: 32552,
    location: frontLeftCorner,
  };

  var beaconBike = {
    name: "bike",
    companyUUID: "D0D3FA86-CA76-45EC-9BD9-6AF47D021D49",
    major: 37519,
    minor: 56552,
    location: frontRightCorner,
  };

  var hot1 = {
    name: "Mensa",
    beacons: [beaconShoe, beaconCar, beaconFridge, beaconDoor],
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

  var hot2 = {
    name: "Library",
    beacons: [beaconBed, beaconBike]
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
  initDummyDatabase();
  /* DEV ONLY END */
});
