/**
 * IoSL-INav models/hotspot
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a hotspot
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var beaconSchema = new Schema({
    name: String,
    companyUUID: String,
    major: Number,
    minor: Number,
    location: {
        coordinates: {
            type: [Number],
            index: '2dsphere' // Order: [ longitude, latitude ]
        },
        building: String,
        floor: String
    }
});

var hotspotSchema = new Schema({
    name: String,
    beacons: [beaconSchema]
});


module.exports = mongoose.model('Hotspot', hotspotSchema);