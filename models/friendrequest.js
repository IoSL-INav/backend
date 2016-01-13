/**
 * IoSL-INav models/friendrequest
 * SNET TU Berlin
 * using PIazza code base
 *
 * Representation of a friend request
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var friendRequestSchema = new Schema({
    fromUser: {
        type: ObjectId,
        ref: 'User'
    },
    toUser: {
        type: ObjectId,
        ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'denied']
    }
});

module.exports = mongoose.model('Friendrequest', friendRequestSchema);
