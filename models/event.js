/**
 * IoSL-INav models/event
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of an event
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var eventSchema = new Schema({
	createdBy: {
		type: ObjectId,
		ref: 'User',
		index: true
	},
	title: String,
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
		floor: String
	},
});


module.exports = mongoose.Model('Event', eventSchema);