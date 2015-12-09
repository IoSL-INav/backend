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

var Location = require('./location.js');


var hotspotSchema = new Schema({
    name: String,
    location: {
        type: ObjectId,
        ref: 'Location'
    },
});


module.exports = mongoose.model('Hotspot', hotspotSchema);