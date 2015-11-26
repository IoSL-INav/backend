/**
 * IoSL-INav routes/meetings
 * SNET TU Berlin
 * using PIazza code base
 *
 * Meetings specific endpoints
 */

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/meetings')

var router = express.Router();

router.route('/')
    .get(controller.getAllMeetings)
    .post(controller.createMeeting);

router.route('/:id')
    .get(controller.getMeetingInfo)
    .put(controller.updateMeeting)
    .delete(controller.deleteMeeting);

router.route('/:id/location')
    .get(controller.getMeetingLocation);

module.exports = router;
