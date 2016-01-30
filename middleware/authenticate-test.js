/**
 * IoSL-INav middleware/authenticate-test
 * SNET TU Berlin
 * using PIazza code base
 *
 * Dummy authentication middleware to allow
 * automatic testing of the API.
 */

var User = require('../models/user');
var userController = require('../controllers/users');


/**
 * Insert a dummy user.
 */
var findOrCreateUser = function(req, res, next) {
  var userID = "ee000000-1234-abcd-def71-83a736f72941";
  var name = "Mark.Smith";
  var email = "mark.smith@web.org";

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
      user.email = email;
      user.save();
      req.user = user;
      return next();
    }
  }).populate('groups.members', 'name _id');
};

module.exports = function(keycloak) {
  return findOrCreateUser;
};
