// Representation of a PIazza user-generated event

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var eventSchema = new Schema({
	createdBy: {
		type: ObjectId,
		ref: 'User',
		index: true
	},
	title: {
		type: String
	},
	startTime: {
		type: Date,
		index: true
	},
	endTime: {
		type: Date,
		index: true
	},
	location: {
		coordinates: {
			type: [Number],
			index: {
				type: '2dsphere'
			}, // per def. [longitude, latitude]
		},
		building: {
			type: String,
			index: true
		},
		floor: {
			type: String
		}
	},
});

module.exports = mongoose.Model('Event', eventSchema);