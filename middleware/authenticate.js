/**
 * IoSL-INav middleware/authenticate
 * SNET TU Berlin
 * using PIazza code base
 *
 * Uses Keycloak for authentication, finds or creates
 * a user and sets request.user.
 */

var User = require('../models/user');
var userController = require('../controllers/users');


/**
 * This function is called on login.
 * It either creates a user and adds a default
 * friends group (first login) or simply retrieves
 * the user.
 * This means: After logging in every user in our
 * system has a default group.
 */
var findOrCreateUser = function(req, res, next) {
  var userID = req.kauth.grant.id_token.content.sub;
  var name = req.kauth.grant.id_token.content.preferred_username;
  var email = req.kauth.grant.id_token.content.email;

  User.findById(userID, function(err, user) {

    if (err) {
      console.log("Error while locating model for userID: %s.", userID);
      console.log(err);
      res.status(500).json();
      return next();
    }

    if (user == null) {

      User.create({
        _id: userID,
        name: name,
        email: email,
        groups: [{
          name: 'All friends',
          members: []
        }]
      }, function(err, user) {

        if (err) {
          console.log("Could not login user with ID: %s.", userID);
          console.log(err);
          res.status(500).json();
          return next();
        }

        req.user = user;
        return next();
      });
    } else {

      /* Hotfix for mail retrieving problem. */
      req.user.email = email;
      req.user.save();

      User.findById(userID, function(err, user) {
        req.user = user;
        return next();
      });
    }
  }).populate('groups.members', 'name _id');
};


module.exports = function(keycloak) {
  return [
    keycloak.protect(),
    findOrCreateUser
  ]
};