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
var locationSchema = require('./location.js');


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