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

  User.findById(userID, function(err, user) {

    if (err) {
      console.log("Error while locating model for userID: %s.", userID);
      res.status(500).json(err);
    } else if (!user) {

      User.create({
        _id: userID,
        name: name,
        groups: [{
          name: 'All friends',
          members: []
        }]
      }, function(err) {
        if (err) {
          console.log("Could not login user with ID: %s.", userID);
          res.status(500).json(err);
        }
      });
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
