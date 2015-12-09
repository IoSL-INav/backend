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

var Beacon = require('./beacon');


var hotspotSchema = new Schema({
    name: String,
    beacons: [{
        type: ObjectId,
        ref: 'Beacon'
    }],
});


module.exports = mongoose.model('Hotspot', hotspotSchema);
