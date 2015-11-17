/**
 * TU-B-HERE User representation
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var privacy_levels = ['friends', 'friends_on_campus', 'nobody']

var schema = mongoose.Schema({
    name: {
        type: String,
        index: {
            type: String,
            text: true,
            unique: true
        }
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    location: {
        coordinates: {
            type: [Number],
            index: {
                type: '2dSphere'
            }
        },
        building: {
            type: String,
            index: true
        },
        floor: {
            type: String
        }
    },
    friends: [{
        type: ObjectId,
        ref: 'User'
    }],
    friend_requests: [{
        type: ObjectId,
        ref: 'User'
    }],
    access_info: {
        type: String,
        enum: privacy_levels,
        default: 'friends'
    },
    access_location: {
        type: String,
        enum: privacy_levels,
        default: 'friends'
    },
    devices: [{
        name: {
            type: String
        },
        jti: {
            type: String,
        }
    }]
});

module.exports = mongoose.model('User', schema);