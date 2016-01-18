/**
 * IoSL-INav models/user
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a user
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var privacyLevels = ['friends_on_campus', 'nobody'];


var groupSchema = new Schema({
	name: String,
	members: [{
		type: String,
		ref: 'User'
	}],
});

var userSchema = new Schema({
	_id: String,
	name: String,
	email: {
		type: String,
		index: {
			unique: true,
			// Allow multiple entries without email, as the Federation Provider currently does not return emails.
			sparse: true
		}
	},
	autoPingEnabled: Boolean,
	autoPingGroup: groupSchema,
	autoLocateEnabled: Boolean,
	privacyLevel: {
		type: String,
		enum: privacyLevels,
		default: 'friends_on_campus'
	},
	devices: [{
		type: ObjectId,
		ref: 'Device'
	}],
	notifications: [],
	groups: [groupSchema]
});


module.exports = mongoose.model('User', userSchema);