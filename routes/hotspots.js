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


/* Routes concerning hotspots. */

router.route('/')
    .get(config.authenticate, controller.getAllHotspots);

router.route('/:hid')
    .get(config.authenticate, controller.getHotspot);

router.route('/:hid/beacons')
    .get(config.authenticate, controller.getAllBeacons);

router.route('/:hid/beacons/:bid')
    .get(config.authenticate, controller.getBeacon);

router.route('/:hid/beacons/active_friends')
    .get(config.authenticate, controller.getActiveFriends);


/* Export router with described routes. */

module.exports = router;