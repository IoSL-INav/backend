// Representation of a User's Location in PIazza which expires after a given time (15 mins by default)
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
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
	level: {
		type: String
	}
});

locationSchema.virtual('info.full', function() {
	return {
		createdAt: this.createdAt,
		coordinates: this.coordinates,
		building: this.building,
		level: this.level
	};
});

module.exports = mongoose.model('Location', locationSchema);