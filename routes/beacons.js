/**
 * IoSL-INav routes/beacons
 * SNET TU Berlin
 * using PIazza code base
 *
 * Beacons specific endpoints
 */

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/beacons')

var router = express.Router();

router.route('/')
    .get(controller.getAllBeacons())
    .post(controller.addBeacon());

router.route('/:id')
    .get(controller.getBeaconInfo())
    .put(controller.updateBeacon())
    .delete(controller.deleteBeacon());

router.route('/:id/location')
        .get(controller.getBeaconLocation());

module.exports = router;
