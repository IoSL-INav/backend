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


var locationSchema = new Schema({
	createdAt: {
		type: Date,
		expires: 900, // 15 minutes in seconds
		default: Date.now
	},
	coordinates: {
		type: [Number],
		index: {
			type: '2dsphere' // per def. [longitude, latitude]
		}
	},
	building: {
		type: String,
		index: true
	},
	floor: String
});

var beaconSchema = new Schema({
	name: String,
	companyUUID: String,
	major: String,
	minor: String,
	location: locationSchema
});

var hotspotSchema = new Schema({
	name: String,
	beacons: [beaconSchema]
});


module.exports = mongoose.model('Hotspot', hotspotSchema);