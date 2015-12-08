/**
 * IoSL-INav models/group
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a group
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var groupSchema = new Schema({
	_id: Number,
	name: String,
	creatorID: String,
	members: [{
		type: ObjectId,
		ref: 'User'
	}],
});


module.exports = mongoose.model('Group', groupSchema);
