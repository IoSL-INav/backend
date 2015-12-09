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

var User = require('./user');


var friendRequestSchema = new Schema({
    fromUser: {
        type: ObjectId
        ref: 'User'
    },
    toUser: {
        type: ObjectId
        ref: 'User'
    }
});


module.exports = mongoose.model('FriendRequest', friendrequestSchema);