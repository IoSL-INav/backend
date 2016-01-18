/**
 * IoSL-INav models/location
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a user's location which expires
 * after a given time (15 mins by default)
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var locationSchema = new Schema({
	createdAt: {
		type: Date,
		expires: 900, // Remove entry after 15 minutes
		default: Date.now
	},
	owner: {
		type: String,
		ref: 'User'
	},
	coordinates: {
		type: [Number],
		index: '2dsphere' // Order: [longitude, latitude]
	},
	building: String,
	floor: String,
	accuracyIndicator: Number
});


module.exports = mongoose.model('Location', locationSchema);