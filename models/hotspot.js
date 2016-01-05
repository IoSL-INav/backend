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
	major: String,
	minor: String,
	location: {
		type: ObjectId,
		ref: 'Location'
	},
});


var hotspotSchema = new Schema({
	name: String,
	beacons: [beaconSchema],
});


module.exports = mongoose.model('Hotspot', hotspotSchema);