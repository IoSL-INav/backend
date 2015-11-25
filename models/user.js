// Representation of a PIazza User
var mongoose = require('mongoose');
var Location = require('./location')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var privacyLevels = [ 'friends_on_campus', 'nobody' ];

var userSchema = new Schema({
	name: {
		type: String,
		index: { type: String }
	},
	email: {
		type: String,
		index: { unique: true }
	},
	friends: [{ 
		type: ObjectId, 
		ref:'User' 
	}],
	privacyLevel: { 
		type: String,
		enum: privacyLevels,
		default: 'friends_on_campus'
	},
	devices: [{
		type: ObjectId,
		ref: 'Device'
	}],
	location: {
		type: ObjectId,
		ref: 'Location'
	},
	notifications: []
});

userSchema.statics.searchByName = function(name, callback) {
	// TODO
};

userSchema.methods.findAroundMe = function(range, callback) {
	// TODO
};

userSchema.methods.isOnCampus = function (callback) {
	this.populate('location', function(err, user) {
		// for now we assume that no location means outside of campus
		// because the client stops sending updates and old locations expire
		callback(err, (user.location != null));
	});
};

userSchema.methods.hasFriend = function(friendId) {
	// FIXME if this proves to be too inefficient
	return this.friends.some(function(fid) {
		return fid.equals(friendId);
	});
};

userSchema.methods.getAccessableInfo = function(uid, callback) {
	if (this.id === uid) {
		// TODO populate & return
	} else if (this.hasFriend(uid)) {
		if (this.privacyLevel === 'friends_on_campus') {
			this.populate('location', function(err, user) {
				if (err) return callback(err, null);
				
				var info = this.info.friends;
				info.location = user.location.info.full;
				callback(null, info);			
			});
		}
		
		if (this.privacyLevel === 'nobody') {
			callback(null, this.info.friends);
		}
	} else {
		// people who are not friends with me may ONLY access general information
		return this.info.public;
	}
};

userSchema.virtual('info.public').get(function () {
	return {		
		id: this.id,
		name: this.name 
	};
});

userSchema.virtual('info.friends').get(function () {
	return {
		id: this.id,
		name: this.name,
		friends: this.friends
	};
});
 
module.exports = mongoose.model('User', userSchema);
