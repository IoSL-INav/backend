/**
 * IoSL-INav middleware/authenticate
 * SNET TU Berlin
 * using PIazza code base
 *
 * Uses Keycloak for authentication, finds or creates
 * a user and sets request.user.
 */

var User = require('../models/user');
var Group = require('../models/group');
var userController = require('../controllers/users');

var findOrCreateUser = function(req, res, next) {
    var userID = req.kauth.grant.id_token.content.sub;
    var name = req.kauth.grant.id_token.content.preferred_username;

    User.findById(userID, function(err, user) {

        if (err) {
            console.log("Error while locating model for userID: %s.", userID);
            res.status(500).json(err);
        }

        if (!user) {

            console.log("a");

            User.create({
                _id: userID,
                name: name
            }, function(err) {
                if (err) {
                    console.log("Could not login user with ID: %s.", userID);
                    res.status(500).json(err);
                }
            });
        }

        console.log("b");

        Group.findOneAndUpdate({
            $and: [{
                name: 'All friends'
            }, {
                creatorID: userID
            }]
        }, {
            $setOnInsert: {
                name: 'All friends',
                creatorID: userID
            }
        }, {
            upsert: true,
            new: true
        }, function(err, group) {

            console.log("c");

            if (err) {
                console.log("Error while searching for the default group for user with ID: %s.", userID);
                res.status(500).json(err);
            }

            console.log("d");

            User.findById(userID, function(err, user) {

                if (err) {
                    console.log("Error while locating model for userID: %s.", userID);
                    res.status(500).json(err);
                }

                user.update({
                    _id: userID
                }, {
                    $addToSet: {
                        // TODO
                        groups: group._id
                    }
                }, function(err) {

                    console.log("e");

                    if (err) {
                        console.log("Could not update user model for newly created default group");
                        res.status(500).json(err);
                    }
                })

                console.log("f");

                req.user = user;
                next();
            });
        });
    });
}

module.exports = function(keycloak) {
    return [
        keycloak.protect(),
        findOrCreateUser
    ]
};