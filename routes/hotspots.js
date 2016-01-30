/**
 * IoSL-INav routes/hotspots
 * SNET TU Berlin
 * using PIazza code base
 *
 * Hotspots specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var Hotspot = require('./../models/hotspot');
var config = require('./../config');
var controller = require('./../controllers/hotspots');

var router = express();


/* Param middleware. */

/* If given, add hotspot ID to request. */
router.param('hid', function(req, res, next, hid) {
    req.hotspotID = hid;
    next();
});


/* If given, add beacon ID to request. */
router.param('bid', function(req, res, next, bid) {
    req.beaconID = bid;
    next();
});


/* Routes concerning hotspots. */

router.route('/')
    .get(config.authenticate, controller.getAllHotspots);

router.route('/:hid')
    .get(config.authenticate, controller.getHotspot);

router.route('/:hid/active_friends')
    .get(config.authenticate, controller.getActiveFriends);

router.route('/:hid/beacons')
    .get(config.authenticate, controller.getAllBeacons);

router.route('/:hid/beacons/:bid')
    .get(config.authenticate, controller.getBeacon);


/* Export router with described routes. */

module.exports = router;