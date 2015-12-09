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
  var Group = require('./models/group');
  var Hotspot = require('./models/hotspot');
  var Beacon = require('./models/beacon');
  var Location = require('./models/location');
  User.remove({}, function(err) {
    console.log('User collection removed');
  });
  Group.remove({}, function(err) {
    console.log('Group collection removed');
  });
  Hotspot.remove({}, function(err) {
    console.log('Hotspot collection removed');
  });
  Beacon.remove({}, function(err) {
    console.log('Beacon collection removed');
  });
  Location.remove({}, function(err) {
    console.log('Location collection removed');
  });
}

var initDatabase = function(){
  console.log("add some real data like defined hotspots etc.");
}

var initDummyDatabase = function() {
  var Location = require('./models/location');
  var Beacon = require('./models/beacon');
  var Hotspot = require('./models/hotspot');

  var dummyLoc = new Location({
    coordinates: [0, 0],
    building: "Mensa",
    level: "0.OG",
  });
  dummyLoc.save();

  var dummyBeacon01 = new Beacon({
    name: "beacon01",
    companyUUID: "somerandomUUID",
    major: "major9383",
    minor: "minor84372",
    location: dummyLoc,
  });
  dummyBeacon01.save();

  var dummyBeacon02 = new Beacon({
    name: "beacon02",
    companyUUID: "somerandomUUID",
    major: "major87283",
    minor: "minor1234",
    location: dummyLoc,
  });
  dummyBeacon02.save();

  Hotspot.create({
    name: "Mensa",
    beacons: [dummyBeacon01, dummyBeacon02],
  }, function(err, hotspot) {
    if (err) {
      console.log("Could not create hotspot Mensa.");
    }
  });

  Hotspot.create({
    name: "Library",
    beacons: [dummyBeacon02, dummyBeacon01],
  }, function(err, hotspot) {
    if (err) {
      console.log("Could not create hotspot Library.");
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
    }else{
      initDatabase();
    }
  }

});
