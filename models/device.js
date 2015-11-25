// Representation of a PIazza user's device, automatically deleted after token expiration period

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../config');

var deviceSchema = new Schema({

	createdAt: {
		type: Date,
		expires: config.expiresIn,
		default: Date.now
	},
	name: {
		type: String
	},
	jti: {
		type: String
	}
});

module.exports = mongoose.model('Device', deviceSchema);