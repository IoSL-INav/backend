// Representation of a PIazza User
var mongoose = require('mongoose');
var Location = require('./meeting')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var meetingSchema = new Schema({
	creator: [{ 
		type: ObjectId, 
		ref:'User' 
	}],
	location: {
		type: ObjectId,
		ref: 'Location'
	},
});

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

module.exports = mongoose.model('Meeting', meetingSchema);
