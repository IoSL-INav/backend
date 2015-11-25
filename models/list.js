// Representation of a INav list of users
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var listSchema = new Schema({
	name: {
		type: String,
		index: {
			type: String
		}
	},
	creator: { 
		type: ObjectId, 
		ref:'User' 
	},
	members: [{
		type: ObjectId, 
		ref:'User'
	}],
});

module.exports = mongoose.model('List', listSchema);
