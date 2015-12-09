/**
 * IoSL-INav models/device
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a device
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var config = require('./../config');


var deviceSchema = new Schema({
	createdAt: {
		type: Date,
		expires: config.expiresIn,
		default: Date.now
	},
	name: String,
	jti: String
});


module.exports = mongoose.model('Device', deviceSchema);