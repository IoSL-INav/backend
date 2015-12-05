/**
 * IoSL-INav middleware/authenticate
 * SNET TU Berlin
 * using PIazza code base
 *
 * Uses Keycloak for authentication, finds or creates a user and sets
 * request.user.
 */

var User = require('../models/user');

var findOrCreateUser = function(req, res, next) {
    var userId = req.kauth.grant.id_token.content.sub;
    var name = req.kauth.grant.id_token.content.preferred_username;

    User.findOneAndUpdate({
        _id: userId
    }, {
        $setOnInsert: {
            name: name
        }
    }, {
        upsert: true
    }, function(err, user) {

        if (err) {
            res.status(500).json(err)
        } else {
            req.user = user;
            next();
        }
    });
};

module.exports = function(keycloak) {
    return [
        keycloak.protect(),
        findOrCreateUser
    ]
};