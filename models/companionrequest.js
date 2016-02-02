/**
 * IoSL-INav models/compreq
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a companion request
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var compReqSchema = new Schema({
	from: {
		type: String,
		ref: 'User'
	},
	to: {
		type: String,
		ref: 'User'
	},
	status: {
		type: String,
		enum: ['pending', 'accepted', 'denied']
	}
});


module.exports = mongoose.model('CompReq', compReqSchema);