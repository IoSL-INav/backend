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


/* Initial express routing object. */
var app = express();

app.use(config.morgan('combined', {
  stream: config.logFile
}));
app.use(config.session);
app.use(config.keycloak.middleware({
  logout: '/logout',
  admin: '/admin'
}));
app.use(routes);


/**
 * DEV function
 * Completely empty some collections we're using.
 */
var dropDatabase = function() {

  var Hotspot = require('./models/hotspot');
  var Location = require('./models/location');

  console.log("Remove some data from collections.");

  Hotspot.remove({}, function(err) {
    console.log("Hotspot collection removed.");
  });

  Location.remove({}, function(err) {
    console.log("Location collection removed.");
  });
}


/**
 * DEV function
 * Initially push some data into the database.
 */
var initDummyDatabase = function() {

  var Hotspot = require('./models/hotspot');

  console.log("Adding some dummy data sets to database.");

  var backRightCorner = {
    coordinates: [13.326402, 52.509646],
    building: "Mensa",
    floor: "1st",
  };

  var backLeftCorner = {
    coordinates: [13.325760, 52.509851],
    building: "Mensa",
    floor: "1st",
  };

  var frontLeftCorner = {
    coordinates: [13.325618, 52.509693],
    building: "Mensa",
    floor: "1st",
  };

  var frontRightCorner = {
    coordinates: [13.326261, 52.509489],
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

  var purpleBeacon = {
    name: "purpleDoor",
    companyUUID: "d0d3fa86-ca76-45ec-9bd9-6af401c6e22d",
    major: 49816,
    minor: 55395,
    location: backRightCorner,
  }

  var blueBeacon = {
    name: "blueBeacon",
    companyUUID: "b9407f30-f5f8-466e-aff9-25556b57fe6d",
    major: 1000,
    minor: 20010,
    location: frontRightCorner,
  }

  var greenBeacon = {
    name: "greenBeacon",
    companyUUID: "b9407f30-f5f8-466e-aff9-25556b57fe6d",
    major: 1002,
    minor: 3090,
    location: frontLeftCorner,
  }

  var hot1 = {
    name: "Mensa",
    beacons: [beaconShoe, beaconCar, beaconFridge, beaconDoor, purpleBeacon, blueBeacon, greenBeacon],
  };

  var hot2 = {
    name: "Library",
    beacons: [beaconBed, beaconBike]
  };

  Hotspot.update({
    name: hot1.name
  }, {
    $setOnInsert: hot1
  }, {
    upsert: true
  }).exec();

  Hotspot.update({
    name: hot2.name
  }, {
    $setOnInsert: hot2
  }, {
    upsert: true
  });
}


/**
 * MAIN
 * Start our backend application.
 * Use port and host configuration taken from
 * environment file. Log where server is running.
 */
var server = app.listen(config.port, config.host, function() {

  var address = server.address();
  console.log("IoSL-INav server listening on host %s at port %s.", address.address, address.port);
  console.log("Logging into file: %s.\n", config.logFile.file);

  /* DEV ONLY BEGIN */

  /* Start with some default data. */
  dropDatabase();
  initDummyDatabase();

  /* DEV ONLY END */
});


/* Export server in order to enable testing. */
module.exports = server;