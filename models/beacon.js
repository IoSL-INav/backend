/**
 * IoSL-INav models/beacon
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a bluetooth beacon
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Location = require('./location');

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


module.exports = mongoose.model('Beacon', beaconSchema);