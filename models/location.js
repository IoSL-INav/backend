/**
 * IoSL-INav models/location
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a user's location which expires
 * after a given time (15 mins by default)
 */


var locationSchema = {
	createdAt: {
		type: Date,
		expires: 900, // 15 minutes in seconds
		default: Date.now
	},
	coordinates: {
		type: [Number],
		index: {
			type: '2dsphere'
		} // per def. [longitude, latitude]
	},
	building: {
		type: String,
		index: true
	},
	floor: String
};


module.exports = locationSchema;