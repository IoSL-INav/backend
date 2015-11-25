// Representation of a INav bluetooth beacon
var mongoose = require('mongoose');
var Location = require('./location')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var beaconSchema = new Schema({
	name: {
		type: String,
		index: {
			type: String
		}
	},
	uuid: {
		type: String,
		index: {
			type: String
		}
	},
	location: {
		type: ObjectId,
		ref: 'Location'
	},
});

module.exports = mongoose.model('Beacon', beaconSchema);
