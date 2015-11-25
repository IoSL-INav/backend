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

var friendrequestSchema = new Schema({
    fromUser: {
        type: ObjectId
    },
    toUser: {
        type: ObjectId
    }
});

module.exports = mongoose.model('Friendrequest', friendrequestSchema);