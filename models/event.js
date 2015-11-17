/**
 * TU-B-HERE Event representation
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    title: {
        type: String
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
            type: String,
            index: true
        }
    },
    start_time: {
        type: Date,
        index: true
    },
    end_time: {
        type: Date,
        index: true
    }
});

module.exports = mongoose.model('Event', schema);