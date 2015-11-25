/**
 * IoSL-INav models/meeting
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a meeting
 */

var mongoose = require('mongoose');
var Location = require('./location')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var meetingSchema = new Schema({
	creator: {
		type: ObjectId,
		ref:'User'
	},
	location: {
		type: ObjectId,
		ref: 'Location'
	},
});

// which function do we need
// updateLocation

/*
meetingSchema.statics.searchByName = function(name, callback) {
	// TODO
};

meetingSchema.methods.findAroundMe = function(range, callback) {
	// TODO
};

meetingSchema.methods.isOnCampus = function (callback) {
	this.populate('location', function(err, user) {
		// for now we assume that no location means outside of campus
		// because the client stops sending updates and old locations expire
		callback(err, (user.location != null));
	});
};
*/

module.exports = mongoose.model('Meeting', meetingSchema);
