/**
 * IoSL-INav models/beacon
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a bluetooth beacon
 */

var mongoose = require('mongoose');

var Location = require('./location')
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var beaconSchema = new Schema({
	name: String,{
		type: String,
		index: {
			type: String
		}
	},
	uid: {
		type: String,
		index: {
			type: String,
			unique: true
		}
	},
	location: {
		type: ObjectId,
		ref: 'Location'
	},
});

// which function do we need
// updateLocation
// updateName


module.exports = mongoose.model('Beacon', beaconSchema);
